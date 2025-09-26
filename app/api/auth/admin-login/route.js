import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import AdminUser from "@/models/AdminUser";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: "Usuario y contraseña son requeridos"
      }, { status: 400 });
    }

    await connectDB();

    // Buscar usuario admin
    const adminUser = await AdminUser.findOne({ username, isActive: true });
    
    if (!adminUser) {
      return NextResponse.json({
        success: false,
        message: "Credenciales incorrectas"
      }, { status: 401 });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "Credenciales incorrectas"
      }, { status: 401 });
    }

    // Actualizar último login
    await AdminUser.findByIdAndUpdate(adminUser._id, { 
      lastLogin: new Date() 
    });

    // Crear cookie de sesión admin
    const response = NextResponse.json({
      success: true,
      message: "Login exitoso",
      user: {
        id: adminUser._id,
        username: adminUser.username,
        name: adminUser.name,
        permissions: adminUser.permissions
      }
    });

    // Establecer cookie de sesión admin
    response.cookies.set('admin-session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    return response;

  } catch (error) {
    console.error("Error en login de admin:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor"
    }, { status: 500 });
  }
}
