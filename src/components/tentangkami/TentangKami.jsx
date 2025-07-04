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
    AOS.init({ once: false, duration: 1000, easing: 'ease-out-cubic' });
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
      {/* PENTING UNTUK TAMPILAN FULL:
          Pastikan di file CSS global Anda (misalnya index.css atau App.css) ada reset dasar:
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden; /* Mencegah scroll horizontal yang tidak diinginkan */
          }
          Dan jika Anda memiliki header navigasi di atas, pastikan ia menggunakan position: fixed/sticky
          dan memiliki z-index yang lebih tinggi dari heroSection (misal z-index: 1000).
      */

      {/* Hero Section - Gambar Besar Full Layar */}
      <section style={styles.heroSection} data-aos="fade-in">
        <img
          src="/image/bg2.jpg" // Pastikan path ini benar dan gambar berkualitas tinggi
          alt="Drg. Tia Dental Care Clinic Exterior"
          style={styles.heroImage}
        />
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle} data-aos="fade-up" data-aos-delay="300">Tentang Kami</h1>
        </div>
      </section>

      {/* Konten Utama Halaman Tentang Kami - Latar Belakang PUTIH */}
      <section style={styles.contentSection}>
        {/* Tentang Kami / Kisah Kami */}
        <div style={styles.row} data-aos="fade-up">
          <img src="/image/k1.jpg" alt="Tentang Kami" style={styles.image} />
          <div style={styles.textBlock}>
            <h2 style={styles.subheading}>Kisah Kami</h2>
            <div dangerouslySetInnerHTML={{ __html: tentangKami.deskripsi }} style={{ lineHeight: 1.8 }} />
          </div>
        </div>

        {/* Visi */}
        <div style={styles.rowReverse} data-aos="fade-up">
          <div style={styles.textBlock}>
            <h2 style={styles.subheading}>Visi</h2>
            <div dangerouslySetInnerHTML={{ __html: tentangKami.visi }} style={{ lineHeight: 1.8 }} />
          </div>
          <img src="/image/k2.jpg" alt="Visi" style={styles.image} />
        </div>

        {/* Misi */}
        <div style={styles.row} data-aos="fade-up">
          <img src="/image/k3.jpg" alt="Misi" style={styles.image} />
          <div style={styles.textBlock}>
            <h2 style={styles.subheading}>Misi</h2>
            <div dangerouslySetInnerHTML={{ __html: tentangKami.misi }} style={{ lineHeight: 1.8 }} />
          </div>
        </div>

        {/* Dokter */}
        <h2 style={styles.heading} data-aos="fade-up">Dokter Kami</h2>
        {loading ? (
          <p style={styles.loadingText}>Memuat data dokter...</p>
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
                <p style={styles.dokterSpesialis}>{dokter.spesialis}</p>
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

// ====================================================================
// STYLES OBJECT - PENYESUAIAN UNTUK TAMPILAN FULL BLOK KONTEN
// ====================================================================
const styles = {
  // --- STYLES UNTUK HERO SECTION ---
  heroSection: {
    position: 'relative',
    width: '100vw',
    height: '600px', // Tinggi hero section
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Sesuaikan `marginTop` ini dengan tinggi header navigasi Anda.
    // Misal, jika header navigasi Anda tingginya 60px, maka pakai -60px.
    marginTop: '-80px', // Nilai default, sesuaikan!
    zIndex: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: '5.5rem',
    fontWeight: 900,
    color: '#FFFFFF',
    fontFamily: "'Montserrat', sans-serif",
    textShadow: '3px 3px 10px rgba(0,0,0,0.8)',
    textAlign: 'center',
    padding: '0 40px',
    lineHeight: '1.2',
  },

  // --- STYLES UNTUK CONTENT SECTION UTAMA ---
  contentSection: {
    // Padding horizontal di sini akan menjadi batas "full" untuk row di dalamnya
    padding: "8rem 4%",
    background: "#FFFFFF",
    fontFamily: "'Roboto', sans-serif",
    color: "#333333",
    boxSizing: "border-box",
    position: 'relative',
    zIndex: 1,
  },

  // --- STYLES ELEMEN KONTEN (ROW) ---
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6rem",
    flexWrap: "wrap",
    marginBottom: "8rem",
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.08)",
    padding: "4rem",
    transition: "transform 0.3s ease-in-out",
    // maxWidth: "1400px", <<< INI DIHAPUS UNTUK MEMBUATNYA FULL LEBAR
    width: "100%", // Pastikan mengambil lebar penuh dari parent
    margin: "0 auto", // Tetap untuk centering jika ada maxWidth
  },
  rowReverse: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6rem",
    flexWrap: "wrap-reverse",
    marginBottom: "8rem",
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.08)",
    padding: "4rem",
    transition: "transform 0.3s ease-in-out",
    // maxWidth: "1400px", <<< INI DIHAPUS UNTUK MEMBUATNYA FULL LEBAR
    width: "100%", // Pastikan mengambil lebar penuh dari parent
    margin: "0 auto", // Tetap untuk centering jika ada maxWidth
  },
  image: {
    flex: "1 1 45%",
    minWidth: "350px",
    borderRadius: "20px",
    width: "100%",
    height: "550px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    objectFit: "cover",
    transition: "transform 0.3s ease-in-out",
  },
  textBlock: {
    flex: "1 1 50%",
    fontSize: "1.25rem",
    lineHeight: 1.8,
    color: "#4A4A4A",
    fontWeight: 400,
    maxWidth: "700px", // Ini bisa dipertahankan untuk keterbacaan teks
  },

  // --- STYLES LAINNYA (tidak berubah) ---
  heading: {
    fontSize: "3.8rem",
    textAlign: "center",
    marginBottom: "5rem",
    color: "#AD1457",
    fontWeight: 800,
    fontFamily: "'Montserrat', sans-serif",
  },
  subheading: {
    fontSize: "2.8rem",
    color: "#AD1457",
    marginBottom: "2.5rem",
    fontWeight: 700,
    fontFamily: "'Montserrat', sans-serif",
  },
  dokterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "3.5rem",
    padding: "0 1rem",
    marginTop: "4rem",
    justifyItems: "center",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  dokterCard: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    width: "100%",
    maxWidth: "340px",
    textAlign: "center",
  },
  dokterFoto: {
    width: "100%",
    height: "350px",
    objectFit: "cover",
    borderBottom: "6px solid #FF8A65",
  },
  dokterNama: {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: "#AD1457",
    padding: "1.5rem 0 0.8rem 0",
    fontFamily: "'Montserrat', sans-serif",
  },
  dokterSpesialis: {
    color: "#666666",
    fontSize: "1.1rem",
    marginBottom: "1.5rem",
  },
  loadingText: {
    textAlign: "center",
    color: "#888",
    fontSize: "1.5rem",
    padding: "3rem 0",
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
    fontWeight: 600,
  },
};

export default TentangKami;