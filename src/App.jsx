import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import Booking from './pages/Booking'
import JadwalPasien from './pages/JadwalPasien'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout/>} >
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/booking" element={<Booking/>}/>
      <Route path="/jadwal" element={<JadwalPasien/>}/>
    </Route>
    </Routes>
  )
}

export default App
