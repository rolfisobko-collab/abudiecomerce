import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import AdminUser from "@/models/AdminUser";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import bcrypt from "bcryptjs";

// GET - Obtener usuario admin por ID
export async function GET(request, { params }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        message: "No autorizado"
      }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const user = await AdminUser.findById(id)
      .select('-password')
      .populate('createdBy', 'name username');

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Usuario no encontrado"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user
    }, { status: 200 });

  } catch (error) {
    console.error("Error al obtener usuario admin:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor"
    }, { status: 500 });
  }
}

// PUT - Actualizar usuario admin
export async function PUT(request, { params }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        message: "No autorizado"
      }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { username, name, password, permissions, isActive } = body;

    const user = await AdminUser.findById(id);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Usuario no encontrado"
      }, { status: 404 });
    }

    // Verificar si el username ya existe en otro usuario
    if (username && username !== user.username) {
      const existingUser = await AdminUser.findOne({ username, _id: { $ne: id } });
      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: "El nombre de usuario ya está registrado por otro usuario"
        }, { status: 400 });
      }
    }

    // Preparar datos de actualización
    const updateData = {};
    if (username) updateData.username = username;
    if (name) updateData.name = name;
    if (permissions) updateData.permissions = permissions;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    // Encriptar nueva contraseña si se proporciona
    if (password) {
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await AdminUser.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password').populate('createdBy', 'name username');

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado exitosamente",
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    console.error("Error al actualizar usuario admin:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor"
    }, { status: 500 });
  }
}

// DELETE - Eliminar usuario admin (soft delete)
export async function DELETE(request, { params }) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        message: "No autorizado"
      }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    const user = await AdminUser.findById(id);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Usuario no encontrado"
      }, { status: 404 });
    }

    // Soft delete - marcar como inactivo
    await AdminUser.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({
      success: true,
      message: "Usuario eliminado exitosamente"
    }, { status: 200 });

  } catch (error) {
    console.error("Error al eliminar usuario admin:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor"
    }, { status: 500 });
  }
}
