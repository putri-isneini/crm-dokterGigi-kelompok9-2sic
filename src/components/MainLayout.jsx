// src/components/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Pastikan path benar
import Sidebar from './Sidebar'; // Asumsikan Anda memiliki komponen Sidebar

// MainLayout sekarang menerima isLoggedIn dan userRole sebagai props
const MainLayout = ({ isLoggedIn, userRole }) => {
  return (
    <div className="flex">
      <Sidebar /> {/* Sidebar untuk navigasi dashboard */}
      <div className="flex-1 flex flex-col">
        {/* Teruskan isLoggedIn dan userRole ke Header */}
        <Header isLoggedIn={isLoggedIn} userRole={userRole} />
        <main className="flex-1 p-6 pt-24"> {/* Sesuaikan padding-top agar tidak tertutup header */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
