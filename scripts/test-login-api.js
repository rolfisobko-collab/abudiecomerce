import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';

const testLoginAPI = async () => {
    try {
        console.log('🔍 [LOGIN API TEST] Iniciando test del API de login...');
        
        // Conectar a la BD
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ [LOGIN API TEST] Conectado a MongoDB');

        // Simular el proceso del API de login
        const testUsername = 'admin'; // Usuario existente
        const testPassword = 'admin123'; // Contraseña hardcodeada
        
        console.log(`\n🔐 [LOGIN API TEST] Probando login con: ${testUsername} / ${testPassword}`);

        // 1. Verificar credenciales hardcodeadas
        const validCredentials = {
            'abudicell': 'abudicell1234',
            'admin': 'admin123'
        };

        console.log('🔍 [LOGIN API TEST] Verificando credenciales hardcodeadas...');
        if (validCredentials[testUsername] && validCredentials[testUsername] === testPassword) {
            console.log('✅ [LOGIN API TEST] Credenciales hardcodeadas válidas');
            console.log('✅ [LOGIN API TEST] Login exitoso con credenciales hardcodeadas');
            return;
        }

        // 2. Si no son hardcodeadas, verificar en BD
        console.log('🔍 [LOGIN API TEST] Verificando en base de datos...');
        const adminUser = await AdminUser.findOne({ username: testUsername });
        
        if (adminUser && adminUser.isActive) {
            console.log('🔍 [LOGIN API TEST] Usuario encontrado en BD:', adminUser.username);
            console.log('🔍 [LOGIN API TEST] isActive:', adminUser.isActive);
            console.log('🔍 [LOGIN API TEST] Permisos:', JSON.stringify(adminUser.permissions, null, 2));
            
            const isValidPassword = await bcrypt.compare(testPassword, adminUser.password);
            console.log('🔍 [LOGIN API TEST] Contraseña válida:', isValidPassword);
            
            if (isValidPassword) {
                console.log('✅ [LOGIN API TEST] Login exitoso con usuario de BD');
                console.log('✅ [LOGIN API TEST] Usuario:', adminUser.username);
                console.log('✅ [LOGIN API TEST] Nombre:', adminUser.name);
                console.log('✅ [LOGIN API TEST] Permisos:', JSON.stringify(adminUser.permissions, null, 2));
            } else {
                console.log('❌ [LOGIN API TEST] Contraseña incorrecta');
            }
        } else {
            console.log('❌ [LOGIN API TEST] Usuario no encontrado o inactivo');
        }

        // 3. Probar con un usuario creado manualmente
        console.log('\n🔧 [LOGIN API TEST] ========== CREANDO USUARIO MANUAL ==========');
        const manualUsername = 'manualuser_' + Date.now();
        const manualPassword = 'manualpass123';
        const manualName = 'Manual User';
        
        console.log(`🔧 Creando usuario manual: ${manualUsername}`);
        
        // Encriptar contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(manualPassword, saltRounds);
        
        // Crear usuario
        const newUser = new AdminUser({
            username: manualUsername,
            name: manualName,
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
        console.log(`✅ Usuario manual creado con ID: ${newUser._id}`);

        // 4. Probar login con usuario manual
        console.log(`\n🔐 [LOGIN API TEST] Probando login con usuario manual: ${manualUsername} / ${manualPassword}`);
        
        const manualUser = await AdminUser.findOne({ username: manualUsername });
        if (manualUser && manualUser.isActive) {
            console.log('🔍 [LOGIN API TEST] Usuario manual encontrado:', manualUser.username);
            const isValidPassword = await bcrypt.compare(manualPassword, manualUser.password);
            console.log('🔍 [LOGIN API TEST] Contraseña válida:', isValidPassword);
            
            if (isValidPassword) {
                console.log('✅ [LOGIN API TEST] Login exitoso con usuario manual');
                console.log('✅ [LOGIN API TEST] Usuario:', manualUser.username);
                console.log('✅ [LOGIN API TEST] Nombre:', manualUser.name);
                console.log('✅ [LOGIN API TEST] Permisos:', JSON.stringify(manualUser.permissions, null, 2));
            } else {
                console.log('❌ [LOGIN API TEST] Contraseña incorrecta para usuario manual');
            }
        } else {
            console.log('❌ [LOGIN API TEST] Usuario manual no encontrado o inactivo');
        }

        // 5. Limpiar usuario manual
        console.log('\n🧹 [LOGIN API TEST] Limpiando usuario manual...');
        await AdminUser.findByIdAndDelete(newUser._id);
        console.log('✅ Usuario manual eliminado');

        console.log('\n🎉 [LOGIN API TEST] ========== TEST COMPLETADO ==========');

    } catch (error) {
        console.error('❌ [LOGIN API TEST] Error:', error);
        console.error('❌ [LOGIN API TEST] Stack:', error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 [LOGIN API TEST] Desconectado de MongoDB');
    }
};

testLoginAPI();
