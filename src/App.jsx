// src/App.js
import './App.css';
import './index.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Layout Components
import MainLayout from './components/MainLayout'; // Layout untuk halaman admin/dokter/staf
import PublicLayout from './components/PublicLayout'; // Layout untuk halaman publik dan pasien

// Authentication Components
import Login from './components/Login';
import RegisterForm from './components/RegisterForm';

// Public & Patient-Specific Components
import Home from './components/Home';
import LayananKami from './components/LayananKami';
import Kontak from './components/Kontak';
import Produk from './components/Produk';
import Testimoni from './components/Testimoni';
import TentangKami from './components/tentangkami/TentangKami';
import PrediksiMasalahGigi from './components/prediksi/PrediksiMasalahGigi';
import FormBooking from './components/FormBooking'; // Form booking yang digunakan pasien
import HalamanProfil from './components/HalamanProfil'; // Profil pasien, sekarang juga berfungsi sebagai home pasien

// Admin/Dokter/Staf Dashboard & Management Pages
import Dashboard from './pages/Dashboard'; // Menggunakan satu Dashboard untuk admin/dokter/staf
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
import BookingForm from './components/BookingForm'; // Perhatikan: ini mungkin form booking untuk admin
import BookingList from './pages/BookingList';
import DiskonForm from './pages/diskon/DiskonForm';
import DiskonList from './pages/diskon/DiskonList';
import JadwalDokterForm from './pages/jadwaldokter/JadwalDokterForm';
import JadwalDokter from './pages/jadwaldokter/JadwalDokterList';
import AdminUser from './pages/admin/AdminUser';
import AdminUserForm from './pages/admin/AdminUserForm';
import Faq from './pages/faq/Faq';
import FaqForm from './pages/faq/FaqForm';

import { supabase } from './supabase'; // Pastikan path ini benar!

// --- Komponen PrivateRoute yang Disesuaikan untuk Role-Based Access ---
const PrivateRoute = ({ children, allowedRoles, isLoggedIn, userRole }) => {
  const navigate = useNavigate();

  if (!isLoggedIn) {
    console.log("PrivateRoute: Not logged in, redirecting to /login");
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log(`PrivateRoute: User role "${userRole}" not allowed for this route. Allowed: ${allowedRoles.join(', ')}`);
    if (userRole === 'Pasien') {
      return <Navigate to="/profil-pasien" />; // Tetap ke profil pasien
    } else if (['Admin', 'Dokter', 'Staf'].includes(userRole)) {
      return <Navigate to="/dashboard" />;
    }
    return <Navigate to="/unauthorized" />;
  }
  console.log(`PrivateRoute: User role "${userRole}" allowed. Rendering children.`);
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App.js useEffect: Setting up auth listener...");
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event, "Session:", session);
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          console.log(`Auth Listener: ${event} event. Updating states...`);
          setIsLoggedIn(true);
          const role = session?.user?.user_metadata?.role || 'Pasien';
          setUserRole(role);
          localStorage.setItem('userRole', role);
          localStorage.setItem('isLoggedIn', 'true');
          console.log(`Auth Listener: User logged in. Role: ${role}`);

          if (role === 'Pasien') {
            console.log("Auth Listener: Fetching pasien_id for Pasien role...");
            try {
              // MENGGUNAKAN TABEL 'pasien_user' dan KOLOM 'supabase_auth_id'
              const { data: pasienData, error: pasienError } = await supabase
                .from('pasien_user') 
                .select('id')
                .eq('supabase_auth_id', session.user.id) 
                .single();

              if (!pasienError && pasienData) {
                localStorage.setItem('pasien_id', pasienData.id);
                console.log("Auth Listener: pasien_id found and set for Pasien.");
              } else if (pasienError && pasienError.code === 'PGRST116') {
                console.warn("Auth Listener: Pasien user not found in 'pasien_user' table after sign in. Ini akan ditangani oleh HalamanProfil.");
                localStorage.removeItem('pasien_id');
                // TIDAK ADA REDIRECT DI SINI. HalamanProfil akan menangani status profil.
              } else {
                console.error("Auth Listener: Error fetching pasien_id:", pasienError?.message);
                localStorage.removeItem('pasien_id');
              }
            } catch (e) {
              console.error("Auth Listener: Unexpected error fetching pasien_id:", e);
              localStorage.removeItem('pasien_id');
            }
          } else {
            localStorage.removeItem('pasien_id');
            console.log("Auth Listener: Not Pasien role, pasien_id removed.");
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("Auth Listener: SIGNED_OUT event detected. Resetting states and localStorage...");
          setIsLoggedIn(false);
          setUserRole(null);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userRole');
          localStorage.removeItem('pasien_id');
        }
        setLoading(false);
        console.log("Auth Listener: setLoading(false) called.");
      }
    );

    return () => {
      console.log("App.js useEffect cleanup: Unsubscribing auth listener.");
      authListener.subscription.unsubscribe();
    };
  }, []);

  const currentUserRole = userRole; 
  console.log(`App.js: Rendering main app. isLoggedIn: ${isLoggedIn}, userRole: ${currentUserRole}`);

  return (
    <Routes>
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/registrasi" element={<RegisterForm />} />
      {/* Rute /profil-pasien-lengkap dihapus, karena HalamanProfil akan menangani semuanya */}

      <Route key={isLoggedIn ? "logged-in-public" : "logged-out-public"} element={<PublicLayout isLoggedIn={isLoggedIn} userRole={currentUserRole} />}>
        <Route path="/" element={<Home />} />
        <Route path="/tentang" element={<TentangKami />} />
        <Route path="/layanan" element={<LayananKami />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/testimoni" element={<Testimoni />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/prediksi" element={<PrediksiMasalahGigi />} />

        <Route
          path="/booking"
          element={
            <PrivateRoute allowedRoles={['Pasien']} isLoggedIn={isLoggedIn} userRole={currentUserRole}>
              <FormBooking />
            </PrivateRoute>
          }
        />
        <Route
          path="/profil-pasien"
          element={
            <PrivateRoute allowedRoles={['Pasien']} isLoggedIn={isLoggedIn} userRole={currentUserRole}>
              <HalamanProfil />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            isLoggedIn ? (
              currentUserRole === 'Pasien' ? (
                <Navigate to="/profil-pasien" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Route>

      <Route
        key={isLoggedIn ? "logged-in-main" : "logged-out-main"}
        element={
          <PrivateRoute allowedRoles={['Admin', 'Dokter', 'Staf']} isLoggedIn={isLoggedIn} userRole={currentUserRole}>
            <MainLayout isLoggedIn={isLoggedIn} userRole={currentUserRole} />
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

      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center bg-red-100 text-red-800">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4">401 - Akses Tidak Sah</h1>
            <p className="text-lg">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
