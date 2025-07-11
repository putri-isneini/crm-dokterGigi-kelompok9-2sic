// src/components/PublicLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Pastikan path benar
import Footer from './Footer'; // Jika ada footer

// PublicLayout sekarang menerima isLoggedIn dan userRole sebagai props
const PublicLayout = ({ isLoggedIn, userRole }) => {
  return (
    <div>
      {/* Teruskan isLoggedIn dan userRole ke Header */}
      <Header isLoggedIn={isLoggedIn} userRole={userRole} />
      <main className="pt-24"> {/* Sesuaikan padding-top agar tidak tertutup header */}
        <Outlet />
      </main>
      <Footer /> {/* Asumsikan Anda memiliki komponen Footer */}
    </div>
  );
};

export default PublicLayout;
