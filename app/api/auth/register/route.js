import connectDB from "@/config/db"
import User from "@/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request) {
    try {
        console.log('🔍 [REGISTER DEBUG] Iniciando proceso de registro...')
        
        const { name, email, password } = await request.json()
        console.log('🔍 [REGISTER DEBUG] Datos recibidos:', { name, email })

        if (!name || !email || !password) {
            console.log('❌ [REGISTER DEBUG] Datos faltantes')
            return NextResponse.json({ success: false, message: "Todos los campos son requeridos" })
        }

        if (password.length < 6) {
            console.log('❌ [REGISTER DEBUG] Contraseña muy corta')
            return NextResponse.json({ success: false, message: "La contraseña debe tener al menos 6 caracteres" })
        }

        console.log('🔍 [REGISTER DEBUG] Conectando a la base de datos...')
        await connectDB()
        console.log('✅ [REGISTER DEBUG] Conexión a la base de datos exitosa')

        // Verificar si el usuario ya existe
        console.log('🔍 [REGISTER DEBUG] Verificando si el usuario ya existe...')
        const existingUser = await User.findOne({ email })
        console.log('🔍 [REGISTER DEBUG] Usuario existente:', existingUser ? 'SÍ' : 'NO')

        if (existingUser) {
            console.log('❌ [REGISTER DEBUG] Usuario ya existe')
            return NextResponse.json({ success: false, message: "El usuario ya existe" })
        }

        // Crear nuevo usuario
        console.log('🔍 [REGISTER DEBUG] Creando nuevo usuario...')
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            cartItems: {},
            isActive: true
        })

        const savedUser = await newUser.save()
        console.log('✅ [REGISTER DEBUG] Usuario creado exitosamente:', { id: savedUser._id, email: savedUser.email })

        return NextResponse.json({ 
            success: true, 
            message: "Usuario creado exitosamente",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        })

    } catch (error) {
        console.log('❌ [REGISTER DEBUG] Error en el registro:', error.message)
        console.log('🔍 [REGISTER DEBUG] Stack trace:', error.stack)
        return NextResponse.json({ success: false, message: error.message })
    }
}
