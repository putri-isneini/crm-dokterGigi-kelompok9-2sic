import { useState } from 'react';
import { User, MessageSquare, PlusCircle, Heart, Smile, Brush, Clock, Stethoscope, Info } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

export default function PrediksiMasalahGigi() {
  const [form, setForm] = useState({
    usia: '',
    jenis_kelamin: '',
    keluhan_utama: '',
    gejala_tambahan: '',
    riwayat_penyakit: '',
    kondisi_mulut: '',
    frekuensi_sikat_gigi: '',
    riwayat_periksa_gigi: ''
  });

  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const listFrekuensiSikatGigi = ['1x sehari', '2x sehari', 'Jarang', 'Tidak Pernah'];
  const listRiwayatPeriksaGigi = ['Rutin 6 bulan', '1 tahun sekali', 'Jarang', 'Belum Pernah'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      setPredictionResult(data);
    } catch (error) {
      console.error('Gagal fetch prediksi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setPredictionResult(null);
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-pink-50 flex justify-center items-start">
      {!predictionResult ? (
        <div className="bg-white w-full max-w-2xl p-10 rounded-3xl shadow-xl border border-pink-200">
          <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">Form Prediksi Masalah Gigi</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {['usia', 'keluhan_utama', 'gejala_tambahan', 'riwayat_penyakit', 'kondisi_mulut'].map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-2 font-semibold">
                  {field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </label>
                <input
                  type={field === 'usia' ? 'number' : 'text'}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>
            ))}

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Jenis Kelamin</label>
              <select
                name="jenis_kelamin"
                value={form.jenis_kelamin}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              >
                <option disabled value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {[{
              name: 'frekuensi_sikat_gigi',
              label: 'Frekuensi Sikat Gigi',
              options: listFrekuensiSikatGigi
            }, {
              name: 'riwayat_periksa_gigi',
              label: 'Riwayat Periksa Gigi',
              options: listRiwayatPeriksaGigi
            }].map(({ name, label, options }) => (
              <div key={name}>
                <label className="block text-gray-700 mb-2 font-semibold">{label}</label>
                <select
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                  required
                >
                  <option value="">Pilih {label}</option>
                  {options.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            ))}

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
      ) : (
        <div className="bg-white w-full max-w-2xl p-10 rounded-3xl shadow-xl border border-pink-200">
          <h1 className="text-3xl font-bold text-pink-600 mb-8 text-center">Hasil Prediksi</h1>

          <div className="space-y-6 text-lg">
            <div className="p-6 bg-gray-50 rounded-xl shadow-inner border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-700 mb-5 text-center border-b pb-3 border-gray-200">Data Pasien</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {Object.entries({
                  Usia: predictionResult.usia,
                  'Jenis Kelamin': predictionResult.jenis_kelamin,
                  'Keluhan Utama': predictionResult.keluhan_utama,
                  'Gejala Tambahan': predictionResult.gejala_tambahan,
                  'Riwayat Penyakit': predictionResult.riwayat_penyakit,
                  'Kondisi Mulut Input': predictionResult.kondisi_mulut,
                  'Frekuensi Sikat Gigi': predictionResult.frekuensi_sikat_gigi,
                  'Riwayat Periksa Gigi': predictionResult.riwayat_periksa_gigi
                }).map(([label, value], idx) => (
                  <p key={idx} className="flex items-center text-gray-800">
                    <User className="mr-3 text-pink-500" size={20} /> <span className="font-semibold">{label}:</span> <span className="ml-2 font-medium">{value}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-pink-500 to-pink-700 rounded-xl shadow-lg text-white">
              <h2 className="text-2xl font-bold mb-5 text-center border-b pb-3 border-pink-400">Prediksi Sistem</h2>
              <div className="space-y-4">
                <div className="flex items-center text-xl">
                  <Stethoscope className="mr-3" size={24} />
                  <span className="font-semibold">Kondisi Mulut Prediksi:</span> <span className="ml-2 font-bold text-pink-100">{predictionResult.kondisi_mulut_prediksi}</span>
                </div>
                <div className="flex items-center text-xl">
                  <Stethoscope className="mr-3" size={24} />
                  <span className="font-semibold">Penanganan Prediksi:</span> <span className="ml-2 font-bold text-pink-100">{predictionResult.penanganan_prediksi}</span>
                </div>

                {[{
                  title: 'Keyakinan Prediksi Kondisi Mulut',
                  data: predictionResult.all_probas_kondisi_mulut,
                  highlight: predictionResult.kondisi_mulut_prediksi
                }, {
                  title: 'Keyakinan Prediksi Penanganan',
                  data: predictionResult.all_probas_penanganan,
                  highlight: predictionResult.penanganan_prediksi
                }].map(({ title, data, highlight }, i) => (
                  <div key={i} className="mt-8 pt-6 border-t border-pink-400 text-center">
                    <h3 className="text-xl font-semibold mb-4">{title}</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                        <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={60} interval={0} />
                        <YAxis stroke="#fff" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                        <Tooltip formatter={(v) => `${(v * 100).toFixed(2)}%`} />
                        <Bar dataKey="confidence" fill="#F9A8D4" radius={[10, 10, 0, 0]}>
                          {data.map((entry, index) => (
                            <Cell key={index} fill={entry.name === highlight ? '#F472B6' : '#F9A8D4'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}

                <p className="text-center text-2xl font-bold mt-4">Overall Confidence: {(predictionResult.confidence * 100).toFixed(2)}%</p>
                <p className="text-sm text-pink-100 mt-2 flex items-center justify-center">
                  <Info className="mr-2" size={16} />
                  Confidence menunjukkan seberapa yakin model terhadap prediksi.
                </p>
              </div>
            </div>

            <button
              onClick={handleBackToForm}
              className="w-full text-white text-lg font-semibold py-3 rounded-xl transition duration-300 bg-gray-500 hover:bg-gray-600 shadow-md hover:shadow-lg"
            >
              Kembali ke Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
