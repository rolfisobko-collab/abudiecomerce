import connectDB from "@/config/db";
import Address from "@/models/Address";
import Order from "@/models/Order";
import Product from "@/models/Product";
import PaymentMethod from "@/models/PaymentMethod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";



export async function GET(request) {
    try {
        
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "No autenticado" })
        }
        
        const userId = session.user.id

        await connectDB()

        await Address.length
        await Product.length

        const orders = await Order.find({userId}).populate('address items.product paymentMethod')

        return NextResponse.json({ success:true, orders })

    } catch (error) {
        return NextResponse.json({ success:false, message:error.message })
    }
}