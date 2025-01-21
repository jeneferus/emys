import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js'; // Importar el controlador
import auth from '../middleware/auth.js';

const contactRoutes = express.Router();

// Ruta para enviar el formulario de contacto
contactRoutes.post('/', auth, sendContactMessage); // Cambiado a '/'

export default contactRoutes;