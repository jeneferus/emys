import ContactMessage from '../models/ContactMessage.js';

export const sendContactMessage = async (req, res) => {
    const { name, email, message } = req.body;

    console.log('Datos recibidos:', { name, email, message }); // Log para verificar los datos

    try {
        const newMessage = new ContactMessage({ name, email, message });
        await newMessage.save();

        console.log(`Mensaje recibido de ${name} (${email}): ${message}`);
        res.status(200).json({ success: true, message: 'Mensaje enviado con éxito' });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el mensaje' });
    }
};