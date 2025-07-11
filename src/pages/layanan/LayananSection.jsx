// src/components/LayananSection.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path supabase benar

const LayananSection = () => {
  const [layananList, setLayananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLayanan = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('layanan')
          .select('id, nama, deskripsi, gambar') // Ambil kolom gambar
          .order('nama', { ascending: true });

        if (error) {
          throw error;
        }
        setLayananList(data);
      } catch (err) {
        console.error('Gagal fetch layanan untuk halaman depan:', err.message);
        setError('Gagal memuat daftar layanan. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchLayanan();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 py-10">Memuat layanan...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  }

  if (layananList.length === 0) {
    return <div className="text-center text-gray-500 py-10 italic">Belum ada layanan yang tersedia.</div>;
  }

  return (
    <section className="py-20 bg-pink-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-pink-700 mb-12">
          Layanan Unggulan Kami ✨
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {layananList.map((layanan) => (
            <div
              key={layanan.id}
              className="bg-white p-8 rounded-2xl shadow-lg border border-pink-100 transform hover:scale-105 transition-transform duration-300 flex flex-col items-center"
            >
              {layanan.gambar && (
                <img
                  src={layanan.gambar}
                  alt={layanan.nama}
                  className="w-24 h-24 object-cover rounded-full mb-4 shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/96x96/FCE7F3/EC4899?text=Layanan"; }} // Fallback image
                />
              )}
              <h3 className="text-2xl font-bold text-pink-600 mb-4">{layanan.nama}</h3>
              <p className="text-gray-700 text-center">{layanan.deskripsi}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LayananSection;
