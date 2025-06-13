import React from 'react'
import {
  LayoutDashboard,
  ShoppingCart,
  Box,
  Settings,
  LogIn,
  UserPlus,
  User2 as User2Icon,
  CalendarCheck,
  UserCheck,
  Stethoscope
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard' },
  { name: 'Pelanggan', icon: <User2Icon />, path: '/pelanggan' },
  { name: 'Booking', icon: <CalendarCheck />, path: '/booking' },
  { name: 'Data Pasien', icon: <UserCheck />, path: '/pasien' },
  { name: 'Riwayat Kunjungan', icon: <Stethoscope />, path: '/riwayat' },
  { name: 'Jadwal Pasien', icon: <CalendarCheck />, path: '/jadwal' },
]

const accountItems = [
  { name: 'Produk', icon: <Box />, path: '/produk' },
  { name: 'Sign In', icon: <LogIn />, path: '/signin' },
  { name: 'Sign Up', icon: <UserPlus />, path: '/signup' },
]

const Sidebar = () => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-pink-50 shadow-xl px-4 py-6 z-30 hidden md:block overflow-y-auto border-r border-pink-100">
      {/* Logo */}
      <Link to="/" className="flex justify-center mb-10">
        <img
          src="/image/logo.png"
          alt="Logo Drg.Tia"
          className="w-24 h-24 object-contain rounded-full shadow-lg hover:scale-105 transition duration-300"
        />
      </Link>

      {/* Menu utama */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition duration-200 ${
              isActive(item.path)
                ? 'bg-rose-100 text-rose-700 font-semibold shadow'
                : 'text-gray-700 hover:bg-pink-100 hover:text-rose-600'
            }`}
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Separator */}
      <div className="mt-10 text-sm font-semibold text-pink-500 tracking-wider border-t pt-4 border-pink-100 uppercase">
        Lainnya
      </div>

      {/* Menu akun */}
      <nav className="mt-2 space-y-2 mb-6">
        {accountItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition duration-200 ${
              isActive(item.path)
                ? 'bg-rose-100 text-rose-700 font-semibold shadow'
                : 'text-gray-700 hover:bg-pink-100 hover:text-rose-600'
            }`}
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
