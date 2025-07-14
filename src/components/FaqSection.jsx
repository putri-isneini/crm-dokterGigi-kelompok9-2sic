// src/components/FaqSection.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path supabase benar
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'; // Untuk ikon accordion dan judul
import AOS from 'aos';
import 'aos/dist/aos.css';

const FaqSection = () => {
    const [faqList, setFaqList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openIndex, setOpenIndex] = useState(null); // State untuk mengontrol accordion

    useEffect(() => {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true }); // Inisialisasi AOS
        const fetchFaq = async () => {
            setLoading(true);
            setError(null);
            try {
                // Ambil semua FAQ, karena ini untuk tampilan publik
                const { data, error: fetchError } = await supabase
                    .from('faq')
                    .select('id, pertanyaan, jawaban, kategori')
                    .order('created_at', { ascending: true }); // Urutkan berdasarkan tanggal dibuat

                if (fetchError) {
                    throw fetchError;
                }
                setFaqList(data);
            } catch (err) {
                console.error('Gagal fetch FAQ untuk halaman depan:', err.message);
                setError('Gagal memuat pertanyaan umum. Silakan coba lagi nanti.');
            } finally {
                setLoading(false);
            }
        };

        fetchFaq();
    }, []);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Gaya untuk Hero Section
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
            backgroundColor: "#FCE4EC", // Warna latar belakang pink soft
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
                    Pertanyaan <span className="text-rose-600">Umum</span>
                </h2>
                <p className="text-xl md:text-2xl mb-8 font-medium leading-relaxed max-w-3xl mx-auto text-pink-700" data-aos="fade-up" data-aos-delay="200">
                    Temukan jawaban atas pertanyaan yang sering diajukan mengenai layanan dan prosedur kami.
                </p>
            </section>

            {/* Konten FAQ Utama - Dibagi Dua Kolom */}
            <div className="max-w-6xl mx-auto px-6 mt-16">
                {loading ? (
                    <p className="text-gray-600 text-xl animate-pulse">Memuat pertanyaan umum...</p>
                ) : error ? (
                    <p className="text-red-600 text-xl">Error: {error}</p>
                ) : faqList.length === 0 ? (
                    <p className="text-gray-500 text-xl italic">Belum ada pertanyaan umum yang tersedia.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Menggunakan grid untuk 2 kolom */}
                        {faqList.map((faq, index) => (
                            <div
                                key={faq.id}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                className={`bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden transition-all duration-300 ease-in-out
                                    ${openIndex === index ? 'shadow-xl scale-[1.01] border-pink-300' : 'hover:shadow-xl hover:scale-[1.005]'}`}
                            >
                                <button
                                    id={`faq-question-${index}`}
                                    className="flex justify-between items-center w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-opacity-75"
                                    onClick={() => toggleAccordion(index)}
                                    aria-expanded={openIndex === index}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span className="text-xl font-semibold text-gray-800 flex items-center">
                                        <HelpCircle className="w-6 h-6 text-pink-500 mr-3 flex-shrink-0" />
                                        {faq.pertanyaan}
                                    </span>
                                    {openIndex === index ? (
                                        <ChevronUp className="w-6 h-6 text-pink-500 transition-transform duration-300" />
                                    ) : (
                                        <ChevronDown className="w-6 h-6 text-pink-500 transition-transform duration-300" />
                                    )}
                                </button>
                                <div
                                    id={`faq-answer-${index}`}
                                    role="region"
                                    aria-labelledby={`faq-question-${index}`}
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                        openIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                    style={{
                                        maxHeight: openIndex === index ? '1000px' : '0', // Nilai besar untuk transisi
                                        opacity: openIndex === index ? '1' : '0',
                                    }}
                                >
                                    <div className="p-6 pt-0 text-gray-700 border-t border-pink-100 bg-pink-50">
                                        <p className="text-lg">{faq.jawaban}</p>
                                        {faq.kategori && (
                                            <span className="mt-4 inline-block bg-pink-100 text-pink-600 text-xs font-medium px-3 py-1 rounded-full">
                                                {faq.kategori}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FaqSection;
