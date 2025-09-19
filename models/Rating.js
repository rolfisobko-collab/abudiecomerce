import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        ref: "user" 
    },
    productId: { 
        type: String, 
        required: true, 
        ref: "product" 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
    review: { 
        type: String, 
        trim: true,
        maxlength: 500 
    },
    userName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Índice compuesto para evitar ratings duplicados del mismo usuario al mismo producto
ratingSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Middleware para actualizar updatedAt
ratingSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Eliminar el modelo existente si existe
if (mongoose.models.rating) {
    delete mongoose.models.rating;
}

export default mongoose.model("rating", ratingSchema);
