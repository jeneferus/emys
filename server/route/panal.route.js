import { Router } from "express";
import auth from "../middleware/auth.js"; // Importa el middleware de autenticación
import {
    getOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
    deleteOrderController
} from "../controllers/PanalControl.js";

const panalroute = Router();

// Ruta para obtener todas las órdenes (requiere autenticación)
panalroute.get("/get", auth, getOrdersController);
panalroute.get("/search", auth, getOrdersController);
// Ruta para obtener una orden por su ID (requiere autenticación)
panalroute.get("/get/:orderId", auth, getOrderByIdController);

// Ruta para actualizar el estado de una orden (requiere autenticación)
panalroute.put("/update-status", auth, updateOrderStatusController);

// Ruta para eliminar una orden (requiere autenticación)
panalroute.delete("/delete", auth, deleteOrderController);

export default panalroute;