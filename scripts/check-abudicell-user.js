import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function checkAbudicellUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Buscar usuario abudicell
    const abudicellUser = await AdminUser.findOne({ username: 'abudicell' });
    
    if (abudicellUser) {
      console.log('🔍 Usuario abudicell encontrado:');
      console.log('   Username:', abudicellUser.username);
      console.log('   Nombre:', abudicellUser.name);
      console.log('   isActive:', abudicellUser.isActive);
      console.log('   Contraseña hasheada:', abudicellUser.password);
      
      // Probar la contraseña
      const isValid = await bcrypt.compare('abudi1234', abudicellUser.password);
      console.log('🔍 Contraseña "abudi1234":', isValid ? '✅ VÁLIDA' : '❌ Inválida');
      
    } else {
      console.log('❌ Usuario abudicell NO encontrado');
      
      // Mostrar todos los usuarios disponibles
      const allUsers = await AdminUser.find({});
      console.log('📊 Usuarios disponibles:');
      allUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.username} (${user.name})`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAbudicellUser();
