import './App.css';
import { Route, Routes } from 'react-router-dom';

// Layout
import MainLayout from './components/MainLayout';

// Auth
import Login from './components/Login';
import RegisterForm from './components/RegisterForm';
import BookingForm from './components/BookingForm';

// Dashboard
import Dashboard from './pages/Dashboard';

// Pasien
import Pasien from './pages/pasien/pasien';
import TambahPasien from './pages/pasien/TambahPasien';
import EditPasien from './pages/pasien/EditPasien';

// Dokter
import DataDokter from './pages/DataDokter';

// FAQ
import Faq from './pages/faq/Faq';
import FaqForm from './pages/faq/FaqForm';

// Admin
import AdminUser from './pages/admin/AdminUser';
import AdminUserForm from './pages/admin/AdminUserForm';

// Riwayat Kunjungan
import RiwayatKunjungan from './pages/riwayatkunjungan/RiwayatKunjungan';
import TambahRiwayat from './pages/riwayatkunjungan/TambahRiwayat';
import EditRiwayat from './pages/riwayatkunjungan/EditRiwayat';

function App() {
  return (
    <Routes>
      {/* Tanpa Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/bookingpasien" element={<BookingForm />} />

      {/* Dengan Layout Utama */}
      <Route element={<MainLayout />}>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Pasien */}
        <Route path="/pasien" element={<Pasien />} />
        <Route path="/pasien/tambah" element={<TambahPasien />} />
        <Route path="/pasien/edit/:id" element={<EditPasien />} />

        {/* Dokter */}
        <Route path="/datadokter" element={<DataDokter />} />

        {/* FAQ */}
        <Route path="/faq/list" element={<Faq />} />
        <Route path="/faq/form" element={<FaqForm />} /> {/* Optional: hapus jika tidak dipakai */}

        {/* Admin */}
        <Route path="/admin/list" element={<AdminUser />} />
        <Route path="/admin/form" element={<AdminUserForm />} /> {/* Optional */}

        {/* Riwayat Kunjungan */}
        <Route path="/riwayat" element={<RiwayatKunjungan />} />
        <Route path="/riwayat/tambah" element={<TambahRiwayat />} />
        <Route path="/riwayat/edit" element={<EditRiwayat />} />
      </Route>
    </Routes>
  );
}

export default App;
