import './App.css';
import './index.css';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import PublicLayout from './components/PublicLayout';

import Home from './components/Home';
import Login from './components/Login';
import LayananKami from './components/LayananKami';
import Kontak from './components/Kontak';
import Produk from './components/Produk';
import Testimoni from './components/Testimoni';
import TentangKami from './components/tentangkami/TentangKami';
import RegisterPasien from './components/RegistrasiPasien';
import FormBooking from './components/FormBooking';
import HalamanProfil from './components/HalamanProfil';
import PrediksiMasalahGigi from './components/prediksi/PrediksiMasalahGigi';

import Dashboard from './pages/Dashboard';
import ListPasien from './pages/pasien/ListPasien';
import FormPasien from './pages/pasien/FormPasien';
import Pasien from './pages/pasien/pasien';
import TambahPasien from './pages/pasien/TambahPasien';
import EditPasien from './pages/pasien/EditPasien';

import ListDokter from './pages/dokter/ListDokter';
import FormDokter from './pages/dokter/FormDokter';
import DataDokter from './pages/DataDokter';

import ListLayanan from './pages/layanan/ListLayanan';
import FormLayanan from './pages/layanan/FormLayanan';

import ListProdukPasien from './pages/produk/ListProdukPasien';
import FormProdukPasien from './pages/produk/FormProdukPasien';

import ListTentangKami from './components/tentangkami/ListTentangKami';
import FormTentangKami from './components/tentangkami/FormTentangKami';

import BookingForm from './components/BookingForm';
import BookingList from './pages/BookingList';

import DiskonForm from './pages/DiskonForm';
import DiskonList from './pages/DiskonList';

import JadwalDokterForm from './pages/JadwalDokterForm';
import JadwalDokter from './pages/JadwalDokterList';

import RegisterForm from './components/RegisterForm';

import Faq from './pages/faq/Faq';
import FaqForm from './pages/faq/FaqForm';

import AdminUser from './pages/admin/AdminUser';
import AdminUserForm from './pages/admin/AdminUserForm';

import RiwayatKunjungan from './pages/riwayatkunjungan/RiwayatKunjungan';
import TambahRiwayat from './pages/riwayatkunjungan/TambahRiwayat';
import EditRiwayat from './pages/riwayatkunjungan/EditRiwayat';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Route tanpa layout - Public */}
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/bookingpasien" element={<BookingForm />} />

      {/* Public layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tentang" element={<TentangKami />} />
        <Route path="/layanan" element={<LayananKami />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/testimoni" element={<Testimoni />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/prediksi" element={<PrediksiMasalahGigi />} />
        <Route path="/registrasi" element={<RegisterPasien />} />
        <Route path="/booking" element={<FormBooking />} />
        <Route path="/profil" element={<HalamanProfil />} />
      </Route>

      {/* Admin / Private layout */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Pasien */}
        <Route path="/listpasien" element={<ListPasien />} />
        <Route path="/formpasien" element={<FormPasien />} />
        <Route path="/pasien" element={<Pasien />} />
        <Route path="/pasien/tambah" element={<TambahPasien />} />
        <Route path="/pasien/edit/:id" element={<EditPasien />} />

        {/* Dokter */}
        <Route path="/listdokter" element={<ListDokter />} />
        <Route path="/formdokter" element={<FormDokter />} />
        <Route path="/datadokter" element={<DataDokter />} />

        {/* Layanan & Produk */}
        <Route path="/listlayanan" element={<ListLayanan />} />
        <Route path="/formlayanan" element={<FormLayanan />} />
        <Route path="/listprodukpasien" element={<ListProdukPasien />} />
        <Route path="/formprodukpasien" element={<FormProdukPasien />} />

        {/* Tentang Kami */}
        <Route path="/listtentangkami" element={<ListTentangKami />} />
        <Route path="/formtentangkami" element={<FormTentangKami />} />

        {/* Booking & Diskon */}
        <Route path="/bookingform" element={<BookingForm />} />
        <Route path="/bookinglist" element={<BookingList />} />
        <Route path="/diskonform" element={<DiskonForm />} />
        <Route path="/diskonlist" element={<DiskonList />} />

        {/* Jadwal */}
        <Route path="/jadwaldokterform" element={<JadwalDokterForm />} />
        <Route path="/jadwaldokterlist" element={<JadwalDokter />} />

        {/* FAQ */}
        <Route path="/faq/list" element={<Faq />} />
        <Route path="/faq/tambah" element={<FaqForm />} />

        {/* Admin User */}
        <Route path="/admin/list" element={<AdminUser />} />
        <Route path="/admin/tambah" element={<AdminUserForm />} />

        {/* Riwayat */}
        <Route path="/riwayat" element={<RiwayatKunjungan />} />
        <Route path="/riwayat/tambah" element={<TambahRiwayat />} />
        <Route path="/riwayat/edit" element={<EditRiwayat />} />
      </Route>
    </Routes>
  );
}

export default App;
