// src/components/FeedbackForm.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Send, XCircle, CheckCircle, Loader2 } from 'lucide-react'; // Import ikon

const FeedbackForm = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [komentar, setKomentar] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [pasienId, setPasienId] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) {
                    throw new Error('User not authenticated. Please log in.');
                }
                setPasienId(user.id);

                const { data, error: bookingError } = await supabase
                    .from('booking')
                    .select('id, status, feedback_submitted, pasien_id')
                    .eq('id', bookingId)
                    .eq('pasien_id', user.id)
                    .single();

                if (bookingError) throw bookingError;
                if (!data) {
                    setError('Booking tidak ditemukan atau Anda tidak memiliki akses.');
                    return;
                }
                if (data.status !== 'Selesai') {
                    setError('Feedback hanya bisa diberikan untuk booking yang sudah selesai.');
                    return;
                }
                if (data.feedback_submitted) {
                    setError('Feedback untuk booking ini sudah diberikan.');
                    return;
                }
                setBookingDetails(data);

            } catch (err) {
                console.error('Error fetching booking details for feedback:', err.message);
                setError(err.message || 'Gagal memuat detail booking.');
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!pasienId || !bookingDetails) {
            setError('Data booking atau pasien tidak valid.');
            setLoading(false);
            return;
        }
        if (rating === 0) {
            setError('Mohon berikan rating bintang.');
            setLoading(false);
            return;
        }

        try {
            // 1. Masukkan feedback
            const { error: feedbackInsertError } = await supabase
                .from('feedback')
                .insert({
                    booking_id: bookingId,
                    pasien_id: pasienId,
                    rating,
                    komentar,
                });

            if (feedbackInsertError) {
                throw feedbackInsertError;
            }

            // 2. Update status feedback_submitted via Edge Function
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch('https://ppakjdgfzuvirtrjfnwg.functions.supabase.co/update-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ id: bookingId }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Gagal update status feedback.');
            }

            setMessage('Feedback berhasil dikirim! Terima kasih.');
            setTimeout(() => {
                navigate('/profil-pasien');
            }, 2000);

        } catch (err) {
            console.error('Error submitting feedback:', err.message);
            setError(err.message || 'Terjadi kesalahan saat mengirim feedback.');
        } finally {
            setLoading(false);
        }
    };

    // Render bintang rating
    const renderStars = (currentRating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-9 h-9 cursor-pointer transition-colors duration-200 ${
                        i <= currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    } hover:text-yellow-500 hover:fill-current`}
                    onClick={() => setRating(i)}
                />
            );
        }
        return <div className="flex justify-center space-x-1">{stars}</div>;
    };

    if (loading && !bookingDetails) { // Hanya tampilkan loading penuh jika belum ada detail booking
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin w-16 h-16 text-pink-500 mb-4" />
                    <div className="text-pink-600 text-lg font-semibold">
                        Memuat formulir feedback...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-700 mb-4">Terjadi Kesalahan!</h3>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button onClick={() => navigate('/profil-pasien')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md">
                        Kembali ke Profil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
            style={{
                backgroundImage: `url('/bg1.jpg')` // Path ke gambar di folder public
            }}
        >
            {/* Overlay untuk efek blur pada latar belakang dan warna pink transparan */}
            <div
                className="absolute inset-0"
                style={{
                    backdropFilter: 'blur(10px)', // Sesuaikan nilai blur sesuai keinginan
                    WebkitBackdropFilter: 'blur(10px)', // Untuk kompatibilitas browser
                    backgroundColor: 'rgba(255, 192, 203, 0.3)' // Overlay pink transparan (pink muda dengan opasitas 0.3)
                }}
            ></div>

            <div className="bg-white/70 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-xl border border-pink-100 transform transition-all duration-300 hover:scale-[1.01] z-10">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-pink-700 mb-2">Berikan Feedback</h2>
                    <p className="text-gray-600 text-lg">Bagikan pengalaman Anda tentang layanan kami.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating Section */}
                    <div>
                        <label className="block text-gray-700 text-lg font-semibold mb-3 text-center">Seberapa puas Anda?</label>
                        {renderStars(rating)}
                    </div>

                    {/* Komentar Section */}
                    <div>
                        <label htmlFor="komentar" className="block text-gray-700 text-lg font-semibold mb-2">Komentar Anda</label>
                        <textarea
                            id="komentar"
                            className="w-full px-4 py-3 border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 resize-y"
                            value={komentar}
                            onChange={(e) => setKomentar(e.target.value)}
                            rows="5"
                            placeholder="Tulis komentar Anda di sini..."
                            required
                        ></textarea>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-200">
                            {error}
                        </p>
                    )}
                    {message && (
                        <p className="text-green-500 text-sm text-center bg-green-100 p-3 rounded-lg border border-green-200">
                            {message}
                        </p>
                    )}

                    <div className="flex items-center justify-center pt-4">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                            disabled={loading || rating === 0}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3 text-white" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" /> Kirim Feedback
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
