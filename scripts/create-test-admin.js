const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Esquema de AdminUser
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
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'editor'],
    default: 'admin'
  },
  permissions: {
    addProduct: { type: Boolean, default: true },
    productList: { type: Boolean, default: true },
    orders: { type: Boolean, default: true },
    paymentMethods: { type: Boolean, default: true },
    adminUsers: { type: Boolean, default: true }
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

const AdminUser = mongoose.model("adminuser", AdminUserSchema);

async function createTestAdmin() {
  try {
    // Conectar a MongoDB
    console.log('🔍 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcart');
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe el usuario de prueba
    const existingUser = await AdminUser.findOne({ username: 'testadmin' });
    if (existingUser) {
      console.log('⚠️ El usuario de prueba ya existe. Eliminando...');
      await AdminUser.deleteOne({ username: 'testadmin' });
    }

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('test123', saltRounds);

    // Crear usuario de prueba
    const testAdmin = new AdminUser({
      username: 'testadmin',
      name: 'Administrador de Prueba',
      password: hashedPassword,
      role: 'super_admin',
      permissions: {
        addProduct: true,
        productList: true,
        orders: true,
        paymentMethods: true,
        adminUsers: true
      },
      isActive: true
    });

    await testAdmin.save();
    console.log('✅ Usuario de prueba creado exitosamente');
    console.log('📋 Credenciales de prueba:');
    console.log('   Usuario: testadmin');
    console.log('   Contraseña: test123');
    console.log('   Permisos: Todos habilitados');

  } catch (error) {
    console.error('❌ Error al crear usuario de prueba:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createTestAdmin();
}

module.exports = { createTestAdmin };
