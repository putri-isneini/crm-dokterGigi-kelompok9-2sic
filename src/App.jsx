import './App.css';
import { Route, Routes } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';

import Login from './components/Login';
import BookingForm from './components/BookingForm';
import RegisterForm from './components/RegisterForm';

import RiwayatKunjungan from './pages/riwayatkunjungan/RiwayatKunjungan';
import TambahRiwayat from './pages/riwayatkunjungan/TambahRiwayat';
import EditRiwayat from './pages/riwayatkunjungan/EditRiwayat';

import Faq from './pages/faq/Faq';
import FaqForm from './pages/faq/FaqForm';

import AdminUser from './pages/admin/AdminUser';         // ✅ pastikan file ini ada
import AdminUserForm from './pages/admin/AdminUserForm'; // ✅ pastikan file ini juga ada

import DataDokter from './pages/DataDokter';

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

  

        {/* Riwayat Kunjungan */}
        <Route path="/riwayat/list" element={<RiwayatKunjungan />} />
        <Route path="/riwayat/tambah" element={<TambahRiwayat />} />
        <Route path="/riwayat/edit" element={<EditRiwayat />} />

        {/* FAQ */}
        <Route path="/faq/list" element={<Faq />} />
      

        {/* Admin User */}
        <Route path="/admin/list" element={<AdminUser />} />
        

        {/* Dokter */}
        <Route path="/datadokter" element={<DataDokter />} />
      </Route>
    </Routes>
  );
}

export default App;
