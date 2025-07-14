// src/components/HomeFaqSection.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'; // Pastikan lucide-react terinstal
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import CSS AOS

const HomeFaqSection = () => {
    const [faqList, setFaqList] = useState([]);
    const [loading, setLoading] = useState(true); // Tetap gunakan loading untuk internal logic
    const [error, setError] = useState(null); // Tetap gunakan error untuk internal logic
    const [openIndex, setOpenIndex] = useState(null);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, easing: 'ease-in-out', once: true }); // Inisialisasi AOS
        const fetchFaq = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, error: fetchError } = await supabase
                    .from('faq')
                    .select('id, pertanyaan, jawaban')
                    .order('created_at', { ascending: false });

                if (fetchError) throw fetchError;
                setFaqList(data);
            } catch (err) {
                console.error('Error fetching FAQ for home:', err.message);
                setError('Gagal memuat pertanyaan umum. Silakan coba lagi nanti.');
            } finally {
                setLoading(false);
            }
        };

        fetchFaq();

        // Trigger fade-in animation
        setTimeout(() => setShowContent(true), 50);
    }, []);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const fadeInClass = showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

    // Gaya untuk Hero Section, disesuaikan dari LayananKami dan Kontak
    const heroStyles = {
        heroSection: {
            position: "relative",
            width: "100%",
            height: "60vh", 
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            paddingTop: "96px", // Sesuaikan dengan tinggi header tetap
            zIndex: 0, 
        },
        heroImage: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0, 
        },
        heroOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.4)", // Overlay gelap
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            padding: "1.5rem",
            zIndex: 1, 
        },
    };

    // Membagi faqList menjadi dua kolom
    const half = Math.ceil(faqList.length / 2);
    const firstColumnFaqs = faqList.slice(0, half);
    const secondColumnFaqs = faqList.slice(half);

    return (
        <section className="bg-white pb-20 text-center relative overflow-hidden">
            {/* Hero Section - Gambar Besar Full Layar */}
            <section style={heroStyles.heroSection}>
                <img src="/image/faq-hero.jpg" alt="FAQ Background" style={heroStyles.heroImage} />
                <div style={heroStyles.heroOverlay} data-aos="zoom-in">
                    <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight" data-aos="fade-up" data-aos-delay="300">
                        <span className="text-rose-300">Pertanyaan</span> Umum
                    </h2>
                    <p className="text-xl md:text-2xl mb-8 font-medium leading-relaxed max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="500">
                        Temukan jawaban atas pertanyaan yang sering diajukan seputar layanan kami.
                    </p>
                </div>
            </section>

            {/* Konten Utama FAQ - Dua Kolom */}
            <div className="container mx-auto px-4 max-w-full lg:max-w-7xl mt-16">
                {loading ? (
                    <p className="text-pink-600 text-xl font-semibold animate-pulse">Memuat pertanyaan umum...</p>
                ) : error ? (
                    <p className="text-red-600 text-xl">Error: {error}</p>
                ) : faqList.length === 0 ? (
                    <p className="text-gray-600 text-xl">Belum ada pertanyaan umum yang tersedia saat ini.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Menggunakan grid untuk 2 kolom */}
                        {/* Kolom Pertama */}
                        <div className="space-y-4">
                            {firstColumnFaqs.map((faq, index) => (
                                <div
                                    key={faq.id}
                                    data-aos="fade-up" // Animasi fade-up untuk setiap kartu
                                    data-aos-delay={index * 100} // Delay berurutan untuk efek staggered
                                    className={`bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden transition-all duration-300 ease-in-out 
                                        ${openIndex === index ? 'shadow-xl scale-[1.01] border-pink-300' : 'hover:shadow-xl hover:scale-[1.005]'}`}
                                >
                                    <button
                                        className="w-full text-left p-6 flex justify-between items-center text-pink-700 font-semibold text-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50 rounded-xl"
                                        onClick={() => toggleFaq(index)}
                                        aria-expanded={openIndex === index}
                                    >
                                        <span className="flex items-center text-rose-700">
                                            <HelpCircle className="mr-3 text-pink-500 flex-shrink-0" size={28} />
                                            {faq.pertanyaan}
                                        </span>
                                        {openIndex === index ? (
                                            <ChevronUp className="text-pink-500 transition-transform duration-300" size={28} />
                                        ) : (
                                            <ChevronDown className="text-pink-500 transition-transform duration-300" size={28} />
                                        )}
                                    </button>
                                    {openIndex === index && (
                                        <div className="p-6 pt-0 text-gray-700 leading-relaxed border-t border-pink-100 bg-pink-50">
                                            <p className="text-lg">{faq.jawaban}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Kolom Kedua */}
                        <div className="space-y-4">
                            {secondColumnFaqs.map((faq, index) => (
                                <div
                                    key={faq.id}
                                    data-aos="fade-up" // Animasi fade-up untuk setiap kartu
                                    data-aos-delay={(firstColumnFaqs.length + index) * 100} // Delay berurutan lanjutan
                                    className={`bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden transition-all duration-300 ease-in-out 
                                        ${openIndex === (firstColumnFaqs.length + index) ? 'shadow-xl scale-[1.01] border-pink-300' : 'hover:shadow-xl hover:scale-[1.005]'}`}
                                >
                                    <button
                                        className="w-full text-left p-6 flex justify-between items-center text-pink-700 font-semibold text-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50 rounded-xl"
                                        onClick={() => toggleFaq(firstColumnFaqs.length + index)}
                                        aria-expanded={openIndex === (firstColumnFaqs.length + index)}
                                    >
                                        <span className="flex items-center text-rose-700">
                                            <HelpCircle className="mr-3 text-pink-500 flex-shrink-0" size={28} />
                                            {faq.pertanyaan}
                                        </span>
                                        {openIndex === (firstColumnFaqs.length + index) ? (
                                            <ChevronUp className="text-pink-500 transition-transform duration-300" size={28} />
                                        ) : (
                                            <ChevronDown className="text-pink-500 transition-transform duration-300" size={28} />
                                        )}
                                    </button>
                                    {openIndex === (firstColumnFaqs.length + index) && (
                                        <div className="p-6 pt-0 text-gray-700 leading-relaxed border-t border-pink-100 bg-pink-50">
                                            <p className="text-lg">{faq.jawaban}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HomeFaqSection;
