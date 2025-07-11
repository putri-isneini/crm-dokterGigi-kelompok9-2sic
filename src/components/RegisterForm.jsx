// src/components/RegisterForm.js
import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterForm() {
  const [form, setForm] = useState({
    nama: "",
    noHp: "", // Menggunakan noHp, konsisten dengan DB (no_hp)
    email: "",
    password: "",
    alamat: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Daftar pengguna ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            role: 'Pasien' // Tambahkan role 'Pasien' ke user_metadata
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          alert("Email ini sudah terdaftar. Silakan login atau gunakan email lain.");
        } else {
          alert("Gagal registrasi akun: " + authError.message);
        }
        setLoading(false);
        return;
      }

      const user = authData.user;
      if (!user) {
        alert("Gagal mendapatkan user dari otentikasi.");
        setLoading(false);
        return;
      }

      // 2. Insert data lengkap pasien ke tabel 'pasien_user'
      // Pastikan semua kolom yang NOT NULL di DB disertakan di sini
      const { error: pasienError } = await supabase.from("pasien_user").insert([
        {
          supabase_auth_id: user.id, // ID unik dari Supabase Auth
          nama: form.nama,
          no_hp: form.noHp, // Ganti dari no_telepon menjadi no_hp agar konsisten dengan DB
          alamat: form.alamat,
          tanggal_lahir: form.tanggal_lahir,
          jenis_kelamin: form.jenis_kelamin,
        },
      ]);

      if (pasienError) {
        console.error("Error saving patient data:", pasienError);
        alert("Registrasi berhasil, tetapi gagal menyimpan detail profil pasien. Mohon coba login atau hubungi admin.");
      } else {
        alert("Registrasi pasien berhasil! Anda sekarang dapat login.");
      }

      navigate("/login"); // Arahkan ke halaman login setelah registrasi
    } catch (err) {
      console.error("Terjadi kesalahan umum saat registrasi:", err);
      alert("Terjadi kesalahan saat registrasi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-xl font-bold text-pink-600 mb-4 text-center">
        Form Registrasi Pasien
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-pink-600">Nama Lengkap</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
            className="w-full border rounded bg-pink-50 p-2"
          />
        </div>
        <div>
          <label className="text-sm text-pink-600">No HP</label> {/* Label juga diubah */}
          <input
            type="text"
            name="noHp" // name atribut juga diubah
            value={form.noHp}
            onChange={handleChange}
            required
            className="w-full border rounded bg-pink-50 p-2"
          />
        </div>
        <div>
          <label className="text-sm text-pink-600">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded bg-pink-50 p-2"
          />
        </div>
        <div>
          <label className="text-sm text-pink-600">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border rounded bg-pink-50 p-2"
          />
        </div>
        <div>
          <label className="text-sm text-pink-600">Alamat</label>
          <input
            type="text"
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2"
          />
        </div>
        <div>
          <label className="text-sm text-pink-600">Jenis Kelamin</label>
          <select
            name="jenis_kelamin"
            value={form.jenis_kelamin}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2"
          >
            <option value="">Pilih</option>
            <option value="Perempuan">Perempuan</option>
            <option value="Laki-laki">Laki-laki</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-pink-600">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggal_lahir"
            value={form.tanggal_lahir}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Mendaftar..." : "Daftar"}
        </button>
      </form>
    </div>
  );
}
