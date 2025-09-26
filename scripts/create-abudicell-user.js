import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createAbudicellUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Verificar si ya existe
    const existingUser = await AdminUser.findOne({ username: 'abudicell' });
    if (existingUser) {
      console.log('⚠️ Usuario abudicell ya existe');
      process.exit(0);
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash('abudi1234', 12);
    console.log('🔐 Contraseña hasheada:', hashedPassword);
    
    // Crear el usuario
    const newUser = new AdminUser({
      username: 'abudicell',
      name: 'Abudi Cell Admin',
      password: hashedPassword,
      permissions: {
        addProduct: true,
        productList: true,
        categories: true,
        brands: true,
        orders: true,
        paymentMethods: true,
        communications: true,
        adminUsers: true,
        whatsapp: true
      },
      isActive: true
    });
    
    await newUser.save();
    console.log('✅ Usuario abudicell creado exitosamente');
    console.log('🔑 Credenciales:');
    console.log('   Usuario: abudicell');
    console.log('   Contraseña: abudi1234');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAbudicellUser();
