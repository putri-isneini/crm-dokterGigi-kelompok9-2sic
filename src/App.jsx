

import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import ProductManagement from './pages/Produk'
import Booking from './pages/Booking'

function App() {

  return (
    <Routes>
      <Route element={<MainLayout/>} >
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/produk" element={<ProductManagement/>}/>
      <Route path="/booking" element={<Booking/>}/>
    </Route>
    </Routes>
  )
}

export default App
