'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        console.log('🔍 [ADMIN LOGIN DEBUG] Intentando login admin con:', { username })

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                })
            })

            const data = await response.json()
            console.log('🔍 [ADMIN LOGIN DEBUG] Respuesta del servidor:', data)

            if (data.success) {
                console.log('✅ [ADMIN LOGIN DEBUG] Login admin exitoso')
                toast.success('¡Bienvenido Admin!')
                router.push('/seller')
            } else {
                console.log('❌ [ADMIN LOGIN DEBUG] Error en login:', data.message)
                toast.error(data.message || 'Credenciales incorrectas')
            }
        } catch (error) {
            console.log('❌ [ADMIN LOGIN DEBUG] Error en el proceso:', error)
            toast.error('Error al iniciar sesión')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Iniciar Sesión Admin
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Acceso al Panel de Administración de AbudiCell
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Usuario
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#feecaf] hover:bg-[#feecaf]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#feecaf] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Acceder como Admin'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            ¿Eres cliente?{' '}
                            <a href="/auth/signin" className="font-medium text-[#feecaf] hover:text-[#feecaf]/80">
                                Inicia sesión aquí
                            </a>
                        </p>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-md">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Credenciales de Admin:</h3>
                        <div className="text-xs text-blue-700 space-y-1">
                            <p><strong>Usuario:</strong> abudicell</p>
                            <p><strong>Contraseña:</strong> abudi1234*</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <a href="/" className="text-sm text-[#feecaf] hover:text-[#feecaf]/80">
                            ← Volver al sitio principal
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
