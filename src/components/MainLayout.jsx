// src/components/MainLayout.js
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ isLoggedIn, userRole }) => {
  const location = useLocation();

  // Rute admin yang tidak pakai Header
  const isDashboardRoute = 
    location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/diskonlist') ||
    location.pathname.startsWith('/listpasien') || 
    location.pathname.startsWith('/listlayanan') ||
    location.pathname.startsWith('/jadwaldokterform') ||
    location.pathname.startsWith('/jadwaldokterlist') ||
    location.pathname.startsWith('/listdokter') ||
    location.pathname.startsWith('/booking') ||
    location.pathname.startsWith('/listtentangkami') ||
    location.pathname.startsWith('/faq') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64 w-full">
        {!isDashboardRoute && <Header isLoggedIn={isLoggedIn} userRole={userRole} />}
        
        <main className={`flex-1 py-6 px-4 ${isDashboardRoute ? 'pt-6' : 'pt-24'}`}>
          {/* ✅ Tambahkan context di Outlet */}
          <Outlet context={{ isLoggedIn, userRole }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
