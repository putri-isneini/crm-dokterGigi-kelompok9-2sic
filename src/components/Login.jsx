// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Mail, Lock, LogIn as LogInIcon } from 'lucide-react'; // Import ikon

const Login = ({ setIsLoggedIn, setUserRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                throw authError;
            }

            if (data.user) {
                let userRoleFromAuthMetadata = data.user.user_metadata?.role;
                let determinedUserRole = userRoleFromAuthMetadata;

                if (!determinedUserRole || determinedUserRole === 'user') {
                    console.warn("Login: Role not found in user_metadata or is 'user'. Attempting fallback lookup in database tables.");

                    const { data: pasienData, error: pasienError } = await supabase
                        .from("pasien_user")
                        .select("id")
                        .eq("id", data.user.id)
                        .single();

                    if (pasienData && !pasienError) {
                        determinedUserRole = "Pasien";
                    } else {
                        const { data: adminUserData, error: adminUserError } = await supabase
                            .from("admin_user")
                            .select("role")
                            .eq("email", data.user.email)
                            .single();

                        if (adminUserData && !adminUserError) {
                            determinedUserRole = adminUserData.role;
                        } else {
                            determinedUserRole = "Guest";
                            console.warn("Login: User role could not be determined from database. Defaulting to Guest.");
                        }
                    }
                } else {
                    console.log(`Login: Role found in user_metadata: ${determinedUserRole}`);
                }

                if (determinedUserRole) {
                    setIsLoggedIn(true);
                    setUserRole(determinedUserRole);
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userRole', determinedUserRole);

                    if (determinedUserRole === 'Pasien') {
                        localStorage.setItem('pasien_id', data.user.id);
                    } else {
                        localStorage.removeItem('pasien_id');
                    }

                    if (determinedUserRole === 'Pasien') {
                        navigate('/profil-pasien');
                    } else if (['Admin', 'Dokter', 'Staf'].includes(determinedUserRole)) {
                        navigate('/dashboard');
                    } else {
                        navigate('/');
                    }
                } else {
                    setError('Peran pengguna tidak ditemukan. Hubungi administrator.');
                    await supabase.auth.signOut();
                    setIsLoggedIn(false);
                    setUserRole(null);
                    localStorage.clear();
                }
            }
        } catch (err) {
            console.error('Error during login:', err.message);
            setError(err.message || 'Terjadi kesalahan saat login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative" // Tambahkan 'relative'
            style={{
                backgroundImage: `url('image/bg1.jpg')` // Path ke gambar di folder public
            }}
        >
            {/* Overlay untuk efek blur pada latar belakang dan warna pink transparan */}
            <div
                className="absolute inset-0"
                style={{
                    backdropFilter: 'blur(10px)', // Meningkatkan nilai blur
                    WebkitBackdropFilter: 'blur(10px)', // Untuk kompatibilitas browser
                    backgroundColor: 'rgba(255, 192, 203, 0.3)' // Overlay pink transparan (pink muda dengan opasitas 0.3)
                }}
            ></div>

            <div className="bg-white/70 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-pink-100 transform transition-all duration-300 hover:scale-[1.01] z-10"> {/* Tambahkan z-10 agar kartu di atas overlay */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-pink-700 mb-2">Selamat Datang!</h2>
                    <p className="text-gray-600 text-lg">Silakan login ke akun Anda.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                            <input
                                type="email"
                                id="email"
                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@contoh.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                            <input
                                type="password"
                                id="password"
                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-200">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memuat...
                            </>
                        ) : (
                            <>
                                <LogInIcon className="w-5 h-5 mr-2" /> Login
                            </>
                        )}
                    </button>

                    <div className="text-center mt-6">
                        <Link to="/registrasi" className="font-semibold text-pink-600 hover:text-pink-800 transition-colors duration-200 text-base">
                            Belum punya akun? Daftar di sini!
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
