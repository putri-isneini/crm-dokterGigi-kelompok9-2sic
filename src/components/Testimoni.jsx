// src/components/Testimoni.jsx
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Testimoni = () => {
  // Data testimoni hardcoded seperti yang Anda minta
  const testimoniList = [
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
  }, []);

  // Gaya untuk Hero Section, mirip dengan LayananKami dan Kontak
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

  return (
    <section className="bg-white pb-20 text-center relative overflow-hidden">
      {/* Hero Section - Gambar Besar Full Layar */}
      <section style={heroStyles.heroSection}>
        <img src="/image/bg1.jpg" alt="Interior Klinik Gigi" style={heroStyles.heroImage} />
        <div style={heroStyles.heroOverlay} data-aos="zoom-in">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight" data-aos="fade-up" data-aos-delay="300">
            <span className="text-rose-300">Transformasi</span> Senyum Anda
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-medium leading-relaxed max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="500">
            Lihat hasil nyata dari perawatan gigi terbaik kami.
          </p>
        </div>
      </section>

      {/* Konten Utama Testimoni (sekarang menampilkan Before & After) */}
      <div className="container mx-auto px-4 max-w-full lg:max-w-7xl mt-16">
        {testimoniList.length === 0 ? (
          <p className="text-gray-600 text-xl">Tidak ada testimoni gambar yang tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimoniList.map((item, index) => (
              <div
                key={index} // Menggunakan index sebagai key karena tidak ada id unik dari DB
                data-aos="fade-up" // Animasi fade-up untuk setiap kartu
                data-aos-delay={index * 100} // Delay berurutan untuk efek staggered
                className="bg-white p-4 rounded-3xl shadow-xl border border-pink-100 flex flex-col items-center text-center 
                           hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer"
              >
                {/* Bagian Gambar Before & After */}
                <div className="flex flex-col md:flex-row gap-2 w-full mb-6"> {/* Menggunakan flex-col untuk mobile, flex-row untuk desktop */}
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
    </section>
  );
};

export default Testimoni;
