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

import Dashboard from './pages/Dashboard';
import ListPasien from './pages/pasien/ListPasien';
import FormPasien from './pages/pasien/FormPasien';
import ListDokter from './pages/dokter/ListDokter';
import FormDokter from './pages/dokter/FormDokter';
import ListLayanan from './pages/layanan/ListLayanan';
import FormLayanan from './pages/layanan/FormLayanan';
import ListProdukPasien from './pages/produk/ListProdukPasien';
import FormProdukPasien from './pages/produk/FormProdukPasien';
import ListTentangKami from './components/tentangkami/ListTentangKami';
import FormTentangKami from './components/tentangkami/FormTentangKami';

import BookingForm from './pages/BookingForm';
import BookingList from './pages/BookingList';
import DiskonForm from './pages/DiskonForm';
import DiskonList from './pages/DiskonList';
import JadwalDokterForm from './pages/JadwalDokterForm';
import JadwalDokter from './pages/JadwalDokterList';
import RegisterPasien from './components/RegistrasiPasien';
import FormBooking from './components/FormBooking';
// import HasilPrediksi from './components/prediksi/HasilPrediksi'; // Hapus import ini
import HalamanProfil from './components/HalamanProfil';
import PrediksiMasalahGigi from './components/prediksi/PrediksiMasalahGigi';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
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

      {/* Admin / Protected Routes */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/listpasien" element={<ListPasien />} />
        <Route path="/formpasien" element={<FormPasien />} />
        <Route path="/listdokter" element={<ListDokter />} />
        <Route path="/formdokter" element={<FormDokter />} />
        <Route path="/listlayanan" element={<ListLayanan />} />
        <Route path="/formlayanan" element={<FormLayanan />} />
        <Route path="/listprodukpasien" element={<ListProdukPasien />} />
        <Route path="/formprodukpasien" element={<FormProdukPasien />} />
        <Route path="/listtentangkami" element={<ListTentangKami />} />
        <Route path="/formtentangkami" element={<FormTentangKami />} />
        <Route path="/bookingform" element={<BookingForm />} />
        <Route path="/bookinglist" element={<BookingList />} />
        <Route path="/diskonform" element={<DiskonForm />} />
        <Route path="/diskonlist" element={<DiskonList />} />
        <Route path="/jadwaldokterform" element={<JadwalDokterForm />} />
        <Route path="/jadwaldokterlist" element={<JadwalDokter />} />
      </Route>
    </Routes>
  );
}

export default App;