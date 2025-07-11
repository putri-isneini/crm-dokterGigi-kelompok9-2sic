import React, { useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path ini benar
import { useNavigate } from 'react-router-dom';
// import bcrypt from 'bcryptjs'; // Tidak diperlukan jika tidak hashing password di frontend

const Auth = ({ setIsLoggedIn }) => {
  const [isLoginView, setIsLoginView] = useState(true); // State untuk beralih antara login/register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState(''); // Untuk register pasien
  const [noTelepon, setNoTelepon] = useState(''); // Untuk register pasien
  const navigate = useNavigate();

  // Fungsi untuk menangani Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Login gagal: ' + error.message);
        return;
      }

      // Ambil session user untuk mendapatkan user_metadata
      const { data: userSession, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        alert('Gagal mendapatkan sesi user: ' + sessionError.message);
        return;
      }

      const user = userSession.session?.user;
      if (!user) {
        alert('Sesi pengguna tidak ditemukan.');
        return;
      }

      const userRole = user.user_metadata?.role; // Ambil role dari user_metadata

      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);

      if (userRole === 'Admin' || userRole === 'Dokter' || userRole === 'Staf') {
        // Jika admin/dokter/staf, arahkan ke dashboard admin
        navigate('/dashboard'); // Menggunakan /dashboard sesuai App.jsx
        localStorage.setItem('userRole', userRole); // Simpan role
      } else {
        // Jika pasien, arahkan ke halaman profil pasien
        // Pastikan pasien_id disimpan untuk halaman booking/profil
        const { data: pasienData, error: pasienError } = await supabase
          .from('pasien_user')
          .select('id')
          .eq('supabase_auth_id', user.id)
          .single();

        if (pasienError || !pasienData) {
          // Jika data pasien tidak ditemukan di tabel pasien_user,
          // ini berarti user baru register dan belum melengkapi profil mereka.
          // Kita tidak perlu alert atau redirect ke halaman "lengkapi profil" terpisah.
          // Halaman ProfilPasien (HalamanProfil.jsx) akan menangani tampilan data yang belum lengkap.
          console.warn('Data pasien tidak ditemukan di tabel pasien_user. User mungkin perlu melengkapi profil.');
          // pasien_id tidak akan disimpan di localStorage jika pasienData null.
          // HalamanProfil akan menampilkan pesan "Profil tidak ditemukan" atau meminta untuk melengkapi.
        } else {
           localStorage.setItem('pasien_id', pasienData.id);
        }
        localStorage.setItem('userRole', 'Pasien'); // Simpan role sebagai 'Pasien'
        navigate('/profil-pasien'); // Selalu arahkan ke halaman profil pasien
      }
    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  // Fungsi untuk menangani Register Pasien
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // 1. Buat user di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'Pasien' // Set role 'Pasien' untuk user yang baru register
          }
        }
      });

      if (authError) {
        alert('Registrasi gagal: ' + authError.message);
        return;
      }

      const user = authData.user;
      if (!user) {
        alert('Gagal membuat user.');
        return;
      }

      // 2. Tambahkan data pasien ke tabel pasien_user
      // Penting: Pastikan RLS di tabel pasien_user mengizinkan INSERT oleh user terautentikasi
      const { error: pasienError } = await supabase
        .from('pasien_user')
        .insert({
          supabase_auth_id: user.id,
          nama: nama,
          no_telepon: noTelepon,
          // Tanggal lahir dan alamat bisa diisi nanti di profil (HalamanProfil.jsx)
        });

      if (pasienError) {
        // Jika gagal menyimpan data pasien, hapus user dari Supabase Auth
        // Ini idealnya dilakukan di server-side dengan service_role key
        // Untuk frontend, mungkin perlu penanganan error yang lebih halus atau petunjuk ke user.
        // Untuk saat ini, kita biarkan user dibuat di auth.users, tapi data pasien_user kosong.
        console.error('Registrasi gagal menyimpan data pasien:', pasienError.message);
        alert('Registrasi berhasil, tetapi gagal menyimpan detail profil. Silakan lengkapi profil Anda setelah login.');
      } else {
        alert('Registrasi berhasil! Silakan login.');
      }

      setIsLoginView(true); // Kembali ke tampilan login setelah register
      setEmail('');
      setPassword('');
      setNama('');
      setNoTelepon('');

    } catch (error) {
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  return (
    <div className="p-6 min-h-screen flex items-center justify-center bg-pink-50">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center">
          {isLoginView ? 'Login' : 'Daftar Akun Baru'}
        </h2>
        <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          />

          {!isLoginView && ( // Tampilkan input ini hanya di mode register
            <>
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="border px-3 py-2 w-full rounded"
                required
              />
              <input
                type="tel"
                placeholder="Nomor Telepon (mis: 08123456789)"
                value={noTelepon}
                onChange={(e) => setNoTelepon(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded w-full"
          >
            {isLoginView ? 'Login' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isLoginView ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-pink-600 hover:underline font-semibold"
          >
            {isLoginView ? 'Daftar di sini' : 'Login di sini'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;