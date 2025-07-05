import React, { useState } from "react";

export default function BookingForm() {
  const [form, setForm] = useState({
    nama: "",
    nohp: "",
    layanan: "",
    tanggal: "",
    waktu: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking Data:", form);
    // Tambahkan logic simpan ke database atau API
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-xl font-bold text-pink-600 mb-4 text-center">Form Booking Pasien</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="text-sm text-pink-600">Nama Lengkap</label>
          <input
            name="nama"
            placeholder="Masukkan nama lengkap"
            value={form.nama}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          />
        </div>

        <div>
          <label className="text-sm text-pink-600">Nomor Telepon</label>
          <input
            name="nohp"
            placeholder="Masukkan nomor telepon"
            value={form.nohp}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          />
        </div>

        <div>
          <label className="text-sm text-pink-600">Layanan</label>
          <input
            name="layanan"
            placeholder="Masukkan layanan"
            value={form.layanan}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          />
        </div>

        <div>
          <label className="text-sm text-pink-600">Tanggal</label>
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          />
        </div>

        <div>
          <label className="text-sm text-pink-600">Waktu</label>
          <input
            type="time"
            name="waktu"
            value={form.waktu}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold"
        >
          Simpan Booking
        </button>
      </form>
    </div>
  );
}
