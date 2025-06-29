import React, { useEffect, useRef } from "react";
import Footer from "./Footer";

const LayananKami = ({ sectionRef }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          containerRef.current.classList.add("fade-in");
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
  }, []);

  const layananData = [
    {
      img: "/image/g1.jpg",
      title: "Perawatan Gigi Umum",
      desc: "Pemeriksaan rutin, scaling, tambal gigi, dan edukasi kesehatan gigi.",
      rating: 4.7,
    },
    {
      img: "/image/g2.jpg",
      title: "Behel & Ortodonti",
      desc: "Solusi behel metal, ceramic, hingga clear aligner.",
      rating: 5.0,
    },
    {
      img: "/image/g3.jpg",
      title: "Estetika Gigi",
      desc: "Whitening, veneer, smile design untuk senyum lebih percaya diri.",
      rating: 4.9,
    },
    {
      img: "/image/g4.jpg",
      title: "Perawatan Gusi & Saraf",
      desc: "Penanganan gusi berdarah, infeksi, hingga perawatan saluran akar.",
      rating: 4.8,
    },
  ];

  const produkData = [
    {
      img: "/image/p1.jpg",
      title: "Obat Kumur Herbal",
      desc: "Nafas segar & antibakteri tanpa alkohol.",
      rating: 4.8,
      harga: "Rp 35.000",
    },
    {
      img: "/image/p2.jpg",
      title: "Pasta Gigi Premium",
      desc: "Memutihkan gigi secara alami dengan bahan herbal.",
      rating: 4.6,
      harga: "Rp 45.000",
    },
    {
      img: "/image/p3.jpg",
      title: "Benang Gigi Halus",
      desc: "Membersihkan sela gigi dengan lembut dan efisien.",
      rating: 4.4,
      harga: "Rp 25.000",
    },
    {
      img: "/image/p4.jpg",
      title: "Tooth Foam Whitening",
      desc: "Pemutih gigi praktis dengan rasa mint segar.",
      rating: 4.9,
      harga: "Rp 65.000",
    },
    {
      img: "/image/p5.jpg",
      title: "Spray Nafas Fresh",
      desc: "Mini spray untuk nafas segar seketika.",
      rating: 4.7,
      harga: "Rp 30.000",
    },
  ];

  const renderCard = (item, isProduk = false) => (
    <div
      key={item.title}
      style={{
        backgroundColor: "#fff",
        borderRadius: "28px",
        padding: "2.5rem",
        boxShadow: "0 18px 40px rgba(251, 207, 232, 0.4)",
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={item.img}
        alt={item.title}
        style={{
          width: "100%",
          height: "240px",
          objectFit: "cover",
          borderRadius: "18px",
          marginBottom: "1.25rem",
        }}
      />
      <h3
        style={{
          fontSize: "1.75rem",
          fontWeight: "700",
          color: "#db2777",
          marginBottom: "0.75rem",
        }}
      >
        {item.title}
      </h3>
      <p style={{ fontSize: "1.05rem", color: "#444", marginBottom: "1.2rem" }}>
        {item.desc}
      </p>
      <div style={{ fontSize: "1.1rem", color: "#f59e0b", marginBottom: "0.75rem" }}>
        {"⭐".repeat(Math.floor(item.rating))}{" "}
        <span style={{ fontSize: "0.9rem", color: "#777" }}>({item.rating})</span>
      </div>
      {isProduk && (
        <div
          style={{
            fontSize: "1.1rem",
            fontWeight: "700",
            color: "#be185d",
            marginBottom: "1.2rem",
          }}
        >
          {item.harga}
        </div>
      )}
      <button
        style={{
          marginTop: "auto",
          backgroundColor: "#db2777",
          color: "white",
          border: "none",
          padding: "0.85rem 1.7rem",
          fontSize: "1.05rem",
          fontWeight: 600,
          borderRadius: "32px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(251, 113, 133, 0.3)",
        }}
      >
        {isProduk ? "Beli Sekarang" : "Buat Janji"}
      </button>
    </div>
  );

  const renderGrid = (data, isProduk = false) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "3rem",
        marginBottom: "5rem",
      }}
    >
      {data.map((item) => renderCard(item, isProduk))}
    </div>
  );

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          background: "linear-gradient(to bottom, #fffafc, #ffe4ec)",
          padding: "6rem 2rem 4rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            color: "#db2777",
            marginBottom: "2rem",
          }}
        >
          Layanan Kami
        </h2>
        <p
          style={{
            fontSize: "1.25rem",
            color: "#6b021d",
            marginBottom: "4rem",
            fontWeight: 500,
            maxWidth: "800px",
            marginInline: "auto",
          }}
        >
          Kami menyediakan berbagai layanan perawatan gigi profesional untuk
          memenuhi kebutuhan kesehatan dan estetika gigi Anda.
        </p>
        {renderGrid(layananData)}

        <h2
          style={{
            fontSize: "2.8rem",
            fontWeight: 800,
            color: "#db2777",
            marginBottom: "2rem",
            marginTop: "3rem",
          }}
        >
          Produk Unggulan
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#6b021d",
            marginBottom: "4rem",
            fontWeight: 500,
            maxWidth: "800px",
            marginInline: "auto",
          }}
        >
          Dukung kesehatan gigi Anda dengan produk pilihan kami yang aman dan
          terpercaya.
        </p>
        {renderGrid(produkData, true)}
      </section>
      <Footer />
    </>
  );
};

export default LayananKami;
