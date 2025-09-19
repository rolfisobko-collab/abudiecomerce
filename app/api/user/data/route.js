import connectDB from "@/config/db";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";


export async function GET(request) {
    
    try {
        console.log('🔍 [LOGIN DEBUG] Iniciando proceso de autenticación...')
        
        const session = await getServerSession(authOptions)
        console.log('🔍 [LOGIN DEBUG] Sesión obtenida de NextAuth:', session ? 'Sesión válida' : 'No hay sesión')
        console.log('🔍 [LOGIN DEBUG] Datos de la sesión:', session)

        if (!session?.user?.id) {
            console.log('❌ [LOGIN DEBUG] No se encontró usuario en la sesión')
            return NextResponse.json({ success: false, message: "No autenticado" })
        }

        console.log('🔍 [LOGIN DEBUG] UserId obtenido de NextAuth:', session.user.id)

        console.log('🔍 [LOGIN DEBUG] Conectando a la base de datos...')
        await connectDB()
        console.log('✅ [LOGIN DEBUG] Conexión a la base de datos exitosa')

        console.log('🔍 [LOGIN DEBUG] Buscando usuario en MongoDB con ID:', session.user.id)
        
        // Buscar por _id ya que el usuario no tiene un campo 'id' personalizado
        const user = await User.findById(session.user.id)
        console.log('🔍 [LOGIN DEBUG] Resultado de la búsqueda en MongoDB:', user ? 'Usuario encontrado' : 'Usuario NO encontrado')

        if (!user) {
            console.log('❌ [LOGIN DEBUG] Usuario no existe en la base de datos MongoDB')
            console.log('🔍 [LOGIN DEBUG] Verificando si hay usuarios en la colección...')
            
            // Verificar si hay usuarios en la colección
            const userCount = await User.countDocuments()
            console.log('🔍 [LOGIN DEBUG] Total de usuarios en la base de datos:', userCount)
            
            // Listar algunos usuarios para debug
            const sampleUsers = await User.find().limit(3)
            console.log('🔍 [LOGIN DEBUG] Muestra de usuarios en la base de datos:', sampleUsers.map(u => ({ id: u.id || u._id, email: u.email, name: u.name })))
            
            return NextResponse.json({ success: false, message: "User Not Found" })
        }

        console.log('✅ [LOGIN DEBUG] Usuario encontrado exitosamente:', { id: user._id, email: user.email, name: user.name, role: user.role })
        return NextResponse.json({success:true, user})

    } catch (error) {
        console.log('❌ [LOGIN DEBUG] Error en el proceso de autenticación:', error.message)
        console.log('🔍 [LOGIN DEBUG] Stack trace completo:', error.stack)
        return NextResponse.json({ success: false, message: error.message })
    }

}