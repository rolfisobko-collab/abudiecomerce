import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET(request){
    try {
        
        const session = await getServerSession(authOptions)
        
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "No autenticado" })
        }
        
        const userId = session.user.id

        await connectDB()

        const addresses = await Address.find({userId})

        return NextResponse.json({ success: true, addresses });

    } catch (error) {
        return NextResponse.json({ success: false, message:error.message });
    }
}