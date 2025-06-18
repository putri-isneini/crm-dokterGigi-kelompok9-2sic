import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const DataDokter = () => {
  const [doctors, setDoctors] = useState([]);

  // Load data dokter dari localStorage saat pertama render
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('dokterList') || '[]');
    setDoctors(saved);
  }, []);

  // Hapus data dokter dari localStorage dan update state
  const handleDelete = (id) => {
    const filtered = doctors.filter((d) => d.id !== id);
    setDoctors(filtered);
    localStorage.setItem('dokterList', JSON.stringify(filtered));
  };

  return (
    <div className="p-8 bg-pink-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-rose-600">Data Dokter Gigi</h1>
        <Link
          to="/data-dokter/tambah"
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg shadow"
        >
          <PlusCircle size={18} /> Tambah Dokter
        </Link>
      </div>

      {doctors.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada data dokter.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl p-5 shadow border border-rose-200 flex gap-4"
            >
              <img
                src={doc.photo || 'https://via.placeholder.com/80'}
                alt={doc.name}
                className="w-20 h-20 object-cover rounded-full border border-pink-300"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-rose-700">{doc.name}</h2>
                <p className="text-gray-700 mt-1">{doc.specialization}</p>
                <p className="text-gray-500 text-sm mt-1">{doc.schedule}</p>
                <div className="mt-3 flex gap-3">
                  <Link
                    to={`/data-dokter/edit/${doc.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataDokter;
  