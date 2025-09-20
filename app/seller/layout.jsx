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
      const cookies = document.cookie.split(';')
      const permissionsCookie = cookies.find(cookie => 
        cookie.trim().startsWith('admin-permissions=')
      )
      
      if (permissionsCookie) {
        try {
          const permissionsValue = permissionsCookie.split('=')[1]
          const permissions = JSON.parse(decodeURIComponent(permissionsValue))
          setAdminPermissions(permissions)
        } catch (error) {
          console.error('Error al parsear permisos:', error)
        }
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