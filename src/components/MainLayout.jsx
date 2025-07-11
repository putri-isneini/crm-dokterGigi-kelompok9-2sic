// src/components/MainLayout.js
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ isLoggedIn, userRole }) => {
  const location = useLocation();

  // Cek apakah rute saat ini adalah salah satu rute admin (yang tidak seharusnya memiliki header terpisah)
  const isDashboardRoute = 
    location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/diskonlist') ||
    location.pathname.startsWith('/data-pasien') || 
    location.pathname.startsWith('/layanan-klinik') ||
    location.pathname.startsWith('/jadwal-dokter') ||
    location.pathname.startsWith('/data-dokter') ||
    location.pathname.startsWith('/booking') ||
    location.pathname.startsWith('/tentang-kami') ||
    location.pathname.startsWith('/faq') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64 w-full">
        {/* Render Header hanya jika bukan di halaman admin (yang ditentukan oleh isDashboardRoute) */}
        {!isDashboardRoute && <Header isLoggedIn={isLoggedIn} userRole={userRole} />}
        
        <main className={`flex-1 py-6 px-4 ${isDashboardRoute ? 'pt-6' : 'pt-24'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;