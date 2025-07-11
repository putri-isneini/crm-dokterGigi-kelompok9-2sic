import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { supabase } from "../supabase";

// Perbaikan path import CSS
import "../App.css";
import "../index.css";

// Header sekarang menerima isLoggedIn dan userRole sebagai props
const Header = ({ isLoggedIn, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Menutup dropdown saat navigasi berubah
    // isLoggedIn dan userRole sekarang datang dari props, tidak perlu dibaca dari localStorage di sini
    setShowDropdown(false);
  }, [location]);

  // Fungsi untuk menangani klik logout
  const handleLogout = async () => {
    console.log("Logout button clicked!");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      alert("Gagal logout: " + error.message);
      console.error("Logout error:", error.message, error);
    } else {
      console.log("Supabase signOut successful. Waiting for App.js to update state and navigate...");
      // localStorage.removeItem("isLoggedIn"); // DIHAPUS: App.js handles this
      // localStorage.removeItem("userRole"); // DIHAPUS: App.js handles this
      // localStorage.removeItem("pasien_id"); // DIHAPUS: App.js handles this
      
      // Memberikan sedikit penundaan sebelum navigasi untuk memastikan state global diperbarui
      setTimeout(() => {
        navigate("/");
        console.log("Navigated to / after delay.");
      }, 100); // Penundaan 100 milidetik
    }
  };

  // Fungsi untuk menutup dropdown saat kursor mouse meninggalkan area dropdown
  const handleDropdownMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-pink-50 via-pink-100 to-white shadow-lg backdrop-blur-sm border-b border-pink-200 px-8 py-3 flex justify-between items-center transition-all duration-300 ease-in-out text-[18px]">
      {/* Logo Klinik */}
      <Link to="/" className="flex items-center gap-3 text-pink-700 hover:text-pink-800 transition-colors duration-200">
        <img src="/image/logo.png" alt="Logo Klinik Gigi" className="w-16 h-16 object-cover rounded-full shadow-md" />
        <span className="font-extrabold text-2xl font-poppins text-pink-600 hover:text-pink-700 transition-colors duration-200">
          Drg. Tia Dental Care
        </span>
      </Link>

      {/* Navigasi Tengah */}
      <nav className="flex gap-10 font-semibold text-rose-800 flex-grow justify-center">
        {[
          { to: "/", label: "Beranda" },
          { to: "/tentang", label: "Tentang Kami" },
          { to: "/layanan", label: "Layanan" },
          { to: "/testimoni", label: "Testimoni" },
          { to: "/kontak", label: "Kontak" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="hover:text-pink-600 transition-colors duration-200 relative group"
          >
            {label}
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
        ))}
      </nav>

      {/* Bagian Login / Icon User */}
      <div className="relative flex items-center">
        {!isLoggedIn ? (
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Login
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-pink-600 text-5xl cursor-pointer hover:text-pink-700 transition-colors duration-200"
              aria-label="User menu"
            >
              <FaUserCircle />
            </button>
            {showDropdown && (
              <div
                className="absolute right-0 mt-3 w-40 bg-white rounded-lg shadow-xl border border-pink-100 py-1 animate-fade-in-down origin-top-right text-[17px] z-[1000]" // Meningkatkan z-index
                onMouseLeave={handleDropdownMouseLeave} // Menutup dropdown saat mouse keluar
              >
                {userRole === 'Pasien' && (
                  <>
                    <Link
                      to="/profil-pasien"
                      className="block px-4 py-2 text-gray-800 hover:bg-pink-50 hover:text-pink-700 font-medium transition-colors duration-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profil
                    </Link>
                    <Link
                      to="/riwayat" // Pastikan rute ini ada dan dilindungi jika perlu
                      className="block px-4 py-2 text-gray-800 hover:bg-pink-50 hover:text-pink-700 font-medium transition-colors duration-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      Riwayat
                    </Link>
                  </>
                )}
                {(userRole === 'Admin' || userRole === 'Dokter' || userRole === 'Staf') && (
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-gray-800 hover:bg-pink-50 hover:text-pink-700 font-medium transition-colors duration-200"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors duration-200 border-t border-gray-100 mt-1 pt-2"
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
