'use client'
import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, User } from 'lucide-react'
import Image from 'next/image'

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        console.log('🔍 [LOGIN DEBUG] Intentando login con:', { email })

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            console.log('🔍 [LOGIN DEBUG] Resultado del login:', result)

            if (result?.error) {
                console.log('❌ [LOGIN DEBUG] Error en login:', result.error)
                toast.error('Credenciales incorrectas')
            } else {
                console.log('✅ [LOGIN DEBUG] Login exitoso')
                
                // Obtener la sesión para verificar el rol
                const session = await getSession()
                console.log('🔍 [LOGIN DEBUG] Sesión obtenida:', session)

                if (session?.user?.role === 'admin') {
                    console.log('🔍 [LOGIN DEBUG] Usuario admin, redirigiendo a /seller')
                    toast.success('¡Bienvenido Admin!')
                    router.push('/seller')
                } else {
                    console.log('🔍 [LOGIN DEBUG] Usuario normal, verificando redirección')
                    
                    // Verificar si hay una URL de redirección guardada
                    const redirectUrl = localStorage.getItem('redirectAfterLogin');
                    if (redirectUrl) {
                        console.log('🔍 [LOGIN DEBUG] Redirigiendo a URL guardada:', redirectUrl)
                        localStorage.removeItem('redirectAfterLogin'); // Limpiar después de usar
                        toast.success('¡Bienvenido!')
                        router.push(redirectUrl);
                    } else {
                        console.log('🔍 [LOGIN DEBUG] Usuario normal, redirigiendo a /')
                        toast.success('¡Bienvenido!')
                        router.push('/')
                    }
                }
            }
        } catch (error) {
            console.log('❌ [LOGIN DEBUG] Error en el proceso de login:', error)
            toast.error('Error al iniciar sesión')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {/* Background decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
            
            {/* Elementos decorativos */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#feecaf]/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>
            
            {/* Contenido principal */}
            <div className="relative z-10 w-full max-w-md mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                                <Image
                                    src="/abudilogo2.png"
                                    alt="AbudiCell Logo"
                                    width={80}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Bienvenido de vuelta
                        </h1>
                        <p className="text-gray-600">
                            Inicia sesión en tu cuenta de AbudiCell
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Campo Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#feecaf] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Campo Contraseña */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#feecaf] focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                    placeholder="Tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Botón de envío */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#feecaf] to-yellow-300 text-gray-800 py-3 px-6 rounded-xl font-semibold hover:from-yellow-300 hover:to-[#feecaf] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800"></div>
                                    Iniciando sesión...
                                </>
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Enlace de registro */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <a 
                                href="/auth/signup" 
                                className="font-semibold text-[#feecaf] hover:text-yellow-300 transition-colors"
                            >
                                Regístrate aquí
                            </a>
                        </p>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}
