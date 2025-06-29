import React from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <Header />

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

          <motion.a
            href="/booking"
            style={styles.btnBooking}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Buat Janji Sekarang
          </motion.a>
        </motion.div>
      </section>

      <Footer />
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
    background: "rgba(255, 182, 193, 0.45)", // Soft pink overlay
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
    background: "#db2777", // Tailwind pink-600
    color: "#fff",
    padding: "0.75rem 1.5rem",
    borderRadius: 30,
    textDecoration: "none",
    fontWeight: 600,
    display: "inline-block",
    marginTop: 20,
  },
};

export default Home;
