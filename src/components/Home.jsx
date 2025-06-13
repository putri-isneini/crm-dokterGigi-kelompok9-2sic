// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import useScrollAnimation from "./useScrollAnimation";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [aboutRef, showAbout] = useScrollAnimation();
  const [serviceRef, showService] = useScrollAnimation();
  const [produkRef, showProduk] = useScrollAnimation();
  const [contactRef, showContact] = useScrollAnimation();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <a href="#home" className="navbar-left">
          <img src="/image/logo.png" alt="Logo" className="logo" />
          <span className="clinic-name">Drg. Tia Dental Care</span>
        </a>

        <nav className="navbar-center">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#reservation">Reservation</a>
          <a href="#produk">Product</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="navbar-right">
          <button className="btn-login" onClick={handleLoginClick}>
            Masuk ke Dashboard
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="overlay" />
        <div className="hero-content">
          <h1>Drg. Tia Dental Care</h1>
          <p>Perawatan gigi profesional untuk senyuman terbaik Anda.</p>
          <a href="#reservation" className="btn-booking">
            Buat Janji Sekarang
          </a>
        </div>
      </section>

      {/* About Us */}
      <section
        id="about"
        ref={aboutRef}
        className={`about-section animated-section ${showAbout ? "show" : ""}`}
      >
        <div className="about-content">
          <img
            src="https://lh3.googleusercontent.com/p/AF1QipMOgcjHs6cmQ7oGb-lN_50OtpaE7djoJc-sCVqm=s680-w680-h510-rw"
            alt="Dokter Gigi"
            className="about-img"
          />
          <div className="about-text">
            <h2>Tentang Kami</h2>
            <p>
              Di <strong>Drg. Tia Dental Care</strong>, kami percaya bahwa
              senyum sehat adalah awal dari kepercayaan diri dan kualitas hidup
              yang lebih baik.
            </p>
            <ul>
              <li>💿 Pelayanan ramah dan profesional</li>
              <li>🦷 Peralatan dan teknologi modern</li>
              <li>👨‍⚕️ Tenaga medis bersertifikat dan berpengalaman</li>
              <li>🌸 Suasana klinik yang nyaman dan Instagramable</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="reservation"
        ref={serviceRef}
        className={`services-section animated-section ${showService ? "show" : ""}`}
      >
        <h2>Layanan Kami</h2>
        <div className="service-cards">
          {/* Perawatan Umum */}
          <div className="service-card">
            <img
              src="/image/g1.jpg"
              alt="Perawatan Umum"
              className="service-photo"
            />
            <h3>Perawatan Umum</h3>
            <p>Pemeriksaan rutin, pembersihan karang gigi, dan penambalan.</p>
          </div>

          {/* Behel Gigi */}
          <div className="service-card">
            <img
              src="/image/g2.jpg"
              alt="Behel Gigi"
              className="service-photo"
            />
            <h3>Behel Gigi</h3>
            <p>Solusi estetika dan kesehatan dengan pemasangan kawat gigi.</p>
          </div>

          {/* Perawatan Estetik */}
          <div className="service-card">
            <img
              src="/image/g3.jpg"
              alt="Perawatan Estetik"
              className="service-photo"
            />
            <h3>Perawatan Estetik</h3>
            <p>Pemutihan gigi, veneer, dan penataan senyum profesional.</p>
          </div>
        </div>
      </section>


      {/* Produk */}
      <section
        id="produk"
        ref={produkRef}
        className={`produk-section animated-section ${showProduk ? "show" : ""}`}
      >
        <h2>Produk Kami</h2>
        <div className="produk-cards">
          <div className="produk-card">
            <img src="/image/p2.jpg" alt="Pasta Gigi Premium" className="produk-img" />
            <h3><strong>Pasta Gigi Premium</strong></h3>
            <p><strong>Melindungi enamel & memutihkan gigi secara alami.</strong></p>
          </div>
          <div className="produk-card">
            <img src="/image/p1.jpg" alt="Obat Kumur Herbal" className="produk-img" />
            <h3><strong>Obat Kumur Herbal</strong></h3>
            <p><strong>Menjaga nafas segar & membunuh bakteri mulut.</strong></p>
          </div>
          <div className="produk-card">
            <img src="/image/p3.jpg" alt="Benang Gigi" className="produk-img" />
            <h3><strong>Benang Gigi</strong></h3>
            <p><strong>Membersihkan sela gigi secara menyeluruh & lembut.</strong></p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        ref={contactRef}
        className={`contact-section animated-section ${showContact ? "show" : ""}`}
      >
        <h2>Hubungi Kami</h2>
        <a
          href="https://www.instagram.com/tiadentalcare"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-instagram"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
            alt="Instagram Icon"
          />
          @tiadentalcare
        </a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Klinik Gigi Sehat. Senyum sehat, hidup lebih baik.</p>
      </footer>
    </div>
  );
};

export default Home;
