import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const dummyData = [
  {
    id: '1',
    tanggal: '2025-06-03',
    namaPasien: 'Andi Saputra',
    tindakan: 'Tambal Gigi',
    catatan: 'Pasien merasa ngilu saat makan manis.',
    resep: 'Paracetamol 500mg, gunakan 3x sehari setelah makan.'
  }
];

const EditRiwayat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tanggal: '',
    namaPasien: '',
    tindakan: '',
    catatan: '',
    resep: ''
  });

  useEffect(() => {
    const data = dummyData.find((d) => d.id === id);
    if (data) setForm(data);
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log('Data diperbarui:', form);
    navigate('/riwayat-kunjungan');
  };

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow border border-pink-200">
        <h1 className="text-2xl font-bold text-rose-600 mb-4">Edit Riwayat Kunjungan</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input name="tanggal" type="date" value={form.tanggal} onChange={handleChange} className="w-full border rounded p-2" required />
          <input name="namaPasien" type="text" placeholder="Nama Pasien" value={form.namaPasien} onChange={handleChange} className="w-full border rounded p-2" required />
          <input name="tindakan" type="text" placeholder="Tindakan" value={form.tindakan} onChange={handleChange} className="w-full border rounded p-2" required />
          <textarea name="catatan" placeholder="Catatan Dokter" value={form.catatan} onChange={handleChange} className="w-full border rounded p-2" required />
          <textarea name="resep" placeholder="Resep Obat" value={form.resep} onChange={handleChange} className="w-full border rounded p-2" required />
          <button type="submit" className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600">Perbarui</button>
        </form>
      </div>
    </div>
  );
};

export default EditRiwayat;