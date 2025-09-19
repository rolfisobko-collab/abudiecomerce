import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "user" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    minWholesaleQuantity: { type: Number, required: true, min: 1 },
    image: { type: Array, required: false, default: [] },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    date: { type: Number, required: true },
    // Campos para ratings
    averageRating: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 5 
    },
    totalRatings: { 
        type: Number, 
        default: 0 
    },
    stock: {
        type: Number,
        default: 100
    }
})

// Eliminar el modelo existente si existe
if (mongoose.models.products) {
    delete mongoose.models.products;
}

const Product = mongoose.model('products', productSchema)

export default Product