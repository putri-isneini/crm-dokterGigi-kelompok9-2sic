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

      <header className="hero-section">
        <div className="hero-content">
          <h1>Klinik Gigi Sehat</h1>
          <p>Perawatan gigi profesional untuk senyuman terbaik Anda.</p>
          <a href="/booking" className="btn-booking">Buat Janji Sekarang</a>
        </div>
      </header>

      <section className="about-section">
        <h2>Tentang Kami</h2>
        <p>
          Klinik Gigi Sehat hadir dengan pelayanan terbaik dan teknologi modern untuk
          memastikan kesehatan dan kenyamanan gigi Anda sekeluarga.
        </p>
      </section>

      <section className="services-section">
        <h2>Layanan Kami</h2>
        <div className="service-cards">
          <div className="service-card">
            <img src="https://img.icons8.com/fluency/48/tooth.png" alt="Tooth Icon" />
            <h3>Perawatan Umum</h3>
            <p>Pemeriksaan rutin, pembersihan karang gigi, dan penambalan.</p>
          </div>
          <div className="service-card">
            <img src="https://img.icons8.com/fluency/48/braces.png" alt="Braces Icon" />
            <h3>Behel Gigi</h3>
            <p>Solusi estetika dan kesehatan dengan pemasangan kawat gigi.</p>
          </div>
          <div className="service-card">
            <img src="https://img.icons8.com/fluency/48/dental-filling.png" alt="Filling Icon" />
            <h3>Perawatan Estetik</h3>
            <p>Pemutihan gigi, veneer, dan penataan senyum profesional.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Klinik Gigi Sehat. Senyum sehat, hidup lebih baik.</p>
      </footer>
    </div>
  );
};

export default Home;
