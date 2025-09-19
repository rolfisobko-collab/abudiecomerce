'use client'
import React from 'react'
import { assets } from '../../assets/assets'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const Navbar = () => {

  const { router } = useAppContext()
  const nextRouter = useRouter()

  const handleLogout = async () => {
    try {
      console.log('🔍 [ADMIN LOGOUT DEBUG] Cerrando sesión de admin...')
      
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      })

      const data = await response.json()
      console.log('🔍 [ADMIN LOGOUT DEBUG] Respuesta:', data)

      if (data.success) {
        toast.success('Sesión cerrada exitosamente')
        nextRouter.push('/')
      } else {
        toast.error('Error al cerrar sesión')
      }
    } catch (error) {
      console.log('❌ [ADMIN LOGOUT DEBUG] Error:', error)
      toast.error('Error al cerrar sesión')
    }
  }

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b bg-black'>
      <Image onClick={()=>router.push('/')} className='w-28 lg:w-32 cursor-pointer' src="/abudilogo2.png" alt="" width={128} height={128} />
      <button 
        onClick={handleLogout}
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-gray-700'
      >
        Logout Admin
      </button>
    </div>
  )
}

export default Navbar