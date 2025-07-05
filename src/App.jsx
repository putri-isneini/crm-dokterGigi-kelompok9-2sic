import './App.css';
import { Route, Routes } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import BookingForm from './components/BookingForm';
import RegisterForm from './components/RegisterForm';

import DataDokter from './pages/DataDokter';
import Faq from './pages/faq/Faq';
import FaqForm from './pages/faq/FaqForm';

import AdminUser from './pages/admin/AdminUser';         // ✅ pastikan file ini ada
import AdminUserForm from './pages/admin/AdminUserForm';

import RiwayatKunjungan from './pages/riwayatkunjungan/RiwayatKunjungan';
import TambahRiwayat from './pages/riwayatkunjungan/TambahRiwayat';
import EditRiwayat from './pages/riwayatkunjungan/EditRiwayat';
import Pasien from './pages/pasien/pasien';
import TambahPasien from './pages/pasien/TambahPasien';
import EditPasien from './pages/pasien/EditPasien';

function App() {
  return (
    <Routes>
      {/* Route tanpa layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/bookingpasien" element={<BookingForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Route dengan layout utama */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />

        {/* Pasien */}
        <Route path="/pasien" element={<Pasien />} />
        <Route path="/pasien/tambah" element={<TambahPasien />} />
        <Route path="/pasien/edit/:id" element={<EditPasien  />} />

        {/* FAQ */}
        <Route path="/faq/list" element={<Faq/>} />
      

        {/* Admin User */}
        <Route path="/admin/list" element={<AdminUser />} />

        {/* Riwayat Kunjungan */}
        <Route path="/riwayat" element={<RiwayatKunjungan />} />
        <Route path="/riwayat/tambah" element={<TambahRiwayat />} />
        <Route path="/riwayat/edit" element={<EditRiwayat />} />
      </Route>
    </Routes>
  );
}

export default App;
