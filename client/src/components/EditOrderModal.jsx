import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const EditOrderModal = ({ close, data, fetchAllOrders }) => {
    const [orderData, setOrderData] = useState({
        orderId: data.orderId,
        userId: data.userId,
        totalAmt: data.totalAmt,
        status: data.status,
        payment_status: data.payment_status,
        delivery_address: data.delivery_address?.address_line || '', // Handle possible null
        products: data.products || []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...SummaryApi.updateOrderStatus,
                data: orderData
            });

            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                if (close) {
                    close();
                }
                if (fetchAllOrders) {
                    fetchAllOrders();
                }
            }

        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='fixed top-0 right-0 bottom-0 left-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-5xl bg-white p-4 rounded'>
                <div className='flex items-center justify-between gap-3'>
                    <h1 className='font-semibold'>Edit Order</h1>
                    <button onClick={close}>
                        <IoClose size={25} />
                    </button>
                </div>
                <form className='my-3 grid gap-3' onSubmit={handleSubmitOrder}>
                    <div className='grid gap-1'>
                        <label htmlFor='orderId'>Order ID</label>
                        <input
                            id='orderId'
                            name='orderId'
                            value={orderData.orderId}
                            onChange={handleChange}
                            className='p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded'
                            readOnly
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='userId'>User</label>
                        <input
                            id='userId'
                            name='userId'
                            value={orderData.userId.name}
                            onChange={handleChange}
                            className='p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded'
                            readOnly
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='totalAmt'>Total Amount</label>
                        <input
                            id='totalAmt'
                            name='totalAmt'
                            value={orderData.totalAmt}
                            onChange={handleChange}
                            className='p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='status'>Status</label>
                        <select
                            id='status'
                            name='status'
                            value={orderData.status}
                            onChange={handleChange}
                            className='p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded'
                        >
                            <option value="PENDING">Pending</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='payment_status'>Payment Status</label>
                        <select
                            id='payment_status'
                            name='payment_status'
                            value={orderData.payment_status}
                            onChange={handleChange}
                            className='p-3 bg-blue-50 border outline-none focus-within:border-primary-200 rounded'
                        >
                            <option value="CASH ON DELIVERY">Cash on Delivery</option>
                            <option value="PAID">Paid</option>
                            <option value="PENDING">Pending</option>
                        </select>
                    </div>
                    <button
                        className={`px-4 py-2 border
                            ${orderData?.totalAmt && orderData?.status ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-200"}
                            font-semibold
                        `}
                        type='submit'
                    >
                        Submit
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditOrderModal;
