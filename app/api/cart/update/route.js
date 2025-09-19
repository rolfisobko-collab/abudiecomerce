import connectDB from '@/config/db'
import User from '@/models/User'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from 'next/server'


export async function POST(request) {
    try {
        
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: 'No autorizado' });
        }
        
        const userId = session.user.id
        
        const { cartData } = await request.json()

        await connectDB()
        const user = await User.findById(userId)

        user.cartItems = cartData
        await user.save()

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json( { success:false, message:error.message } )
    }
}