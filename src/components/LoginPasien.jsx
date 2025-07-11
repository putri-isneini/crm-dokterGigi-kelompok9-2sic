import React, { useState } from "react";
import { supabase } from "../supabase";
import bcrypt from "bcryptjs";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPasien() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("pasien_user")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      alert("Email tidak ditemukan");
      return;
    }

    const passwordMatch = await bcrypt.compare(password, data.password_hash);
    if (!passwordMatch) {
      alert("Password salah");
      return;
    }

    localStorage.setItem("pasien_id", data.id);
    navigate("/profil-pasien");
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow">
      <h1 className="text-xl font-bold text-pink-600 mb-4 text-center">Login Pasien</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-sm text-pink-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          />
        </div>
        <div>
          <label className="text-sm text-pink-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold"
        >
          Login
        </button>

        {/* 👉 Tambahan ini */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-pink-600 hover:underline font-semibold">
            Regis di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
