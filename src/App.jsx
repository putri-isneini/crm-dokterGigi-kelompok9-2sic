import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Pasien from './pages/pasien/pasien';
import Login from './components/Login';
import RiwayatKunjungan from './pages/RiwayatKunjungan';
import DataDokter from './pages/DataDokter';
import PasienForm from './components/PasienForm';
import TambahPasien from './pages/pasien/TambahPasien';
import EditPasien from './pages/pasien/EditPasien';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pasien" element={<Pasien />} />
        <Route path="/pasien/tambah" element={<TambahPasien />} />
        <Route path="/pasien/edit/:id" element={<EditPasien />} />
        <Route path="/formpasien" element={<PasienForm />} />
        <Route path="/riwayat" element={<RiwayatKunjungan />} />
        <Route path="/datadokter" element={<DataDokter />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
