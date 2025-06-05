import './App.css';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import Home from './components/Home';
import Booking from './pages/Booking';
import { Route, Routes } from 'react-router-dom';
import Pasien from './pages/Pasien';
import RiwayatKunjungan from './pages/RiwayatKunjungan';
import JadwalPasien from './pages/JadwalPasien';

function App() {
  return (
    <Routes>
      {/* Halaman Home tanpa layout */}
      <Route path="/" element={<Home />} />

      {/* Semua halaman ini menggunakan MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<CustomerManagement />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/pasien" element={<Pasien />} />
        <Route path="/riwayat" element={<RiwayatKunjungan />} />
        <Route path="/jadwalpasien" element={<JadwalPasien />} />
      </Route>
    </Routes>
  );
}

export default App;
