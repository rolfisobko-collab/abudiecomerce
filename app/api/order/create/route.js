import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";



export async function POST(request) {
    try {

        const session = await getServerSession(authOptions)
        
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "No autenticado" })
        }
        
        const userId = session.user.id
        const { address, items, paymentMethod, paymentProof } = await request.json();

        if (!address || items.length === 0 || !paymentMethod || !paymentProof) {
            return NextResponse.json({ success: false, message: 'Invalid data' });
        }

        // calculate amount using items
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                console.error(`❌ [ORDER CREATE DEBUG] Producto no encontrado con ID: ${item.product}`);
                return await acc;
            }
            const price = product.offerPrice || product.price;
            return await acc + price * item.quantity;
        }, 0)

        console.log('🔍 [ORDER CREATE DEBUG] Guardando orden directamente en la base de datos...')
        console.log('🔍 [ORDER CREATE DEBUG] Datos de la orden:', { userId, address, items: items.length, amount })
        
        // Conectar a la base de datos
        await connectDB()
        
        // Crear la orden directamente en la base de datos
        const orderData = {
            userId,
            address,
            paymentMethod,
            paymentProof,
            items,
            amount: amount + Math.floor(amount * 0.02),
            date: Date.now()
        }
        
        const newOrder = await Order.create(orderData)
        console.log('✅ [ORDER CREATE DEBUG] Orden guardada exitosamente en la base de datos:', newOrder._id)
        
        // También enviar a Inngest como respaldo
        try {
            await inngest.send({
                name: 'order/created',
                data: orderData
            })
            console.log('✅ [ORDER CREATE DEBUG] Evento también enviado a Inngest como respaldo')
        } catch (error) {
            console.log('⚠️ [ORDER CREATE DEBUG] Error enviando a Inngest (pero la orden ya está guardada):', error.message)
        }

        // clear user cart
        const user = await User.findById(userId)
        user.cartItems = {}
        await user.save()

        return NextResponse.json({ success: true, message: 'Order Placed' })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message })
    }
}