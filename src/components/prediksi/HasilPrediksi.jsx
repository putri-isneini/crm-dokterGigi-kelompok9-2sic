import { useState } from 'react';
import {
  User,
  MessageSquare,
  PlusCircle,
  Heart,
  Smile,
  Brush,
  Clock,
  Stethoscope,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function PrediksiForm({ predictionResult, form, handleChange, handleSubmit, handleBackToForm, loading, listFrekuensiSikatGigi, listRiwayatPeriksaGigi }) {
  return (
    <div className="flex justify-center px-4 py-8">
      {!predictionResult ? (
        <div className="bg-white w-full max-w-2xl p-10 rounded-3xl shadow-xl border border-pink-200">
          <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">Formulir Prediksi Kesehatan Gigi</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Keluhan Utama</label>
              <input
                type="text"
                name="keluhan_utama"
                value={form.keluhan_utama}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Contoh: gigi ngilu, gigi berlubang"
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
                placeholder="Contoh: bengkak, sakit saat mengunyah"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Riwayat Penyakit</label>
              <input
                type="text"
                name="riwayat_penyakit"
                value={form.riwayat_penyakit}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Contoh: Diabetes, Tidak ada"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Kondisi Mulut</label>
              <input
                type="text"
                name="kondisi_mulut"
                value={form.kondisi_mulut}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                placeholder="Contoh: Karies, Baik"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Frekuensi Sikat Gigi</label>
              <select
                name="frekuensi_sikat_gigi"
                value={form.frekuensi_sikat_gigi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              >
                <option value="">Pilih Frekuensi Sikat Gigi</option>
                {listFrekuensiSikatGigi.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Riwayat Periksa Gigi</label>
              <select
                name="riwayat_periksa_gigi"
                value={form.riwayat_periksa_gigi}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              >
                <option value="">Pilih Riwayat Periksa Gigi</option>
                {listRiwayatPeriksaGigi.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white text-lg font-semibold py-3 rounded-xl transition duration-300 ${loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
            >
              {loading ? 'Memproses...' : 'Prediksi Sekarang'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white w-full max-w-4xl p-10 rounded-3xl shadow-xl border border-pink-200">
          <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">Hasil Prediksi</h1>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div><span className="font-semibold text-gray-700">Usia:</span> {predictionResult.usia}</div>
              <div><span className="font-semibold text-gray-700">Jenis Kelamin:</span> {predictionResult.jenis_kelamin}</div>
              <div><span className="font-semibold text-gray-700">Keluhan Utama:</span> {predictionResult.keluhan_utama}</div>
              <div><span className="font-semibold text-gray-700">Gejala Tambahan:</span> {predictionResult.gejala_tambahan}</div>
              <div><span className="font-semibold text-gray-700">Riwayat Penyakit:</span> {predictionResult.riwayat_penyakit}</div>
              <div><span className="font-semibold text-gray-700">Kondisi Mulut:</span> {predictionResult.kondisi_mulut}</div>
              <div><span className="font-semibold text-gray-700">Frekuensi Sikat Gigi:</span> {predictionResult.frekuensi_sikat_gigi}</div>
              <div><span className="font-semibold text-gray-700">Riwayat Periksa Gigi:</span> {predictionResult.riwayat_periksa_gigi}</div>
            </div>

            <div className="p-6 bg-pink-500 rounded-xl text-white">
              <h2 className="text-2xl font-bold mb-4 text-center">Prediksi Sistem</h2>
              <p><span className="font-semibold">Kondisi Mulut Prediksi:</span> {predictionResult.kondisi_mulut_prediksi}</p>
              <p><span className="font-semibold">Penanganan Prediksi:</span> {predictionResult.penanganan_prediksi}</p>
              <p className="mt-4 text-center font-semibold">Tingkat Keyakinan: {(predictionResult.confidence * 100).toFixed(2)}%</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Keyakinan Prediksi Kondisi Mulut</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={predictionResult.all_probas_kondisi_mulut}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} />
                  <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                  <Tooltip formatter={(v) => `${(v * 100).toFixed(2)}%`} />
                  <Bar dataKey="confidence" fill="#F9A8D4">
                    {predictionResult.all_probas_kondisi_mulut.map((entry, index) => (
                      <Cell key={index} fill={entry.name === predictionResult.kondisi_mulut_prediksi ? '#F472B6' : '#F9A8D4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Keyakinan Prediksi Penanganan</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={predictionResult.all_probas_penanganan}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} />
                  <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                  <Tooltip formatter={(v) => `${(v * 100).toFixed(2)}%`} />
                  <Bar dataKey="confidence" fill="#F9A8D4">
                    {predictionResult.all_probas_penanganan.map((entry, index) => (
                      <Cell key={index} fill={entry.name === predictionResult.penanganan_prediksi ? '#F472B6' : '#F9A8D4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="text-center">
              <button
                onClick={handleBackToForm}
                className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md"
              >
                Kembali ke Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
