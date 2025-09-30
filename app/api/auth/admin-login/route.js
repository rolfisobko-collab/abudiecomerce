import { NextResponse } from "next/server";
import connectDB from '@/config/db';
import AdminUser from '@/models/AdminUser';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: "Usuario y contraseña son requeridos"
      }, { status: 400 });
    }

    // Credenciales hardcodeadas (sin base de datos)
    const validCredentials = {
      'abudicell': 'abudicell1234',
      'admin': 'admin123'
    };

    console.log('🔍 [LOGIN DEBUG] Intentando login:', { username, password: '***' });
    console.log('🔍 [LOGIN DEBUG] Credenciales válidas:', Object.keys(validCredentials));

    // Conectar a la base de datos
    await connectDB();

    let user = null;
    let isValidPassword = false;

    // Primero verificar credenciales hardcodeadas
    if (validCredentials[username] && validCredentials[username] === password) {
      console.log('✅ [LOGIN DEBUG] Credenciales hardcodeadas válidas para:', username);
      user = {
        id: 'hardcoded_' + username,
        username: username,
        name: username === 'abudicell' ? 'Abudi Cell Admin' : 'Administrador Principal',
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
      // Si no son hardcodeadas, verificar en la base de datos
      console.log('🔍 [LOGIN DEBUG] Verificando en base de datos...');
      const adminUser = await AdminUser.findOne({ username });
      
      if (adminUser && adminUser.isActive) {
        console.log('🔍 [LOGIN DEBUG] Usuario encontrado en BD:', adminUser.username);
        isValidPassword = await bcrypt.compare(password, adminUser.password);
        
        if (isValidPassword) {
          console.log('✅ [LOGIN DEBUG] Contraseña válida en BD para:', username);
          user = {
            id: adminUser._id.toString(),
            username: adminUser.username,
            name: adminUser.name,
            permissions: adminUser.permissions
          };
        } else {
          console.log('❌ [LOGIN DEBUG] Contraseña incorrecta en BD para:', username);
        }
      } else {
        console.log('❌ [LOGIN DEBUG] Usuario no encontrado en BD o inactivo:', username);
      }
    }

    if (user && isValidPassword) {
      console.log('✅ [LOGIN DEBUG] Login exitoso para:', username);
      
      // Crear cookie de sesión admin
      const response = NextResponse.json({
        success: true,
        message: "Login exitoso",
        user: user
      });

      // Establecer cookie de sesión admin
      response.cookies.set('admin-session', 'authenticated', {
        httpOnly: false, // Cambiado para debugging
        secure: false, // Cambiado para testing
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        path: '/'
      });

      // Establecer cookie de permisos
      response.cookies.set('admin-permissions', JSON.stringify(user.permissions), {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        path: '/'
      });

      console.log('✅ [LOGIN DEBUG] Cookie establecida, login exitoso');
      return response;
    } else {
      console.log('❌ [LOGIN DEBUG] Credenciales inválidas');
      return NextResponse.json({
        success: false,
        message: "Credenciales incorrectas"
      }, { status: 401 });
    }

  } catch (error) {
    console.error("❌ [LOGIN DEBUG] Error en login de admin:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor"
    }, { status: 500 });
  }
}
