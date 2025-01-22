import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from '../utils/Axios';

const Success = () => {
    const [orderId, setOrderId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    // Recuperar el orderId del localStorage
    useEffect(() => {
        const orderIdFromStorage = localStorage.getItem('paypalOrderId')

        if (orderIdFromStorage) {
            setOrderId(orderIdFromStorage);
            console.log("orderId recuperado del localStorage:", orderIdFromStorage)
        } else {
            setError("No se encontró orderId en el localStorage.")
            setLoading(false)
        }
    }, []);

    // Confirmar el pago con el backend
    useEffect(() => {
        if (orderId) {
      

            Axios.get(`/api/order/confirm-paypal-payment?orderId=${orderId}`)
                .then(response => {
               

                    if (response.data.message === 'Pago confirmado y orden registrada exitosamente.') {
                        setSuccessMessage("Pago confirmado exitosamente.")
                    } else {
                        setError("El pago no se confirmó correctamente. Respuesta del backend: " + JSON.stringify(response.data))
                    }
                })
                .catch(error => {
                    console.error("Error al confirmar el pago:", error);

                    if (error.response) {
                        setError("Error del backend: " + JSON.stringify(error.response.data))
                    } else if (error.request) {
                        setError("No se recibió respuesta del backend. Error en la solicitud.")
                    } else {
                        setError("Error en la configuración de la solicitud: " + error.message)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [orderId])

    if (loading) {
        return (
            <div className='m-2 w-full max-w-md bg-blue-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
                <h1 className='text-blue-800 font-bold text-lg text-center'>Procesando pago...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div className='m-2 w-full max-w-md bg-red-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
                <h1 className='text-red-800 font-bold text-lg text-center'>Error</h1>
                <p className='text-red-800 text-center'>{error}</p>
                <Link to="/" className="border border-red-900 text-red-900 hover:bg-red-900 hover:text-white transition-all px-4 py-1">
                    Volver a Inicio
                </Link>
            </div>
        )
    }

    return (
        <div className='m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
            <h1 className='text-green-800 font-bold text-lg text-center'>¡Pago exitoso!</h1>
            <p className='text-green-800 font-bold text-lg text-center'>
                Tu orden con ID {orderId} ha sido procesada correctamente.
            </p>
            {successMessage && (
                <p className='text-green-800 text-center'>{successMessage}</p>
            )}
            <Link to="/" className="border border-green-900 text-green-900 hover:bg-green-900 hover:text-white transition-all px-4 py-1">
                Volver a Inicio
            </Link>
        </div>
    )
}

export default Success