import React from 'react';
import { DisplayPriceInUSD } from '../utils/DisplayPriceInUSD';
import logo from '../assets/logo.png'; // Importa el logo desde la carpeta assets

const OrderDetailsModal = ({ data, close }) => {
  // Función para calcular el subtotal
  const calculateSubtotal = (products) => {
    return products.reduce((sum, product) => {
      const unitPrice = parseFloat(product.product_details?.unit_price || 0);
      const discountPercentage = parseFloat(product.product_details?.discount || 0); // Descuento como porcentaje
      const quantity = parseFloat(product.product_details?.quantity || 0);

      // Calcular el monto del descuento
      const discountAmount = (unitPrice * discountPercentage) / 100;

      // Calcular el precio final con descuento
      const finalPrice = unitPrice - discountAmount;

      // Sumar al subtotal
      return sum + finalPrice * quantity;
    }, 0);
  };

  // Función para manejar la impresión
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl'>
        {data ? (
          <div className='overflow-y-auto flex-1'>
            {/* Contenedor para el contenido imprimible */}
            <div className='printable-content space-y-6'>
              {/* Encabezado de la boleta */}
              <div className='text-center mb-6'>
                <img
                  src={logo} // Usa la variable logo importada
                  alt='Company Logo'
                  className='w-24 h-24 mx-auto mb-4'
                />
                <h1 className='text-3xl font-bold text-gray-700'>EMY'S SHOOP</h1>
                <p className='text-sm text-gray-500'>Your trusted online store</p>
              </div>

              {/* Sección de información general del pedido */}
              <div className='mb-6'>
                <p className='text-gray-700'><strong>Order No:</strong> {data.orderId}</p>
                <p className='text-gray-700'>
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusStyle(data.status)}`}>
                    {data.status}
                  </span>
                </p>
                <p className='text-gray-700'><strong>Payment Method:</strong> {data.metodoDePago || 'N/A'}</p>
                <p className='text-gray-700'><strong>Payment Status:</strong> {data.payment_status || 'N/A'}</p>
                <p className='text-gray-700'><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString()}</p>
              </div>

              {/* Sección de dirección de entrega */}
              <div className='mb-6'>
                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Delivery Address</h3>
                <p className='text-gray-700'><strong>Street:</strong> {data.delivery_address?.address_line || 'N/A'}</p>
                <p className='text-gray-700'><strong>City:</strong> {data.delivery_address?.city || 'N/A'}</p>
                <p className='text-gray-700'><strong>State:</strong> {data.delivery_address?.state || 'N/A'}</p>
                <p className='text-gray-700'><strong>Postal Code:</strong> {data.delivery_address?.pincode || 'N/A'}</p>
                <p className='text-gray-700'><strong>Country:</strong> {data.delivery_address?.country || 'N/A'}</p>
              </div>

              {/* Sección de productos */}
              <div className='products-list mb-6'>
                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Products</h3>
                {data.products.map((product, index) => {
                  const unitPrice = parseFloat(product.product_details?.unit_price || 0);
                  const discountPercentage = parseFloat(product.product_details?.discount || 0); // Descuento como porcentaje
                  const quantity = parseFloat(product.product_details?.quantity || 0);

                  // Calcular el monto del descuento
                  const discountAmount = (unitPrice * discountPercentage) / 100;

                  // Calcular el precio final con descuento
                  const finalPrice = unitPrice - discountAmount;

                  // Calcular el precio total del producto
                  const totalPrice = finalPrice * quantity;

                  return (
                    <div key={product.productId._id + index} className='mb-4 border-b pb-4'>
                      <div className='flex items-center space-x-4'>
                        <img
                          src={product.product_details.image[0]}
                          className='w-16 h-16 rounded-lg object-cover'
                          alt={product.product_details.name}
                        />
                        <div>
                          <p className='text-lg font-medium text-gray-900'>{product.product_details?.name}</p>
                          <p className='text-sm text-gray-600'><strong>Unit Price:</strong> {DisplayPriceInUSD(unitPrice)}</p>
                          <p className='text-sm text-gray-600'><strong>Discount:</strong> {discountPercentage}%</p>
                          <p className='text-sm text-gray-600'><strong>Quantity:</strong> {quantity}</p>
                          <p className='text-sm text-gray-600'><strong>Total Price:</strong> {DisplayPriceInUSD(totalPrice)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sección de resumen del pedido */}
              <div className='mb-6'>
                <h3 className='text-xl font-semibold text-gray-800 mb-3'>Order Summary</h3>
                <p className='text-gray-700'><strong>Subtotal:</strong> {DisplayPriceInUSD(calculateSubtotal(data.products))}</p>
                <p className='text-gray-700'><strong>Total Amount:</strong> {DisplayPriceInUSD(data.totalAmt)}</p>
              </div>

              {/* Pie de página de la boleta */}
              <div className='text-center mt-8'>
                <p className='text-sm text-gray-500'>Gracias por su compra</p>
                <p className='text-sm text-gray-500'>Visite nuestra tienda nuevamente</p>
              </div>
            </div>
          </div>
        ) : (
          <p className='text-gray-700'>No details available.</p>
        )}
        <div className='mt-6 flex justify-end space-x-4'>
          {/* Botones de acción */}
          <button 
            onClick={handlePrint} 
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200'
          >
            Print
          </button>
          <button 
            onClick={close} 
            className='px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Función para obtener el estilo del estado
const getStatusStyle = (status) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'SHIPPED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default OrderDetailsModal;