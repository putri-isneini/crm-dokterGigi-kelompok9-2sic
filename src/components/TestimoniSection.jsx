// src/components/TestimoniSection.jsx (Sebelumnya FeedbackTestimoniSection.jsx)
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path supabase benar
import { QuoteIcon, StarIcon } from 'lucide-react'; // Untuk ikon

const TestimoniSection = () => { // Nama komponen dikembalikan menjadi TestimoniSection
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch dari tabel 'feedback' dan join dengan 'pasien_user' untuk mendapatkan nama pasien
        const { data, error } = await supabase
          .from('feedback')
          .select(`
            id,
            komentar,
            rating,
            created_at,
            pasien_user(nama_lengkap) // Join untuk mendapatkan nama_lengkap dari pasien_user
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        // Map data untuk menyertakan nama_pasien
        const formattedFeedback = data.map(item => ({
          id: item.id,
          komentar: item.komentar,
          rating: item.rating,
          created_at: item.created_at,
          nama_pasien: item.pasien_user ? item.pasien_user.nama_lengkap : 'Anonim',
        }));
        setFeedbackList(formattedFeedback);
      } catch (err) {
        console.error('Gagal fetch feedback untuk halaman testimoni:', err.message);
        setError('Gagal memuat testimoni. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 py-10">Memuat testimoni feedback...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  }

  if (feedbackList.length === 0) {
    return <div className="text-center text-gray-500 py-10 italic">Belum ada testimoni feedback yang tersedia.</div>;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-pink-700 mb-12">
          Apa Kata Pasien Kami 💬
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {feedbackList.map((testimoni) => (
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
