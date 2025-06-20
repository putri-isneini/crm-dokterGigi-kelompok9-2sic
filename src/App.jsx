import './App.css';
import { Route, Routes } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';


import DataDokter from './pages/DataDokter';

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

      {/* Route dengan layout utama */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />

        {/* Pasien */}
        <Route path="/pasien" element={<Pasien />} />
        <Route path="/pasien/tambah" element={<TambahPasien />} />
        <Route path="/pasien/edit/:id" element={<EditPasien  />} />

        {/* Dokter */}
        <Route path="/datadokter" element={<DataDokter />} />

        {/* Riwayat Kunjungan */}
        <Route path="/riwayat" element={<RiwayatKunjungan />} />
        <Route path="/riwayat/tambah" element={<TambahRiwayat />} />
        <Route path="/riwayat/edit" element={<EditRiwayat />} />
      </Route>
    </Routes>
  );
}

export default App;
