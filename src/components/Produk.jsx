import React from "react";
import Footer from "./Footer";

const Produk = ({ produkRef, showProduk }) => {
  const produkList = [
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
  ];

  return (
    <>
    <section
      id="produk"
      ref={produkRef}
      className={`produk-section animated-section ${showProduk ? "show" : ""}`}
      style={styles.produkSection}
    >
      <h2 style={styles.produkTitle}>Produk Kami</h2>
      <p style={styles.produkSubtitle}>
        Semua produk di bawah ini sedang dalam <strong>promo spesial!</strong> Yuk, jangan sampai kehabisan!
      </p>

      <div style={styles.produkCards}>
        {produkList.map((produk, index) => (
          <div style={styles.produkCard} key={index}>
            <div style={styles.promoBadge}>Promo</div>
            <img src={produk.img} alt={produk.nama} style={styles.produkImg} />
            <h4 style={styles.nama}>{produk.nama}</h4>
            <p style={styles.produkDesc}>{produk.deskripsi}</p>
            <div style={styles.produkRating}>
              {"⭐".repeat(Math.floor(produk.rating))}
              {produk.rating % 1 !== 0 && "✨"}
              <span style={styles.ratingText}>({produk.rating})</span>
            </div>
            <div style={styles.produkHarga}>{produk.harga}</div>
            <button style={styles.btnBeli}>Beli Sekarang</button>
          </div>
        ))}
      </div>
    </section>
    <Footer/>
    </>
  );
};

const styles = {
  produkSection: {
    background: "linear-gradient(to bottom, #fff0f5, #ffe8f1)",
    padding: "5rem 2rem",
    textAlign: "center",
  },
  produkTitle: {
    fontSize: "2.75rem",
    fontWeight: 800,
    color: "#db2777",
    marginBottom: "0.5rem",
  },
  produkSubtitle: {
    fontSize: "1.1rem",
    fontWeight: 500,
    color: "#6b021d",
    marginBottom: "3rem",
  },
  produkCards: {
    display: "flex",
    gap: "2rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  produkCard: {
    backgroundColor: "#fff",
    padding: "1.5rem 1.25rem",
    borderRadius: "18px",
    width: "230px",
    boxShadow: "0 8px 22px rgba(251, 113, 133, 0.08)",
    transition: "all 0.3s ease",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  promoBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#db2777",
    color: "white",
    fontSize: "0.7rem",
    padding: "4px 10px",
    borderRadius: "50px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
  },
  produkImg: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "0.8rem",
  },
  nama: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#be185d",
    marginBottom: "0.3rem",
    textAlign: "center",
  },
  produkDesc: {
    fontSize: "0.95rem",
    color: "#666",
    fontWeight: 500,
    marginBottom: "0.7rem",
    textAlign: "center",
  },
  produkRating: {
    fontSize: "1rem",
    color: "#f59e0b",
    marginBottom: "0.4rem",
  },
  ratingText: {
    fontSize: "0.85rem",
    color: "#888",
    marginLeft: "0.3rem",
  },
  produkHarga: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#db2777",
    marginBottom: "0.8rem",
  },
  btnBeli: {
    backgroundColor: "#db2777",
    color: "white",
    border: "none",
    padding: "0.5rem 1.2rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    borderRadius: "30px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(251, 113, 133, 0.15)",
  },
};

export default Produk;
