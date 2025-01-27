import React from 'react';
import GooglePayButton from '@google-pay/button-react';

const GooglePayComponent = ({ totalAmt, onSuccess, onError }) => {
  const paymentRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['VISA', 'MASTERCARD'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example', // Valor genérico para pruebas
            gatewayMerchantId: '01234567890123456789', // Valor genérico para pruebas
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: '01234567890123456789', // Valor genérico para pruebas
      merchantName: 'Mi Tienda de Prueba',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: totalAmt, // Asegúrate de que este valor sea válido
      currencyCode: 'USD',
      countryCode: 'US',
    },
  };

  const handleLoadPaymentData = (paymentData) => {
    console.log('Pago exitoso:', paymentData);
    onSuccess(paymentData);
  };

  return (
    <GooglePayButton
      environment="TEST"
      paymentRequest={paymentRequest}
      onLoadPaymentData={handleLoadPaymentData}
      onError={onError}
      buttonType="buy"
      buttonColor="black"
    />
  );
};

export default GooglePayComponent;