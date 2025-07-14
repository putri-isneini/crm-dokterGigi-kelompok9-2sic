// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Calendar, Users, UserPlus } from 'lucide-react'; // Import ikon

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nama, setNama] = useState('');
    const [noHp, setNoHp] = useState('');
    const [alamat, setAlamat] = useState('');
    const [tanggalLahir, setTanggalLahir] = useState('');
    const [jenisKelamin, setJenisKelamin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            // 1. Daftar user di Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: 'Pasien' // Set role default di metadata Supabase Auth
                    }
                }
            });

            if (authError) {
                throw authError;
            }

            // 2. Jika pendaftaran auth berhasil, tambahkan detail pasien ke tabel pasien_user
            // PENTING: id di pasien_user sekarang adalah authData.user.id
            if (authData.user) {
                const { error: pasienError } = await supabase
                    .from('pasien_user')
                    .insert({
                        id: authData.user.id, // Gunakan ID dari Supabase Auth sebagai PK
                        email: authData.user.email, // Gunakan email dari Supabase Auth
                        nama,
                        no_hp: noHp,
                        alamat,
                        tanggal_lahir: tanggalLahir,
                        jenis_kelamin: jenisKelamin,
                        membership: 'Silver' // Default membership
                    });

                if (pasienError) {
                    console.error("Error inserting into pasien_user, attempting to delete auth user:", pasienError.message);
                    // Jika gagal menyimpan ke pasien_user, coba hapus user dari auth
                    // Perhatian: Menghapus user dari auth.users memerlukan service_role key atau RLS yang sangat spesifik
                    // Jika ini gagal, user akan terdaftar di auth.users tapi tidak di pasien_user
                    // const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(authData.user.id);
                    // if (deleteAuthError) {
                    //     console.error("Failed to delete auth user after pasien_user insert failure:", deleteAuthError.message);
                    // }
                    throw pasienError;
                }

                setMessage('Registrasi berhasil! Silakan login.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            console.error('Error during registration:', err.message);
            setError(err.message || 'Terjadi kesalahan saat registrasi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 py-16 bg-cover bg-center relative" // Menambah py-16 untuk mendorong ke bawah
            style={{
                backgroundImage: `url('/bg1.jpg')` // Path ke gambar di folder public
            }}
        >
            {/* Overlay untuk efek blur pada latar belakang dan warna pink transparan */}
            <div
                className="absolute inset-0"
                style={{
                    backdropFilter: 'blur(10px)', // Sesuaikan nilai blur sesuai keinginan
                    WebkitBackdropFilter: 'blur(10px)', // Untuk kompatibilitas browser
                    backgroundColor: 'rgba(255, 192, 203, 0.3)' // Overlay pink transparan (pink muda dengan opasitas 0.3)
                }}
            ></div>

            <div className="bg-white/70 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-pink-100 transform transition-all duration-300 hover:scale-[1.01] z-10"> {/* Mengubah max-w-lg menjadi max-w-2xl */}
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-pink-700 mb-2">Daftar Akun Baru</h2>
                    <p className="text-gray-600 text-lg">Isi data diri Anda untuk registrasi.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Nama Lengkap */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="nama">
                            Nama Lengkap
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                            <input
                                type="text"
                                id="nama"
                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Nama Lengkap Anda"
                                required
                            />
                        </div>
                    </div>
                    {/* Email */}
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
                    {/* Password */}
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
                    {/* No. HP */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="noHp">
                            No. HP
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                            <input
                                type="tel"
                                id="noHp"
                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                value={noHp}
                                onChange={(e) => setNoHp(e.target.value)}
                                placeholder="081234567890"
                                required
                            />
                        </div>
                    </div>
                    {/* Alamat */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="alamat">
                            Alamat
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-pink-400" size={20} /> {/* Top disesuaikan untuk textarea */}
                            <textarea
                                id="alamat"
                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 resize-y" // resize-y untuk resize vertikal
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                                placeholder="Alamat lengkap Anda"
                                rows="3" // Menambahkan baris default
                                required
                            />
                        </div>
                    </div>
                    {/* Tanggal Lahir */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="tanggalLahir">
                            Tanggal Lahir
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                            <input
                                type="date"
                                id="tanggalLahir"
                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                value={tanggalLahir}
                                onChange={(e) => setTanggalLahir(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {/* Jenis Kelamin */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="jenisKelamin">
                            Jenis Kelamin
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                            <select
                                id="jenisKelamin"
                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none" // appearance-none untuk kustomisasi panah select
                                value={jenisKelamin}
                                onChange={(e) => setJenisKelamin(e.target.value)}
                                required
                            >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                            {/* Panah kustom untuk select */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-200">
                            {error}
                        </p>
                    )}
                    {message && (
                        <p className="text-green-500 text-sm text-center bg-green-100 p-3 rounded-lg border border-green-200">
                            {message}
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
                                Mendaftar...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5 mr-2" /> Daftar
                            </>
                        )}
                    </button>

                    <div className="text-center mt-6">
                        <Link to="/login" className="font-semibold text-pink-600 hover:text-pink-800 transition-colors duration-200 text-base">
                            Sudah punya akun? Login di sini!
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
