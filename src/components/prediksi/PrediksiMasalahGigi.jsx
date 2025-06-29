import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PrediksiMasalahGigi() {
  const [form, setForm] = useState({
    usia: '',
    jenis_kelamin: '',
    keluhan: '',
    gejala_tambahan: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidForm = () => {
    return (
      form.usia.trim() !== '' &&
      form.jenis_kelamin.trim() !== '' &&
      form.keluhan.trim() !== '' &&
      form.gejala_tambahan.trim() !== ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidForm()) {
      alert('❗ Harap lengkapi semua data terlebih dahulu.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('https://2235-104-199-121-106.ngrok-free.app/predict', form);
      const hasil = res.data;

      navigate('/hasil-prediksi', {
        state: {
          hasil: {
            masalah: hasil.masalah,
            penanganan: hasil.penanganan
          },
          usia: form.usia,
          jenis_kelamin: form.jenis_kelamin,
          keluhan: form.keluhan,
          gejala_tambahan: form.gejala_tambahan,
          confidence: hasil.confidence,
          all_confidences: hasil.all_confidences
        }
      });
    } catch (error) {
      console.error('Gagal prediksi:', error);
      const msg = error.response?.data?.error || "Terjadi kesalahan server. Silakan coba lagi.";
      alert("Gagal memproses prediksi: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-6 py-10">
      <div className="bg-white w-full max-w-2xl p-10 rounded-3xl shadow-xl border border-pink-200">
        <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">
          Form Prediksi Masalah Gigi
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 text-lg">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Usia</label>
            <input
              type="number"
              name="usia"
              value={form.usia}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Jenis Kelamin</label>
            <select
              name="jenis_kelamin"
              value={form.jenis_kelamin}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Keluhan</label>
            <input
              type="text"
              name="keluhan"
              value={form.keluhan}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Gejala Tambahan</label>
            <input
              type="text"
              name="gejala_tambahan"
              value={form.gejala_tambahan}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white text-lg font-semibold py-3 rounded-xl transition duration-300 ${
              loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'
            }`}
          >
            {loading ? 'Memproses...' : 'Prediksi Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}
