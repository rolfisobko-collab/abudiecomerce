import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';

const testAPICurl = async () => {
    try {
        console.log('🔍 [API CURL TEST] Iniciando test del API con curl...');
        
        // Conectar a la BD
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ [API CURL TEST] Conectado a MongoDB');

        // Crear un usuario de prueba
        const testUsername = 'curluser_' + Date.now();
        const testPassword = 'curlpass123';
        const testName = 'Curl User';
        
        console.log(`\n🔧 [API CURL TEST] Creando usuario: ${testUsername}`);
        
        // Encriptar contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
        
        // Crear usuario
        const newUser = new AdminUser({
            username: testUsername,
            name: testName,
            password: hashedPassword,
            permissions: {
                addProduct: true,
                productList: true,
                categories: true,
                brands: true,
                orders: true,
                paymentMethods: true,
                communications: true,
                adminUsers: false
            }
        });
        
        await newUser.save();
        console.log(`✅ Usuario creado con ID: ${newUser._id}`);

        // Generar comando curl
        const curlCommand = `curl -X POST http://localhost:3000/api/auth/admin-login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"${testUsername}","password":"${testPassword}"}'`;

        console.log(`\n🔐 [API CURL TEST] Comando curl para probar:`);
        console.log(curlCommand);

        console.log(`\n📋 [API CURL TEST] Datos del usuario creado:`);
        console.log(`  - Username: ${testUsername}`);
        console.log(`  - Password: ${testPassword}`);
        console.log(`  - Name: ${testName}`);
        console.log(`  - ID: ${newUser._id}`);
        console.log(`  - isActive: ${newUser.isActive}`);
        console.log(`  - Permissions: ${JSON.stringify(newUser.permissions, null, 2)}`);

        console.log(`\n🎯 [API CURL TEST] Para probar manualmente:`);
        console.log(`1. Ejecuta el servidor: npm run dev`);
        console.log(`2. Ejecuta el comando curl de arriba`);
        console.log(`3. Debería devolver un JSON con success: true`);

        // Limpiar usuario de prueba
        console.log('\n🧹 [API CURL TEST] Limpiando usuario de prueba...');
        await AdminUser.findByIdAndDelete(newUser._id);
        console.log('✅ Usuario de prueba eliminado');

        console.log('\n🎉 [API CURL TEST] ========== TEST COMPLETADO ==========');

    } catch (error) {
        console.error('❌ [API CURL TEST] Error:', error);
        console.error('❌ [API CURL TEST] Stack:', error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 [API CURL TEST] Desconectado de MongoDB');
    }
};

testAPICurl();
