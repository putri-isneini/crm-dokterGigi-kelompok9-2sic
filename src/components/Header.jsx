import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const pasienId = localStorage.getItem("pasien_id");
    setIsLoggedIn(!!pasienId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pasien_id");
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-pink-50 via-pink-100 to-white shadow-lg backdrop-blur-sm border-b border-pink-200 px-8 py-3 flex justify-between items-center transition-all duration-300 ease-in-out">
      {/* Logo and Clinic Name */}
      <Link to="/" className="flex items-center gap-3 text-pink-700 hover:text-pink-800 transition-colors duration-200">
        <img src="/image/logo.png" alt="Logo Klinik Gigi" className="w-16 h-16 object-cover rounded-full shadow-md" />
        <span className="font-extrabold text-2xl font-poppins text-pink-600 hover:text-pink-700 transition-colors duration-200">
          Drg. Tia Dental Care
        </span>
      </Link>

      {/* Navigation Links - Tetap di tengah dengan gap yang lebih lebar */}
      <nav className="flex gap-10 text-lg font-semibold text-rose-800 flex-grow justify-center">
        <Link to="/" className="hover:text-pink-600 transition-colors duration-200 relative group">
          Beranda
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </Link>
        <Link to="/tentang" className="hover:text-pink-600 transition-colors duration-200 relative group">
          Tentang Kami
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </Link>
        <Link to="/layanan" className="hover:text-pink-600 transition-colors duration-200 relative group">
          Layanan
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </Link>
        <Link to="/testimoni" className="hover:text-pink-600 transition-colors duration-200 relative group">
          Testimoni
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </Link>
        <Link to="/kontak" className="hover:text-pink-600 transition-colors duration-200 relative group">
          Kontak
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
        </Link>
      </nav>

      {/* User/Login Section */}
      <div className="relative flex items-center"> {/* Added flex and items-center for vertical alignment */}
        {!isLoggedIn ? (
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
          >
            Masuk ke Dashboard
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-pink-600 text-5xl cursor-pointer hover:text-pink-700 transition-colors duration-200 focus:outline-none" // Ukuran ikon diperbesar menjadi text-5xl
              aria-label="User menu"
            >
              <FaUserCircle />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-xl border border-pink-100 py-1 animate-fade-in-down origin-top-right">
                <Link to="/profil" className="block px-4 py-2 text-gray-800 hover:bg-pink-50 hover:text-pink-700 text-base font-medium transition-colors duration-200">
                  Profil
                </Link>
                <Link to="/riwayat" className="block px-4 py-2 text-gray-800 hover:bg-pink-50 hover:text-pink-700 text-base font-medium transition-colors duration-200">
                  Riwayat
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 text-base font-medium transition-colors duration-200 border-t border-gray-100 mt-1 pt-2"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;