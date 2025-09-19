import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'user' },
    items: [{
        product: { type: String, required: true, ref: 'products' },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: { type: String, ref: 'address', required: true },
    paymentMethod: { type: String, ref: 'paymentmethod', required: true },
    paymentProof: { type: String, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    date: { type: Number, required: true },
})

// Eliminar el modelo existente si existe
if (mongoose.models.order) {
  delete mongoose.models.order;
}

const Order = mongoose.model('order', orderSchema)

export default Order