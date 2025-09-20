import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "El nombre de usuario es requerido"],
    unique: true,
    trim: true,
    maxLength: [30, "El nombre de usuario no puede exceder 30 caracteres"],
    match: [/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos"]
  },
  name: {
    type: String,
    required: [true, "El nombre completo es requerido"],
    trim: true,
    maxLength: [50, "El nombre no puede exceder 50 caracteres"]
  },
  password: {
    type: String,
    required: [true, "La contraseña es requerida"],
    minLength: [6, "La contraseña debe tener al menos 6 caracteres"]
  },
  permissions: {
    addProduct: {
      type: Boolean,
      default: true
    },
    productList: {
      type: Boolean,
      default: true
    },
    categories: {
      type: Boolean,
      default: true
    },
    brands: {
      type: Boolean,
      default: true
    },
    orders: {
      type: Boolean,
      default: true
    },
    paymentMethods: {
      type: Boolean,
      default: true
    },
    communications: {
      type: Boolean,
      default: true
    },
    adminUsers: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'adminuser',
    default: null
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
AdminUserSchema.index({ username: 1 });
AdminUserSchema.index({ role: 1 });
AdminUserSchema.index({ isActive: 1 });

// Eliminar el modelo existente si tiene el campo email
if (mongoose.models.adminuser) {
  delete mongoose.models.adminuser;
}

export default mongoose.model("adminuser", AdminUserSchema);
