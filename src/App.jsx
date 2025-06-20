import './App.css';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Login from './components/Login';

import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import Booking from './pages/Booking';
import JadwalPasien from './pages/JadwalPasien';
import Diskon from './pages/Diskon';
import ProdukPasien from './pages/ProdukPasien';
import FAQList from './pages/faq/FAQList';
import TambahFAQ from './pages/faq/TambahFAQ';
import EditFAQ from './pages/faq/EditFAQ';
import DataDokter from './pages/dokter/DataDokter';
import TambahDokter from './pages/dokter/TambahDokter';
import EditDokter from './pages/dokter/EditDokter';
import RiwayatKunjungan from './pages/riwayatkunjungan/RiwayatKunjungan';
import TambahRiwayat from './pages/riwayatkunjungan/TambahRiwayat';
import EditRiwayat from './pages/riwayatkunjungan/EditRiwayat';
import Pasien from './pages/pasien';
import ListPasien from './pages/ListPasien';
import PasienForm from './components/PasienForm';

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
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/unauthorized" element={<div>401 - Unauthorized</div>} />

      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* Halaman utama */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<CustomerManagement />} />
        <Route path="/booking" element={<Booking bookings={bookings} onStatusChange={onStatusChange} />} />
        <Route path="/pasien" element={<Pasien />} />
        <Route path="/listpasien" element={<ListPasien />} />
        <Route path="/formpasien" element={<PasienForm />} />
        <Route path="/jadwal" element={<JadwalPasien bookings={bookings} />} />
        <Route path="/diskon-membership" element={<Diskon />} />
        <Route path="/produk-pasien" element={<ProdukPasien />} />

        {/* Dokter CRUD */}
        <Route path="/datadokter" element={<DataDokter />} />
        <Route path="/data-dokter/tambah" element={<TambahDokter />} />
        <Route path="/data-dokter/edit/:id" element={<EditDokter />} />

        {/* FAQ CRUD */}
        <Route path="/faq" element={<FAQList />} />
        <Route path="/faq/tambah" element={<TambahFAQ />} />
        <Route path="/faq/edit/:id" element={<EditFAQ />} />

        {/* Riwayat Kunjungan CRUD */}
        <Route path="/riwayat" element={<RiwayatKunjungan />} />
        <Route path="/riwayat-kunjungan/tambah" element={<TambahRiwayat />} />
        <Route path="/riwayat-kunjungan/edit/:id" element={<EditRiwayat />} />
      </Route>
    </Routes>
  );
}

export default App;
