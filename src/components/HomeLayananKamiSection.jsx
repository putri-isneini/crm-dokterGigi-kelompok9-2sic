// src/components/HomeLayananKamiSection.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from "../supabase"; // pastikan path-nya benar

const HomeLayananKamiSection = () => {
  const [layananData, setLayananData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-out-cubic', once: true });
    const fetchLayanan = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('layanan')
        .select('id, nama, deskripsi, harga, gambar')
        .order('created_at', { ascending: false })
        .limit(3); // Ambil hanya 3 layanan teratas

      if (error) {
        console.error('Gagal mengambil data layanan untuk Home:', error.message);
      } else {
        setLayananData(data);
      }
      setLoading(false);
    };
    fetchLayanan();
  }, []);

  const renderCard = (item, index) => (
    <div
      key={item.id}
      data-aos="fade-up"
      data-aos-delay={index * 150} // Delay animasi untuk setiap kartu
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 duration-300 border border-pink-100 flex flex-col justify-between items-center text-center"
    >
      {item.gambar && (
        <img
          src={item.gambar}
          alt={item.nama}
          className="w-full h-48 object-cover rounded-xl mb-4 shadow-sm"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/FCE7F3/EC407A?text=No+Image"; }} // Fallback gambar
        />
      )}
      <h3 className="text-pink-600 text-2xl font-bold mb-2">
        {item.nama}
      </h3>
      <p className="text-gray-700 text-base leading-relaxed mb-3 flex-grow">
        {item.deskripsi.substring(0, 100)}... {/* Potong deskripsi */}
      </p>
      {item.harga && (
        <p className="text-rose-700 text-xl font-extrabold mt-2 mb-4">
          Rp {parseInt(item.harga).toLocaleString("id-ID")}
        </p>
      )}
      <Link
        to={`/booking?layanan_id=${item.id}`}
        className="mt-auto bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-sm px-5 py-2 rounded-full hover:shadow-md hover:scale-105 transition"
      >
        Coba Layanan
      </Link>
    </div>
  );

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-rose-100 rounded-full mix-blend-multiply opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-pink-100 rounded-full mix-blend-multiply opacity-20 animate-pulse-slow delay-500"></div>

      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-pink-700 mb-12" data-aos="fade-up">
          3 Top Layanan Kami
        </h2>
        {loading ? (
          <p className="text-gray-600 text-lg animate-pulse" data-aos="fade-up" data-aos-delay="200">Memuat layanan...</p>
        ) : layananData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {layananData.map((item, index) => renderCard(item, index))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg italic" data-aos="fade-up" data-aos-delay="200">Tidak ada layanan yang tersedia saat ini.</p>
        )}
        <Link
          to="/layanan"
          className="inline-block bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
          data-aos="zoom-in" data-aos-delay="400"
        >
          Lihat Semua Layanan
        </Link>
      </div>
    </section>
  );
};

export default HomeLayananKamiSection;
