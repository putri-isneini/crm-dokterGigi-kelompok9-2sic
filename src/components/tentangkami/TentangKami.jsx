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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State untuk lebar jendela
  // State untuk efek hover pada gambar d2/d3
  const [isImageBorderedHovered, setIsImageBorderedHovered] = useState(false);
  // State untuk efek hover pada dokter card
  const [hoveredDokterId, setHoveredDokterId] = useState(null);
  // State untuk efek hover pada tombol
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    AOS.init({ once: false, duration: 1000, easing: 'ease-out-cubic' });
    fetchTentangKami();
    fetchDokter();

    // Listener untuk perubahan ukuran jendela
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  // Fungsi untuk mendapatkan gaya dinamis berdasarkan lebar jendela dan state hover
  const getDynamicStyles = (width) => {
    // --- PALET WARNA PINK SOFT BARU YANG LEBIH CERAH DAN HAMPIR PUTIH ---
    const primaryPink = '#EC407A';     // Pink yang cerah untuk judul, tombol
    const secondaryPink = '#FFC0CB';   // Pink sedang, sedikit lebih cerah dari secondary sebelumnya
    const subtlePinkBg = '#FFFBFB';    // PUTIH DENGAN HINT PINK SANGAT TIPIS
    const darkText = '#424242';        // Teks gelap agar mudah dibaca
    const mediumText = '#616161';      // Teks abu-abu sedang
    const white = '#FFFFFF';           // Putih murni

    const baseStyles = {
      heroSection: {
        position: 'relative',
        width: '100vw',
        height: '650px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '-80px',
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
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
      },
      heroTitle: {
        fontSize: '6.5rem',
        fontWeight: 900,
        color: white,
        fontFamily: "'Playfair Display', serif",
        textShadow: '0 5px 15px rgba(0,0,0,0.6)',
        textAlign: 'center',
        padding: '0 40px',
        lineHeight: '1.2',
      },
      contentSection: {
        padding: "8rem 6%",
        background: subtlePinkBg, // Latar belakang putih dengan hint pink
        fontFamily: "'Roboto', sans-serif",
        color: darkText,
        boxSizing: "border-box",
        position: 'relative',
        zIndex: 1,
      },
      row: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5rem",
        flexWrap: "wrap",
        marginBottom: "9rem",
        width: "100%",
      },
      rowReverse: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "5rem",
        flexWrap: "wrap-reverse",
        marginBottom: "9rem",
        width: "100%",
      },
      imageWrapper: {
        flex: "1 1 45%",
        minWidth: "400px",
        maxWidth: "600px",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      },
      imageD1: {
        width: "100%",
        height: "auto",
        maxHeight: "550px",
        objectFit: "contain",
        objectPosition: "center",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      },
      imageBordered: {
        width: "100%",
        height: "auto",
        maxHeight: "550px",
        objectFit: "cover",
        objectPosition: "center",
        borderRadius: "20px",
        border: `8px solid ${secondaryPink}`, // Border pink sedang
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
        transform: isImageBorderedHovered ? 'rotate(0deg) scale(1.02)' : 'rotate(-3deg)',
        transition: 'transform 0.3s ease-in-out',
      },
      textBlock: {
        flex: "1 1 50%",
        fontSize: "1.15rem",
        lineHeight: 1.8,
        color: darkText,
        fontWeight: 400,
        maxWidth: "700px",
        textAlign: "justify",
      },
      paragraphText: {
        lineHeight: 1.8,
        fontSize: "1.1rem",
        color: darkText,
      },
      heading: {
        fontSize: "4.2rem",
        textAlign: "center",
        marginBottom: "6rem",
        color: primaryPink, // Heading berwarna pink cerah
        fontWeight: 800,
        fontFamily: "'Playfair Display', serif",
      },
      subheading: {
        fontSize: "3rem",
        color: primaryPink, // Subheading berwarna pink cerah
        marginBottom: "2rem",
        fontWeight: 700,
        fontFamily: "'Playfair Display', serif",
        textAlign: "left",
      },
      dokterGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "3.5rem",
        padding: "0 1rem",
        marginTop: "4rem",
        justifyItems: "center",
        maxWidth: "1400px",
        margin: "0 auto",
      },
      dokterCard: (id) => ({
        backgroundColor: white,
        borderRadius: "20px",
        overflow: "hidden",
        // Efek hover untuk card dokter
        transform: hoveredDokterId === id ? 'translateY(-12px) scale(1.04)' : 'translateY(0) scale(1)',
        boxShadow: hoveredDokterId === id
          ? "0 28px 60px rgba(236, 64, 122, 0.3)" // Bayangan pink lebih kuat saat hover
          : "0 15px 40px rgba(0, 0, 0, 0.08)", // Bayangan default lebih lembut dan transparan
        transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
        width: "100%",
        maxWidth: "340px",
        textAlign: "center",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: `2px solid ${secondaryPink}`, // Tambah border tipis untuk definisi card
      }),
      dokterFoto: (id) => ({
        width: "100%",
        height: "380px",
        objectFit: "cover",
        // Border bawah foto dokter dengan gradasi pink (lebih aesthetic)
        borderBottom: hoveredDokterId === id
          ? `6px solid ${primaryPink}` // Pink cerah saat hover
          : `6px solid ${secondaryPink}`, // Pink sedang default
        // Efek hover untuk foto dokter
        filter: hoveredDokterId === id ? 'grayscale(0%) brightness(105%)' : 'grayscale(10%) brightness(100%)',
        transition: 'filter 0.3s ease, border-bottom 0.3s ease',
      }),
      dokterInfo: {
        padding: "1.5rem 1rem",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        // Background info dokter dengan gradasi subtle dari putih ke pink sangat tipis
        background: `linear-gradient(to bottom, ${white}, ${subtlePinkBg})`,
      },
      dokterNama: {
        fontSize: "2.1rem",
        fontWeight: 700,
        color: primaryPink,
        marginBottom: "0.5rem",
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: '0.5px',
      },
      dokterSpesialis: {
        color: mediumText,
        fontSize: "1.15rem",
        fontWeight: 500,
        letterSpacing: '0.8px',
        opacity: 0.9,
      },
      loadingText: {
        textAlign: "center",
        color: mediumText,
        fontSize: "1.5rem",
        padding: "3rem 0",
      },
      buttonWrapper: {
        textAlign: "center",
        marginTop: "5rem",
      },
      button: {
        backgroundColor: primaryPink,
        color: white,
        border: "none",
        padding: "1.2rem 3rem",
        fontSize: "1.2rem",
        borderRadius: "50px",
        cursor: "pointer",
        transition: "background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease",
        fontWeight: 600,
        letterSpacing: '0.5px',
        // Efek hover dan active
        transform: isButtonHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isButtonHovered ? "0 15px 30px rgba(236, 64, 122, 0.4)" : "0 8px 20px rgba(0, 0, 0, 0.2)",
      },
    };

    // --- MEDIA QUERIES (Diterapkan secara kondisional) ---
    let currentStyles = { ...baseStyles };

    // Untuk memastikan objek bersarang juga disalin dan tidak mereferensi yang sama
    currentStyles.heroTitle = { ...baseStyles.heroTitle };
    currentStyles.contentSection = { ...baseStyles.contentSection };
    currentStyles.row = { ...baseStyles.row };
    currentStyles.rowReverse = { ...baseStyles.rowReverse };
    currentStyles.imageWrapper = { ...baseStyles.imageWrapper };
    currentStyles.imageD1 = { ...baseStyles.imageD1 };
    currentStyles.imageBordered = { ...baseStyles.imageBordered };
    currentStyles.textBlock = { ...baseStyles.textBlock };
    currentStyles.paragraphText = { ...baseStyles.paragraphText };
    currentStyles.heading = { ...baseStyles.heading };
    currentStyles.subheading = { ...baseStyles.subheading };
    currentStyles.dokterGrid = { ...baseStyles.dokterGrid };
    currentStyles.dokterInfo = { ...baseStyles.dokterInfo };
    currentStyles.dokterNama = { ...baseStyles.dokterNama };
    currentStyles.dokterSpesialis = { ...baseStyles.dokterSpesialis };
    currentStyles.loadingText = { ...baseStyles.loadingText };
    currentStyles.buttonWrapper = { ...baseStyles.buttonWrapper };
    currentStyles.button = { ...baseStyles.button };


    if (width <= 1200) {
      currentStyles.heroTitle.fontSize = '5.5rem';
      currentStyles.row.gap = "3rem";
      currentStyles.rowReverse.gap = "3rem";
      currentStyles.imageWrapper.minWidth = "350px";
      currentStyles.imageBordered.maxHeight = "450px";
      currentStyles.imageD1.maxHeight = "450px";
      currentStyles.textBlock.fontSize = "1.05rem";
      currentStyles.heading.fontSize = "3.5rem";
      currentStyles.subheading.fontSize = "2.5rem";
      currentStyles.dokterFoto = (id) => ({
        ...baseStyles.dokterFoto(id),
        height: "300px",
      });
    }
    if (width <= 992) {
      currentStyles.heroSection.height = '550px';
      currentStyles.heroTitle.fontSize = '4.5rem';
      currentStyles.heroTitle.padding = '0 20px';
      currentStyles.contentSection.padding = "6rem 4%";
      currentStyles.row.flexDirection = "column";
      currentStyles.row.marginBottom = "6rem";
      currentStyles.row.gap = "2rem";
      currentStyles.rowReverse.flexDirection = "column-reverse";
      currentStyles.rowReverse.marginBottom = "6rem";
      currentStyles.rowReverse.gap = "2rem";
      currentStyles.imageWrapper.minWidth = "auto";
      currentStyles.imageWrapper.width = "100%";
      currentStyles.imageWrapper.maxWidth = "500px";
      currentStyles.imageBordered.transform = isImageBorderedHovered ? 'none' : 'none';
      currentStyles.imageBordered.borderWidth = '6px';
      currentStyles.imageD1.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)";
      currentStyles.heading.fontSize = "3rem";
      currentStyles.heading.marginBottom = "4rem";
      currentStyles.subheading.fontSize = "2.2rem";
      currentStyles.subheading.textAlign = "center";
      currentStyles.textBlock.textAlign = "center";
      currentStyles.textBlock.maxWidth = "100%";
      currentStyles.dokterGrid.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
      currentStyles.dokterGrid.gap = "2.5rem";
      currentStyles.dokterCard = (id) => ({
        ...baseStyles.dokterCard(id),
        maxWidth: "300px",
      });
      currentStyles.dokterFoto = (id) => ({
        ...currentStyles.dokterFoto(id),
        height: "250px",
      });
    }
    if (width <= 768) {
      currentStyles.heroSection.height = '450px';
      currentStyles.heroTitle.fontSize = '3.5rem';
      currentStyles.contentSection.padding = "5rem 3%";
      currentStyles.heading.fontSize = "2.5rem";
      currentStyles.subheading.fontSize = "2rem";
      currentStyles.textBlock.fontSize = "1rem";
      currentStyles.paragraphText.fontSize = "0.95rem";
      currentStyles.dokterCard = (id) => ({
        ...currentStyles.dokterCard(id),
        maxWidth: "280px",
      });
      currentStyles.dokterFoto = (id) => ({
        ...currentStyles.dokterFoto(id),
        height: "220px",
      });
      currentStyles.dokterNama.fontSize = "1.8rem";
      currentStyles.dokterSpesialis.fontSize = "1rem";
      currentStyles.button.padding = "1rem 2rem";
      currentStyles.button.fontSize = "1.1rem";
    }
    if (width <= 480) {
      currentStyles.heroSection.height = '350px';
      currentStyles.heroTitle.fontSize = '2.8rem';
      currentStyles.heroTitle.padding = '0 15px';
      currentStyles.contentSection.padding = "4rem 2%";
      currentStyles.heading.fontSize = "2rem";
      currentStyles.heading.marginBottom = "3rem";
      currentStyles.subheading.fontSize = "1.8rem";
      currentStyles.row.marginBottom = "4rem";
      currentStyles.rowReverse.marginBottom = "4rem";
      currentStyles.dokterGrid.gridTemplateColumns = "1fr";
      currentStyles.dokterGrid.gap = "2rem";
      currentStyles.dokterCard = (id) => ({
        ...currentStyles.dokterCard(id),
        maxWidth: "unset",
        width: "90%",
        margin: "0 auto",
      });
    }

    return currentStyles;
  };

  // Panggil fungsi untuk mendapatkan gaya saat ini
  const currentStyles = getDynamicStyles(windowWidth);

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
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Playfair+Display:wght@400;700&family=Roboto:wght@300;400;500&display=swap');
      */

      {/* Hero Section - Gambar Besar Full Layar */}
      <section style={currentStyles.heroSection} data-aos="fade-in">
        <img
          src="/image/bg2.jpg"
          alt="Drg. Tia Dental Care Clinic Exterior"
          style={currentStyles.heroImage}
        />
        <div style={currentStyles.heroOverlay}>
          <h1 style={currentStyles.heroTitle} data-aos="fade-up" data-aos-delay="300">Tentang Kami</h1>
        </div>
      </section>

      {/* Konten Utama Halaman Tentang Kami - Latar Belakang BERSIH */}
      <section style={currentStyles.contentSection}>
        {/* Tentang Kami / Kisah Kami */}
        <div style={currentStyles.row} data-aos="fade-up">
          <div style={currentStyles.imageWrapper}>
            <img src="/image/d1.png" alt="Tentang Kami" style={currentStyles.imageD1} />
          </div>
          <div style={currentStyles.textBlock}>
            <h2 style={currentStyles.subheading}>Kisah Kami</h2>
            <div dangerouslySetInnerHTML={{ __html: tentangKami.deskripsi }} style={currentStyles.paragraphText} />
          </div>
        </div>

        {/* Visi */}
        <div style={currentStyles.rowReverse} data-aos="fade-up">
          <div
            style={currentStyles.textBlock}>
            <h2 style={currentStyles.subheading}>Visi</h2>
            <div dangerouslySetInnerHTML={{ __html: tentangKami.visi }} style={currentStyles.paragraphText} />
          </div>
          <div
            style={currentStyles.imageWrapper}
            onMouseEnter={() => setIsImageBorderedHovered(true)}
            onMouseLeave={() => setIsImageBorderedHovered(false)}
          >
            <img src="/image/d2.jpg" alt="Visi" style={currentStyles.imageBordered} />
          </div>
        </div>

        {/* Misi */}
        <div style={currentStyles.row} data-aos="fade-up">
          <div
            style={currentStyles.imageWrapper}
            onMouseEnter={() => setIsImageBorderedHovered(true)}
            onMouseLeave={() => setIsImageBorderedHovered(false)}
          >
            <img src="/image/d3.jpg" alt="Misi" style={currentStyles.imageBordered} />
          </div>
          <div style={currentStyles.textBlock}>
            <h2 style={currentStyles.subheading}>Misi</h2>
            <div dangerouslySetInnerHTML={{ __html: tentangKami.misi }} style={currentStyles.paragraphText} />
          </div>
        </div>

        {/* Dokter */}
        <h2 style={currentStyles.heading} data-aos="fade-up">Tim Dokter Kami</h2>
        {loading ? (
          <p style={currentStyles.loadingText}>Memuat data dokter...</p>
        ) : (
          <div style={currentStyles.dokterGrid} data-aos="fade-up">
            {dokterList.map((dokter) => (
              <div
                key={dokter.id}
                style={currentStyles.dokterCard(dokter.id)}
                data-aos="zoom-in"
                data-aos-delay={dokter.id * 100} // Menggunakan ID untuk delay AOS yang unik
                onMouseEnter={() => setHoveredDokterId(dokter.id)}
                onMouseLeave={() => setHoveredDokterId(null)}
              >
                <img
                  src={dokter.foto || "/image/default-dokter.jpg"}
                  alt={dokter.nama}
                  style={currentStyles.dokterFoto(dokter.id)}
                />
                <div style={currentStyles.dokterInfo}>
                  <h4 style={currentStyles.dokterNama}>{dokter.nama}</h4>
                  <p style={currentStyles.dokterSpesialis}>{dokter.spesialis}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <div style={currentStyles.buttonWrapper} data-aos="zoom-in">
          <button
            style={currentStyles.button}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Jadwalkan Konsultasi
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TentangKami;