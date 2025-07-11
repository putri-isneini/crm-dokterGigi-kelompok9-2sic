// src/components/TestimoniSection.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path supabase benar
import { QuoteIcon, StarIcon } from 'lucide-react'; // Untuk ikon

const TestimoniSection = () => {
  const [testimoniList, setTestimoniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimoni = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('testimoni')
          .select('id, nama_pasien, komentar, rating, created_at')
          .order('created_at', { ascending: false }); // Urutkan dari terbaru

        if (error) {
          throw error;
        }
        setTestimoniList(data);
      } catch (err) {
        console.error('Gagal fetch testimoni untuk halaman depan:', err.message);
        setError('Gagal memuat testimoni. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimoni();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 py-10">Memuat testimoni...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  }

  if (testimoniList.length === 0) {
    return <div className="text-center text-gray-500 py-10 italic">Belum ada testimoni yang tersedia.</div>;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-pink-700 mb-12">
          Apa Kata Pasien Kami 💬
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {testimoniList.map((testimoni) => (
            <div key={testimoni.id} className="bg-pink-50 p-8 rounded-2xl shadow-lg border border-pink-100 flex flex-col items-center text-center">
              <QuoteIcon className="w-10 h-10 text-pink-400 mb-4" />
              <p className="italic text-gray-700 mb-4 leading-relaxed">"{testimoni.komentar}"</p>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimoni.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="font-semibold text-pink-600">- {testimoni.nama_pasien || 'Anonim'}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(testimoni.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimoniSection;
