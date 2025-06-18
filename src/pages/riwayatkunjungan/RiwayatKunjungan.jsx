import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

const RiwayatKunjungan = () => {
  const [riwayat, setRiwayat] = useState([
    {
      id: 1,
      tanggal: '2025-06-03',
      namaPasien: 'Andi Saputra',
      tindakan: 'Tambal Gigi',
      catatan: 'Pasien merasa ngilu saat makan manis.',
      resep: 'Paracetamol 500mg, gunakan 3x sehari setelah makan.'
    },
    {
      id: 2,
      tanggal: '2025-05-25',
      namaPasien: 'Siti Nurhaliza',
      tindakan: 'Cabut Gigi Bungsu',
      catatan: 'Disarankan kontrol seminggu lagi.',
      resep: 'Amoxicillin 500mg, 3x sehari. Obat kumur antiseptik.'
    },
    {
      id: 3,
      tanggal: '2025-05-10',
      namaPasien: 'Budi Santoso',
      tindakan: 'Scaling',
      catatan: 'Plak gigi cukup tebal, edukasi sikat gigi 2x sehari.',
      resep: 'Tidak diberikan resep.'
    }
  ]);

  const handleDelete = (id) => {
    setRiwayat(riwayat.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-rose-600">Riwayat Kunjungan Pasien</h1>
        <Link
          to="/riwayat-kunjungan/tambah"
          className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg shadow hover:bg-rose-600"
        >
          <PlusCircle size={18} /> Tambah Riwayat
        </Link>
      </div>

      <div className="grid gap-6">
        {riwayat.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow border border-rose-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-rose-700">{item.namaPasien}</h2>
                <p className="text-sm text-gray-500">{item.tanggal}</p>
              </div>
              <div className="flex gap-3">
                <Link to={`/riwayat-kunjungan/edit/${item.id}`} className="text-blue-500 hover:text-blue-700">
                  <Pencil size={18} />
                </Link>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <p><span className="font-medium">Tindakan:</span> {item.tindakan}</p>
              <p><span className="font-medium">Catatan:</span> {item.catatan}</p>
              <p><span className="font-medium">Resep:</span> {item.resep}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiwayatKunjungan;
