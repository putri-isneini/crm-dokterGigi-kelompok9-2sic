import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header style={styles.navbar}>
      <a href="/" style={styles.navbarLeft}>
        <img src="/image/logo.png" alt="Logo Klinik Gigi" style={styles.logo} />
        <span style={styles.clinicName}>Drg. Tia Dental Care</span>
      </a>

      <nav style={styles.navbarCenter}>
        <a href="/">Beranda</a>
        <a href="/tentang">Tentang Kami</a>
        <a href="/layanan">Layanan</a>
        <a href="/testimoni">Testimoni</a>
        <a href="/kontak">Kontak</a>
      </nav>

      <div>
        <button style={styles.btnLogin} onClick={handleLoginClick}>
          Masuk ke Dashboard
        </button>
      </div>
    </header>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0rem 1rem",
    background: "linear-gradient(135deg, #fff0f5, #ffe4e6)",
    boxShadow: "0 4px 16px rgba(255, 105, 180, 0.15)",
    backdropFilter: "blur(10px)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottom: "1px solid #fbcfe8",
  },
  navbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    color: "#db2777",
    textDecoration: "none",
  },
  logo: {
    width: 88,
    height: 88,
    objectFit: "cover",
    borderRadius: 20,
  },
  clinicName: {
    fontWeight: 800,
    fontSize: "1.65rem",
    fontFamily: "Poppins, sans-serif",
    color: "#f829c4",
  },
   navbarCenter: {
    display: "flex",
    gap: "2.5rem",
    fontSize: "1.3rem", // 🔥 diperbesar
    fontWeight: 600,
    color: "#881337",
  },
  btnLogin: {
    background: "linear-gradient(to right, #db2777, #f472b6)",
    color: "white",
    border: "none",
    padding: "0.6rem 1.4rem",
    fontSize: "1rem",
    borderRadius: "30px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(255, 105, 180, 0.3)",
    fontWeight: "bold",
  },
};

export default Header;
