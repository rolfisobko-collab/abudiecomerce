import connectDB from "@/config/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: 'No autorizado' });
        }
        
        const userId = session.user.id

        await connectDB()
        const user = await User.findById(userId)

        const { cartItems } = user

        return NextResponse.json({ success: true, cartItems})

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}