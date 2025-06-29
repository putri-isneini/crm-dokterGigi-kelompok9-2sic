import React, { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import PrediksiMasalahGigi from "./prediksi/PrediksiMasalahGigi"; // pastikan path sesuai

const LayananKami = ({ sectionRef }) => {
  const containerRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [layananData, setLayananData] = useState([]);

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

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const res = await fetch("/api/layanan"); // ubah sesuai endpoint kamu
        const data = await res.json();
        setLayananData(data);
      } catch (error) {
        console.error("Gagal mengambil data layanan:", error);
      }
    };
    fetchLayanan();
  }, []);

  const renderCard = (item) => (
    <div
      key={item.id}
      style={{
        background: "#fff",
        padding: "1.5rem",
        borderRadius: "1rem",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        textAlign: "left",
      }}
    >
      <h3 style={{ color: "#db2777", fontSize: "1.4rem", marginBottom: "0.5rem" }}>
        {item.nama}
      </h3>
      <p style={{ color: "#4b5563" }}>{item.deskripsi}</p>
      {item.harga && (
        <p style={{ color: "#6b021d", fontWeight: "bold", marginTop: "0.5rem" }}>
          Rp {parseInt(item.harga).toLocaleString("id-ID")}
        </p>
      )}
    </div>
  );

  const renderGrid = (data) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "3rem",
        marginBottom: "5rem",
      }}
    >
      {data.map((item) => renderCard(item))}
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
        <h2 style={{ fontSize: "3rem", fontWeight: 800, color: "#db2777", marginBottom: "2rem" }}>
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

        {/* Tombol Cek Masalah */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: "#ec4899",
            color: "white",
            border: "none",
            padding: "1rem 2rem",
            fontSize: "1.15rem",
            fontWeight: "bold",
            borderRadius: "999px",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(251, 113, 133, 0.4)",
            marginBottom: "3rem",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🔍 Cek Masalah Gigi Anda
        </button>
      </section>

      <Footer />

      {/* Modal Pop-Up */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "1rem",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                float: "right",
                border: "none",
                background: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#db2777",
              }}
            >
              ×
            </button>
            <PrediksiMasalahGigi />
          </div>
        </div>
      )}
    </>
  );
};

export default LayananKami;
