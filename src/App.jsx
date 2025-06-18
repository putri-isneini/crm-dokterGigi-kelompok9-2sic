import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import Pasien from './pages/pasien'
import Login from './components/Login'
import DataDokter from './pages/DataDokter'
import RiwayatKunjungan from './pages/riwayatkunjungan/RiwayatKunjungan'
import TambahRiwayat from './pages/riwayatkunjungan/TambahRiwayat'
import EditRiwayat from './pages/riwayatkunjungan/EditRiwayat'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pasien" element={<Pasien />} />
        <Route path="/riwayat" element={<RiwayatKunjungan />} />
        <Route path="/datadokter" element={<DataDokter />} />

        <Route path="/riwayat-kunjungan" element={<RiwayatKunjungan />} />
        <Route path="/riwayat-kunjungan/tambah" element={<TambahRiwayat />} />
        <Route path="/riwayat-kunjungan/edit/:id" element={<EditRiwayat />} />
      </Route>
    </Routes>
  )
}

export default App
