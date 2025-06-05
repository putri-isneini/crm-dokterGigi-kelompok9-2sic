import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="home-container">
      {/* Tombol Login */}
      <div className="login-button-container">
        <button className="btn-login" onClick={handleLoginClick}>
          Masuk ke Dashboard
        </button>
      </div>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="overlay" />
        <div className="hero-content">
          <h1>Drg. Tia Dental Care</h1>
          <p>Perawatan gigi profesional untuk senyuman terbaik Anda.</p>
          <a href="/janji" className="btn-booking">
            Buat Janji Sekarang
          </a>
        </div>
      </header>

      {/* About Us */}
      <section className="about-section">
        <div className="about-content">
          <img
            src="https://lh3.googleusercontent.com/p/AF1QipMOgcjHs6cmQ7oGb-lN_50OtpaE7djoJc-sCVqm=s680-w680-h510-rw"
            alt="Dokter Gigi"
            className="about-img"
          />
          <div className="about-text">
            <h2>Tentang Kami</h2>
            <p>
              Di <strong>Drg. Tia Dental Care</strong>, kami percaya bahwa senyum sehat adalah awal dari kepercayaan diri dan kualitas hidup yang lebih baik.
              Klinik kami menyediakan layanan perawatan gigi modern dengan pendekatan ramah, aman, dan nyaman bagi seluruh keluarga.
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

      {/* Services */}
      <section className="services-section">
        <h2>Layanan Kami</h2>
        <div className="service-cards">
          <div className="service-card">
            <img
              src="https://cdn-icons-png.flaticon.com/128/14698/14698571.png"
              alt="Ikon Gigi Modern"
              className="service-icon"
            />
            <h3>Perawatan Umum</h3>
            <p>Pemeriksaan rutin, pembersihan karang gigi, dan penambalan.</p>
          </div>
          <div className="service-card">
            <img
              src="https://cdn-icons-png.flaticon.com/128/13351/13351215.png"
              alt="Braces Icon"
              className="service-icon"
            />
            <h3>Behel Gigi</h3>
            <p>Solusi estetika dan kesehatan dengan pemasangan kawat gigi.</p>
          </div>
          <div className="service-card">
            <img
              src="https://cdn-icons-png.flaticon.com/128/15349/15349458.png"
              alt="Filling Icon"
              className="service-icon"
            />
            <h3>Perawatan Estetik</h3>
            <p>Pemutihan gigi, veneer, dan penataan senyum profesional.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Klinik Gigi Sehat. Senyum sehat, hidup lebih baik.</p>
      </footer>
    </div>
  );
};

export default Home;
