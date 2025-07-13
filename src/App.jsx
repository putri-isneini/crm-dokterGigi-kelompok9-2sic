// src/App.js
import './App.css';
import './index.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Layout Components
import MainLayout from './components/MainLayout';
import PublicLayout from './components/PublicLayout';

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
import FormBooking from './components/FormBooking';
import HalamanProfil from './components/HalamanProfil';
import FeedbackForm from './components/FeedbackForm';
import TestimoniSection from './components/TestimoniSection';

// Admin/Dokter/Staf Dashboard & Management Pages
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
import BookingFormAdmin from './components/BookingForm';
import BookingList from './pages/BookingList';
import DiskonForm from './pages/diskon/DiskonForm';
import DiskonList from './pages/diskon/DiskonList';
import JadwalDokterForm from './pages/jadwaldokter/JadwalDokterForm';
import JadwalDokter from './pages/jadwaldokter/JadwalDokterList';
import AdminUser from './pages/admin/AdminUser';
import AdminUserForm from './pages/admin/AdminUserForm';
import Faq from './pages/faq/Faq';
import FaqForm from './pages/faq/FaqForm';

import { supabase } from './supabase';

const PrivateRoute = ({ children, allowedRoles, isLoggedIn, userRole }) => {
  const navigate = useNavigate();
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'Pasien') return <Navigate to="/profil-pasien" />;
    if (['Admin', 'Dokter', 'Staf'].includes(userRole)) return <Navigate to="/dashboard" />;
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const navigate = useNavigate(); // ✅ Tambahkan ini

  useEffect(() => {
    const getSessionAndRole = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          setIsLoggedIn(false);
          setUserRole(null);
          localStorage.clear();
        } else if (session) {
          setIsLoggedIn(true);
          const role = session.user?.user_metadata?.role || 'Pasien';
          setUserRole(role);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', role);

          if (role === 'Pasien') {
            const { data: pasienData, error: pasienError } = await supabase
              .from('pasien_user')
              .select('id')
              .eq('supabase_auth_id', session.user.id)
              .single();
            if (!pasienError && pasienData) {
              localStorage.setItem('pasien_id', pasienData.id);
            } else {
              localStorage.removeItem('pasien_id');
            }
          } else {
            localStorage.removeItem('pasien_id');
          }
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
          localStorage.clear();
        }
      } catch (e) {
        setIsLoggedIn(false);
        setUserRole(null);
        localStorage.clear();
      }
    };

    getSessionAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setIsLoggedIn(true);
          const role = session?.user?.user_metadata?.role || 'Pasien';
          setUserRole(role);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', role);

          if (role === 'Pasien') {
            const { data: pasienData, error: pasienError } = await supabase
              .from('pasien_user')
              .select('id')
              .eq('supabase_auth_id', session.user.id)
              .single();
            if (!pasienError && pasienData) {
              localStorage.setItem('pasien_id', pasienData.id);
            } else {
              localStorage.removeItem('pasien_id');
            }
          } else {
            localStorage.removeItem('pasien_id');
          }
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setUserRole(null);
          localStorage.clear();

          // ✅ Redirect ke home (bukan ke /login)
          setTimeout(() => {
            navigate('/');
          }, 100);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const currentUserRole = userRole;

  return (
    <Routes>
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/registrasi" element={<RegisterForm />} />

      <Route element={<PublicLayout isLoggedIn={isLoggedIn} userRole={currentUserRole} />}>
        <Route path="/" element={<Home />} />
        <Route path="/tentang" element={<TentangKami />} />
        <Route path="/layanan" element={<LayananKami />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/testimoni" element={<Testimoni />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/prediksi" element={<PrediksiMasalahGigi />} />
        <Route path="/feedback-testimoni" element={<TestimoniSection />} />
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
          path="/feedback/:bookingId"
          element={
            <PrivateRoute allowedRoles={['Pasien']} isLoggedIn={isLoggedIn} userRole={currentUserRole}>
              <FeedbackForm />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            isLoggedIn ? (
              currentUserRole === 'Pasien' ? (
                <Navigate to="/profil-pasien" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Route>

      <Route
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
        <Route path="/bookingform" element={<BookingFormAdmin />} />
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
              onClick={() => navigate('/')}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
