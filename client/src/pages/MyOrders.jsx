import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NoData from '../components/NoData';
import { DisplayPriceInUSD } from '../utils/DisplayPriceInUSD';
import OrderDetailsModal from '../components/OrderDetailsModal';

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detectar si es móvil

  console.log("order Items", orders);

  // Función para manejar el cambio de tamaño de la pantalla
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // Agregar un listener para el cambio de tamaño de la pantalla
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  // Función para obtener los últimos 4 caracteres del orderId
  const getLastFourCharacters = (orderId) => {
    return orderId.slice(-4); // Obtener los últimos 4 caracteres
  };

  return (
    <div>
      <div className='bg-white shadow-md p-3 font-semibold'>
        <h1>Orders</h1>
      </div>
      {!orders[0] && <NoData message="No completed orders found." />} {/* Mensaje personalizado */}
      {orders.length > 0 && (
        <div className='mt-4'>
          {orders.map((order, index) => (
            <div key={order._id + index + "order"} className='order rounded p-4 text-sm bg-white mb-4 shadow-md'>
              <div className='flex justify-between items-center'>
                <p><strong>Order No:</strong> {isMobile ? getLastFourCharacters(order.orderId) : order.orderId}</p>
                <button
                  onClick={() => handleViewDetails(order)}
                  className='p-2 bg-blue-100 rounded-full hover:text-blue-600'
                >
                  View Details
                </button>
              </div>
              <div className='products-list mt-2'>
                {order.products.map((product, idx) => (
                  <div key={product.productId + idx} className='mb-2 flex'>
                    {product.product_details?.image && (
                      <img
                        src={product.product_details.image[0]}
                        className='w-14 h-14 mr-2'
                        alt={product.product_details.name}
                      />
                    )}
                    <div>
                      <p className='font-medium'>{product.product_details?.name}</p>
                      <p>Quantity: {product.quantity}</p>
                      <p>Unit Price: {DisplayPriceInUSD(product.product_details.unit_price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-4'>
                <p><strong>Subtotal:</strong> {DisplayPriceInUSD(order.subTotalAmt)}</p>
                <p><strong>Total:</strong> {DisplayPriceInUSD(order.totalAmt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedOrder && (
        <OrderDetailsModal
          data={selectedOrder}
          close={closeModal}
        />
      )}
    </div>
  );
};

export default MyOrders;