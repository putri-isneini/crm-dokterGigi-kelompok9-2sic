import React from "react";

const Beranda = () => {
  return (
    <section id="home" style={styles.heroSection}>
      <div style={styles.overlay}></div>
      <div style={styles.heroContent}>
        <h1 style={styles.heading}>Drg. Tia Dental Care</h1>
        <p style={styles.subheading}>Make you Smile.</p>
        <a href="#reservation" style={styles.btnBooking}>
          Buat Janji Sekarang
        </a>
      </div>
    </section>
  );
};

const styles = {
  heroSection: {
    position: "relative",
    background: `url("/image/bg1.jpg") center/cover no-repeat`,
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    overflow: "hidden",
    paddingTop: 130,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(255, 182, 193, 0.45)",
    zIndex: 1,
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: 900,
    padding: "0 2rem",
  },
  heading: {
    fontSize: "5rem",
    fontWeight: 800,
    color: "#fff",
    marginBottom: "1rem",
    textShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  subheading: {
    fontSize: "1.75rem",
    color: "#fffefc",
    marginBottom: "2rem",
    opacity: 0.95,
  },
  btnBooking: {
    background: "#db2777",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: 30,
    textDecoration: "none",
    fontWeight: 600,
  },
};

export default Beranda;
