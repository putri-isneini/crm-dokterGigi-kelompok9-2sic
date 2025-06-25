import React from 'react';
import Footer from "./Footer";

const Kontak = () => {
  return (
    <>
    <section id="contact" className="contact-section">
      <h2 className="section-title">📞 Hubungi Kami</h2>
      <p className="sub-text">Kami siap membantu Anda. Silakan hubungi kami kapan saja!</p>

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

      <div className="map-fullwidth">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15934.376057692196!2d101.4512569!3d0.5104407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ae2f7f1224c7%3A0x4f887af334ad89da!2sDrg.%20Tia%20Dental%20Care!5e0!3m2!1sid!2sid!4v1718799999999"
          loading="lazy"
          allowFullScreen=""
          title="Lokasi Drg. Tia Dental Care"
        ></iframe>
      </div>

      <style>{`
        .contact-section {
          background-color: #fff0f6;
          padding: 80px 20px 0;
          text-align: center;
        }
        .section-title {
          font-size: 2.4rem;
          color: #d63384;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .sub-text {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 40px;
        }
        .contact-top-info {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          color: #444;
        }
        .contact-item i {
          color: #d63384;
          font-size: 1.2rem;
        }
        .contact-item a {
          color: #d63384;
          text-decoration: none;
          font-weight: 500;
        }
        .contact-item a:hover {
          text-decoration: underline;
        }
        .map-fullwidth {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          height: 400px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border-radius: 0;
          overflow: hidden;
        }
        .map-fullwidth iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        @media (max-width: 768px) {
          .contact-top-info {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .map-fullwidth {
            height: 300px;
          }
        }
      `}</style>
    </section>
    <Footer/>
    </>
  );
};

export default Kontak;
