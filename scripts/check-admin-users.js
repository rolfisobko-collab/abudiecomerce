import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkAdminUsers() {
  try {
    console.log('🔍 MONGODB_URI:', process.env.MONGODB_URI ? 'Configurada' : 'No configurada');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    const users = await AdminUser.find({});
    console.log('📊 Total usuarios admin:', users.length);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Usuario: ${user.username}`);
      console.log(`   Nombre: ${user.name}`);
      console.log(`   isActive: ${user.isActive}`);
      console.log(`   Permisos: ${JSON.stringify(user.permissions)}`);
      console.log('---');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAdminUsers();
