import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { isAdminAuthenticated } from "@/lib/adminAuth";

// PUT - Actualizar estado de orden (solo admin)
export async function PUT(request) {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        message: "No autorizado"
      }, { status: 401 });
    }

    await connectDB();
    
    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json({
        success: false,
        message: "ID de orden y estado son requeridos"
      }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      orderId, 
      { status }, 
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Orden no encontrada"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Estado de orden actualizado exitosamente",
      order
    }, { status: 200 });

  } catch (error) {
    console.error("Error al actualizar estado de orden:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor"
    }, { status: 500 });
  }
}
