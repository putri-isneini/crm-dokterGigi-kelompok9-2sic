import React from "react";
// Hapus baris ini: import Footer from "./Footer";

const Testimoni = () => {
  const testimoniList = [
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
  ];

  return (
    <>
      <section id="testimoni" style={styles.section}>
        <h2 style={styles.title}>
          💬 Testimoni Pasien Kami
          <span style={styles.titleUnderline}></span>
        </h2>

        <div style={styles.gallery}>
          {testimoniList.map((item, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.images}>
                <div style={styles.imgWrapper}>
                  <img src={item.before} alt="Before" style={styles.image} />
                  <span style={styles.label}>Before</span>
                </div>
                <div style={styles.imgWrapper}>
                  <img src={item.after} alt="After" style={styles.image} />
                  <span style={{ ...styles.label, ...styles.labelAfter }}>After</span>
                </div>
              </div>
              <div style={styles.keterangan}>
                <p>{item.keterangan}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Hapus baris ini: <Footer /> */}
    </>
  );
};

const styles = {
  section: {
    backgroundColor: "#fff0f6",
    padding: "100px 20px",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    color: "#d63384",
    marginBottom: "50px",
    fontWeight: "bold",
    position: "relative",
  },
  titleUnderline: {
    content: "''",
    display: "block",
    width: "80px",
    height: "4px",
    background: "#f78fb3",
    margin: "10px auto 0",
    borderRadius: "10px",
  },
  gallery: {
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "24px",
    boxShadow: "0 8px 24px rgba(214, 51, 132, 0.1)",
    padding: "25px",
    maxWidth: "580px",
    width: "100%",
    transition: "0.3s ease",
  },
  images: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
  },
  imgWrapper: {
    position: "relative",
    flex: 1,
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "18px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  },
  label: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#fff",
    color: "#d63384",
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: "12px",
    fontSize: "0.85rem",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  },
  labelAfter: {
    backgroundColor: "#d63384",
    color: "#fff",
  },
  keterangan: {
    marginTop: 0,
  },
  keteranganText: {
    margin: 0,
    fontWeight: 600,
    color: "#d63384",
    backgroundColor: "#ffe6f0",
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: "14px",
    fontSize: "1rem",
  },
};

export default Testimoni;