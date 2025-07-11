import './App.css';
import './index.css';
import React, { useState, useEffect } from 'react'; // Tambahkan React dan useEffect
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Tambahkan useNavigate

import MainLayout from './components/MainLayout';
import PublicLayout from './components/PublicLayout';

import Home from './components/Home';
import Login from './components/Login';
import LayananKami from './components/LayananKami';
import Kontak from './components/Kontak';
import Produk from './components/Produk';
import Testimoni from './components/Testimoni';
import TentangKami from './components/tentangkami/TentangKami';
import FormBooking from './components/FormBooking';
import HalamanProfil from './components/HalamanProfil';
import PrediksiMasalahGigi from './components/prediksi/PrediksiMasalahGigi';

import Dashboard from './pages/Dashboard';
import ListPasien from './pages/pasien/ListPasien';
import FormPasien from './pages/pasien/FormPasien';
import ListDokter from './pages/dokter/ListDokter';
import FormDokter from './pages/dokter/FormDokter';
import ListLayanan from './pages/layanan/ListLayanan';
import FormLayanan from './pages/layanan/FormLayanan';
import ListProdukPasien from './pages/produk/ListProdukPasien';
import FormProdukPasien from './pages/produk/FormProdukPasien';
import ListTentangKami from './components/tentangkami/ListTentangKami';
import FormTentangKami from './components/tentangkami/FormTentangKami';
import BookingForm from './components/BookingForm'; // Perhatikan, ini BookingForm yang beda dengan FormBooking
import BookingList from './pages/BookingList';
import DiskonForm from './pages/DiskonForm';
import DiskonList from './pages/DiskonList';
import JadwalDokterForm from './pages/JadwalDokterForm';
import JadwalDokter from './pages/JadwalDokterList';
import AdminUser from './pages/admin/AdminUser';
import AdminUserForm from './pages/admin/AdminUserForm';
import Faq from './pages/faq/Faq';
import FaqForm from './pages/faq/FaqForm';
import RegisterForm from './components/RegisterForm';
import LoginPasien from './components/LoginPasien';

import { supabase } from './supabase'; // Pastikan path ini benar!

