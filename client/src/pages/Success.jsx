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
      
        } else {
            setError("No orderId was found in localStorage.")
            setLoading(false)
        }
    }, []);

    // Confirmar el pago con el backend
    useEffect(() => {
        if (orderId) {
      

            Axios.get(`/api/order/confirm-paypal-payment?orderId=${orderId}`)
                .then(response => {
               

                    if (response.data.message === 'Payment confirmed and order successfully registered.') {
                        setSuccessMessage("Payment successfully confirmed.")
                    } else {
                        setError("The payment was not successfully confirmed. Backend response:" + JSON.stringify(response.data))
                    }
                })
                .catch(error => {
                    console.error("Error confirming payment:", error);

                    if (error.response) {
                        setError("Backend error: " + JSON.stringify(error.response.data))
                    } else if (error.request) {
                        setError("No response received from the backend. Request error.")
                    } else {
                        setError("Request configuration error: " + error.message)
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
                Go back to Home
                </Link>
            </div>
        )
    }

    return (
        <div className='m-2 w-full max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
            <h1 className='text-green-800 font-bold text-lg text-center'>Payment successful!</h1>
            <p className='text-green-800 font-bold text-lg text-center'>
            Your order with ID {orderId} has been successfully processed.
            </p>
            {successMessage && (
                <p className='text-green-800 text-center'>{successMessage}</p>
            )}
            <Link to="/" className="border border-green-900 text-green-900 hover:bg-green-900 hover:text-white transition-all px-4 py-1">
            Go back to Home
            </Link>
        </div>
    )
}

export default Success