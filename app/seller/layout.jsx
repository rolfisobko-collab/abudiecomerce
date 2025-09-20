'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import { useAppContext } from '@/context/AppContext'
import React from 'react'

const Layout = ({ children }) => {
  const { user } = useAppContext()
  
  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar userPermissions={user?.permissions} />
        {children}
      </div>
    </div>
  )
}

export default Layout