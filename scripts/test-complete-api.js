import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';

const testCompleteAPI = async () => {
    try {
        console.log('🔍 [COMPLETE API TEST] Iniciando test completo del API...');
        
        // Conectar a la BD
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ [COMPLETE API TEST] Conectado a MongoDB');

        // Crear un usuario de prueba
        const testUsername = 'apiuser_' + Date.now();
        const testPassword = 'apipass123';
        const testName = 'API User';
        
        console.log(`\n🔧 [COMPLETE API TEST] Creando usuario: ${testUsername}`);
        
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

        // Simular exactamente el proceso del API de login
        console.log(`\n🔐 [COMPLETE API TEST] Simulando API de login con: ${testUsername} / ${testPassword}`);

        // 1. Credenciales hardcodeadas
        const validCredentials = {
            'abudicell': 'abudicell1234',
            'admin': 'admin123'
        };

        let user = null;
        let isValidPassword = false;

        // 2. Verificar credenciales hardcodeadas
        if (validCredentials[testUsername] && validCredentials[testUsername] === testPassword) {
            console.log('✅ [COMPLETE API TEST] Credenciales hardcodeadas válidas');
            user = {
                id: 'hardcoded_' + testUsername,
                username: testUsername,
                name: 'Hardcoded User',
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
                }
            };
            isValidPassword = true;
        } else {
            console.log('❌ [COMPLETE API TEST] Credenciales hardcodeadas inválidas');
            
            // 3. Verificar en base de datos
            console.log('🔍 [COMPLETE API TEST] Verificando en base de datos...');
            const adminUser = await AdminUser.findOne({ username: testUsername });
            
            if (adminUser && adminUser.isActive) {
                console.log('✅ [COMPLETE API TEST] Usuario encontrado en BD:', adminUser.username);
                console.log('✅ [COMPLETE API TEST] isActive:', adminUser.isActive);
                console.log('✅ [COMPLETE API TEST] Permisos:', JSON.stringify(adminUser.permissions, null, 2));
                
                isValidPassword = await bcrypt.compare(testPassword, adminUser.password);
                console.log('✅ [COMPLETE API TEST] Contraseña válida:', isValidPassword);
                
                if (isValidPassword) {
                    console.log('✅ [COMPLETE API TEST] Contraseña válida en BD para:', testUsername);
                    user = {
                        id: adminUser._id.toString(),
                        username: adminUser.username,
                        name: adminUser.name,
                        permissions: adminUser.permissions
                    };
                } else {
                    console.log('❌ [COMPLETE API TEST] Contraseña incorrecta en BD para:', testUsername);
                }
            } else {
                console.log('❌ [COMPLETE API TEST] Usuario no encontrado en BD o inactivo:', testUsername);
            }
        }

        // 4. Verificar resultado final
        if (user && isValidPassword) {
            console.log('\n🎉 [COMPLETE API TEST] LOGIN EXITOSO!');
            console.log('🎉 [COMPLETE API TEST] Usuario:', user.username);
            console.log('🎉 [COMPLETE API TEST] Nombre:', user.name);
            console.log('🎉 [COMPLETE API TEST] ID:', user.id);
            console.log('🎉 [COMPLETE API TEST] Permisos:', JSON.stringify(user.permissions, null, 2));
        } else {
            console.log('\n❌ [COMPLETE API TEST] LOGIN FALLIDO!');
            console.log('❌ [COMPLETE API TEST] User:', user);
            console.log('❌ [COMPLETE API TEST] isValidPassword:', isValidPassword);
        }

        // Limpiar usuario de prueba
        console.log('\n🧹 [COMPLETE API TEST] Limpiando usuario de prueba...');
        await AdminUser.findByIdAndDelete(newUser._id);
        console.log('✅ Usuario de prueba eliminado');

        console.log('\n🎉 [COMPLETE API TEST] ========== TEST COMPLETADO ==========');

    } catch (error) {
        console.error('❌ [COMPLETE API TEST] Error:', error);
        console.error('❌ [COMPLETE API TEST] Stack:', error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 [COMPLETE API TEST] Desconectado de MongoDB');
    }
};

testCompleteAPI();
