import './App.css';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Login from './components/Login';

import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import Booking from './pages/Booking';
import Pasien from './pages/Pasien';
import RiwayatKunjungan from './pages/RiwayatKunjungan';
import JadwalPasien from './pages/JadwalPasien';
import Produk from './pages/Produk';
import './App.css'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import Booking from './pages/Booking'
import JadwalPasien from './pages/JadwalPasien'
import Diskon from './pages/Diskon';
import ProdukPasien from './pages/ProdukPasien'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [bookings, setBookings] = useState([
    { id: 1, bookingCode: "BOOK-001", patientName: "Joko Gntg", date: "2025-06-05", time: "11:00", status: "Terjadwal" },
    { id: 2, bookingCode: "BOOK-002", patientName: "Madara", date: "2025-06-17", time: "13:30", status: "Terjadwal" },
    { id: 3, bookingCode: "BOOK-003", patientName: "Itachi", date: "2025-06-21", time: "10:00", status: "Menunggu" },
    { id: 4, bookingCode: "BOOK-004", patientName: "Yami-Sukehiro", date: "2025-06-27", time: "15:00", status: "Menunggu" },
    { id: 5, bookingCode: "BOOK-005", patientName: "Dazai", date: "2025-06-30", time: "13:30", status: "Menunggu" },
    { id: 6, bookingCode: "BOOK-006", patientName: "Minato", date: "2025-07-01", time: "14:30", status: "Menunggu" },
  ]);

  const onStatusChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  // Komponen PrivateRoute untuk proteksi
  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/unauthorized" element={<div>401 - Unauthorized</div>} />

      {/* Semua halaman di bawah ini hanya bisa diakses setelah login */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<CustomerManagement />} />
        <Route path="/booking" element={<Booking bookings={bookings} onStatusChange={onStatusChange} />} />
        <Route path="/pasien" element={<Pasien />} />
        <Route path="/riwayat" element={<RiwayatKunjungan />} />
        <Route path="/jadwal" element={<JadwalPasien bookings={bookings} />} />
        <Route path="/produk" element={<Produk />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/booking"
          element={
            <Booking
              bookings={bookings}
              onStatusChange={onStatusChange}
            />
          }
        />
        <Route path="/jadwalpasien" element={<JadwalPasien bookings={bookings} />} />
        <Route path="/diskon-membership" element={<Diskon />} />
        <Route path="/produk-pasien" element={<ProdukPasien />} />
      </Route>
    </Routes>
  );
}

export default App;
