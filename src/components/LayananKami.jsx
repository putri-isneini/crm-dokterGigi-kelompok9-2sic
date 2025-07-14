// src/components/LayananKami.jsx
import React, { useEffect, useRef, useState } from "react";
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LayananKami = ({ sectionRef }) => {
  const containerRef = useRef(null);
  const [layananData, setLayananData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // containerRef.current.classList.add("fade-in"); // Dihapus, AOS akan menangani animasi
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchLayanan = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('layanan')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Gagal mengambil data layanan:', error.message);
      } else {
        setLayananData(data);
      }
      setLoading(false);
    };
    fetchLayanan();
  }, []);

  const renderCard = (item) => (
    <div
      key={item.id}
      data-aos="fade-up"
      data-aos-delay="100"
      className="bg-white p-8 rounded-3xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 border border-pink-100 flex flex-col justify-between items-center text-center"
    >
      {item.gambar && (
        <img
          src={item.gambar}
          alt={item.nama}
          className="w-full h-56 object-cover rounded-2xl mb-4 shadow-sm"
        />
      )}
      <h3 className="text-pink-600 text-3xl font-bold mb-3 font-heading">
        {item.nama}
      </h3>
      <p className="text-gray-700 text-lg leading-relaxed mb-3 flex-grow">
        {item.deskripsi}
      </p>
      {item.harga && (
        <p className="text-rose-700 text-2xl font-extrabold mt-2 mb-4">
          Rp {parseInt(item.harga).toLocaleString("id-ID")}
        </p>
      )}

      <Link
        to={`/booking?layanan_id=${item.id}`}
        className="mt-auto bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-base px-6 py-3 rounded-full hover:shadow-md hover:scale-105 transition"
      >
        Coba Layanan
      </Link>
    </div>
  );

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
      paddingTop: "96px",
      zIndex: 0, // Menambahkan zIndex eksplisit untuk section
    },
    heroImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0, // Mengubah zIndex dari -1 menjadi 0
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      padding: "1.5rem",
      zIndex: 1, // Menambahkan zIndex eksplisit untuk overlay, lebih tinggi dari gambar
    },
  };

  return (
    <section ref={sectionRef} className="bg-white pb-20 text-center relative overflow-hidden">
      <section style={heroStyles.heroSection}>
        <img src="/image/k1.jpg" alt="Interior Klinik Gigi" style={heroStyles.heroImage} />
        <div style={heroStyles.heroOverlay} data-aos="zoom-in">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight" data-aos="fade-up" data-aos-delay="300">
            Jajaran <span className="text-rose-300">Layanan Terbaik</span> Kami
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-medium leading-relaxed max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="500">
            Kami berkomitmen menyediakan perawatan gigi komprehensif dengan teknologi
            terkini dan sentuhan personal untuk senyum sehat Anda.
          </p>
        </div>
      </section>

      <div className="absolute top-10 left-10 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-rose-200 rounded-full mix-blend-multiply opacity-30 animate-pulse-slow delay-500"></div>

      <div className="container mx-auto px-4 max-w-full lg:max-w-7xl mt-16">
        {loading ? (
          <p className="text-gray-500 text-xl">Memuat layanan...</p>
        ) : layananData.length > 0 ? (
          <div
            ref={containerRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 lg:gap-2 mb-20"
          >
            {layananData.map((item) => renderCard(item))}
          </div>
        ) : (
          <p className="text-gray-500 text-xl">Tidak ada layanan yang tersedia saat ini.</p>
        )}

        <Link
          to="/prediksi"
          className="bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75 text-lg flex items-center justify-center mx-auto"
        >
          <span className="mr-3 text-2xl">🦷</span> Cek Masalah Gigi Anda
        </Link>
      </div>
    </section>
  );
};

export default LayananKami;
