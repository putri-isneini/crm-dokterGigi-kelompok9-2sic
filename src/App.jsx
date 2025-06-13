import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import Pasien from './pages/pasien'
import Login from './components/Login'
import RiwayatKunjungan from './pages/RiwayatKunjungan'  

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pasien" element={<Pasien />} />
        <Route path="/riwayat" element={<RiwayatKunjungan />} />
      </Route>
    </Routes>
  )
}

export default App
