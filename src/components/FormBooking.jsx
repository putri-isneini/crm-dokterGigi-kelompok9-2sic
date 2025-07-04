import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import dayjs from "dayjs";

const FormBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pasienId = location.state?.pasien_id;

  const [layananList, setLayananList] = useState([]);
  const [form, setForm] = useState({
    layanan_id: "",
    tanggal: "",
    keluhan: "",
  });

  const [jamDipilih, setJamDipilih] = useState(null);

  useEffect(() => {
    fetchLayanan();
  }, []);

  useEffect(() => {
    if (form.tanggal) {
      cariSlotJamTersedia(form.tanggal);
    }
  }, [form.tanggal]);

  const fetchLayanan = async () => {
    const { data, error } = await supabase.from("layanan").select("id, nama");
    if (!error) setLayananList(data);
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
    setJamDipilih(null);
    const hari = getHariIndo(tanggalStr);

    const { data: jadwalList, error: errJadwal } = await supabase
      .from("jadwal_dokter")
      .select("*, dokter(id, nama)")
      .eq("hari", hari);

    if (errJadwal || !jadwalList?.length) {
      console.warn("Tidak ada jadwal dokter untuk hari:", hari);
      return;
    }

    const { data: bookings } = await supabase
      .from("booking")
      .select("jam, dokter_id")
      .eq("tanggal", tanggalStr);

    for (const jadwal of jadwalList) {
      const start = dayjs(`${tanggalStr} ${jadwal.jam_mulai}`);
      const end = dayjs(`${tanggalStr} ${jadwal.jam_selesai}`);

      for (let jam = start; jam.isBefore(end); jam = jam.add(30, "minute")) {
        const jamStr = jam.format("HH:mm");

        const sudahBooking = bookings?.some(
          (b) => b.jam === jamStr && b.dokter_id === jadwal.dokter_id
        );

        if (!sudahBooking) {
          setJamDipilih({
            jam: jamStr,
            dokter_id: jadwal.dokter_id,
            dokter_nama: jadwal.dokter?.nama || "Tanpa Nama",
          });
          return;
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jamDipilih) {
      alert("Tidak ada jam tersedia pada tanggal tersebut.");
      return;
    }

    const kode_booking = `BK-${Date.now()}`;
    const { error } = await supabase.from("booking").insert([
      {
        pasien_id: pasienId,
        dokter_id: jamDipilih.dokter_id,
        layanan_id: form.layanan_id,
        tanggal: form.tanggal,
        jam: jamDipilih.jam,
        keluhan: form.keluhan,
        kode_booking,
      },
    ]);

    if (error) {
      alert("Gagal booking: " + error.message);
    } else {
      alert("Booking berhasil!");
      navigate("/");
    }
  };

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
          <p className="text-red-500">Tidak ada jam tersedia.</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg text-lg font-semibold transition"
      >
        Booking Sekarang
      </button>
    </form>
  );
};

export default FormBooking;
