import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';

const testBDLogin = async () => {
    try {
        console.log('🔍 [BD LOGIN TEST] Iniciando test de login con usuario de BD...');
        
        // Conectar a la BD
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ [BD LOGIN TEST] Conectado a MongoDB');

        // Crear un usuario de prueba que NO sea hardcodeado
        const testUsername = 'bduser_' + Date.now();
        const testPassword = 'bdpass123';
        const testName = 'BD User';
        
        console.log(`\n🔧 [BD LOGIN TEST] Creando usuario de BD: ${testUsername}`);
        
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
        console.log(`✅ Usuario de BD creado con ID: ${newUser._id}`);

        // Simular el proceso del API de login
        console.log(`\n🔐 [BD LOGIN TEST] Probando login con: ${testUsername} / ${testPassword}`);

        // 1. Verificar credenciales hardcodeadas (debería fallar)
        const validCredentials = {
            'abudicell': 'abudicell1234',
            'admin': 'admin123'
        };

        console.log('🔍 [BD LOGIN TEST] Verificando credenciales hardcodeadas...');
        if (validCredentials[testUsername] && validCredentials[testUsername] === testPassword) {
            console.log('✅ [BD LOGIN TEST] Credenciales hardcodeadas válidas (NO DEBERÍA PASAR)');
        } else {
            console.log('❌ [BD LOGIN TEST] Credenciales hardcodeadas inválidas (CORRECTO)');
        }

        // 2. Verificar en BD (debería funcionar)
        console.log('🔍 [BD LOGIN TEST] Verificando en base de datos...');
        const adminUser = await AdminUser.findOne({ username: testUsername });
        
        if (adminUser && adminUser.isActive) {
            console.log('✅ [BD LOGIN TEST] Usuario encontrado en BD:', adminUser.username);
            console.log('✅ [BD LOGIN TEST] isActive:', adminUser.isActive);
            console.log('✅ [BD LOGIN TEST] Permisos:', JSON.stringify(adminUser.permissions, null, 2));
            
            const isValidPassword = await bcrypt.compare(testPassword, adminUser.password);
            console.log('✅ [BD LOGIN TEST] Contraseña válida:', isValidPassword);
            
            if (isValidPassword) {
                console.log('🎉 [BD LOGIN TEST] LOGIN EXITOSO CON USUARIO DE BD!');
                console.log('🎉 [BD LOGIN TEST] Usuario:', adminUser.username);
                console.log('🎉 [BD LOGIN TEST] Nombre:', adminUser.name);
                console.log('🎉 [BD LOGIN TEST] Permisos:', JSON.stringify(adminUser.permissions, null, 2));
            } else {
                console.log('❌ [BD LOGIN TEST] Contraseña incorrecta');
            }
        } else {
            console.log('❌ [BD LOGIN TEST] Usuario no encontrado o inactivo');
        }

        // Limpiar usuario de prueba
        console.log('\n🧹 [BD LOGIN TEST] Limpiando usuario de prueba...');
        await AdminUser.findByIdAndDelete(newUser._id);
        console.log('✅ Usuario de prueba eliminado');

        console.log('\n🎉 [BD LOGIN TEST] ========== TEST COMPLETADO ==========');

    } catch (error) {
        console.error('❌ [BD LOGIN TEST] Error:', error);
        console.error('❌ [BD LOGIN TEST] Stack:', error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 [BD LOGIN TEST] Desconectado de MongoDB');
    }
};

testBDLogin();
