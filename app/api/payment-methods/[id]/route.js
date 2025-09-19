import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import PaymentMethod from "@/models/PaymentMethod";
import { isAdminAuthenticated } from "@/lib/adminAuth";

// DELETE - Eliminar medio de pago (solo admin)
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
    
    const paymentMethod = await PaymentMethod.findByIdAndDelete(id);
    
    if (!paymentMethod) {
      return NextResponse.json({
        success: false,
        message: "Medio de pago no encontrado"
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Medio de pago eliminado exitosamente"
    });
  } catch (error) {
    console.log('❌ [PAYMENT METHODS DEBUG] Error:', error);
    return NextResponse.json({
      success: false,
      message: "Error al eliminar medio de pago"
    }, { status: 500 });
  }
}
