import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function testAdminLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const adminUser = await AdminUser.findOne({ username: 'admin' });
    console.log('🔍 Usuario encontrado:', adminUser.username);
    console.log('🔍 Contraseña hasheada:', adminUser.password);
    console.log('🔍 isActive:', adminUser.isActive);
    
    // Probar contraseñas comunes
    const testPasswords = ['admin', '123456', 'password', 'admin123'];
    
    for (const testPassword of testPasswords) {
      const isValid = await bcrypt.compare(testPassword, adminUser.password);
      console.log(`🔍 Contraseña "${testPassword}": ${isValid ? '✅ VÁLIDA' : '❌ Inválida'}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAdminLogin();
