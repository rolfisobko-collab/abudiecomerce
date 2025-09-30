import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Newsletter from "@/models/Newsletter";
import ContactMessage from "@/models/ContactMessage";

export async function GET(request) {
    try {
        await connectDB();
        
        // Obtener todos los suscriptores del newsletter
        const subscribers = await Newsletter.find({ isActive: true }).sort({ date: -1 });
        
        // Obtener todos los mensajes de contacto
        const contactMessages = await ContactMessage.find().sort({ date: -1 });
        
        return NextResponse.json({ 
            success: true, 
            subscribers,
            contactMessages
        });
    } catch (error) {
        console.error('Error al obtener comunicaciones:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
}





