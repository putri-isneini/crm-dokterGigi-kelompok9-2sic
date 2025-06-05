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
  { name: 'Produk', icon: <Box />, path: '/produk' },
  { name: 'Pelanggan', icon: <User2Icon />, path: '/pelanggan' },
  { name: 'Booking', icon: <CalendarCheck />, path: '/booking' },
  { name: 'Data Pasien', icon: <UserCheck />, path: '/pasien' },
  { name: 'Riwayat Kunjungan', icon: <Stethoscope />, path: '/riwayat' },
  { name: 'Penjualan', icon: <ShoppingCart />, path: '/laporan' },
  { name: 'Jadwal Pasien', icon: <CalendarCheck />, path: '/jadwal' },
]

const accountItems = [
  { name: 'Pengaturan Akun', icon: <Settings />, path: '/akun' },
  { name: 'Sign In', icon: <LogIn />, path: '/signin' },
  { name: 'Sign Up', icon: <UserPlus />, path: '/signup' },
]

const Sidebar = () => {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-lg px-3 py-4 z-20 hidden md:block overflow-y-auto">
      <div className="text-xl font-bold mb-8 text-purple-700">Drg.Tia Dental Care</div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-100 transition ${
              isActive(item.path)
                ? 'bg-purple-200 text-purple-800 font-semibold'
                : 'text-gray-700'
            }`}
          >
            <span className="w-5 h-5">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-8 text-xs font-semibold text-gray-500">AKUN</div>

      <nav className="mt-2 space-y-1 mb-4">
        {accountItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-100 transition ${
              isActive(item.path)
                ? 'bg-purple-200 text-purple-800 font-semibold'
                : 'text-gray-700'
            }`}
          >
            <span className="w-5 h-5">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
