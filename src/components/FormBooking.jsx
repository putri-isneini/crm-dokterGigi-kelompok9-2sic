import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

export default function FormBooking() {
  const location = useLocation();
  const pasienId = location.state?.pasienId;

  const [form, setForm] = useState({
    tanggal: '',
    jam: '',
    keluhan: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pasienId) {
      alert('Pasien belum login. Silakan login atau registrasi terlebih dahulu.');
      return;
    }

    // Validasi jam harus di antara 08:00 dan 17:00
    const [jamStr, menitStr] = form.jam.split(':');
    const jam = parseInt(jamStr);
    const menit = parseInt(menitStr);

    const totalMenit = jam * 60 + menit;
    const minMenit = 8 * 60; // 08:00 = 480 menit
    const maxMenit = 17 * 60; // 17:00 = 1020 menit

    if (totalMenit < minMenit || totalMenit > maxMenit) {
      alert('Jam booking hanya diperbolehkan antara pukul 08:00 sampai 17:00.');
      return;
    }

    const kode_booking = 'BK-' + Date.now();
    const defaultDokterId = 'ID_DOKTER_DEFAULT'; // ganti sesuai ID dokter kamu
    const defaultLayananId = 'ID_LAYANAN_DEFAULT'; // ganti sesuai ID layanan kamu

    const { error } = await supabase.from('booking').insert([{
      pasien_id: pasienId,
      dokter_id: defaultDokterId,
      layanan_id: defaultLayananId,
      tanggal: form.tanggal,
      jam: form.jam,
      keluhan: form.keluhan,
      status: 'Menunggu',
      kode_booking
    }]);

    if (error) {
      alert('Gagal booking: ' + error.message);
    } else {
      alert('Booking berhasil!');
      setForm({ tanggal: '', jam: '', keluhan: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-3xl font-bold text-center text-pink-600 mb-4">Form Booking Janji</h2>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Tanggal Booking</label>
        <input
          type="date"
          name="tanggal"
          onChange={handleChange}
          value={form.tanggal}
          required
          className="w-full border border-gray-300 rounded p-2 focus:outline-pink-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Jam (08:00 - 17:00)</label>
        <input
          type="time"
          name="jam"
          onChange={handleChange}
          value={form.jam}
          required
          className="w-full border border-gray-300 rounded p-2 focus:outline-pink-500"
          min="08:00"
          max="17:00"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Keluhan Pasien</label>
        <textarea
          name="keluhan"
          placeholder="Contoh: Sakit gigi bagian belakang saat mengunyah..."
          onChange={handleChange}
          value={form.keluhan}
          required
          rows={4}
          className="w-full border border-gray-300 rounded p-2 focus:outline-pink-500"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded shadow transition duration-200"
      >
        Booking Sekarang
      </button>
    </form>
  );
}
