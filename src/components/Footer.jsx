import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Kolom 1: Info Klinik */}
        <div style={styles.column}>
          <h3 style={styles.title}>drg. Tia Dental Care</h3>
          <p style={styles.text}>Jl. Senyum Sehat No. 12, Surabaya</p>
          <p style={styles.text}>WhatsApp: 0812-3456-7890</p>
          <p style={styles.text}>Email: info@tiadentalcare.com</p>
        </div>

        {/* Kolom 2: Navigasi */}
        <div style={styles.column}>
          <h4 style={styles.subtitle}>Menu</h4>
          <ul style={styles.linkList}>
            <li><a href="#home" style={styles.link}>Beranda</a></li>
            <li><a href="#about" style={styles.link}>Tentang Kami</a></li>
            <li><a href="#reservation" style={styles.link}>Layanan</a></li>
            <li><a href="#produk" style={styles.link}>Promo</a></li>
            <li><a href="#testimoni" style={styles.link}>Testimoni</a></li>
            <li><a href="#contact" style={styles.link}>Kontak</a></li>
            <li><a href="#artikel" style={styles.link}>Artikel</a></li>
          </ul>
        </div>

        {/* Kolom 3: Artikel */}
        <div style={styles.column}>
          <h4 style={styles.subtitle}>Artikel Terbaru</h4>
          <ul style={styles.linkList}>
            <li><a href="#artikel1" style={styles.link}>🦷 Cara Merawat Gigi Sehat</a></li>
            <li><a href="#artikel2" style={styles.link}>😁 Tips Senyum Cerah</a></li>
            <li><a href="#artikel3" style={styles.link}>👶 Gigi Anak & Perawatannya</a></li>
          </ul>
        </div>
      </div>

      {/* Bawah */}
      <div style={styles.bottom}>
        <p style={styles.copyright}>
          &copy; {new Date().getFullYear()} drg. Tia Dental Care. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#fff0f6",
    padding: "4rem 2rem 2rem",
    marginTop: "5rem",
    borderTop: "2px solid #fbcfe8",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: 1200,
    margin: "0 auto",
    gap: "2rem",
  },
  column: {
    flex: "1 1 250px",
    minWidth: "200px",
  },
  title: {
    color: "#be185d",
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  subtitle: {
    color: "#db2777",
    fontSize: "1.25rem",
    marginBottom: "0.8rem",
  },
  text: {
    color: "#6b7280",
    margin: "0.4rem 0",
    fontSize: "0.95rem",
  },
  linkList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    textDecoration: "none",
    color: "#6b7280",
    fontSize: "0.95rem",
    display: "block",
    marginBottom: "0.5rem",
    transition: "color 0.2s ease",
  },
  bottom: {
    textAlign: "center",
    marginTop: "2.5rem",
    borderTop: "1px solid #fbcfe8",
    paddingTop: "1.5rem",
  },
  copyright: {
    fontSize: "0.85rem",
    color: "#a1a1aa",
  },
};

export default Footer;
