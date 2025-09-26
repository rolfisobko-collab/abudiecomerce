import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AdminUser from '../models/AdminUser.js';

const testAdminFlow = async () => {
    try {
        console.log('🔍 [TEST FLOW] Iniciando test del flujo completo de admin...');
        
        // Conectar a la BD
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ [TEST FLOW] Conectado a MongoDB');

        // 1. Verificar usuarios existentes
        console.log('\n📊 [TEST FLOW] ========== USUARIOS EXISTENTES ==========');
        const existingUsers = await AdminUser.find({});
        console.log(`📊 Total usuarios en BD: ${existingUsers.length}`);
        
        existingUsers.forEach((user, index) => {
            console.log(`\n👤 Usuario ${index + 1}:`);
            console.log(`  - ID: ${user._id}`);
            console.log(`  - Username: ${user.username}`);
            console.log(`  - Name: ${user.name}`);
            console.log(`  - isActive: ${user.isActive}`);
            console.log(`  - Permissions: ${JSON.stringify(user.permissions, null, 2)}`);
            console.log(`  - Created: ${user.createdAt}`);
        });

        // 2. Crear un usuario de prueba
        console.log('\n🔧 [TEST FLOW] ========== CREANDO USUARIO DE PRUEBA ==========');
        const testUsername = 'testuser_' + Date.now();
        const testPassword = 'testpass123';
        const testName = 'Test User';
        
        console.log(`🔧 Creando usuario: ${testUsername}`);
        console.log(`🔧 Contraseña: ${testPassword}`);
        
        // Encriptar contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
        console.log(`🔧 Contraseña hasheada: ${hashedPassword.substring(0, 20)}...`);
        
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

        // 3. Verificar que se creó correctamente
        console.log('\n🔍 [TEST FLOW] ========== VERIFICANDO USUARIO CREADO ==========');
        const createdUser = await AdminUser.findById(newUser._id);
        console.log(`🔍 Usuario encontrado: ${createdUser.username}`);
        console.log(`🔍 Nombre: ${createdUser.name}`);
        console.log(`🔍 isActive: ${createdUser.isActive}`);
        console.log(`🔍 Permisos: ${JSON.stringify(createdUser.permissions, null, 2)}`);

        // 4. Probar login
        console.log('\n🔐 [TEST FLOW] ========== PROBANDO LOGIN ==========');
        console.log(`🔐 Intentando login con: ${testUsername} / ${testPassword}`);
        
        const loginUser = await AdminUser.findOne({ username: testUsername });
        if (loginUser && loginUser.isActive) {
            console.log(`🔍 Usuario encontrado para login: ${loginUser.username}`);
            const isValidPassword = await bcrypt.compare(testPassword, loginUser.password);
            console.log(`🔍 Contraseña válida: ${isValidPassword}`);
            
            if (isValidPassword) {
                console.log('✅ [TEST FLOW] LOGIN EXITOSO!');
                console.log(`✅ Usuario: ${loginUser.username}`);
                console.log(`✅ Nombre: ${loginUser.name}`);
                console.log(`✅ Permisos: ${JSON.stringify(loginUser.permissions, null, 2)}`);
            } else {
                console.log('❌ [TEST FLOW] CONTRASEÑA INCORRECTA');
            }
        } else {
            console.log('❌ [TEST FLOW] USUARIO NO ENCONTRADO O INACTIVO');
        }

        // 5. Limpiar usuario de prueba
        console.log('\n🧹 [TEST FLOW] ========== LIMPIANDO USUARIO DE PRUEBA ==========');
        await AdminUser.findByIdAndDelete(newUser._id);
        console.log('✅ Usuario de prueba eliminado');

        console.log('\n🎉 [TEST FLOW] ========== TEST COMPLETADO ==========');

    } catch (error) {
        console.error('❌ [TEST FLOW] Error:', error);
        console.error('❌ [TEST FLOW] Stack:', error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 [TEST FLOW] Desconectado de MongoDB');
    }
};

testAdminFlow();
