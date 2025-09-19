import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Category from "@/models/Category";
import { isAdminAuthenticated } from "@/lib/adminAuth";

// GET - Obtener categoría por ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        message: "Categoría no encontrada"
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      category
    });
  } catch (error) {
    console.log('❌ [CATEGORIES DEBUG] Error:', error);
    return NextResponse.json({
      success: false,
      message: "Error al obtener categoría"
    }, { status: 500 });
  }
}

// PUT - Actualizar categoría (solo admin)
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
    const { name, description } = await request.json();
    
    if (!name || name.trim() === '') {
      return NextResponse.json({
        success: false,
        message: "El nombre de la categoría es requerido"
      }, { status: 400 });
    }

    // Verificar si ya existe otra categoría con ese nombre
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      _id: { $ne: id }
    });
    
    if (existingCategory) {
      return NextResponse.json({
        success: false,
        message: "Ya existe otra categoría con ese nombre"
      }, { status: 400 });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description?.trim() || ''
      },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({
        success: false,
        message: "Categoría no encontrada"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Categoría actualizada exitosamente",
      category
    });

  } catch (error) {
    console.log('❌ [CATEGORIES DEBUG] Error:', error);
    return NextResponse.json({
      success: false,
      message: "Error al actualizar categoría"
    }, { status: 500 });
  }
}

// DELETE - Eliminar categoría (solo admin)
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
    
    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({
        success: false,
        message: "Categoría no encontrada"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Categoría eliminada exitosamente"
    });

  } catch (error) {
    console.log('❌ [CATEGORIES DEBUG] Error:', error);
    return NextResponse.json({
      success: false,
      message: "Error al eliminar categoría"
    }, { status: 500 });
  }
}


