// PanalControl.js
import OrderModel from "../models/order.model.js";
import mongoose from "mongoose";

// Obtener todas las órdenes (con filtro por estado)
export const getOrdersController = async (request, response) => {
    try {
        const { orderId, userName, startDate, endDate, status } = request.query;

        // Construcción del filtro dinámico
        const filter = {};

        // Filtro por ID de la orden
        if (orderId) {
            filter.orderId = { $regex: orderId, $options: "i" }; // Búsqueda parcial
        }

        // Filtro por nombre de usuario
        if (userName) {
            filter["userId.name"] = { $regex: userName, $options: "i" }; // Búsqueda parcial
        }

        // Filtro por rango de fechas
        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Filtro por estado
        if (status) {
            filter.status = status;
        }

        // Realizar la consulta con filtros
        const orders = await OrderModel.find(filter)
            .sort({ createdAt: -1 }) // Ordenar por fecha de creación
            .populate('userId') // Poblar el usuario
            .populate('delivery_address') // Poblar la dirección de entrega
            .populate('products.productId'); // Poblar los productos

        return response.json({
            message: "Orders retrieved successfully",
            data: orders,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


// Obtener una orden por su ID
export const getOrderByIdController = async (request, response) => {
    try {
        const { orderId } = request.params;

        // Buscar la orden por su orderId
        const order = await OrderModel.findOne({ orderId })
            .populate('userId') // Poblar el usuario
            .populate('delivery_address') // Poblar la dirección de entrega
            .populate('products.productId'); // Poblar los productos

        if (!order) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Order retrieved successfully",
            data: order,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Actualizar el estado de una orden
export const updateOrderStatusController = async (request, response) => {
    try {
        const { orderId, status } = request.body;

        // Verificar si la orden existe
        const existingOrder = await OrderModel.findOne({ orderId });
        if (!existingOrder) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        // Validar el nuevo estado
        const validStatuses = ["PENDING", "DELIVERED", "CANCELLED", "SHIPPED"];
        if (!validStatuses.includes(status)) {
            return response.status(400).json({
                message: "Invalid status",
                error: true,
                success: false
            });
        }

        // Actualizar el estado de la orden
        const updatedOrder = await OrderModel.findOneAndUpdate(
            { orderId },
            { status },
            { new: true } // Devolver el documento actualizado
        );

        return response.json({
            message: "Order status updated successfully",
            data: updatedOrder,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Eliminar una orden
// Eliminar una orden
export const deleteOrderController = async (request, response) => {
    console.log("Solicitud recibida para eliminar orden:", request.body);

    try {
        const { orderId } = request.body;

        // Verificar si el orderId está presente
        if (!orderId) {
            return response.status(400).json({
                message: "Order ID is required",
                error: true,
                success: false
            });
        }

        // Buscar la orden en la base de datos
        const existingOrder = await OrderModel.findOne({ orderId });
        if (!existingOrder) {
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        // Verificar si la orden está en estado CANCELLED
        if (existingOrder.status !== "CANCELLED") {
            console.log("Estado actual de la orden:", existingOrder.status);
            return response.status(400).json({
                message: "Order cannot be deleted unless it is CANCELLED",
                error: true,
                success: false
            });
        }

        // Eliminar la orden
        const deletedOrder = await OrderModel.findOneAndDelete({ orderId });
        if (!deletedOrder) {
            return response.status(500).json({
                message: "Failed to delete the order",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "Order deleted successfully",
            data: deletedOrder,
            error: false,
            success: true
        });
    } catch (error) {
        console.error("Error al eliminar orden:", error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

