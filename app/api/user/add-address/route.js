import connectDB from "@/config/db"
import Address from "@/models/Address"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: 'No autorizado' });
        }
        
        const userId = session.user.id
        const {address} = await request.json()

        await connectDB()
        const newAddress = await Address.create({...address,userId})

        return NextResponse.json({ success: true, message: "Address added successfully", newAddress })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}