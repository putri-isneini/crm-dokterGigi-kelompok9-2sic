// src/components/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Asumsi Header ada di sini
import Footer from './Footer'; // Asumsi Footer ada di sini

const PublicLayout = ({ isLoggedIn, userRole }) => {
  return (
    <>
      {/* Meneruskan isLoggedIn dan userRole ke Header juga, jika diperlukan */}
      <Header isLoggedIn={isLoggedIn} userRole={userRole} />
      <main>
        {/* PENTING: Meneruskan isLoggedIn dan userRole ke komponen anak melalui context */}
        <Outlet context={{ isLoggedIn, userRole }} />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
