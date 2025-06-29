import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function HasilPrediksi() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasil, usia, jenis_kelamin, confidence, all_confidences, keluhan, gejala_tambahan } = location.state || {};

  if (!hasil) {
    return (
      <div className="text-center mt-10 px-4">
        <p className="text-pink-600 font-semibold">⚠️ Tidak ada hasil prediksi. Silakan isi formulir terlebih dahulu.</p>
        <button
          onClick={() => navigate('/prediksi')}
          className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Kembali ke Form
        </button>
      </div>
    );
  }

  const dataInputPengguna = [
    { kategori: 'Usia', nilai: parseInt(usia) || 0 },
    { kategori: `Jenis Kelamin: ${jenis_kelamin || '-'}`, nilai: 1 },
    { kategori: `Keluhan: ${keluhan || '-'}`, nilai: 1 },
    { kategori: `Gejala: ${gejala_tambahan || '-'}`, nilai: 1 },
  ];

  const dataConfidenceUtama = [
    {
      label: hasil.masalah,
      nilai: parseFloat((confidence || 0) * 100), // JANGAN toFixed di sini
    },
  ];

  const dataAllConfidence = all_confidences
    ? Object.entries(all_confidences).map(([label, prob]) => ({
        label,
        nilai: parseFloat((prob * 100).toFixed(2)),
      }))
    : [];

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-pink-600 text-center">
          🦷 Hasil Prediksi Masalah Gigi
        </h2>

        <div className="space-y-3 text-center text-lg text-pink-800">
          <p><strong>Masalah Gigi:</strong> {hasil.masalah}</p>
          <p><strong>Penanganan:</strong> {hasil.penanganan}</p>
          <p><strong>Confidence:</strong> {(confidence * 100).toFixed(2)}%</p>
        </div>

        <div>
          <h3 className="text-pink-700 font-semibold mb-3 text-center text-xl">
            📊 Informasi yang Diberikan Pasien
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dataInputPengguna}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="kategori" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="nilai" fill="#f472b6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-pink-700 font-semibold mb-3 text-center text-xl">
            ✅ Confidence Prediksi Utama
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dataConfidenceUtama}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(val) => `${val}%`} />
              <Bar dataKey="nilai" fill="#fb7185" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {dataAllConfidence.length > 0 && (
          <div>
            <h3 className="text-pink-700 font-semibold mb-3 text-center text-xl">
              📈 Confidence Seluruh Kategori Masalah Gigi
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={dataAllConfidence}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(val) => `${val}%`} />
                <Legend />
                <Bar dataKey="nilai" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/prediksi')}
            className="mt-6 bg-pink-500 text-white px-6 py-3 text-lg rounded-lg hover:bg-pink-600 transition"
          >
            🔁 Prediksi Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
