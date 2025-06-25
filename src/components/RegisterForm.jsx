import React, { useState } from "react";

export default function RegisterForm({ onAddPatient }) {
  const [form, setForm] = useState({
    nama: "",
    tanggalLahir: "",
    jenisKelamin: "",
    noHp: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onAddPatient) {
      onAddPatient(form);  // Kirim data ke parent (misal DataPasien.jsx)
    }

    // Reset form
    setForm({
      nama: "",
      tanggalLahir: "",
      jenisKelamin: "",
      noHp: ""
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-pink-50 rounded shadow">
      <h1 className="text-xl font-bold text-pink-600 mb-4">Form Registrasi Pasien</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nama"
          placeholder="Nama Lengkap"
          value={form.nama}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="date"
          name="tanggalLahir"
          value={form.tanggalLahir}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <select
          name="jenisKelamin"
          value={form.jenisKelamin}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">Pilih Jenis Kelamin</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
        <input
          type="text"
          name="noHp"
          placeholder="No. HP"
          value={form.noHp}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          className="bg-pink-600 text-white px-4 py-2 rounded"
        >
          Daftar
        </button>
      </form>
    </div>
  );
}
