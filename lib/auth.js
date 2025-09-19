import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "@/config/db"
import User from "@/models/User"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('🔍 [NEXTAUTH DEBUG] Intentando autenticación con:', { email: credentials.email })
                
                try {
                    await connectDB()
                    console.log('✅ [NEXTAUTH DEBUG] Conectado a la base de datos')
                    
                    const user = await User.findOne({ email: credentials.email })
                    console.log('🔍 [NEXTAUTH DEBUG] Usuario encontrado:', user ? 'SÍ' : 'NO')
                    
                    if (!user) {
                        console.log('❌ [NEXTAUTH DEBUG] Usuario no encontrado')
                        return null
                    }
                    
                    if (!user.isActive) {
                        console.log('❌ [NEXTAUTH DEBUG] Usuario inactivo')
                        return null
                    }
                    
                    // Verificar contraseña
                    const isPasswordValid = await user.comparePassword(credentials.password)
                    console.log('🔍 [NEXTAUTH DEBUG] Contraseña válida:', isPasswordValid)
                    
                    if (!isPasswordValid) {
                        console.log('❌ [NEXTAUTH DEBUG] Contraseña incorrecta')
                        return null
                    }
                    
                    console.log('✅ [NEXTAUTH DEBUG] Autenticación exitosa para:', { id: user._id, email: user.email, role: user.role })
                    
                    return {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        image: user.imageUrl
                    }
                    
                } catch (error) {
                    console.log('❌ [NEXTAUTH DEBUG] Error en autenticación:', error.message)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.role = token.role
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export default handler
