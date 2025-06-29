import React from 'react';
import {
  Home,
  Users,
  HeartPulse,
  ShoppingBag,
  UserCircle2,
  FolderKanban,
  HelpCircle,
  ScrollText,
  CalendarCheck,
  BarChart2
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: <Home size={22} />, path: '/dashboard' },
  { name: 'Data Pasien', icon: <Users size={22} />, path: '/listpasien' },
];

const otherItems = [
  { name: 'Tentang Kami', icon: <ScrollText size={22} />, path: '/listtentangkami' },
  { name: 'Layanan Klinik', icon: <HeartPulse size={22} />, path: '/listlayanan' },
  // { name: 'Produk Pasien', icon: <ShoppingBag size={22} />, path: '/listprodukpasien' },
  { name: 'Data Dokter', icon: <UserCircle2 size={22} />, path: '/listdokter' },
  // { name: 'Rekam Medis', icon: <FolderKanban size={22} />, path: '/rekammedis' },
  { name: 'Booking', icon: <CalendarCheck size={22} />, path: '/bookinglist' },
  { name: 'Jadwal Dokter', icon: <CalendarCheck size={22} />, path: '/jadwaldokterlist' },
  { name: 'Diskon', icon: <BarChart2 size={22} />, path: '/diskonlist' },
  // { name: 'FAQ', icon: <HelpCircle size={22} />, path: '/faq' },
];

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed top-0 left-0 w-72 h-screen bg-pink-50 shadow-xl px-6 py-6 z-30 hidden md:block overflow-y-auto border-r border-pink-100">
      {/* Logo */}
      <Link to="/" className="flex justify-center mb-10">
        <img
          src="/image/logo.png"
          alt="Logo Drg.Tia"
          className="w-36 h-32 object-contain hover:scale-105 transition duration-300"
        />
      </Link>

      {/* Menu Utama */}
      <nav className="space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-5 py-3 rounded-xl text-lg transition duration-200 ${
              isActive(item.path)
                ? 'bg-rose-100 text-rose-700 font-semibold shadow'
                : 'text-gray-700 hover:bg-pink-100 hover:text-rose-600'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Separator */}
      <div className="mt-10 text-sm font-semibold text-pink-500 tracking-wider border-t pt-4 border-pink-100 uppercase">
        Lainnya
      </div>

      {/* Menu Lainnya */}
      <nav className="mt-2 space-y-3 mb-6">
        {otherItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-5 py-3 rounded-xl text-lg transition duration-200 ${
              isActive(item.path)
                ? 'bg-rose-100 text-rose-700 font-semibold shadow'
                : 'text-gray-700 hover:bg-pink-100 hover:text-rose-600'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
