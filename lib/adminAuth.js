import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// Credenciales del admin (en producción esto debería estar en variables de entorno)
const ADMIN_CREDENTIALS = {
    username: "abudicell",
    password: "abudi1234*"
};

// Función para verificar credenciales del admin
export async function verifyAdminCredentials(username, password) {
    console.log('🔍 [ADMIN AUTH DEBUG] Verificando credenciales:', { username });
    
    try {
        // Verificar credenciales hardcodeadas primero (para compatibilidad)
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            console.log('✅ [ADMIN AUTH DEBUG] Credenciales hardcodeadas válidas');
            // Permisos completos para el admin principal
            return { 
                isValid: true, 
                permissions: {
                    addProduct: true,
                    productList: true,
                    categories: true,
                    brands: true,
                    orders: true,
                    paymentMethods: true,
                    communications: true,
                    adminUsers: true
                }
            };
        }
        
        // Verificar contra la base de datos
        const mongoose = await import('mongoose');
        const AdminUser = mongoose.default.model('adminuser');
        
        if (!AdminUser) {
            console.log('❌ [ADMIN AUTH DEBUG] Modelo AdminUser no encontrado');
            return false;
        }
        
        const user = await AdminUser.findOne({ username, isActive: true });
        if (!user) {
            console.log('❌ [ADMIN AUTH DEBUG] Usuario no encontrado');
            return false;
        }
        
        const bcrypt = await import('bcryptjs');
        const isValidPassword = await bcrypt.default.compare(password, user.password);
        
        if (isValidPassword) {
            console.log('✅ [ADMIN AUTH DEBUG] Credenciales de base de datos válidas');
            return { isValid: true, permissions: user.permissions };
        }
        
        console.log('❌ [ADMIN AUTH DEBUG] Contraseña incorrecta');
        return false;
        
    } catch (error) {
        console.log('❌ [ADMIN AUTH DEBUG] Error al verificar credenciales:', error.message);
        return false;
    }
}

// Función para crear sesión de admin
export function createAdminSession(userPermissions = null) {
    console.log('🔍 [ADMIN AUTH DEBUG] Creando sesión de admin');
    
    const response = NextResponse.json({ success: true, message: "Login exitoso" });
    
    // Crear cookie de sesión (expira en 24 horas)
    response.cookies.set('admin-session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 horas
    });
    
    // Guardar permisos del usuario en cookie
    if (userPermissions) {
        response.cookies.set('admin-permissions', JSON.stringify(userPermissions), {
            httpOnly: false, // Permitir acceso desde JavaScript
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 // 24 horas
        });
    }
    
    return response;
}

// Función para verificar si el admin está autenticado
export async function isAdminAuthenticated() {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin-session');
    
    console.log('🔍 [ADMIN AUTH DEBUG] Verificando sesión de admin:', adminSession ? 'Sesión encontrada' : 'Sin sesión');
    
    return adminSession?.value === 'authenticated';
}

// Función para cerrar sesión de admin
export function destroyAdminSession() {
    console.log('🔍 [ADMIN AUTH DEBUG] Cerrando sesión de admin');
    
    const response = NextResponse.json({ success: true, message: "Sesión cerrada" });
    
    // Eliminar cookie
    response.cookies.set('admin-session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0
    });
    
    return response;
}
