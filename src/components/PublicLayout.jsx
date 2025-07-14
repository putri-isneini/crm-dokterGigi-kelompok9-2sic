// src/components/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const PublicLayout = ({ isLoggedIn, userRole }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={isLoggedIn} userRole={userRole} />
      <main className="flex-grow">
        <Outlet context={{ isLoggedIn, userRole }} />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
