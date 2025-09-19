import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Para usuarios con credenciales
    imageUrl: { type: String, required: false },
    cartItems: { type: Object, default: {} },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true }
}, { minimize: false })

// Método para verificar contraseña
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Método para hashear contraseña
userSchema.methods.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Eliminar el modelo existente si existe
if (mongoose.models.user) {
  delete mongoose.models.user;
}

const User = mongoose.model('user', userSchema)

export default User