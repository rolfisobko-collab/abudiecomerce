import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function fixAdminUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Eliminar todos los usuarios admin existentes
    await AdminUser.deleteMany({});
    console.log('🗑️ Usuarios admin eliminados');
    
    // Crear usuario admin
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new AdminUser({
      username: 'admin',
      name: 'Administrador Principal',
      password: adminPassword,
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
    await adminUser.save();
    console.log('✅ Usuario admin creado');
    
    // Crear usuario abudicell
    const abudicellPassword = await bcrypt.hash('abudi1234', 12);
    const abudicellUser = new AdminUser({
      username: 'abudicell',
      name: 'Abudi Cell Admin',
      password: abudicellPassword,
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
    await abudicellUser.save();
    console.log('✅ Usuario abudicell creado');
    
    console.log('🎉 Usuarios creados exitosamente:');
    console.log('   admin / admin123');
    console.log('   abudicell / abudi1234');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAdminUsers();
