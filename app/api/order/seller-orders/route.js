import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import PaymentMethod from "@/models/PaymentMethod";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function GET(request) {
    try {
        console.log('🔍 [SELLER ORDERS DEBUG] Iniciando proceso de listar órdenes...')
        
        const isAdmin = await isAdminAuthenticated()
        console.log('🔍 [SELLER ORDERS DEBUG] Admin autenticado:', isAdmin ? 'SÍ' : 'NO')

        if (!isAdmin) {
            console.log('❌ [SELLER ORDERS DEBUG] No autorizado')
            return NextResponse.json({ success: false, message: 'not authorized' })
        }

        console.log('🔍 [SELLER ORDERS DEBUG] Conectando a la base de datos...')
        await connectDB()
        console.log('✅ [SELLER ORDERS DEBUG] Conexión exitosa')

        console.log('🔍 [SELLER ORDERS DEBUG] Buscando órdenes...')
        const orders = await Order.find({}).populate('address items.product paymentMethod')
        console.log('🔍 [SELLER ORDERS DEBUG] Órdenes encontradas:', orders.length)

        return NextResponse.json({ success: true, orders })

    } catch (error) {
        console.log('❌ [SELLER ORDERS DEBUG] Error:', error.message)
        return NextResponse.json({ success: false, message: error.message })
    }
}