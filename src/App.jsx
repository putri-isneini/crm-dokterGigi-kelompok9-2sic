import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import SalesManagement from './pages/SalesManagement';
import ProductManagement from './pages/Produk';
import Home from './components/Home';
import Booking from './pages/Booking';

function App() {
  return (
    <Routes>
      {/* Halaman Home tanpa layout */}
      <Route path="/" element={<Home />} />

      {/* Halaman lain dengan layout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<CustomerManagement />} />
        <Route path="/penjualan" element={<SalesManagement />} />
        <Route path="/produk" element={<ProductManagement />} />
        <Route path="/booking" element={<Booking />} />
      </Route>
    </Routes>
  );
}

export default App;
