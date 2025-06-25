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
    // Di sini bisa tambahkan logic simpan ke database atau API
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-pink-50 rounded shadow">
      <h1 className="text-xl font-bold text-pink-600 mb-4">Form Booking Pasien</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nama"
          placeholder="Nama Lengkap"
          value={form.nama}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="notelepon"
          placeholder="Nomor Telepon"
          value={form.nohp}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="layanan"
          placeholder="Layanan"
          value={form.layanan}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="date"
          name="tanggal"
          value={form.tanggal}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="time"
          name="waktu"
          value={form.waktu}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
          Simpan Booking
        </button>
      </form>
    </div>
  );
}
