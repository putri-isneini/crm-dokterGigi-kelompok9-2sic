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
    navigate("/dashboard");
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <a href="" className="navbar-left">
          <img src="/public/image/logo.png" alt="Logo" className="logo" />
          <span className="clinic-name">Drg. Tia Dental Care</span>
        </a>

        <nav className="navbar-center">
          <a href="">Home</a>
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
      <section className="hero-section">
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
              yang lebih baik. Klinik kami menyediakan layanan perawatan gigi
              modern dengan pendekatan ramah, aman, dan nyaman bagi seluruh
              keluarga.
            </p>
            <ul>
              <li>💎 Pelayanan ramah dan profesional</li>
              <li>🦷 Peralatan dan teknologi modern</li>
              <li>👨‍⚕️ Tenaga medis bersertifikat dan berpengalaman</li>
              <li>🌸 Suasana klinik yang nyaman dan Instagramable</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="reservation"
        ref={serviceRef}
        className={`services-section animated-section ${showService ? "show" : ""}`}
      >
        <h2>Layanan Kami</h2>
        <div className="service-cards">
          <div className="service-card">
            <img
              src="https://cdn-icons-png.flaticon.com/128/14698/14698571.png"
              alt="Ikon Gigi Modern"
              className="service-icon"
            />
            <h3>Perawatan Umum</h3>
            <p>
              Pemeriksaan rutin, pembersihan karang gigi, dan penambalan.
            </p>
          </div>
          <div className="service-card">
            <img
              src="https://cdn-icons-png.flaticon.com/128/13351/13351215.png"
              alt="Braces Icon"
              className="service-icon"
            />
            <h3>Behel Gigi</h3>
            <p>
              Solusi estetika dan kesehatan dengan pemasangan kawat gigi.
            </p>
          </div>
          <div className="service-card">
            <img
              src="https://cdn-icons-png.flaticon.com/128/15349/15349458.png"
              alt="Filling Icon"
              className="service-icon"
            />
            <h3>Perawatan Estetik</h3>
            <p>
              Pemutihan gigi, veneer, dan penataan senyum profesional.
            </p>
          </div>
        </div>
      </section>

      {/* Produk Section */}
      <section
        id="produk"
        ref={produkRef}
        className={`produk-section animated-section ${showProduk ? "show" : ""}`}
      >
        <h2>Produk Kami</h2>
        <p className="produk-desc">
          Pilih produk perawatan gigi terbaik untuk senyum Anda
        </p>
        <div className="produk-cards">
          <div className="produk-card">
            <img
              src="https://cdn-icons-png.flaticon.com/128/1730/1730806.png"
              alt="Toothpaste"
            />
            <h3>Pasta Gigi Premium</h3>
            <p>Melindungi enamel dan memutihkan gigi secara alami.</p>
          </div>
          <div className="produk-card">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3798/3798228.png"
              alt="Mouthwash"
            />
            <h3>Obat Kumur Herbal</h3>
            <p>Menjaga nafas segar dan membunuh bakteri mulut.</p>
          </div>
          <div className="produk-card">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3798/3798217.png"
              alt="Dental Floss"
            />
            <h3>Benang Gigi</h3>
            <p>Membersihkan sela gigi secara menyeluruh dan lembut.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
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
