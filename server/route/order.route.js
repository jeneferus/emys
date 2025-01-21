import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
    CashOnDeliveryOrderController,
    getOrderDetailsController,
    confirmPayPalPayment,
    handlePayPalCancel,
    createPayPalOrder
} from '../controllers/order.controller.js';

const orderRouter = Router();

// Ruta para crear una orden contra reembolso
orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);

// Ruta para manejar la cancelación de PayPal (GET porque PayPal redirige aquí)
orderRouter.get('/handle-paypal-cancel', auth, handlePayPalCancel);

// Ruta para confirmar el pago de PayPal (GET porque PayPal redirige aquí)
orderRouter.get('/confirm-paypal-payment', auth, confirmPayPalPayment);

// Ruta para crear una orden de PayPal
orderRouter.post('/create-paypal-order', auth, createPayPalOrder);

// Ruta para obtener la lista de órdenes del usuario
orderRouter.get("/order-list", auth, getOrderDetailsController);

export default orderRouter;