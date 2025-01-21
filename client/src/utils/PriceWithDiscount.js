export const pricewithDiscount = (price, discount = 0) => {
    // Si no hay descuento, devuelve el precio original
    if (!discount || discount === 0) return Number(price).toFixed(2);
  
    // Calcula el monto del descuento
    const discountAmount = (Number(price) * Number(discount)) / 100;
  
    // Calcula el precio final restando el descuento
    const actualPrice = Number(price) - discountAmount;
  
    // Devuelve el precio formateado con dos decimales
    return actualPrice.toFixed(2);
  };