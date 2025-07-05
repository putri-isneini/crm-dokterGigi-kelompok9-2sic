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
      onAddPatient(form);
    }

    setForm({
      nama: "",
      tanggalLahir: "",
      jenisKelamin: "",
      noHp: ""
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-xl font-bold text-pink-600 mb-4 text-center">Form Registrasi Pasien</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="text-sm text-pink-600">Nama Lengkap</label>
          <input
            type="text"
            name="nama"
            placeholder="Masukkan nama lengkap"
            value={form.nama}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          />
        </div>

        <div>
          <label className="text-sm text-pink-600">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggalLahir"
            value={form.tanggalLahir}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          />
        </div>

        <div>
          <label className="text-sm text-pink-600">Jenis Kelamin</label>
          <select
            name="jenisKelamin"
            value={form.jenisKelamin}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-pink-600">No. HP</label>
          <input
            type="text"
            name="noHp"
            placeholder="Masukkan nomor HP"
            value={form.noHp}
            onChange={handleChange}
            className="w-full border rounded bg-pink-50 p-2 focus:outline-pink-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold"
        >
          Daftar
        </button>
      </form>
    </div>
  );
}
