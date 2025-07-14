// src/App.jsx
import './App.css';
import './index.css';
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Supabase client
import { supabase } from './supabase';

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
import BookingForm from './components/BookingForm'; // Admin Booking Form
import BookingList from './pages/BookingList'; // Admin Booking List
import DiskonForm from './pages/diskon/DiskonForm';
import DiskonList from './pages/diskon/DiskonList';
import JadwalDokterForm from './pages/jadwaldokter/JadwalDokterForm';
import JadwalDokterList from './pages/jadwaldokter/JadwalDokterList';
import AdminUser from './pages/admin/AdminUser';
import AdminUserForm from './pages/admin/AdminUserForm';
import Faq from './pages/faq/Faq';
import FaqForm from './pages/faq/FaqForm';
import HomeFaqSection from './pages/faq/HomeFaqSection';

// PrivateRoute Component untuk melindungi rute
const PrivateRoute = ({ children, allowedRoles, isLoggedIn, userRole }) => {
    const navigate = useNavigate();

    // 1. Jika belum login, selalu redirect ke login
    if (!isLoggedIn) {
        console.log("PrivateRoute: Not logged in. Redirecting to /login.");
        return <Navigate to="/login" replace />; // Menggunakan replace untuk menghindari masalah riwayat
    }

    // 2. Jika userRole masih null (belum ditentukan), tampilkan loading.
    // Ini penting agar tidak ada redirect prematur sebelum peran teridentifikasi sepenuhnya.
    if (userRole === null) {
        console.log("PrivateRoute: User role is null, waiting for role determination.");
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-pink-600 text-lg font-semibold animate-pulse">
                    Memuat peran pengguna...
                </div>
            </div>
        );
    }

    // 3. Pada titik ini, isLoggedIn adalah true dan userRole sudah ditentukan (bukan null).
    // Sekarang, lakukan pengecekan izin berdasarkan peran.

    // Jika userRole adalah 'Guest' (berarti tidak ada peran spesifik yang ditemukan di DB/metadata)
    // DAN rute ini membutuhkan peran tertentu (allowedRoles tidak kosong), maka tidak diizinkan.
    if (userRole === 'Guest' && allowedRoles && allowedRoles.length > 0) {
        console.log("PrivateRoute: User is 'Guest' but route requires specific roles. Redirecting to unauthorized.");
        return <Navigate to="/unauthorized" replace />;
    }

    // Jika allowedRoles secara eksplisit didefinisikan dan userRole TIDAK termasuk di dalamnya, redirect.
    // Pengecekan ini hanya berjalan jika userRole BUKAN null dan BUKAN 'Guest'.
    if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(userRole)) {
        console.log(`PrivateRoute: Role '${userRole}' not allowed for this route. Redirecting.`);
        if (userRole === 'Pasien') {
            return <Navigate to="/profil-pasien" replace />;
        }
        if (['Admin', 'Dokter', 'Staf'].includes(userRole)) {
            return <Navigate to="/dashboard" replace />;
        }
        return <Navigate to="/unauthorized" replace />;
    }

    // Jika semua pengecekan lolos, izinkan akses ke children
    console.log(`PrivateRoute: Access granted for role '${userRole}'`);
    return children;
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    // Fungsi untuk menentukan peran user dari database jika tidak ada di user_metadata
    const determineUserRoleFromDB = useCallback(async (userId, userEmail) => {
        console.log("App.jsx: Attempting to determine role from DB for user ID:", userId);

        // Cek di tabel 'pasien_user' (ID pasien_user sekarang adalah auth.uid())
        const { data: pasienData, error: pasienError } = await supabase
            .from("pasien_user")
            .select("id")
            .eq("id", userId) // Menggunakan 'id' karena sekarang id pasien_user = auth.uid()
            .single();

        if (pasienData && !pasienError) {
            console.log("App.jsx: Role determined from pasien_user: Pasien");
            return "Pasien";
        }

        // Cek di tabel 'admin_user'
        const { data: adminUserData, error: adminUserError } = await supabase
            .from("admin_user")
            .select("role")
            .eq("email", userEmail)
            .single();

        if (adminUserData && !adminUserError) {
            console.log("App.jsx: Role determined from admin_user:", adminUserData.role);
            return adminUserData.role;
        }

        console.warn("App.jsx: User role could not be determined from database. Defaulting to Guest.");
        return "Guest";
    }, []);

    // Fungsi untuk menangani logout
    const handleLogout = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
            alert('Gagal logout: ' + error.message);
        } else {
            setIsLoggedIn(false);
            setUserRole(null);
            localStorage.clear(); // Bersihkan semua item di localStorage hanya saat logout eksplisit
            navigate('/', { replace: true }); // Arahkan ke halaman beranda setelah logout
            alert('Anda telah berhasil logout.');
        }
    }, [navigate]);

    // useEffect untuk inisialisasi status login dan peran user saat aplikasi dimuat
    useEffect(() => {
        const checkUserSessionAndRole = async () => {
            console.log("App.jsx: checkUserSessionAndRole running...");
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error("App.jsx: Error getting session:", error.message);
                    setIsLoggedIn(false);
                    setUserRole(null);
                } else if (session) {
                    setIsLoggedIn(true);
                    let currentRole = session.user?.user_metadata?.role;
                    if (!currentRole || currentRole === 'user') { 
                        console.log("App.jsx: Role not in user_metadata or is 'user', checking DB...");
                        currentRole = await determineUserRoleFromDB(session.user.id, session.user.email);
                    } else {
                        console.log(`App.jsx: Role found in user_metadata: ${currentRole}`);
                    }
                    
                    setUserRole(currentRole);

                    if (currentRole === 'Pasien') {
                        localStorage.setItem('pasien_id', session.user.id); 
                    } else {
                        localStorage.removeItem('pasien_id');
                    }
                    console.log(`App.jsx: Session found. User is logged in. Final Role: ${currentRole}`);
                } else {
                    console.log("App.jsx: No session found. User is logged out.");
                    setIsLoggedIn(false);
                    setUserRole(null);
                }
            } catch (e) {
                console.error("App.jsx: Unexpected error in checkUserSessionAndRole:", e);
                setIsLoggedIn(false);
                setUserRole(null);
            }
        };

        checkUserSessionAndRole();

        // Listener untuk perubahan autentikasi (login/logout)
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('App.jsx: Auth state changed:', event, session);
                if (event === 'SIGNED_IN') {
                    setIsLoggedIn(true);
                    let currentRole = session?.user?.user_metadata?.role;
                    if (!currentRole || currentRole === 'user') { 
                        console.log("App.jsx: Role not in user_metadata or is 'user' during SIGNED_IN, checking DB...");
                        currentRole = await determineUserRoleFromDB(session.user.id, session.user.email);
                    } else {
                         console.log(`App.jsx: Role found in user_metadata during SIGNED_IN: ${currentRole}`);
                    }
                    setUserRole(currentRole);

                    if (currentRole === 'Pasien') {
                        localStorage.setItem('pasien_id', session.user.id);
                    } else {
                        localStorage.removeItem('pasien_id');
                    }
                    console.log(`App.jsx: User SIGNED_IN. Final Role: ${currentRole}`);

                } else if (event === 'SIGNED_OUT') {
                    console.log("App.jsx: User SIGNED_OUT.");
                    setIsLoggedIn(false);
                    setUserRole(null);
                    localStorage.clear(); 

                    setTimeout(() => {
                        navigate('/');
                    }, 100);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate, determineUserRoleFromDB]);

    const currentUserRole = userRole;

    return (
        <Routes>
            {/* Rute tanpa layout (login dan registrasi) */}
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
            <Route path="/registrasi" element={<RegisterForm />} />

            {/* Rute Publik dengan PublicLayout (Header/Footer untuk umum) */}
            <Route
                element={
                    <PublicLayout
                        isLoggedIn={isLoggedIn}
                        userRole={currentUserRole}
                        setIsLoggedIn={setIsLoggedIn}
                        setUserRole={setUserRole}
                        handleLogout={handleLogout}
                    />
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/tentang" element={<TentangKami />} />
                <Route path="/layanan" element={<LayananKami />} />
                <Route path="/produk" element={<Produk />} />
                <Route path="/testimoni" element={<Testimoni />} />
                <Route path="/faq" element={<HomeFaqSection />} />
                <Route path="/kontak" element={<Kontak />} />
                <Route path="/prediksi" element={<PrediksiMasalahGigi />} />
                <Route path="/feedback-testimoni" element={<TestimoniSection />} />

                {/* Rute khusus Pasien (dilindungi PrivateRoute) */}
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
                            <HalamanProfil setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
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
            </Route>

            {/* Rute Admin/Dokter/Staf dengan MainLayout (Sidebar/Dashboard Layout) */}
            <Route
                element={
                    <PrivateRoute allowedRoles={['Admin', 'Dokter', 'Staf']} isLoggedIn={isLoggedIn} userRole={currentUserRole}>
                        <MainLayout
                            isLoggedIn={isLoggedIn}
                            userRole={currentUserRole}
                            setIsLoggedIn={setIsLoggedIn}
                            setUserRole={setUserRole}
                        />
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

                {/* Rute Booking untuk Admin */}
                <Route path="/add-booking" element={<BookingForm />} />
                <Route path="/edit-booking/:id" element={<BookingForm />} />
                <Route path="/bookinglist" element={<BookingList />} />

                <Route path="/diskonform" element={<DiskonForm />} />
                <Route path="/diskonlist" element={<DiskonList />} />
                <Route path="/jadwaldokterform" element={<JadwalDokterForm />} />
                <Route path="/jadwaldokterlist" element={<JadwalDokterList />} />
                <Route path="/faq/list" element={<Faq />} />
                <Route path="/faq/tambah" element={<FaqForm />} />
                <Route path="/admin/list" element={<AdminUser />} />
                <Route path="/admin/tambah" element={<AdminUserForm />} />
            </Route>

            {/* Rute default atau halaman 404/Unauthorized */}
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

            {/* Catch-all route untuk URL yang tidak cocok, redirect sesuai status login/role */}
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
        </Routes>
    );
}

export default App;
