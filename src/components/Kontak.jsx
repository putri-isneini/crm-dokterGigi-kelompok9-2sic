import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Kontak = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Mengecek apakah ada pasien_id di localStorage.
    // Ini mungkin perlu disesuaikan dengan logika otentikasi admin Anda.
    // Jika Anda ingin tombol ini hanya terlihat oleh admin, pastikan ada indikator admin di localStorage.
    const pasienId = localStorage.getItem("pasien_id");
    // Untuk tujuan admin, mungkin Anda perlu mengecek role atau token admin
    // Contoh sederhana: setIsLoggedIn(localStorage.getItem("admin_token") !== null);
    setIsLoggedIn(!!pasienId); // Menganggap jika ada pasienId, maka bisa masuk ke halaman admin/login
  }, []);

  const goToLogin = () => { // Mengubah nama fungsi dari goToAdmin menjadi goToLogin
    navigate("/login"); // Mengubah rute navigasi dari "/admin" menjadi "/login"
  };

  return (
    <>
      <section className="kontak-wrapper">
        <div className="kontak-container">
          <h2 className="kontak-title">📞 Hubungi Kami</h2>
          <p className="kontak-subtitle">
            Kami siap membantu Anda. Silakan hubungi kami kapan saja!
          </p>

          <div className="kontak-content">
            {/* Map */}
            <div className="kontak-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.658682705599!2d101.4429916742533!3d0.5187700994963576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ac91ee202f5d%3A0x6b4e72c8e3129532!2sJl.%20Durian%20No.28a%2C%20Sukajadi%2C%20Kec.%20Sukajadi%2C%20Kota%20Pekanbaru%2C%20Riau%2028121!5e0!3m2!1sid!2sid!4v1717282800000!5m2!1sid!2sid" // Mengganti URL map yang lebih spesifik
                title="Lokasi Klinik Drg. Tia Dental Care"
                loading="lazy"
                allowFullScreen
              ></iframe>
            </div>

            {/* Contact Info */}
            <div className="kontak-info">
              <div className="info-item">
                <i className="fas fa-map-marker-alt info-icon"></i>
                <span>
                  Jl. Durian No.28a, Sukajadi, Kec. Sukajadi, Kota Pekanbaru, Riau 28121
                </span>
              </div>
              <div className="info-item">
                <i className="fab fa-whatsapp info-icon"></i>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"> {/* Tambah rel="noopener noreferrer" untuk keamanan */}
                  0812-3456-7890
                </a>
              </div>
              <div className="info-item">
                <i className="fab fa-instagram info-icon"></i>
                <a href="https://www.instagram.com/tiadentalcare" target="_blank" rel="noopener noreferrer"> {/* Tambah rel="noopener noreferrer" */}
                  @tiadentalcare
                </a>
              </div>
              <div className="info-item">
                <i className="fas fa-clock info-icon"></i>
                <span>Senin - Sabtu, 08.00 - 17.00 WIB</span>
              </div>

              {isLoggedIn && (
                <button className="admin-button" onClick={goToLogin}> {/* Mengubah onClick ke goToLogin */}
                  Masuk ke Halaman Login Admin
                </button>
              )}
            </div>
          </div>
        </div>

        <style>{`
          /* Font Imports */
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Montserrat:wght@600;700;800&display=swap');

          .kontak-wrapper {
            background: #fff0f6; /* Warna latar belakang lembut */
            padding: 80px 20px 40px;
            font-family: 'Roboto', sans-serif; /* Font default */
            color: #333;
          }
          .kontak-container {
            max-width: 1100px;
            margin: 0 auto;
            text-align: center;
          }
          .kontak-title {
            font-size: 2.8rem; /* Ukuran font lebih besar */
            font-weight: 800; /* Lebih tebal */
            color: #AD1457; /* Warna pink gelap yang elegan */
            margin-bottom: 15px; /* Jarak lebih besar */
            font-family: 'Montserrat', sans-serif; /* Font untuk judul */
          }
          .kontak-subtitle {
            color: #555;
            font-size: 1.2rem; /* Ukuran font lebih besar */
            margin-bottom: 50px; /* Jarak lebih besar */
          }
          .kontak-content {
            display: flex;
            flex-wrap: wrap;
            gap: 50px; /* Jarak antar kolom lebih besar */
            justify-content: center;
            align-items: flex-start;
          }
          .kontak-map {
            flex: 1;
            min-width: 320px; /* Lebar minimum sedikit lebih besar */
            height: 450px; /* Tinggi map lebih besar */
            box-shadow: 0 10px 30px rgba(0,0,0,0.15); /* Shadow lebih menonjol */
            border-radius: 20px; /* Sudut lebih membulat */
            overflow: hidden;
            border: 2px solid #f8bbd0; /* Border halus */
          }
          .kontak-map iframe {
            width: 100%;
            height: 100%;
            border: 0;
          }
          .kontak-info {
            flex: 1;
            min-width: 300px; /* Lebar minimum sedikit lebih besar */
            text-align: left;
            display: flex;
            flex-direction: column;
            gap: 25px; /* Jarak antar info item lebih besar */
            padding: 20px 0; /* Padding vertikal */
          }
          .info-item {
            display: flex;
            align-items: flex-start; /* Menggunakan flex-start agar ikon dan teks sejajar di atas */
            gap: 15px; /* Jarak ikon dan teks lebih besar */
            font-size: 1.1rem; /* Ukuran font lebih besar */
            color: #444;
            line-height: 1.5; /* Spasi baris untuk alamat */
          }
          .info-icon {
            font-size: 1.6rem; /* Ukuran ikon lebih besar */
            color: #E91E63; /* Warna ikon yang menarik */
            flex-shrink: 0; /* Pastikan ikon tidak menyusut */
          }
          .info-item a {
            color: #E91E63; /* Warna link yang menarik */
            text-decoration: none;
            font-weight: 500;
          }
          .info-item a:hover {
            text-decoration: underline;
            color: #d81b60; /* Warna hover link */
          }
          .admin-button {
            margin-top: 40px; /* Jarak lebih besar dari info di atasnya */
            align-self: flex-start;
            background-color: #AD1457; /* Warna tombol yang kuat */
            color: white;
            border: none;
            padding: 14px 32px; /* Padding tombol lebih besar */
            border-radius: 9999px;
            font-size: 1.1rem; /* Ukuran font tombol lebih besar */
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 6px 16px rgba(173, 20, 87, 0.3); /* Shadow tombol lebih menonjol */
            transition: background 0.3s ease, transform 0.2s ease;
          }
          .admin-button:hover {
            background-color: #880E4F; /* Warna hover tombol */
            transform: translateY(-2px); /* Efek angkat saat hover */
          }
          .admin-button:active {
            transform: translateY(0); /* Kembali ke posisi semula saat diklik */
          }

          @media (max-width: 768px) {
            .kontak-title {
              font-size: 2.2rem;
            }
            .kontak-subtitle {
              font-size: 1rem;
            }
            .kontak-content {
              flex-direction: column;
              align-items: center;
              gap: 30px;
            }
            .kontak-map,
            .kontak-info {
              width: 100%;
              min-width: unset; /* Hapus min-width di mobile */
              height: 350px; /* Sesuaikan tinggi map di mobile */
            }
            .info-item {
              font-size: 1rem;
            }
            .info-icon {
              font-size: 1.4rem;
            }
            .admin-button {
                width: 100%; /* Tombol full width di mobile */
                align-self: center; /* Tengah tombol di mobile */
                max-width: 300px; /* Batasi lebar tombol */
            }
          }
        `}</style>
      </section>

      <Footer />
    </>
  );
};

export default Kontak;