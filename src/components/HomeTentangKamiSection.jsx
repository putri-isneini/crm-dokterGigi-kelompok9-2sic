// src/components/HomeTentangKamiSection.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from "../supabase"; // pastikan path-nya benar

const HomeTentangKamiSection = () => {
  const [deskripsiSingkat, setDeskripsiSingkat] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-out-cubic', once: true });
    const fetchDeskripsi = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tentang_kami")
        .select("konten")
        .eq("tipe", "deskripsi") // Ambil konten dengan tipe 'deskripsi'
        .single(); // Ambil hanya satu baris untuk deskripsi

      if (error) {
        console.error("Gagal mengambil deskripsi tentang_kami:", error.message);
        setDeskripsiSingkat("Gagal memuat deskripsi.");
      } else if (data) {
        // Ambil hanya beberapa kalimat pertama atau potong string
        const fullDeskripsi = data.konten;
        // Memecah berdasarkan titik dan spasi, lalu mengambil 2 kalimat pertama
        const sentences = fullDeskripsi.split('. ');
        let snippet = sentences.slice(0, 2).join('. ');
        if (sentences.length > 2 && snippet.length > 0) { // Pastikan snippet tidak kosong sebelum menambahkan elipsis
          snippet += '...';
        }
        setDeskripsiSingkat(snippet);
      } else {
        setDeskripsiSingkat("Deskripsi tentang kami belum tersedia.");
      }
      setLoading(false);
    };

    fetchDeskripsi();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-white relative overflow-hidden">
      {/* Decorative background circles removed */}
      {/* <div className="absolute top-0 left-0 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-rose-200 rounded-full mix-blend-multiply opacity-30 animate-pulse-slow delay-500"></div> */}

      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-extrabold text-pink-800 mb-16 relative z-10" data-aos="fade-up">
          Tentang <span className="text-rose-500">Kami</span>
          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-10px] w-24 h-2 bg-rose-500 rounded-full"></span>
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 bg-white p-10 rounded-3xl shadow-2xl border border-pink-100 relative z-10">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center" data-aos="fade-right" data-aos-delay="200">
            <img
              src="/image/d1.png" // Menggunakan gambar baru yang lebih profesional
              alt="Dokter Tia Dental Care"
              className="w-full max-w-md h-auto rounded-3xl shadow-xl border-4 border-pink-300 transition-transform duration-500 ease-in-out transform hover:scale-105"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x500/FCE7F3/EC407A?text=Doctor+Image"; }} // Fallback gambar
            />
          </div>

          {/* Text Section (Kisah Kami) */}
          <div className="w-full lg:w-1/2 text-left" data-aos="fade-left" data-aos-delay="200">
            <h3 className="text-4xl font-bold text-pink-700 mb-6 leading-tight">
              Kisah Kami: <span className="block text-rose-500">Dedikasi untuk Senyum Anda</span>
            </h3>
            {loading ? (
              <p className="text-gray-600 text-lg animate-pulse">Memuat deskripsi...</p>
            ) : (
              <p className="text-gray-700 text-lg leading-relaxed mb-10">
                {deskripsiSingkat}
              </p>
            )}
            <Link
              to="/tentang"
              className="inline-block bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
              data-aos="zoom-in" data-aos-delay="400"
            >
              Baca Selengkapnya
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTentangKamiSection;
