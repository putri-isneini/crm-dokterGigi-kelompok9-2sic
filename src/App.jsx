<<<<<<< HEAD
import './App.css';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import SalesManagement from './pages/SalesManagement';
import ProductManagement from './pages/Produk';
import Home from './components/Home'; // Jika ini halaman utama tanpa layout
=======


import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Dashboard from './pages/Dashboard'
import CustomerManagement from './pages/CustomerManagement'
import SalesManagement from './pages/SalesManagement'
import ProductManagement from './pages/Produk'
import Booking from './pages/Booking'
>>>>>>> faa6f093c8b5790a38b97a2f734df9a217e8bf38

function App() {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/" element={<Home />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pelanggan" element={<CustomerManagement />} />
        <Route path="/penjualan" element={<SalesManagement />} />
        <Route path="/produk" element={<ProductManagement />} />
      </Route>
=======
      <Route element={<MainLayout/>} >
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/pelanggan" element={<CustomerManagement/>}/>
      <Route path="/penjualan" element={<SalesManagement/>}/>
      <Route path="/produk" element={<ProductManagement/>}/>
      <Route path="/booking" element={<Booking/>}/>
    </Route>
>>>>>>> faa6f093c8b5790a38b97a2f734df9a217e8bf38
    </Routes>
  );
}

export default App;
