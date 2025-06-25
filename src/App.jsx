import './App.css';
import './index.css';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Login from './components/Login';

import Dashboard from './pages/Dashboard';

import LayananKami from './components/LayananKami';
import Kontak from './components/Kontak';
import PublicLayout from './components/PublicLayout';
import Produk from './components/Produk';
import Testimoni from './components/Testimoni';
import ListPasien from './pages/pasien/ListPasien';
import FormPasien from './pages/pasien/FormPasien';
import ListDokter from './pages/dokter/ListDokter';
import FormDokter from './pages/dokter/FormDokter';
import ListLayanan from './pages/layanan/ListLayanan';
import FormLayanan from './pages/layanan/FormLayanan';
import ListProdukPasien from './pages/produk/ListProdukPasien';
import FormProdukPasien from './pages/produk/FormProdukPasien';
import TentangKami from './components/tentangkami/TentangKami';
import ListTentangKami from './components/tentangkami/ListTentangKami';
import FormTentangKami from './components/tentangkami/FormTentangKami';

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

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/unauthorized" element={<div>401 - Unauthorized</div>} />

      {/* Halaman dari komponen terpisah beranda */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tentang" element={<TentangKami />} />
        <Route path="/layanan" element={<LayananKami />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/testimoni" element={<Testimoni />} />
        <Route path="/kontak" element={<Kontak />} />
      </Route>


      {/* Protected Routes */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Dashboard dan Umum */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Pasien */}
        <Route path="/listpasien" element={<ListPasien />} />
        <Route path="/formpasien" element={<FormPasien />} />

        {/* Dokter */}
        <Route path="/listdokter" element={<ListDokter />} />
        <Route path="/formdokter" element={<FormDokter />} />

        {/* tentang kami */}
        <Route path="/listtentangkami" element={<ListTentangKami />} />
        <Route path="/formtentangkami" element={<FormTentangKami />} />

        {/* Layanan */}
        <Route path="/listlayanan" element={<ListLayanan />} />
        <Route path="/formdokter" element={<FormLayanan />} />

        {/* ProdukPasien */}
        <Route path="/listprodukpasien" element={<ListProdukPasien />} />
        <Route path="/formprodukpasien" element={<FormProdukPasien/>} />

        {/* Riwayat Kunjungan */}

        {/* FAQ */}
      </Route>
    </Routes>
  );
}

export default App;
