// src/components/FeedbackForm.jsx
import React, { useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path supabase benar
import { StarIcon } from 'lucide-react'; // Untuk ikon bintang

const FeedbackForm = ({ bookingId, pasienId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false); // State untuk menandakan sudah submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (rating === 0) {
      setError('Mohon berikan rating bintang.');
      setLoading(false);
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
        // Jika update booking gagal, mungkin perlu rollback feedback atau log error
        console.error('Gagal memperbarui status feedback di booking:', updateBookingError.message);
        // Namun, feedback sudah tersimpan, jadi biarkan saja untuk saat ini
      }

      setSubmitted(true);
      alert('Terima kasih atas feedback Anda!');
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(); // Panggil callback untuk refresh data di HalamanProfil
      }
    } catch (err) {
      console.error('Gagal mengirim feedback:', err.message);
      setError('Gagal mengirim feedback: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center">
        Feedback Anda telah diterima! Terima kasih.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-pink-100">
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
          disabled={loading || rating === 0}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Mengirim...' : 'Kirim Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
