import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Category from "@/models/Category";
import { isAdminAuthenticated } from "@/lib/adminAuth";

// GET - Obtener todas las categorías
export async function GET() {
  try {
    await connectDB();
    
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.log('❌ [CATEGORIES DEBUG] Error:', error);
    return NextResponse.json({
      success: false,
      message: "Error al obtener categorías"
    }, { status: 500 });
  }
}

// POST - Crear nueva categoría (solo admin)
export async function POST(request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        message: "No autorizado"
      }, { status: 401 });
    }

    await connectDB();
    
    const { name, description } = await request.json();
    
    if (!name || name.trim() === '') {
      return NextResponse.json({
        success: false,
        message: "El nombre de la categoría es requerido"
      }, { status: 400 });
    }

    // Verificar si ya existe una categoría con ese nombre
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });
    
    if (existingCategory) {
      return NextResponse.json({
        success: false,
        message: "Ya existe una categoría con ese nombre"
      }, { status: 400 });
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim() || ''
    });

    await category.save();

    return NextResponse.json({
      success: true,
      message: "Categoría creada exitosamente",
      category
    });

  } catch (error) {
    console.log('❌ [CATEGORIES DEBUG] Error:', error);
    return NextResponse.json({
      success: false,
      message: "Error al crear categoría"
    }, { status: 500 });
  }
}


