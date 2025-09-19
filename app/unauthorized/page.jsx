'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { assets } from '@/assets/assets'
import Image from 'next/image'

const Unauthorized = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="mb-6">
          <Image
            src={assets.logo}
            alt="AbudiCell Logo"
            width={120}
            height={60}
            className="mx-auto"
          />
        </div>

        {/* Icono de error */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Acceso No Autorizado
        </h1>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6">
          No tienes permisos para acceder a esta página. Por favor, contacta al administrador si crees que esto es un error.
        </p>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/admin-login')}
            className="w-full bg-[#feecaf] text-black py-2 px-4 rounded-md hover:bg-[#feecaf]/80 transition-colors font-medium"
          >
            Ir al Login de Admin
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Volver al Inicio
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Si necesitas acceso, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
