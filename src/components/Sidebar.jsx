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
  BarChart2,
  LayoutDashboard,
  CalendarDays // Mengganti CalendarCheck untuk jadwal dokter agar lebih spesifik
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/dashboard' },
  { name: 'Data Pasien', icon: <Users size={22} />, path: '/listpasien' },
  { name: 'Layanan Klinik', icon: <HeartPulse size={22} />, path: '/listlayanan' },
  { name: 'Jadwal Dokter', icon: <CalendarDays size={22} />, path: '/jadwaldokterlist' }, // Menggunakan CalendarDays
  { name: 'Data Dokter', icon: <UserCircle2 size={22} />, path: '/listdokter' },
  { name: 'Booking', icon: <CalendarCheck size={22} />, path: '/bookinglist' }, // Tetap CalendarCheck untuk booking
];

const otherItems = [
  { name: 'Tentang Kami', icon: <ScrollText size={22} />, path: '/listtentangkami' },
  { name: 'Diskon', icon: <BarChart2 size={22} />, path: '/diskonlist' },
  { name: 'FAQ', icon: <HelpCircle size={22} />, path: '/faq/list' },
];

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed top-0 left-0 w-96 h-screen bg-gradient-to-b from-pink-50 to-rose-50 shadow-2xl px-7 py-8 z-30 hidden md:block overflow-y-auto border-r border-pink-100 rounded-r-3xl"> {/* Changed w-80 to w-96 */}
      {/* Logo */}
      <Link to="/" className="flex justify-center mb-12">
        <img
          src="/image/logo.png"
          alt="Logo Drg.Tia"
          className="w-36 h-32 object-contain transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </Link>

      {/* Menu Utama */}
      <nav className="space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl text-lg transition duration-200 ease-in-out
              ${isActive(item.path)
                ? 'bg-rose-500/10 text-rose-700 font-bold border-l-4 border-rose-500 shadow-md transform translate-x-1'
                : 'text-gray-600 hover:bg-pink-100 hover:text-rose-600'
              }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Separator */}
      <div className="mt-12 mb-4 text-sm font-bold text-pink-600 tracking-wider border-t-2 pt-5 border-pink-200 uppercase">
        Lainnya
      </div>

      {/* Menu Lainnya */}
      <nav className="mt-2 space-y-3 mb-6">
        {otherItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl text-lg transition duration-200 ease-in-out
              ${isActive(item.path)
                ? 'bg-rose-500/10 text-rose-700 font-bold border-l-4 border-rose-500 shadow-md transform translate-x-1'
                : 'text-gray-600 hover:bg-pink-100 hover:text-rose-600'
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
