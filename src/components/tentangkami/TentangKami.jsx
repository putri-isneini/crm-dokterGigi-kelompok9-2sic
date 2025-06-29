import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from "../../supabase"; // pastikan path-nya benar

const TentangKami = () => {
  const [tentangKami, setTentangKami] = useState({
    deskripsi: "",
    visi: "",
    misi: "",
  });
  const [dokterList, setDokterList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ once: false, duration: 1000 });
    fetchTentangKami();
    fetchDokter();
  }, []);

  const fetchTentangKami = async () => {
    const { data, error } = await supabase
      .from("tentang_kami")
      .select("tipe, konten");

    if (error) {
      console.error("Gagal mengambil data tentang_kami:", error.message);
    } else {
      const temp = { deskripsi: "", visi: "", misi: "" };
      data.forEach((item) => {
        if (item.tipe === "deskripsi") temp.deskripsi = item.konten;
        else if (item.tipe === "visi") temp.visi = item.konten;
        else if (item.tipe === "misi") temp.misi = item.konten;
      });
      setTentangKami(temp);
    }
  };

  const fetchDokter = async () => {
    const { data, error } = await supabase
      .from("dokter")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data dokter:", error.message);
    } else {
      setDokterList(data);
    }
    setLoading(false);
  };

  return (
    <>
      <section style={styles.section}>
        <h2 style={styles.heading} data-aos="fade-up">Tentang Kami</h2>

        {/* Tentang Kami */}
        <div style={styles.row} data-aos="fade-up">
          <img src="/image/k1.jpg" alt="Tentang Kami" style={styles.image} />
          <div style={styles.textBlock}>
            <div dangerouslySetInnerHTML={{ __html: tentangKami.deskripsi }} />
          </div>
        </div>

        {/* Visi */}
        <div style={styles.rowReverse} data-aos="fade-up">
          <div style={styles.textBlock}>
            <h3 style={styles.subheading}>Visi</h3>
            <div dangerouslySetInnerHTML={{ __html: tentangKami.visi }} />
          </div>
          <img src="/image/k2.jpg" alt="Visi" style={styles.image} />
        </div>

        {/* Misi */}
        <div style={styles.row} data-aos="fade-up">
          <img src="/image/k3.jpg" alt="Misi" style={styles.image} />
          <div style={styles.textBlock}>
            <h3 style={styles.subheading}>Misi</h3>
            <div dangerouslySetInnerHTML={{ __html: tentangKami.misi }} />
          </div>
        </div>

        {/* Dokter */}
        <h2 style={styles.heading} data-aos="fade-up">Dokter Kami</h2>
        {loading ? (
          <p style={{ textAlign: "center", color: "#888" }}>Memuat data dokter...</p>
        ) : (
          <div style={styles.dokterGrid} data-aos="fade-up">
            {dokterList.map((dokter, index) => (
              <div key={dokter.id} style={styles.dokterCard} data-aos="zoom-in" data-aos-delay={index * 100}>
                <img
                  src={dokter.foto || "/image/default-dokter.jpg"}
                  alt={dokter.nama}
                  style={styles.dokterFoto}
                />
                <h4 style={styles.dokterNama}>{dokter.nama}</h4>
                <p style={{ color: "#666", fontSize: "1rem" }}>{dokter.spesialis}</p>
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <div style={styles.buttonWrapper} data-aos="zoom-in">
          <button style={styles.button}>Lihat Selengkapnya</button>
        </div>
      </section>

      <Footer />
    </>
  );
};

const styles = {
  section: {
    padding: "6rem 2rem",
    background: "linear-gradient(to bottom, #fff0f5, #fef7f9)",
    fontFamily: "'Kugile_Demo', sans-serif",
    color: "#4b006e",
  },
  heading: {
    fontSize: "3.2rem",
    textAlign: "center",
    marginBottom: "4rem",
    color: "#db2777",
    fontWeight: 800,
  },
  subheading: {
    fontSize: "2rem",
    color: "#db2777",
    marginBottom: "1.5rem",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4rem",
    flexWrap: "wrap",
    marginBottom: "5rem",
  },
  rowReverse: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4rem",
    flexWrap: "wrap-reverse",
    marginBottom: "5rem",
  },
  image: {
    flex: "1 1 50vw",
    borderRadius: "24px",
    width: "50vw",
    maxWidth: "720px",
    height: "auto",
    boxShadow: "0 15px 40px rgba(251, 113, 133, 0.25)",
    objectFit: "cover",
  },
  textBlock: {
    flex: "1 1 500px",
    fontSize: "1.3rem",
    lineHeight: 2,
    color: "#444",
    fontWeight: 500,
    maxWidth: "700px",
  },
  dokterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "3rem",
    padding: "0 1rem",
    marginTop: "3rem",
    justifyItems: "center",
  },
  dokterCard: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 30px rgba(251, 113, 133, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    width: "260px",
    textAlign: "center",
  },
  dokterFoto: {
    width: "100%",
    height: "280px",
    objectFit: "cover",
    borderBottom: "4px solid #fbcfe8",
  },
  dokterNama: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#be185d",
    padding: "1rem 0 0.5rem 0",
  },
  buttonWrapper: {
    textAlign: "center",
    marginTop: "4rem",
  },
  button: {
    backgroundColor: "#f472b6",
    color: "#fff",
    border: "none",
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default TentangKami;