// --- Komponen PrivateRoute yang Disesuaikan ---
const PrivateRoute = ({ children, allowedRoles }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate(); // Gunakan useNavigate untuk redirect

  // Jika belum login, redirect ke halaman login utama
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Jika user tidak memiliki role yang diizinkan untuk rute ini
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Arahkan ke dashboard yang sesuai berdasarkan role yang dimiliki
    if (userRole === 'Pasien') {
      return <Navigate to="/profil-pasien" />; // Arahkan pasien ke halaman profil pasien atau home pasien
    } else {
      // Jika bukan pasien (misal Admin, Dokter, Staf) tapi mencoba akses rute pasien
      // atau mencoba akses rute admin tapi tidak diizinkan
      return <Navigate to="/dashboard" />; // Arahkan ke dashboard admin/dokter/staf
    }
  }

  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default false
  const [loading, setLoading] = useState(true); // Untuk menunjukkan loading saat cek sesi

  useEffect(() => {
    // Fungsi untuk memeriksa status login dari Supabase
    const checkLoginStatus = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
        // Ambil role dari session user_metadata
        const userRole = session.user?.user_metadata?.role || 'Pasien'; // Default 'Pasien' jika tidak ada role
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('isLoggedIn', 'true'); // Pastikan isLoggedIn juga di-set di localStorage

        // Jika user adalah pasien, ambil pasien_id dari tabel `pasien_user`
        if (userRole === 'Pasien') {
          const { data: pasienData, error: pasienError } = await supabase
            .from('pasien_user')
            .select('id')
            .eq('supabase_auth_id', session.user.id)
            .single();

          if (!pasienError && pasienData) {
            localStorage.setItem('pasien_id', pasienData.id);
          } else if (pasienError && pasienError.code === 'PGRST116') {
            // Error code for no rows found (Pasien belum melengkapi profil)
            console.warn("Pasien user not found in 'pasien_user' table. User might need to complete profile.");
            // Anda bisa tambahkan redirect ke halaman profil lengkap di sini jika diperlukan
          } else {
            console.error("Error fetching pasien_id:", pasienError.message);
          }
        }
      } else {
        // Jika tidak ada sesi, reset semua status
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('pasien_id');
      }
      setLoading(false); // Selesai loading
    };

    checkLoginStatus();

    // Listener untuk perubahan status otentikasi (misalnya saat login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setIsLoggedIn(true);
          const userRole = session?.user?.user_metadata?.role || 'Pasien';
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('isLoggedIn', 'true');

          if (userRole === 'Pasien') {
            const { data: pasienData, error: pasienError } = await supabase
              .from('pasien_user')
              .select('id')
              .eq('supabase_auth_id', session.user.id)
              .single();
            if (!pasienError && pasienData) {
              localStorage.setItem('pasien_id', pasienData.id);
            } else if (pasienError && pasienError.code === 'PGRST116') {
              // Jika pasien_user tidak ditemukan setelah SIGNED_IN
              console.warn("Pasien user not found in 'pasien_user' table after sign in.");
              // Opsional: redirect ke halaman lengkapi profil di sini
              // navigate('/profil-pasien-lengkap'); // Misalnya
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userRole');
          localStorage.removeItem('pasien_id');
        }
      }
    );

    // Cleanup listener saat komponen unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // [] agar hanya berjalan sekali saat mount

  // Tampilkan loading screen saat pertama kali memuat aplikasi
  if (loading) {
    return <div>Loading aplikasi...</div>;
  }

  const userRole = localStorage.getItem('userRole'); // Ambil role setelah loading selesai

  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/register" element={<RegisterForm />} />
      {/* LoginPasien bisa digabung dengan Login. Sesuaikan jika perlu */}
      <Route path="/login-pasien" element={<LoginPasien setIsLoggedIn={setIsLoggedIn} />} /> 

      {/* PUBLIC ROUTES (Akses tanpa login, atau untuk pasien) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tentang" element={<TentangKami />} />
        <Route path="/layanan" element={<LayananKami />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/testimoni" element={<Testimoni />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/prediksi" element={<PrediksiMasalahGigi />} />
        
        {/* Rute khusus Pasien yang tetap di PublicLayout tapi perlu dilindungi */}
        <Route
          path="/booking"
          element={
            <PrivateRoute allowedRoles={['Pasien']}>
              <FormBooking />
            </PrivateRoute>
          }
        />
        <Route
          path="/profil-pasien"
          element={
            <PrivateRoute allowedRoles={['Pasien']}>
              <HalamanProfil />
            </PrivateRoute>
          }
        />
        {/* Jika Anda punya halaman khusus pasien setelah register untuk melengkapi data */}
        {/* <Route
          path="/profil-pasien-lengkap"
          element={
            <PrivateRoute allowedRoles={['Pasien']}>
              <ProfilPasienLengkap />
            </PrivateRoute>
          }
        /> */}

        {/* Redirect default untuk user yang sudah login ke halaman yang sesuai */}
        <Route
          path="*"
          element={
            isLoggedIn ? (
              userRole === 'Pasien' ? (
                <Navigate to="/profil-pasien" /> // Atau /home-pasien jika ada
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Navigate to="/login" /> // Jika belum login, selalu ke /login
            )
          }
        />
      </Route>

      {/* PRIVATE ROUTES (ADMIN/DOKTER/STAF) */}
      {/* Semua rute di bawah MainLayout sekarang dilindungi dan dicek rolenya */}
      <Route
        element={
          <PrivateRoute allowedRoles={['Admin', 'Dokter', 'Staf']}>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/listpasien" element={<ListPasien />} />
        <Route path="/formpasien" element={<FormPasien />} />
        <Route path="/listdokter" element={<ListDokter />} />
        <Route path="/formdokter" element={<FormDokter />} />
        <Route path="/listlayanan" element={<ListLayanan />} />
        <Route path="/formlayanan" element={<FormLayanan />} />
        <Route path="/listprodukpasien" element={<ListProdukPasien />} />
        <Route path="/formprodukpasien" element={<FormProdukPasien />} />
        <Route path="/listtentangkami" element={<ListTentangKami />} />
        <Route path="/formtentangkami" element={<FormTentangKami />} />
        <Route path="/bookingform" element={<BookingForm />} />
        <Route path="/bookinglist" element={<BookingList />} />
        <Route path="/diskonform" element={<DiskonForm />} />
        <Route path="/diskonlist" element={<DiskonList />} />
        <Route path="/jadwaldokterform" element={<JadwalDokterForm />} />
        <Route path="/jadwaldokterlist" element={<JadwalDokter />} />
        <Route path="/faq/list" element={<Faq />} />
        <Route path="/faq/tambah" element={<FaqForm />} />
        <Route path="/admin/list" element={<AdminUser />} />
        <Route path="/admin/tambah" element={<AdminUserForm />} />
      </Route>

      {/* UNAUTHORIZED ACCESS */}
      <Route path="/unauthorized" element={<div><h1>401 - Unauthorized Access</h1><p>Anda tidak memiliki izin untuk mengakses halaman ini.</p></div>} />
    </Routes>
  );
}

export default App;