import './App.css'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import Booking from './pages/Booking'
import JadwalPasien from './pages/JadwalPasien'
import Diskon from './pages/Diskon';
import ProdukPasien from './pages/ProdukPasien'

function App() {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      bookingCode: "BOOK-001",
      patientName: "Joko Gntg",
      date: "2025-06-25",
      time: "11:00",
      status: "Menunggu",
    },
    {
      id: 2,
      bookingCode: "BOOK-002",
      patientName: "Madara",
      date: "2025-06-17",
      time: "13:30",
      status: "Menunggu",
    },
    {
      id: 3,
      bookingCode: "BOOK-003",
      patientName: "Itachi",
      date: "2025-06-21",
      time: "10:00",
      status: "Menunggu",
    },
    {
      id: 4,
      bookingCode: "BOOK-004",
      patientName: "Yami-Sukehiro",
      date: "2025-06-27",
      time: "15:00",
      status: "Menunggu",
    },
    {
      id: 5,
      bookingCode: "BOOK-005",
      patientName: "Dazai",
      date: "2025-06-30",
      time: "13:30",
      status: "Menunggu",
    },
    {
      id: 6,
      bookingCode: "BOOK-006",
      patientName: "Minato",
      date: "2025-07-10",
      time: "14:30",
      status: "Menunggu",
    },
  ])

  // Fungsi update status booking
  const onStatusChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/booking"
          element={
            <Booking
              bookings={bookings}
              onStatusChange={onStatusChange}
            />
          }
        />
        <Route path="/jadwalpasien" element={<JadwalPasien bookings={bookings} />} />
        <Route path="/diskon-membership" element={<Diskon />} />
        <Route path="/produk-pasien" element={<ProdukPasien />} />
      </Route>
    </Routes>
  )
}

export default App
