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
          <img src="/image/logo.png" alt="Logo Klinik Gigi" className="logo" />
          <span className="clinic-name">Drg. Tia Dental Care</span>
        </a>

        <nav className="navbar-center">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#reservation">Reservation</a>
          <a href="#produk">Product</a>
          <a href="#dokter">Dokter</a>
          <a href="#testimoni">Testimoni</a>
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
          <p>Make you Smile.</p>
          <a href="#reservation" className="btn-booking">
            Buat Janji Sekarang
          </a>
        </div>
      </section>

      <section
        id="about"
        ref={aboutRef}
        className={`about-section animated-section ${showAbout ? "show" : ""}`}
      >
        <div className="about-content">
          <div className="about-text">
            <h2 className="heading-about">Tentang Kami</h2>
            <p className="intro-about">
              <strong>Drg. Tia Dental Care</strong> hadir sebagai solusi perawatan gigi
              modern yang memadukan keahlian, kenyamanan, dan estetika. Kami percaya,
              setiap senyum adalah cerminan dari rasa percaya diri dan kebahagiaan.
            </p>
            <div className="highlight-list">
              <div className="highlight-box">💎 Klinik bersih, nyaman & Instagramable</div>
              <div className="highlight-box">🦷 Layanan komprehensif: perawatan, behel, bleaching</div>
              <div className="highlight-box">👩‍⚕️ Dokter gigi berpengalaman & tersertifikasi</div>
              <div className="highlight-box">🔬 Teknologi modern & standar sterilisasi tinggi</div>
            </div>
          </div>
          <div className="about-image-wrapper">
            <img
              src="https://lh3.googleusercontent.com/p/AF1QipMOgcjHs6cmQ7oGb-lN_50OtpaE7djoJc-sCVqm=s680-w680-h510-rw"
              alt="Foto Klinik Gigi"
              className="about-img"
            />
          </div>
        </div>
      </section>


      {/* Services */}
      <section
        id="reservation"
        ref={serviceRef}
        className={`services-section animated-section ${showService ? "show" : ""}`}
      >
        <h2 className="service-title">Layanan Kami</h2>
        <p className="service-subtitle">
          Kami menyediakan berbagai perawatan gigi dengan pendekatan profesional dan penuh empati.
        </p>
        <div className="service-cards">
          {[
            {
              img: "/image/g1.jpg",
              title: "Perawatan Gigi Umum",
              desc: "Pemeriksaan rutin, scaling, tambal gigi, dan edukasi kesehatan gigi.",
              rating: 4.7,
            },
            {
              img: "/image/g2.jpg",
              title: "Behel & Ortodonti",
              desc: "Solusi behel metal, ceramic, hingga clear aligner untuk gigi lebih rapi.",
              rating: 5.0,
            },
            {
              img: "/image/g3.jpg",
              title: "Estetika Gigi",
              desc: "Whitening, veneer, dan smile design untuk senyum yang lebih percaya diri.",
              rating: 4.9,
            },
            {
              img: "/image/g4.jpg",
              title: "Perawatan Anak",
              desc: "Layanan ramah anak seperti tambal susu, edukasi menyikat gigi & konsultasi tumbuh kembang gigi.",
              rating: 4.8,
            },
          ].map((layanan, index) => (
            <div className="service-card" key={index}>
              <img src={layanan.img} alt={layanan.title} className="service-img" />
              <h3>{layanan.title}</h3>
              <p>{layanan.desc}</p>
              <div className="service-rating">
                {"⭐".repeat(Math.floor(layanan.rating))}
                {layanan.rating % 1 !== 0 && "✨"}
                <span className="rating-text">({layanan.rating})</span>
              </div>
              <button className="btn-book">Buat Janji</button>
            </div>
          ))}
        </div>
      </section>


      <section
        id="produk"
        ref={produkRef}
        className={`produk-section animated-section ${showProduk ? "show" : ""}`}
      >
        <h2 className="produk-title">Produk Kami</h2>
        <p className="produk-subtitle">
          Semua produk di bawah ini sedang dalam <strong>promo spesial!</strong> Yuk, jangan sampai kehabisan!
        </p>

        <div className="produk-cards">
          {[
            {
              img: "/image/p2.jpg",
              nama: "Pasta Gigi Premium",
              deskripsi: "Memutihkan gigi secara alami.",
              harga: "Rp 45.000",
              rating: 4.6,
            },
            {
              img: "/image/p1.jpg",
              nama: "Obat Kumur Herbal",
              deskripsi: "Nafas segar & antibakteri tanpa alkohol.",
              harga: "Rp 35.000",
              rating: 4.8,
            },
            {
              img: "/image/p3.jpg",
              nama: "Benang Gigi Halus",
              deskripsi: "Membersihkan sela gigi dengan lembut dan efisien.",
              harga: "Rp 25.000",
              rating: 4.4,
            },
            {
              img: "/image/p4.jpg",
              nama: "Tooth Foam Whitening",
              deskripsi: "Pemutih gigi praktis dengan rasa mint segar.",
              harga: "Rp 65.000",
              rating: 4.9,
            },
            {
              img: "/image/p5.jpg",
              nama: "Spray Nafas Fresh",
              deskripsi: "Mini spray untuk nafas segar seketika.",
              harga: "Rp 30.000",
              rating: 4.7,
            },
          ].map((produk, index) => (
            <div className="produk-card" key={index}>
              <div className="promo-badge">Promo</div>
              <img src={produk.img} alt={produk.nama} className="produk-img" />
              <h4>{produk.nama}</h4>
              <p className="produk-desc">{produk.deskripsi}</p>
              <div className="produk-rating">
                {"⭐".repeat(Math.floor(produk.rating))}
                {produk.rating % 1 !== 0 && "✨"}
                <span className="rating-text">({produk.rating})</span>
              </div>
              <div className="produk-harga">{produk.harga}</div>
              <button className="btn-beli">Beli Sekarang</button>
            </div>
          ))}
        </div>
      </section>



      <section id="dokter" className="dokter-kami-section">
        <h2 className="dokter-title">Dokter Kami</h2>
        <p className="dokter-subtitle">Dokter berpengalaman & profesional siap memberikan pelayanan terbaik untuk senyum indahmu 😁</p>

        <div className="dokter-grid">
          {[
            {
              nama: "drg. Fajar Pratama",
              foto: "/image/dokter2.jpg",
              spesialis: "Behel & Ortodonti",
              pengalaman: "8 tahun pengalaman",
            },
            {
              nama: "drg. Rina Lestari",
              foto: "/image/dokter3.jpg",
              spesialis: "Perawatan Anak",
              pengalaman: "5 tahun pengalaman",
            },
            {
              nama: "drg. Budi Setiawan",
              foto: "/image/dokter4.jpg",
              spesialis: "Bedah Mulut",
              pengalaman: "10 tahun pengalaman",
            },
            {
              nama: "drg. Ayu Safitri",
              foto: "/image/dokter5.jpg",
              spesialis: "Konservasi Gigi",
              pengalaman: "7 tahun pengalaman",
            },
            {
              nama: "drg. Rendi Alamsyah",
              foto: "/image/dokter6.jpg",
              spesialis: "Prostodonti",
              pengalaman: "9 tahun pengalaman",
            },
          ].map((dokter, index) => (
            <div className="dokter-card" key={index}>
              <div className="dokter-img-wrapper">
                <img src={dokter.foto} alt={dokter.nama} className="dokter-foto" />
              </div>
              <h4>{dokter.nama}</h4>
              <p className="dokter-spesialis">{dokter.spesialis}</p>
              <p className="dokter-pengalaman">{dokter.pengalaman}</p>
              <button className="btn-profil">Lihat Profil</button>
            </div>
          ))}
        </div>
      </section>



      {/* Testimoni Pasien */}
      <section id="testimoni" className="testimoni-ba-section">
        <h2 className="section-title">💬 Testimoni Pasien Kami</h2>
        <div className="ba-gallery">
          {[
            {
              before: "/image/before1.jpg",
              after: "/image/after1.jpg",
              keterangan: "Veneer Gigi",
            },
            {
              before: "/image/before2.jpg",
              after: "/image/after2.jpg",
              keterangan: "Behel Ortodonti",
            },
            {
              before: "/image/before3.jpg",
              after: "/image/after3.jpg",
              keterangan: "Scaling & Whitening",
            },
            {
              before: "/image/before4.jpg",
              after: "/image/after4.jpg",
              keterangan: "Scaling & Whitening",
            },
          ].map((item, index) => (
            <div className="ba-card" key={index}>
              <div className="ba-images">
                <div className="ba-img">
                  <img src={item.before} alt="Before" />
                  <span className="ba-label">Before</span>
                </div>
                <div className="ba-img">
                  <img src={item.after} alt="After" />
                  <span className="ba-label after">After</span>
                </div>
              </div>
              <div className="ba-keterangan">
                <p>{item.keterangan}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2 className="section-title">📞 Hubungi Kami</h2>
        <p className="sub-text">Kami siap membantu Anda. Silakan hubungi kami kapan saja!</p>

        {/* Info Kontak Awal */}
        <div className="contact-top-info">
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>Jl. Durian No.28a, Sukajadi, Pekanbaru</span>
          </div>
          <div className="contact-item">
            <i className="fab fa-whatsapp"></i>
            <a href="https://wa.me/6281234567890">0812-3456-7890</a>
          </div>
          <div className="contact-item">
            <i className="fab fa-instagram"></i>
            <a href="https://www.instagram.com/tiadentalcare">@tiadentalcare</a>
          </div>
          <div className="contact-item">
            <i className="fas fa-clock"></i>
            <span>Senin - Sabtu, 08.00 - 17.00 WIB</span>
          </div>
        </div>


        {/* MAP Full Width */}
        <div className="map-fullwidth">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15934.376057692196!2d101.4512569!3d0.5104407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ae2f7f1224c7%3A0x4f887af334ad89da!2sDrg.%20Tia%20Dental%20Care!5e0!3m2!1sid!2sid!4v1718799999999"
            loading="lazy"
            allowFullScreen=""
            title="Lokasi Drg. Tia Dental Care"
          ></iframe>
        </div>
      </section>



      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Drg. Tia Dental Care — Make You Smile.</p>
      </footer>
    </div>
  );
};

export default Home;
