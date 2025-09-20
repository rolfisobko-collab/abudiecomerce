import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import AdminUser from "@/models/AdminUser";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import bcrypt from "bcryptjs";

// GET - Listar todos los usuarios admin
export async function GET() {
  try {
    await connectDB();

    const users = await AdminUser.find({ isActive: true })
      .select('-password')
      .populate('createdBy', 'name username')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users
    }, { status: 200 });

  } catch (error) {
    console.error("Error al listar usuarios admin:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor"
    }, { status: 500 });
  }
}

// POST - Crear nuevo usuario admin
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, name, password, permissions } = body;

    // Validaciones
    if (!username || !name || !password) {
      return NextResponse.json({
        success: false,
        message: "Nombre de usuario, nombre completo y contraseña son requeridos"
      }, { status: 400 });
    }

    // Verificar si el username ya existe
    const existingUser = await AdminUser.findOne({ username });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "El nombre de usuario ya está registrado"
      }, { status: 400 });
    }

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const newUser = new AdminUser({
      username,
      name,
      password: hashedPassword,
      permissions: permissions || {
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

    // Retornar usuario sin contraseña
    const userResponse = await AdminUser.findById(newUser._id)
      .select('-password')
      .populate('createdBy', 'name username');

    return NextResponse.json({
      success: true,
      message: "Usuario admin creado exitosamente",
      user: userResponse
    }, { status: 201 });

  } catch (error) {
    console.error("Error al crear usuario admin:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
