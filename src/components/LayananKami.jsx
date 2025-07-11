import React, { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';

const LayananKami = ({ sectionRef }) => {
  const containerRef = useRef(null);
  const [layananData, setLayananData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          containerRef.current.classList.add("fade-in");
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
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out border border-pink-100 flex flex-col"
    >
      {item.gambar && (
        <img
          src={item.gambar}
          alt={item.nama}
          className="w-full h-48 object-cover rounded-xl mb-4 shadow-sm"
        />
      )}
      <h3 className="text-pink-600 text-2xl font-bold mb-3 font-heading">
        {item.nama}
      </h3>
      <p className="text-gray-700 text-base leading-relaxed mb-4 flex-grow">
        {item.deskripsi}
      </p>
      {item.harga && (
        <p className="text-rose-700 text-xl font-extrabold mt-2 mb-4">
          Rp {parseInt(item.harga).toLocaleString("id-ID")}
        </p>
      )}

      {/* Tombol coba layanan */}
      <Link
        to={`/booking?layanan_id=${item.id}`}
        className="mt-auto bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-sm px-5 py-2 rounded-full hover:shadow-md hover:scale-105 transition-all ease-in-out text-center"
      >
        Coba Layanan
      </Link>
    </div>
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="bg-gradient-to-br from-pink-50 to-white pt-32 pb-20 text-center relative overflow-hidden"
      >
        <div className="absolute top-10 left-10 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-rose-200 rounded-full mix-blend-multiply opacity-30 animate-pulse-slow delay-500"></div>

        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-5xl md:text-6xl font-extrabold text-pink-700 mb-6 leading-tight animate-fade-in-up">
            Jajaran <span className="text-rose-500">Layanan Terbaik</span> Kami
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-16 font-medium max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Kami berkomitmen menyediakan perawatan gigi komprehensif dengan teknologi
            terkini dan sentuhan personal untuk senyum sehat Anda.
          </p>

          {loading ? (
            <p className="text-gray-500 text-xl">Memuat layanan...</p>
          ) : layananData.length > 0 ? (
            <div
              ref={containerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14 mb-20 animate-fade-in"
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

      <Footer />
    </>
  );
};

export default LayananKami;
  