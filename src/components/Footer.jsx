import React from "react";
import { Link } from "react-router-dom"; // Penting: Gunakan Link untuk navigasi internal
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"; // Tambahkan ikon media sosial

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-pink-50 via-pink-100 to-white pt-16 pb-8 mt-20 border-t border-pink-200 shadow-inner">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Kolom 1: Info Klinik */}
        <div className="flex flex-col items-start">
          <h3 className="text-pink-700 text-3xl font-extrabold mb-4 font-poppins">
            drg. Tia Dental Care
          </h3>
          <p className="text-gray-700 text-base mb-2 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-pink-500" /> Jl. Senyum Sehat No. 12, Surabaya
          </p>
          <p className="text-gray-700 text-base mb-2 flex items-center">
            <FaWhatsapp className="mr-2 text-pink-500" /> WhatsApp: 0812-3456-7890
          </p>
          <p className="text-gray-700 text-base mb-2 flex items-center">
            <FaEnvelope className="mr-2 text-pink-500" /> Email: info@tiadentalcare.com
          </p>

          {/* Social Media Icons */}
          <div className="flex space-x-5 mt-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition-colors duration-200 text-2xl">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition-colors duration-200 text-2xl">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition-colors duration-200 text-2xl">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Kolom 2: Navigasi */}
        <div>
          <h4 className="text-pink-600 text-xl font-bold mb-5">Menu</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Beranda</Link></li>
            <li><Link to="/tentang" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Tentang Kami</Link></li>
            <li><Link to="/layanan" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Layanan</Link></li>
            <li><Link to="/promo" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Promo</Link></li>
            <li><Link to="/testimoni" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Testimoni</Link></li>
            <li><Link to="/kontak" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Kontak</Link></li>
            <li><Link to="/artikel" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Artikel</Link></li>
          </ul>
        </div>

        {/* Kolom 3: Layanan Populer */}
        <div>
          <h4 className="text-pink-600 text-xl font-bold mb-5">Layanan Populer</h4>
          <ul className="space-y-3">
            <li><Link to="/layanan/pembersihan-karang-gigi" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Pembersihan Karang Gigi</Link></li>
            <li><Link to="/layanan/pemutihan-gigi" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Pemutihan Gigi</Link></li>
            <li><Link to="/layanan/penambalan-gigi" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Penambalan Gigi</Link></li>
            <li><Link to="/layanan/behel-ortodonti" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Behel Ortodonti</Link></li>
            <li><Link to="/layanan/cabut-gigi" className="text-gray-700 hover:text-pink-600 transition-colors duration-200 text-base">Cabut Gigi</Link></li>
          </ul>
        </div>

        {/* Kolom 4: Jam Operasional (Contoh, bisa diganti dengan Subscribe Newsletter atau Peta) */}
        <div>
          <h4 className="text-pink-600 text-xl font-bold mb-5">Jam Operasional</h4>
          <p className="text-gray-700 text-base mb-2">Senin - Jumat: 09:00 - 17:00</p>
          <p className="text-gray-700 text-base mb-2">Sabtu: 09:00 - 14:00</p>
          <p className="text-gray-700 text-base mb-2">Minggu: Tutup</p>
        </div>
      </div>

      {/* Bagian Bawah Footer */}
      <div className="border-t border-pink-200 mt-12 pt-8 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} drg. Tia Dental Care. All rights reserved.
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Made with ❤️ in Pekanbaru, Riau.
        </p>
      </div>
    </footer>
  );
};

export default Footer;