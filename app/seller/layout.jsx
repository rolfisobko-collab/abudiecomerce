'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import { useAppContext } from '@/context/AppContext'
import React, { useState, useEffect } from 'react'

const Layout = ({ children }) => {
  const { user } = useAppContext()
  const [adminPermissions, setAdminPermissions] = useState(null)
  
  useEffect(() => {
    // Obtener permisos desde las cookies
    const getAdminPermissions = () => {
      try {
        const cookies = document.cookie.split(';')
        const permissionsCookie = cookies.find(cookie => 
          cookie.trim().startsWith('admin-permissions=')
        )
        
        if (permissionsCookie) {
          const permissionsValue = permissionsCookie.split('=')[1]
          const permissions = JSON.parse(decodeURIComponent(permissionsValue))
          console.log('🔍 [LAYOUT DEBUG] Permisos obtenidos:', permissions)
          setAdminPermissions(permissions)
        } else {
          console.log('🔍 [LAYOUT DEBUG] No se encontraron permisos en cookies')
          // Para desarrollo, dar permisos completos si no hay cookies
          setAdminPermissions({
            addProduct: true,
            productList: true,
            categories: true,
            brands: true,
            orders: true,
            paymentMethods: true,
            communications: true,
            whatsapp: true, // WhatsApp siempre disponible
            adminUsers: true
          })
        }
      } catch (error) {
        console.error('Error al parsear permisos:', error)
        // En caso de error, dar permisos completos para desarrollo
        setAdminPermissions({
          addProduct: true,
          productList: true,
          categories: true,
          brands: true,
          orders: true,
          paymentMethods: true,
          communications: true,
          whatsapp: true, // WhatsApp siempre disponible
          adminUsers: true
        })
      }
    }
    
    getAdminPermissions()
  }, [])
  
  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar userPermissions={adminPermissions} />
        {children}
      </div>
    </div>
  )
}

export default Layout