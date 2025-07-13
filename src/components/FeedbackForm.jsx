// src/components/FeedbackForm.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // Pastikan path supabase benar
import { StarIcon } from 'lucide-react'; // Untuk ikon bintang
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams dan useNavigate

const FeedbackForm = () => {
  const { bookingId } = useParams(); // Ambil bookingId dari URL
  const navigate = useNavigate();
  const [pasienId, setPasienId] = useState(null);
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [loading, setLoading] = useState(true); // Initial loading for fetching pasienId
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false); // State untuk menandakan sudah submit

  useEffect(() => {
    const fetchPasienId = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Sesi pengguna tidak valid. Silakan login kembali.");
          setLoading(false);
          navigate("/login");
          return;
        }

        const { data: pasienData, error: pasienError } = await supabase
          .from('pasien_user')
          .select('id')
          .eq('supabase_auth_id', user.id)
          .single();

        if (pasienError || !pasienData) {
          setError("Data profil pasien Anda tidak ditemukan. Silakan lengkapi profil Anda.");
          setLoading(false);
          navigate("/profil-pasien");
          return;
        }
        setPasienId(pasienData.id);
      } catch (err) {
        console.error("Error fetching pasien ID in FeedbackForm:", err.message);
        setError("Gagal memuat data pasien: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPasienId();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Mulai loading saat submit
    setError(null);

    if (rating === 0) {
      setError('Mohon berikan rating bintang.');
      setIsSubmitting(false);
      return;
    }
    if (!bookingId) {
      setError('ID Booking tidak ditemukan. Tidak dapat mengirim feedback.');
      setIsSubmitting(false);
      return;
    }
    if (!pasienId) {
      setError('ID Pasien tidak ditemukan. Silakan coba lagi.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Masukkan feedback ke tabel 'feedback'
      const { error: feedbackError } = await supabase.from('feedback').insert([
        {
          booking_id: bookingId,
          pasien_id: pasienId,
          rating: rating,
          komentar: komentar,
        },
      ]);

      if (feedbackError) {
        throw feedbackError;
      }

      // 2. Perbarui status 'feedback_submitted' di tabel 'booking'
      const { error: updateBookingError } = await supabase
        .from('booking')
        .update({ feedback_submitted: true })
        .eq('id', bookingId);

      if (updateBookingError) {
        console.error('Gagal memperbarui status feedback di booking:', updateBookingError.message);
      }

      setSubmitted(true);
      alert('Terima kasih atas feedback Anda!');
      // Arahkan ke halaman profil pasien
      navigate("/profil-pasien", { replace: true });
    } catch (err) {
      console.error('Gagal mengirim feedback:', err.message);
      setError('Gagal mengirim feedback: ' + err.message);
    } finally {
      setIsSubmitting(false); // Selesai loading
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat formulir feedback...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center">
        Feedback Anda telah diterima! Terima kasih.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-pink-100 max-w-md mx-auto mt-10">
      <h3 className="text-xl font-semibold text-pink-600 mb-4">Berikan Feedback Anda</h3>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Komentar (Opsional)</label>
          <textarea
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            rows="3"
            placeholder="Bagaimana pengalaman Anda?"
            className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
