// src/components/Kontak.jsx
import React, { useEffect } from 'react';
import { PhoneCall } from 'lucide-react'; // Tetap import jika ingin digunakan di tempat lain
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import CSS AOS

const Kontak = () => {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true }); // Inisialisasi AOS
  }, []);

  // Gaya untuk Hero Section, disesuaikan dari LayananKami
  const heroStyles = {
    heroSection: {
      position: "relative",
      width: "100%",
      height: "60vh", // Tinggi yang sama dengan LayananKami
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
    <section id="kontak-page-container" className="bg-white pb-20 text-center relative overflow-hidden">
      {/* Hero Section - Gambar Besar Full Layar */}
      <section style={heroStyles.heroSection}>
        <img src="/image/bg2.jpg" alt="Interior Klinik Gigi" style={heroStyles.heroImage} />
        <div style={heroStyles.heroOverlay} data-aos="zoom-in">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight" data-aos="fade-up" data-aos-delay="300">
            <span className="text-rose-300">Hubungi</span> Kami
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-medium leading-relaxed max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="500">
            Kami siap membantu Anda dengan segala pertanyaan dan kebutuhan perawatan gigi Anda.
          </p>
        </div>
      </section>

      {/* Konten Utama Halaman Kontak */}
      <div className="max-w-6xl mx-auto px-6 mt-16"> {/* mt-16 untuk jarak dari hero section */}
        {/* Judul dan paragraf yang sebelumnya ada di sini dihapus karena digantikan oleh hero section */}
        
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-xl border border-pink-100" data-aos="fade-right" data-aos-delay="500">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.658682705599!2d101.4429916742533!3d0.5187700994963576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ac91ee202f5d%3A0x6b4e72c8e3129532!2sJl.%20Durian%20No.28a%2C%20Sukajadi%2C%20Kec.%20Sukajadi%2C%20Kota%20Pekanbaru%2C%20Riau%2028121!5e0!3m2!1sid!2sid!4v1717282800000!5m2!1sid!2sid"
              title="Lokasi Klinik Drg. Tia Dental Care"
              loading="lazy"
              allowFullScreen
              className="w-full h-[450px] border-0"
            ></iframe>
          </div>

          <div className="w-full lg:w-1/2 space-y-6 text-lg text-gray-700" data-aos="fade-left" data-aos-delay="600">
            <div className="flex items-start gap-4">
              <i className="fas fa-map-marker-alt text-2xl text-pink-500"></i>
              <span>
                Jl. Durian No.28a, Sukajadi, Kec. Sukajadi, Kota Pekanbaru, Riau 28121
              </span>
            </div>
            <div className="flex items-start gap-4">
              <i className="fab fa-whatsapp text-2xl text-pink-500"></i>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline"
              >
                0812-3456-7890
              </a>
            </div>
            <div className="flex items-start gap-4">
              <i className="fab fa-instagram text-2xl text-pink-500"></i>
              <a
                href="https://www.instagram.com/tiadentalcare"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:underline"
              >
                @tiadentalcare
              </a>
            </div>
            <div className="flex items-start gap-4">
              <i className="fas fa-clock text-2xl text-pink-500"></i>
              <span>Senin - Sabtu, 08.00 - 17.00 WIB</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Kontak;
