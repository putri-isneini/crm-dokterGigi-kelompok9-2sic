// src/components/HomeKontakSection.jsx
import React, { useEffect } from 'react';
import { MapPin, Phone, Instagram } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

const HomeKontakSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
  }, []);

  return (
    <section id="kontak-home" className="bg-gradient-to-br from-pink-100 to-rose-50 py-24 relative overflow-hidden">
      {/* Decorative background shape - subtle wave */}
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="absolute bottom-0 left-0 w-full h-auto text-pink-50 opacity-70" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" fillOpacity="1" d="M0,192L48,192C96,192,192,192,288,181.3C384,171,480,149,576,149.3C672,149,768,171,864,181.3C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 text-center max-w-full lg:max-w-6xl relative z-10">
        <h2 className="text-5xl md:text-6xl font-extrabold text-pink-800 mb-16 relative" data-aos="fade-up">
          <span className="block text-rose-600">Hubungi</span> Kami
          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-20px] w-32 h-2 bg-rose-500 rounded-full"></span>
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-12 bg-white p-12 rounded-3xl shadow-2xl border border-pink-200 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-3xl" data-aos="fade-up" data-aos-delay="200">
          <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-xl border border-pink-100" data-aos="fade-right" data-aos-delay="400">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.658682705599!2d101.4429916742533!3d0.5187700994963576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ac91ee202f5d%3A0x6b4e72c8e3129532!2sJl.%20Durian%20No.28a%2C%20Sukajadi%2C%20Kec.%20Sukajadi%2C%20Kota%20Pekanbaru%2C%20Riau%2028121!5e0!3m2!1sid!2sid!4v1717282800000!5m2!1sid!2sid"
              title="Lokasi Klinik Drg. Tia Dental Care"
              loading="lazy"
              allowFullScreen
              className="w-full h-80 lg:h-96 border-0 rounded-xl"
            ></iframe>
          </div>

          <div className="w-full lg:w-1/2 space-y-8 text-lg text-gray-700 text-left" data-aos="fade-left" data-aos-delay="400">
            <div className="flex items-start gap-4">
              <MapPin className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <span className="text-xl leading-relaxed text-gray-800">
                Jl. Durian No.28a, Sukajadi, Kec. Sukajadi, Kota Pekanbaru, Riau 28121
              </span>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-700 hover:text-pink-900 hover:underline text-xl font-medium"
              >
                0812-3456-7890
              </a>
            </div>
            <div className="flex items-start gap-4">
              <Instagram className="w-8 h-8 text-pink-600 flex-shrink-0 mt-1" />
              <a
                href="https://www.instagram.com/tiadentalcare"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-700 hover:text-pink-900 hover:underline text-xl font-medium"
              >
                @tiadentalcare
              </a>
            </div>
            <Link
              to="/kontak"
              className="inline-flex items-center justify-center mt-10 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-75"
            >
              Lihat Selengkapnya
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeKontakSection;
