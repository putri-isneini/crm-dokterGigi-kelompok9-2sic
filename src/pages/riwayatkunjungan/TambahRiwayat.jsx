import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TambahRiwayat = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tanggal: '',
    namaPasien: '',
    tindakan: '',
    catatan: '',
    resep: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan logika submit ke database jika sudah ada
    console.log('Data disimpan:', form);
    navigate('/riwayatkunjungan');
  };

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow border border-pink-200">
        <h1 className="text-2xl font-bold text-rose-600 mb-4">Tambah Riwayat Kunjungan</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="tanggal" type="date" value={form.tanggal} onChange={handleChange} className="w-full border rounded p-2" required />
          <input name="namaPasien" type="text" placeholder="Nama Pasien" value={form.namaPasien} onChange={handleChange} className="w-full border rounded p-2" required />
          <input name="tindakan" type="text" placeholder="Tindakan" value={form.tindakan} onChange={handleChange} className="w-full border rounded p-2" required />
          <textarea name="catatan" placeholder="Catatan Dokter" value={form.catatan} onChange={handleChange} className="w-full border rounded p-2" required />
          <textarea name="resep" placeholder="Resep Obat" value={form.resep} onChange={handleChange} className="w-full border rounded p-2" required />
          <button type="submit" className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600">Simpan</button>
        </form>
      </div>
    </div>
  );
};

export default TambahRiwayat;