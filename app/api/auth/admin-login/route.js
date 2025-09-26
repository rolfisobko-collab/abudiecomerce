import { NextResponse } from "next/server";

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

    // Verificar credenciales
    if (validCredentials[username] && validCredentials[username] === password) {
      console.log('✅ [LOGIN DEBUG] Credenciales válidas para:', username);
      
      // Crear cookie de sesión admin
      const response = NextResponse.json({
        success: true,
        message: "Login exitoso",
        user: {
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
        }
      });

      // Establecer cookie de sesión admin
      response.cookies.set('admin-session', 'authenticated', {
        httpOnly: false, // Cambiado para debugging
        secure: false, // Cambiado para testing
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
