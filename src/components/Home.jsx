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
          <a href="#edukasi">Edukasi & Artikel</a>
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

      {/* About Us */}
      <section
        id="about"
        ref={aboutRef}
        className={`about-section animated-section ${showAbout ? "show" : ""}`}
      >
        <div className="about-content">
          <img
            src="https://lh3.googleusercontent.com/p/AF1QipMOgcjHs6cmQ7oGb-lN_50OtpaE7djoJc-sCVqm=s680-w680-h510-rw"
            alt="Foto Klinik Gigi"
            className="about-img"
          />
          <div className="about-text">
            <h2>Tentang Kami</h2>
            <p>
              Di <strong>Drg. Tia Dental Care</strong>, kami percaya bahwa senyum
              sehat adalah awal dari kepercayaan diri dan kualitas hidup yang
              lebih baik.
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
          {[
            {
              img: "/image/g1.jpg",
              title: "Perawatan Umum",
              desc: "Pemeriksaan rutin, scaling, dan penambalan gigi berlubang.",
              rating: 4.5,
            },
            {
              img: "/image/g2.jpg",
              title: "Behel Gigi",
              desc: "Pemasangan kawat gigi untuk penataan gigi yang rapi dan sehat.",
              rating: 5,
            },
            {
              img: "/image/g3.jpg",
              title: "Perawatan Estetik",
              desc: "Veneer, pemutihan gigi, hingga desain senyum profesional.",
              rating: 4.8,
            },
          ].map((layanan, index) => (
            <div className="service-card" key={index}>
              <img src={layanan.img} alt={layanan.title} className="service-img" />
              <h3>{layanan.title}</h3>
              <p>{layanan.desc}</p>
              <div className="service-rating">
                {"⭐".repeat(Math.floor(layanan.rating))}
                {layanan.rating % 1 !== 0 && "✨"} {/* setengah bintang */}
                <span className="rating-text">({layanan.rating})</span>
              </div>
            </div>
          ))}
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
          {[
            {
              img: "/image/p2.jpg",
              nama: "Pasta Gigi Premium",
              deskripsi: "Melindungi enamel & memutihkan gigi secara alami.",
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
          ].map((produk, index) => (
            <div className="produk-card" key={index}>
              <img src={produk.img} alt={produk.nama} className="produk-img" />
              <h4>{produk.nama}</h4>
              <p className="produk-desc">{produk.deskripsi}</p>
              <div className="produk-rating">
                {"⭐".repeat(Math.floor(produk.rating))}
                {produk.rating % 1 !== 0 && "✨"}
                <span className="rating-text">({produk.rating})</span>
              </div>
              <div className="produk-harga">{produk.harga}</div>
            </div>
          ))}
        </div>

      </section>

      <section id="dokter" className="dokter-kami-section">
        <h2>👩‍⚕️ Dokter Kami</h2>
        <p>Tim profesional kami siap melayani dengan sepenuh hati.</p>
        <div className="dokter-grid">
          {[
            { nama: "drg. Tia Maharani", foto: "/image/dokter1.jpg", spesialis: "Estetika Gigi" },
            { nama: "drg. Fajar Pratama", foto: "/image/dokter2.jpg", spesialis: "Behel & Ortodonti" },
            { nama: "drg. Rina Lestari", foto: "/image/dokter3.jpg", spesialis: "Perawatan Anak" },
            { nama: "drg. Budi Setiawan", foto: "/image/dokter4.jpg", spesialis: "Bedah Mulut" },
            { nama: "drg. Ayu Safitri", foto: "/image/dokter5.jpg", spesialis: "Konservasi Gigi" },
            { nama: "drg. Rendi Alamsyah", foto: "/image/dokter6.jpg", spesialis: "Prostodonti" },
          ].map((dokter, index) => (
            <div className="dokter-card" key={index}>
              <div className="dokter-img-wrapper">
                <img src={dokter.foto} alt={dokter.nama} className="dokter-foto" />
              </div>
              <h4>{dokter.nama}</h4>
              <p>{dokter.spesialis}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Testimoni Pasien */}
      <section id="testimoni" className="testimoni-section">
        <h2>⭐ Testimoni Pasien</h2>
        <div className="testimoni-cards">
          <div className="testimoni-card">
            <p>"Pelayanan ramah dan hasil memuaskan!"</p>
            <span>- Rina, Pekanbaru</span>
          </div>
          <div className="testimoni-card">
            <p>"Kliniknya bersih dan sangat nyaman."</p>
            <span>- Dika, Panam</span>
          </div>
        </div>
      </section>
      <section id="before-after" className="before-after-section">
  <h2>📸 Before & After</h2>
  <p className="sub-text">Transformasi senyum pasien kami setelah perawatan di klinik.</p>

  <div className="before-after-gallery">
    {[
      {
        before: "/image/before1.jpg",
        after: "/image/after1.jpg",
        nama: "Citra, 24th",
        keterangan: "Perawatan Veneer Gigi",
      },
      {
        before: "/image/before2.jpg",
        after: "/image/after2.jpg",
        nama: "Andi, 30th",
        keterangan: "Pemasangan Behel",
      },
      {
        before: "/image/before3.jpg",
        after: "/image/after3.jpg",
        nama: "Rani, 21th",
        keterangan: "Whitening & Scaling",
      },
    ].map((item, index) => (
      <div className="ba-card" key={index}>
        <div className="ba-image-pair">
          <div className="ba-image before">
            <img src={item.before} alt="Before" />
            <span>Before</span>
          </div>
          <div className="ba-image after">
            <img src={item.after} alt="After" />
            <span>After</span>
          </div>
        </div>
        <div className="ba-info">
          <h4>{item.nama}</h4>
          <p>{item.keterangan}</p>
        </div>
      </div>
    ))}
  </div>
</section>


      {/* Artikel Edukasi */}
      <section id="edukasi" className="edukasi-section">
        <h2>📝 Artikel Edukasi</h2>
        <div className="artikel-cards">
          <div className="artikel-card">
            <h4>Cara Menjaga Kesehatan Gigi Sehari-hari</h4>
            <p>Tips menyikat gigi dengan benar, jenis makanan yang baik, dan lainnya.</p>
          </div>
          <div className="artikel-card">
            <h4>Kenapa Behel Perlu Perawatan Rutin?</h4>
            <p>Pentingnya kontrol berkala saat menggunakan behel.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2>📞 Hubungi Kami</h2>
        <p>Butuh bantuan? Kami siap melayani Anda</p>

        <div className="contact-map-wrapper">
          {/* MAP - kiri */}
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15934.376057692196!2d101.4512569!3d0.5104407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ae2f7f1224c7%3A0x4f887af334ad89da!2sDrg.%20Tia%20Dental%20Care!5e0!3m2!1sid!2sid!4v1718799999999"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Lokasi Drg. Tia Dental Care"
            ></iframe>
          </div>

          {/* CONTACT - kanan */}
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i> Jl. Mawar No.10, Pekanbaru
            </div>
            <div className="contact-item">
              <i className="fab fa-whatsapp"></i>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                0812-3456-7890 (Chat via WhatsApp)
              </a>
            </div>
            <div className="contact-item">
              <i className="fab fa-instagram"></i>
              <a
                href="https://www.instagram.com/tiadentalcare?igsh=MXhwOWpxc29nN2FrZA=="
                target="_blank"
                rel="noopener noreferrer"
              >
                @tiadentalcare
              </a>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock"></i> Senin - Sabtu, 08.00 - 17.00 WIB
            </div>
          </div>
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
