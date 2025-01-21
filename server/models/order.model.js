import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: String,
        required: [true, "Provide orderId"],
        unique: true,
        maxlength: 255
    },
    products: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: "product"
        },
        product_details: {
            name: String,
            image: Array,
            unit_price: Number,  // Precio unitario
            discount: Number,    // Descuento
            quantity: Number,    // Cantidad
            total_price: Number  // Precio total (unit_price - discount) * quantity
        }
    }],
    subTotalAmt: {
        type: Number,
        default: 0
    },
    totalAmt: {
        type: Number,
        default: 0
    },
    paymentId: {
        type: String,
        default: ""
    },
    metodoDePago: {   // Aquí defines el campo metodoDePago
        type: String,
        default: "",
      },
    payment_status: {
        type: String,
        default: "PENDING" // Estado del pago
    },
    status: {
        type: String,
        enum: ["PENDING","COMPLETED", "DELIVERED", "CANCELLED", "SHIPPED"], // Estados de la orden
        default: "PENDING"
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    },
    invoice_receipt: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});
const OrderModel = mongoose.model('order', orderSchema);

export default OrderModel;