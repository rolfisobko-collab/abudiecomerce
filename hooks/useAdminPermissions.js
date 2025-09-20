'use client'
import { useState, useEffect } from 'react'

export const useAdminPermissions = () => {
  const [permissions, setPermissions] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Función para obtener permisos desde las cookies
    const getPermissionsFromCookies = () => {
      try {
        // Leer cookie de permisos
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('admin-permissions='))
          ?.split('=')[1]
        
        if (cookieValue) {
          const decodedValue = decodeURIComponent(cookieValue)
          const parsedPermissions = JSON.parse(decodedValue)
          console.log('🔍 [PERMISSIONS DEBUG] Permisos obtenidos:', parsedPermissions)
          setPermissions(parsedPermissions)
        } else {
          console.log('🔍 [PERMISSIONS DEBUG] No se encontraron permisos en cookies')
          setPermissions(null)
        }
      } catch (error) {
        console.error('❌ [PERMISSIONS DEBUG] Error al parsear permisos:', error)
        setPermissions(null)
      } finally {
        setLoading(false)
      }
    }

    getPermissionsFromCookies()

    // Escuchar cambios en las cookies (opcional)
    const interval = setInterval(getPermissionsFromCookies, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return { permissions, loading }
}
