export const DisplayPriceInUSD = (price) => {
    return new Intl.NumberFormat('en-US', { // Use 'en-US' for USD formatting
        style: 'currency',
        currency: 'USD', // Change currency to USD
        minimumFractionDigits: 2, // Mínimo 2 decimales
        maximumFractionDigits: 2, // Máximo 2 decimales
    }).format(price);
};