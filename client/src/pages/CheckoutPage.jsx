import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInUSD } from '../utils/DisplayPriceInUSD';
import AddAddress from '../components/AddAddress';
import { useSelector } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
    const [openAddress, setOpenAddress] = useState(false);
    const addressList = useSelector(state => state.addresses.addressList);
    const [selectAddress, setSelectAddress] = useState(null);
    const cartItemsList = useSelector(state => state.cartItem.cart);
    const navigate = useNavigate();

    // Función para manejar el pago contra entrega (Cash on Delivery)

    // Función para manejar el pago con PayPal
    const handlePayPalPayment = async () => {
        if (!addressList[selectAddress]) {
            toast.error("Please select an address");
            return;
        }

        const toastId = toast.loading("Redirecting to PayPal...");

        try {
            const response = await Axios({
                ...SummaryApi.createPayPalOrder,
                data: {
                    list_items: cartItemsList,
                    addressId: addressList[selectAddress]._id,
                },
            });

            const { data: responseData } = response;

            if (responseData.success && responseData.approvalUrl) {
                // Almacenar el orderId en localStorage antes de redirigir
                localStorage.setItem('paypalOrderId', responseData.orderId);

                // Redirigir al usuario a PayPal
                window.location.href = responseData.approvalUrl;
            } else {
                toast.error("Failed to get PayPal approval URL");
            }
        } catch (error) {
            console.error("Error en handlePayPalPayment:", error);
            if (error.response) {
                toast.error(error.response.data.message || "Error en la API");
            } else if (error.request) {
                toast.error("No se recibió respuesta del servidor");
            } else {
                toast.error("Error interno al procesar la solicitud");
            }
        } finally {
            toast.dismiss(toastId); // Limpiar el toast de carga
        }
    };


    useEffect(() => {
        if (typeof window.Culqi !== 'undefined') {
            console.log("Culqi SDK cargado correctamente");
            window.Culqi.publicKey = import.meta.env.VITE_CULQI_PUBLIC_KEY;
        } else {
            console.error("Culqi SDK no está cargado correctamente.");
        }
    }, []);

    // Función para manejar el pago con Culqi
 const handleCulqiPayment = async () => {
    if (!addressList[selectAddress]) {
        toast.error("Please select an address");
        return;
    }

    // Verificar si Culqi está cargado
    if (typeof window.Culqi === 'undefined') {
        toast.error("Culqi SDK no está cargado correctamente.");
        return;
    }

    // Configurar Culqi
    window.Culqi.settings({
        title: 'Emys SHoop',
        currency: 'PEN', // Moneda en soles peruanos
        description: 'Compra en Emys SHoop',
        amount: totalPrice * 100, // Monto en céntimos
    });

    // Abrir el formulario de Culqi
    window.Culqi.open();

    // Escuchar el evento 'token' para obtener el token generado por Culqi
    window.Culqi.on('token', async (token) => {
        console.log("Token generado:", token);
        const toastId = toast.loading("Processing payment with Culqi...");
    
        try {
            const response = await Axios({
                ...SummaryApi.createCulqiOrder,
                data: {
                    token: token.id,
                    list_items: cartItemsList,
                    addressId: addressList[selectAddress]._id,
                },
            });
    
            const { data: responseData } = response;
            if (responseData.success) {
                toast.success("Payment successful!");
                navigate('/order-success');
            } else {
                toast.error("Failed to process payment with Culqi");
            }
        } catch (error) {
            console.error("Error en handleCulqiPayment:", error);
            if (error.response) {
                toast.error(error.response.data.message || "Error en la API");
            } else if (error.request) {
                toast.error("No se recibió respuesta del servidor");
            } else {
                toast.error("Error interno al procesar la solicitud");
            }
        } finally {
            toast.dismiss(toastId);
        }
    });
    
    window.Culqi.on('error', (error) => {
        console.error("Culqi error:", error);
        toast.error("Error al procesar el pago con Culqi");
    });

    // Escuchar el evento 'error' para manejar errores de Culqi
    window.Culqi.on('error', (error) => {
        console.error("Culqi error:", error);
        toast.error("Error al procesar el pago con Culqi");
    });
};


    return (
        <section className='bg-blue-50'>
            <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
                <div className='w-full'>
                    {/*** Sección de direcciones ***/}
                    <h3 className='text-lg font-semibold'>Choose your address</h3>
                    <div className='bg-white p-2 grid gap-4'>
                        {addressList.map((address, index) => (
                            <label
                                key={index}
                                htmlFor={"address" + index}
                                className={!address.status ? "hidden" : undefined}
                            >
                                <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                                    <div>
                                        <input
                                            id={"address" + index}
                                            type='radio'
                                            value={index}
                                            onChange={(e) => setSelectAddress(e.target.value)}
                                            name='address'
                                        />
                                    </div>
                                    <div>
                                        <p>{address.address_line}</p>
                                        <p>{address.city}</p>
                                        <p>{address.state}</p>
                                        <p>{address.country} - {address.pincode}</p>
                                        <p>{address.mobile}</p>
                                    </div>
                                </div>
                            </label>
                        ))}
                        <div
                            onClick={() => setOpenAddress(true)}
                            className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'
                        >
                            Add address
                        </div>
                    </div>
                </div>

                <div className='w-full max-w-md bg-white py-4 px-2'>
                    {/*** Resumen de la compra ***/}
                    <h3 className='text-lg font-semibold'>Summary</h3>
                    <div className='bg-white p-4'>
                        <h3 className='font-semibold'>Bill details</h3>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Items total</p>
                            <p className='flex items-center gap-2'>
                                <span className='line-through text-neutral-400'>
                                    {DisplayPriceInUSD(notDiscountTotalPrice)}
                                </span>
                                <span>{DisplayPriceInUSD(totalPrice)}</span>
                            </p>
                        </div>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Quantity total</p>
                            <p className='flex items-center gap-2'>{totalQty} item</p>
                        </div>
                        <div className='flex gap-4 justify-between ml-1'>
                            <p>Delivery Charge</p>
                            <p className='flex items-center gap-2'>Free</p>
                        </div>
                        <div className='font-semibold flex items-center justify-between gap-4'>
                            <p>Grand total</p>
                            <p>{DisplayPriceInUSD(totalPrice)}</p>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-4'>
                        <button
                            className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold'
                            onClick={handleCulqiPayment}
                        >
                            Pay with Culqi
                        </button>
                    </div>
                </div>
            </div>

            {/*** Modal para agregar una nueva dirección ***/}
            {openAddress && (
                <AddAddress close={() => setOpenAddress(false)} />
            )}
        </section>
    );
};


export default CheckoutPage;