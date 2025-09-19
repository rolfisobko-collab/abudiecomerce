'use client'
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CEODashboard from '@/components/CEODashboard';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CEODashboardPage = () => {
  const { user, isSeller } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario es admin o CEO
    if (!user || (!isSeller && user.role !== 'admin' && user.role !== 'ceo')) {
      router.push('/unauthorized');
    }
  }, [user, isSeller, router]);

  if (!user || (!isSeller && user.role !== 'admin' && user.role !== 'ceo')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <CEODashboard />
      <Footer />
    </>
  );
};

export default CEODashboardPage;
