import mongoose from "mongoose";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import paypal from "@paypal/checkout-server-sdk";
import { config } from "dotenv";
config();
import culqi from "../config/culqi.js";
// Configuración del entorno de PayPal (Sandbox para pruebas)
const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Controlador para órdenes contra reembolso (Cash on Delivery)
export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    // Generar un orderId único
    const orderId = `COD-${new mongoose.Types.ObjectId()}`;

    // Crear el payload para la orden
    const payload = list_items.map((el) => {
      return {
        userId: userId,
        orderId: orderId, // Usar el mismo orderId para todos los productos
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "", // No hay paymentId para Cash on Delivery
        metodoDePago: "EFECTIVO",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    // Guardar la orden en la base de datos
    const generatedOrder = await OrderModel.insertMany(payload);

    // Eliminar los productos del carrito
    await CartProductModel.deleteMany({ userId: userId });

    // Actualizar el carrito del usuario
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    // Responder con el orderId para que el frontend lo almacene en localStorage
    return response.json({
      message: "Order successfully",
      error: false,
      success: true,
      data: {
        orderId: orderId, // Enviar el orderId al frontend
        generatedOrder: generatedOrder,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Controlador para obtener detalles de las órdenes
export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId;

    // Buscar las órdenes del usuario con estado COMPLETED
    const orderlist = await OrderModel.find({ 
      userId: userId,
      status: 'COMPLETED' // Filtrar solo órdenes completadas
    })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación (más reciente primero)
      .populate("delivery_address"); // Poblar la dirección de entrega

    return response.json({
      message: "Order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Controlador para confirmar el pago de PayPal
export const confirmPayPalPayment = async (req, res) => {
  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ message: 'El orderId es requerido.' });
  }

  try {
    // Verificar la conexión a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Capturar el pago con PayPal
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    const captureResponse = await client.execute(captureRequest);

    // Validar la respuesta de PayPal
    if (captureResponse.statusCode !== 201 || !captureResponse.result || !captureResponse.result.id) {
      return res.status(400).json({ message: 'Error al capturar el pago o respuesta inválida de PayPal.' });
    }

    // Actualizar la orden en la base de datos
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderId: orderId }, // Filtro
      {
        payment_status: 'COMPLETED',
        paymentId: captureResponse.result.id,
        status: 'COMPLETED',
        metodoDePago: 'PayPal',
      },
      { new: true } // Opciones
    );

    // Verificar si la orden se actualizó correctamente
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found in the database.' });
    }

    // Responder con la orden actualizada
    return res.status(200).json({
      message: 'Payment confirmed and order successfully registered.',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error en confirmPayPalPayment:', error.message);
    return res.status(500).json({
      message: error.message || 'Error confirming payment',
    });
  }
};

// Controlador para manejar la cancelación de PayPal
export const handlePayPalCancel = async (req, res) => {
  const { orderId } = req.query;
  console.log("orderId from cancel:", orderId); // Debugging

  if (!orderId) {
    return res.status(400).json({ message: 'El orderId es requerido.' });
  }

  try {
    // Verificar la conexión a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    // Actualizar la orden en la base de datos
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderId: orderId, payment_status: 'PENDING' }, // Filtro: solo actualizar si está pendiente
      {
        payment_status: 'CANCELED', // Actualizar el estado del pago
        status: 'CANCELED', // Actualizar el estado general de la orden
      },
      { new: true } // Devolver la orden actualizada
    );
    console.log("Updated Order:", updatedOrder); // Debugging

    // Verificar si la orden se actualizó correctamente
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Orden no encontrada o ya no está pendiente.' });
    }

    // Responder con la orden actualizada
    return res.status(200).json({
      message: 'Orden cancelada exitosamente.',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error en handlePayPalCancel:', error.message);
    console.error('Error details:', error); // Debugging
    return res.status(500).json({
      message: error.message || 'Error al cancelar la orden',
    });
  }
};
// Controlador para crear una orden de PayPal
export const createPayPalOrder = async (req, res) => {
  try {
    const { list_items, addressId } = req.body;
    const userId = req.userId;

    // Validación de datos
    if (!list_items || !Array.isArray(list_items) || list_items.length === 0) {
      return res.status(400).json({ message: "Lista de items inválida o vacía" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    // Crear los items para PayPal
    const items = await Promise.all(list_items.map(async (item) => {
      const productDetails = await ProductModel.findById(item.productId);
      if (!productDetails) {
        throw new Error(`Producto con ID ${item.productId} no encontrado`);
      }

      return {
        name: productDetails.name.substring(0, 127), // Limita a 127 caracteres
        description: (productDetails.description || productDetails.name).substring(0, 127), // Limita a 127 caracteres
        quantity: item.quantity.toString(), // Asegúrate de que sea una cadena
        unit_amount: {
          currency_code: 'USD', // Cambia a 'INR' si es necesario
          value: (productDetails.price * (1 - productDetails.discount / 100)).toFixed(2) // Asegura dos decimales
        }
      };
    }));

    // Calcular el monto total
    const totalAmount = list_items.reduce((acc, item) => 
      acc + (item.productId.price * (1 - item.productId.discount / 100) * item.quantity), 0).toFixed(2);

    // Crear la solicitud de orden de PayPal
    const orderRequest = new paypal.orders.OrdersCreateRequest();
    orderRequest.prefer("return=representation");
    orderRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD', // Cambia a 'INR' si es necesario
          value: totalAmount,
          breakdown: {
            item_total: {
              currency_code: 'USD', // Cambia a 'INR' si es necesario
              value: totalAmount
            }
          }
        },
        items: items
      }],
      application_context: {
        brand_name: 'Emys SHoop', // Limita a 127 caracteres
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/success`, // URL de retorno
        cancel_url: `${process.env.FRONTEND_URL}/cancel` // URL de cancelación
      }
    });

    // Ejecutar la solicitud de PayPal
    const orderResponse = await client.execute(orderRequest);

    if (!orderResponse.result.links) {
      throw new Error("Respuesta inesperada de PayPal");
    }

    const approvalLink = orderResponse.result.links.find(link => link.rel === 'approve');
    if (!approvalLink) {
      throw new Error("No se pudo encontrar la URL de aprobación en la respuesta de PayPal");
    }

    const approvalUrl = approvalLink.href;

    // Guardar la orden en la base de datos
    const order = new OrderModel({
      userId: userId,
      orderId: orderResponse.result.id,
      products: await Promise.all(list_items.map(async (item) => {
        const productDetails = await ProductModel.findById(item.productId);
        if (!productDetails) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
        }

        return {
          productId: productDetails._id,
          product_details: {
            name: productDetails.name,
            image: productDetails.image,
            unit_price: productDetails.price,
            discount: productDetails.discount,
            quantity: item.quantity,
            total_price: (productDetails.price * (1 - productDetails.discount / 100) * item.quantity).toFixed(2)
          }
        };
      })),
      subTotalAmt: totalAmount,
      totalAmt: totalAmount,
      payment_status: 'PENDING',
      delivery_address: addressId,
      invoice_receipt: `INV-${new mongoose.Types.ObjectId()}`
    });

    await order.save();

    // Limpiar el carrito del usuario
    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    // Responder con la URL de aprobación y el ID de la orden
    return res.status(200).json({
      approvalUrl: approvalUrl,
      orderId: orderResponse.result.id,
      message: "Orden creada exitosamente",
      error: false,
      success: true
    });

  } catch (error) {
    console.error("Error en createPayPalOrder:", error.message);
    console.error("Detalles del error:", error.response?.data || error.stack);
    res.status(500).json({
      message: error.message || "Error al crear la orden de PayPal",
      error: true,
      success: false
    });
  }
};










export const createCulqiOrder = async (req, res) => {
  try {
    const { token, list_items, addressId } = req.body;
    const userId = req.userId;

    // Validación de datos
    if (!token) {
      return res.status(400).json({ message: "Token de Culqi es requerido." });
    }

    if (!list_items || !Array.isArray(list_items) || list_items.length === 0) {
      return res.status(400).json({ message: "Lista de items inválida o vacía." });
    }

    // Calcular el monto total
    const totalAmount = list_items.reduce((acc, item) => {
      const product = item.productId;
      return acc + (product.price * (1 - product.discount / 100) * item.quantity);
    }, 0);

    // Crear el cargo en Culqi
    const charge = await culqi.charges.create({
      amount: totalAmount * 100, // Culqi espera el monto en céntimos
      currency_code: "PEN", // Moneda (PEN para soles peruanos)
      email: req.userEmail, // Email del usuario (debes obtenerlo desde el token JWT o la base de datos)
      source_id: token, // Token generado por Culqi en el frontend
      description: "Compra en Emys SHoop",
    });

    // Guardar la orden en la base de datos
    const order = new OrderModel({
      userId: userId,
      orderId: charge.id, // ID del cargo en Culqi
      products: await Promise.all(list_items.map(async (item) => {
        const productDetails = await ProductModel.findById(item.productId);
        return {
          productId: productDetails._id,
          product_details: {
            name: productDetails.name,
            image: productDetails.image,
            unit_price: productDetails.price,
            discount: productDetails.discount,
            quantity: item.quantity,
            total_price: (productDetails.price * (1 - productDetails.discount / 100) * item.quantity).toFixed(2),
          },
        };
      })),
      subTotalAmt: totalAmount,
      totalAmt: totalAmount,
      payment_status: "COMPLETED",
      delivery_address: addressId,
      invoice_receipt: `INV-${new mongoose.Types.ObjectId()}`,
      metodoDePago: "Culqi",
    });

    await order.save();

    // Limpiar el carrito del usuario
    await CartProductModel.deleteMany({ userId: userId });
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    // Responder con la orden creada
    return res.status(200).json({
      message: "Pago procesado exitosamente con Culqi",
      order: order,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error en createCulqiOrder:", error.message);
    return res.status(500).json({
      message: error.message || "Error al procesar el pago con Culqi",
      error: true,
      success: false,
    });
  }
};