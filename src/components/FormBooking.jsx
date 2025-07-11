// src/components/FormBooking.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import dayjs from "dayjs";

const FormBooking = () => {
  const navigate = useNavigate();
  const [pasienId, setPasienId] = useState(null);
  const [layananList, setLayananList] = useState([]);
  const [form, setForm] = useState({
    layanan_id: "",
    tanggal: "",
    keluhan: "",
  });

  const [jamDipilih, setJamDipilih] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPasienId = async () => {
      setLoading(true); // Pastikan loading true saat memulai
      setError(null); // Reset error
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session || !session.user) {
        console.error("Session error or no user:", sessionError?.message);
        setError("Anda harus login sebagai pasien untuk melakukan booking.");
        setLoading(false);
        navigate("/login");
        return;
      }

      // Ambil pasienId dari tabel 'pasien_user' menggunakan ID dari auth.users
      const { data: pasienData, error: pasienError } = await supabase
        .from('pasien_user') // Menggunakan tabel 'pasien_user'
        .select('id')
        .eq('supabase_auth_id', session.user.id) // Kolom 'supabase_auth_id' di tabel pasien_user
        .single();

      if (pasienError || !pasienData) {
        console.error("Pasien data not found or error:", pasienError?.message);
        setError("Data profil pasien Anda tidak ditemukan. Silakan lengkapi profil Anda.");
        setLoading(false);
        navigate("/profil-pasien"); // Arahkan ke HalamanProfil untuk melengkapi data
        return;
      }

      setPasienId(pasienData.id);
      setLoading(false);
      fetchLayanan(); // Panggil fetchLayanan setelah pasienId didapatkan
    };

    checkPasienId();
  }, [navigate]);

  useEffect(() => {
    if (form.tanggal && pasienId) {
      cariSlotJamTersedia(form.tanggal);
    }
  }, [form.tanggal, pasienId]); // Tambahkan pasienId sebagai dependency

  const fetchLayanan = async () => {
    const { data, error } = await supabase.from("layanan").select("id, nama");
    if (!error) setLayananList(data);
    else console.error("Error fetching layanan:", error.message);
  };

  const getHariIndo = (tanggal) => {
    const hariInggris = dayjs(tanggal).format("dddd");
    const mapHari = {
      Sunday: "Minggu",
      Monday: "Senin",
      Tuesday: "Selasa",
      Wednesday: "Rabu",
      Thursday: "Kamis",
      Friday: "Jumat",
      Saturday: "Sabtu",
    };
    return mapHari[hariInggris];
  };

  const cariSlotJamTersedia = async (tanggalStr) => {
    setJamDipilih(null); // Reset jam terpilih setiap kali tanggal berubah
    const hari = getHariIndo(tanggalStr);

    const { data: jadwalList, error: errJadwal } = await supabase
      .from("jadwal_dokter")
      .select("*, dokter(id, nama)")
      .eq("hari", hari);

    if (errJadwal) {
      console.error("Error fetching jadwal dokter:", errJadwal.message);
      return;
    }
    
    if (!jadwalList || jadwalList.length === 0) {
      console.warn("Tidak ada jadwal dokter untuk hari:", hari);
      return;
    }

    const { data: bookings, error: errBookings } = await supabase
      .from("booking")
      .select("jam, dokter_id")
      .eq("tanggal", tanggalStr);

    if (errBookings) {
      console.error("Error fetching existing bookings:", errBookings.message);
      return;
    }

    // Filter jadwal yang sudah lewat (jika tanggal adalah hari ini)
    const now = dayjs();
    const isToday = dayjs(tanggalStr).isSame(now, 'day');

    for (const jadwal of jadwalList) {
      const start = dayjs(`${tanggalStr} ${jadwal.jam_mulai}`);
      const end = dayjs(`${tanggalStr} ${jadwal.jam_selesai}`);

      for (let jam = start; jam.isBefore(end); jam = jam.add(30, "minute")) {
        const jamStr = jam.format("HH:mm");

        // Lewati jam yang sudah lewat jika tanggal adalah hari ini
        if (isToday && jam.isBefore(now)) {
          continue;
        }

        const sudahBooking = bookings?.some(
          (b) => b.jam === jamStr && b.dokter_id === jadwal.dokter.id
        );

        if (!sudahBooking) {
          setJamDipilih({
            jam: jamStr,
            dokter_id: jadwal.dokter.id,
            dokter_nama: jadwal.dokter?.nama || "Tanpa Nama",
          });
          return; // Temukan slot pertama yang tersedia dan keluar
        }
      }
    }
    // Jika tidak ada slot yang ditemukan setelah iterasi semua jadwal
    setJamDipilih(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Mulai loading saat submit
    setError(null); // Reset error

    if (!pasienId) {
      setError("ID Pasien tidak ditemukan. Silakan login kembali.");
      navigate("/login");
      setLoading(false);
      return;
    }
    if (!jamDipilih) {
      setError("Tidak ada jam tersedia pada tanggal tersebut.");
      setLoading(false);
      return;
    }
    if (!form.layanan_id || !form.tanggal || !form.keluhan) {
      setError("Semua field harus diisi.");
      setLoading(false);
      return;
    }

    const kode_booking = `BK-${Date.now()}`;
    try {
      const { error: insertError } = await supabase.from("booking").insert([
        {
          pasien_id: pasienId,
          dokter_id: jamDipilih.dokter_id,
          layanan_id: form.layanan_id,
          tanggal: form.tanggal,
          jam: jamDipilih.jam,
          keluhan: form.keluhan,
          kode_booking,
          status: 'Menunggu', // Set status default
        },
      ]);

      if (insertError) {
        throw insertError;
      }
      alert("Booking berhasil!");
      navigate("/profil-pasien");
    } catch (err) {
      console.error("Gagal booking:", err.message);
      setError("Gagal booking: " + err.message);
      alert("Gagal booking: " + err.message);
    } finally {
      setLoading(false); // Selesai loading
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat formulir booking...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-4 shadow-md rounded bg-white"
    >
      <h2 className="text-xl font-semibold mb-4 text-pink-600">Form Booking</h2>

      <label className="font-medium text-pink-700">Layanan</label>
      <select
        required
        value={form.layanan_id}
        onChange={(e) => setForm({ ...form, layanan_id: e.target.value })}
        className="w-full border p-2 mb-3 bg-pink-50 rounded-lg"
      >
        <option value="">Pilih Layanan</option>
        {layananList.map((l) => (
          <option key={l.id} value={l.id}>
            {l.nama}
          </option>
        ))}
      </select>

      <label className="font-medium text-pink-700">Tanggal</label>
      <input
        type="date"
        required
        value={form.tanggal}
        onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
        className="w-full border p-2 mb-3 bg-pink-50 rounded-lg"
        min={dayjs().format('YYYY-MM-DD')} // Hanya izinkan tanggal di masa depan atau hari ini
      />

      <label className="font-medium text-pink-700">Keluhan</label>
      <textarea
        required
        value={form.keluhan}
        onChange={(e) => setForm({ ...form, keluhan: e.target.value })}
        className="w-full border p-2 mb-3 bg-pink-50 rounded-lg"
      />

      <div className="mb-4 text-sm text-gray-700">
        {jamDipilih ? (
          <p>
            Jam Otomatis: <strong>{jamDipilih.jam}</strong> bersama Dr.{" "}
            <strong>{jamDipilih.dokter_nama}</strong>
          </p>
        ) : form.tanggal ? (
          <p className="text-red-500">Tidak ada jam tersedia untuk tanggal ini.</p>
        ) : (
          <p className="text-gray-500">Pilih tanggal untuk melihat jam tersedia.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !jamDipilih || !form.layanan_id || !form.tanggal || !form.keluhan} // Disable jika loading, tidak ada jam, atau field kosong
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Memproses Booking...' : 'Booking Sekarang'}
      </button>
    </form>
  );
};

export default FormBooking;
