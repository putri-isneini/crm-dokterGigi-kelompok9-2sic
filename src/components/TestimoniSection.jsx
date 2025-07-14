// src/components/TestimoniSection.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path supabase benar
import { Quote, Star } from 'lucide-react'; // Untuk ikon
import AOS from 'aos';
import 'aos/dist/aos.css';

const TestimoniSection = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data testimoni hardcoded untuk gambar Before & After
    const imageTestimoniList = [
        {
            before: "/image/before1.jpg",
            after: "/image/after1.jpg",
            keterangan: "Behel Ortodonti",
        },
        {
            before: "/image/b2.jpg",
            after: "/image/a2.jpg",
            keterangan: "Pemasangan Gigi Palsu",
        },
        {
            before: "/image/b3.jpg",
            after: "/image/a3.jpg",
            keterangan: "Scaling & Whitening",
        },
        {
            before: "/image/b4.jpg",
            after: "/image/a4.jpg",
            keterangan: "Veneer Gigi",
        },
        {
            before: "/image/b5.jpg",
            after: "/image/a5.jpg",
            keterangan: "Veneer Gigi",
        },
        {
            before: "/image/b6.jpg",
            after: "/image/a6.jpg",
            keterangan: "Pembersihan Karang Gigi",
        },
    ];

    useEffect(() => {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
        fetchFeedback(); // Panggil saat komponen dimuat
    }, []);

    // Fungsi untuk mengambil feedback dari Supabase (semua feedback)
    const fetchFeedback = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('feedback')
                .select(`
                    id,
                    komentar,
                    rating,
                    created_at,
                    pasien_user(nama)
                `)
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            console.log("Data mentah feedback dari Supabase:", data); 

            const formattedFeedback = data.map(item => ({
                id: item.id,
                komentar: item.komentar,
                rating: item.rating,
                created_at: item.created_at,
                nama_pasien: item.pasien_user && item.pasien_user.nama ? item.pasien_user.nama : 'Anonim',
            }));
            setFeedbackList(formattedFeedback);
        } catch (err) {
            console.error('Gagal fetch feedback untuk halaman testimoni:', err.message);
            setError('Gagal memuat testimoni. Silakan coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
            );
        }
        return <div className="flex justify-center mb-3">{stars}</div>;
    };

    // Gaya untuk Hero Section - Diubah agar tanpa gambar latar belakang
    const heroStyles = {
        heroSection: {
            width: "100%",
            minHeight: "300px", // Tinggi minimum untuk hero section
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "96px 1.5rem 64px", // Padding atas disesuaikan dengan tinggi header tetap
            backgroundColor: "#FCE4EC", // Warna latar belakang pink soft (seperti FAQ)
            color: "#EC407A", // Warna teks judul
            position: "relative", // Tetap relatif untuk konten
            overflow: "hidden", // Tetap hidden untuk mencegah scroll
        },
    };

    return (
        <section className="bg-white pb-20 text-center relative overflow-hidden">
            {/* Hero Section - Tanpa Gambar Latar Belakang dan tanpa lingkaran dekoratif */}
            <section style={heroStyles.heroSection}>
                {/* Decorative background circles removed */}
                {/* <div className="absolute top-10 left-10 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply opacity-30 animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-rose-200 rounded-full mix-blend-multiply opacity-30 animate-pulse-slow delay-500"></div> */}

                <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight" data-aos="fade-up" data-aos-delay="100">
                    Apa Kata <span className="text-rose-600">Pasien Kami</span>
                </h2>
                <p className="text-xl md:text-2xl mb-8 font-medium leading-relaxed max-w-3xl mx-auto text-pink-700" data-aos="fade-up" data-aos-delay="200">
                    Dengarkan pengalaman langsung dari mereka yang telah merasakan perawatan terbaik kami.
                </p>
            </section>

            {/* Bagian Testimoni Gambar Before & After */}
            <div className="container mx-auto px-4 max-w-full lg:max-w-7xl mt-16">
                <h3 className="text-4xl font-extrabold text-pink-700 mb-10" data-aos="fade-up">
                    Transformasi Senyum Pasien
                </h3>
                {imageTestimoniList.length === 0 ? (
                    <p className="text-gray-600 text-xl">Tidak ada testimoni gambar yang tersedia.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {imageTestimoniList.map((item, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className="bg-white p-4 rounded-3xl shadow-xl border border-pink-100 flex flex-col items-center text-center 
                                           hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row gap-2 w-full mb-6">
                                    <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-md">
                                        <img
                                            src={item.before}
                                            alt={`Before ${item.keterangan}`}
                                            className="w-full h-40 object-cover rounded-md"
                                        />
                                        <p className="text-sm font-semibold text-gray-600 mt-2">Before</p>
                                    </div>
                                    <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-md">
                                        <img
                                            src={item.after}
                                            alt={`After ${item.keterangan}`}
                                            className="w-full h-40 object-cover rounded-md"
                                        />
                                        <p className="text-sm font-semibold text-gray-600 mt-2">After</p>
                                    </div>
                                </div>
                                
                                <h3 className="text-pink-600 text-2xl font-bold mb-2 font-heading">
                                    {item.keterangan}
                                </h3>
                                <p className="text-gray-700 text-base leading-relaxed">
                                    Transformasi senyum yang menakjubkan!
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bagian Testimoni Teks (dari Supabase) - Dipindahkan ke bawah gambar testimoni */}
            <div className="max-w-6xl mx-auto px-6 mt-20">
                <h3 className="text-4xl font-extrabold text-pink-700 mb-10" data-aos="fade-up">
                    Apa Kata Mereka
                </h3>
                {loading ? (
                    <p className="text-gray-600 text-xl animate-pulse">Memuat testimoni feedback...</p>
                ) : error ? (
                    <p className="text-red-600 text-xl">Error: {error}</p>
                ) : feedbackList.length === 0 ? (
                    <p className="text-gray-500 text-xl italic">Belum ada testimoni feedback yang tersedia.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {feedbackList.map((testimoni, index) => (
                            <div
                                key={testimoni.id}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className="bg-pink-50 p-8 rounded-2xl shadow-lg border border-pink-100 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                            >
                                <Quote className="w-10 h-10 text-pink-400 mb-4" />
                                <p className="italic text-gray-700 mb-4 leading-relaxed flex-grow">"{testimoni.komentar}"</p>
                                {renderStars(testimoni.rating)}
                                <p className="font-semibold text-pink-600 text-lg">- {testimoni.nama_pasien || 'Anonim'}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(testimoni.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TestimoniSection;
