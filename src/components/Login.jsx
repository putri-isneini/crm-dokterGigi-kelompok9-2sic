// src/components/Login.jsx
import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        alert("Login gagal: " + error.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        alert("Sesi pengguna tidak ditemukan.");
        setLoading(false);
        return;
      }

      let userRole = user.user_metadata?.role; // Prioritas 1: Ambil role dari user_metadata

      // Fallback jika role tidak ada di user_metadata
      if (!userRole) {
        console.warn("Role not found in user_metadata. Attempting fallback lookup in database tables.");

        // Cek di tabel 'pasien' (menggunakan tabel pasien sekarang)
        const { data: pasienData, error: pasienError } = await supabase
          .from("pasien") // Ubah ke tabel 'pasien'
          .select("id")
          .eq("id", user.id) // Kolom 'id' di tabel pasien harus sama dengan user.id dari auth.users
          .single();

        if (pasienData && !pasienError) {
          userRole = "Pasien";
        } else {
          // Cek di tabel 'admin_user'
          const { data: adminUserData, error: adminUserError } = await supabase
            .from("admin_user")
            .select("role")
            .eq("email", user.email)
            .single();

          if (adminUserData && !adminUserError) {
            userRole = adminUserData.role;
          } else {
            userRole = "Guest";
            console.warn("User role could not be determined from database. Defaulting to Guest.");
          }
        }
      }

      localStorage.setItem("userRole", userRole);
      localStorage.setItem("isLoggedIn", "true");

      // Simpan pasien_id hanya jika role adalah Pasien
      if (userRole === "Pasien") {
        // Karena tabel pasien menggunakan id dari auth.users sebagai PK, langsung gunakan user.id
        localStorage.setItem('pasien_id', user.id);
      } else {
        localStorage.removeItem('pasien_id');
      }

      setIsLoggedIn(true);
      alert("Login berhasil! Anda adalah " + userRole);

      switch (userRole) {
        case "Pasien":
          navigate("/profil-pasien");
          break;
        case "Admin":
        case "Dokter":
        case "Staf":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Kesalahan tak terduga saat login:", error);
      alert("Terjadi kesalahan tak terduga saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-pink-600 mb-6 text-center">Login Akun</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Belum punya akun?{" "}
        <Link to="/registrasi" className="font-medium text-pink-600 hover:text-pink-500">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
