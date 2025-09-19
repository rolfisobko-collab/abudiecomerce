import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import { isAdminAuthenticated } from "@/lib/adminAuth";

// DELETE - Eliminar producto (solo admin)
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
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Producto no encontrado"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Producto eliminado exitosamente"
    }, { status: 200 });

  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor"
    }, { status: 500 });
  }
}
