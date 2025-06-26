import './App.css'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import DiskonForm from './pages/DiskonForm'
import BookingForm from './pages/BookingForm'
import JadwalDokter from './pages/JadwalDokterList'
import JadwalDokterForm from './pages/JadwalDokterForm'
import BookingList from './pages/BookingList'
import DiskonList from './pages/DiskonList'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/diskonform" element={<DiskonForm />} />
        <Route path="/diskonlist" element={<DiskonList/>} />
        <Route path="/bookingform" element={<BookingForm />} />
        <Route path="/bookinglist" element={<BookingList/>} />
        <Route path="/Jadwaldokterform" element={<JadwalDokterForm />} />
        <Route path="/Jadwaldokterlist" element={<JadwalDokter/>} />
      </Route>
    </Routes>
  )
}

export default App
