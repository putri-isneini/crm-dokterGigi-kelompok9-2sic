import React from "react";
import { motion } from "framer-motion";
import { useOutletContext, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import HomeTentangKamiSection from './HomeTentangKamiSection';
import HomeLayananKamiSection from './HomeLayananKamiSection';
import HomeKontakSection from './HomeKontakSection';
import FaqSection from "./FaqSection";
import TestimoniSection from "./TestimoniSection";

const Home = () => {
  const context = useOutletContext?.() || {};
  const { isLoggedIn = false, userRole = null } = context;
  const navigate = useNavigate();

  React.useEffect(() => {
    AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
  }, []);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      if (userRole === 'Pasien') {
        console.log("Home: User is Pasien, navigating to /booking");
        navigate("/booking");
      } else if (['Admin', 'Dokter', 'Staf'].includes(userRole)) {
        console.log("Home: User is Admin/Dokter/Staf, navigating to /dashboard");
        navigate("/dashboard");
      } else {
        console.log("Home: User is logged in but role is unknown, navigating to /");
        navigate("/");
      }
    } else {
      console.log("Home: User not logged in, navigating to /login");
      navigate("/login");
    }
  };

  let buttonText = "Login / Daftar";
  if (isLoggedIn) {
    if (userRole === 'Pasien') {
      buttonText = "Buat Janji Sekarang";
    } else if (['Admin', 'Dokter', 'Staf'].includes(userRole)) {
      buttonText = "Ke Dashboard";
    }
  }

  return (
    <>
      <section id="home" style={styles.heroSection}>
        <div style={styles.overlay} />

        <motion.div
          style={styles.heroContent}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.h1
            style={styles.heading}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            Drg. Tia Dental Care
          </motion.h1>

          <motion.p
            style={styles.subheading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Make you Smile.
          </motion.p>

          <motion.button
            onClick={handleButtonClick}
            style={styles.btnBooking}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {buttonText}
          </motion.button>
        </motion.div>
      </section>

      <HomeTentangKamiSection />
      <HomeLayananKamiSection />
      <FaqSection />
      <TestimoniSection />
      <HomeKontakSection />
    </>
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
    display: "inline-block",
    marginTop: 20,
    border: 'none',
    cursor: 'pointer',
  },
};

export default Home;
