import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import PaymentMethod from "@/models/PaymentMethod";
import { isAdminAuthenticated } from "@/lib/adminAuth";

// GET - Obtener todos los medios de pago
export async function GET() {
  try {
    await connectDB();
    
    const paymentMethods = await PaymentMethod.find({ isActive: true }).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      paymentMethods
    });
  } catch (error) {
    console.log('❌ [PAYMENT METHODS DEBUG] Error:', error);
    return NextResponse.json({
      success: false,
      message: "Error al obtener medios de pago"
    }, { status: 500 });
  }
}

// POST - Crear nuevo medio de pago (solo admin)
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
    
    const { 
      type, 
      category, 
      country, 
      currency, 
      name, 
      bankName, 
      accountNumber, 
      accountHolder, 
      cbu, 
      pix, 
      walletAddress, 
      network, 
      instructions, 
      minAmount, 
      maxAmount, 
      processingTime 
    } = await request.json();
    
    if (!type || !category || !country || !currency || !name || !instructions) {
      return NextResponse.json({
        success: false,
        message: "Los campos básicos son requeridos"
      }, { status: 400 });
    }

    // Validaciones específicas por tipo
    if (type === 'BANK_TRANSFER') {
      if (!bankName || !accountNumber || !accountHolder) {
        return NextResponse.json({
          success: false,
          message: "Para transferencias bancarias se requiere nombre del banco, número de cuenta y titular"
        }, { status: 400 });
      }
      
      if (category === 'CBU' && !cbu) {
        return NextResponse.json({
          success: false,
          message: "Para CBU se requiere el número de CBU"
        }, { status: 400 });
      }
      
      if (category === 'PIX' && !pix) {
        return NextResponse.json({
          success: false,
          message: "Para PIX se requiere la clave PIX"
        }, { status: 400 });
      }
    }

    if (type === 'CRYPTO') {
      if (!walletAddress || !network) {
        return NextResponse.json({
          success: false,
          message: "Para criptomonedas se requiere dirección de wallet y red"
        }, { status: 400 });
      }
    }

    const paymentMethod = new PaymentMethod({
      type,
      category,
      country,
      currency,
      name,
      bankName,
      accountNumber,
      accountHolder,
      cbu,
      pix,
      walletAddress,
      network,
      instructions,
      minAmount: minAmount || 0,
      maxAmount: maxAmount || 999999999,
      processingTime: processingTime || "Inmediato"
    });

    await paymentMethod.save();
    
    return NextResponse.json({
      success: true,
      message: "Medio de pago creado exitosamente",
      paymentMethod
    });
  } catch (error) {
    console.log('❌ [PAYMENT METHODS DEBUG] Error:', error);
    return NextResponse.json({
      success: false,
      message: "Error al crear medio de pago"
    }, { status: 500 });
  }
}
