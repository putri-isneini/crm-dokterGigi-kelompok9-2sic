import { useState } from 'react';
import { PlusCircle, Brush } from 'lucide-react';
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

// Komponen kustom untuk tick pada XAxis (sumbu horizontal)
// Digunakan untuk mengontrol tampilan label pada sumbu X (persentase kepercayaan)
const CustomXAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={16} textAnchor="middle" fill="#4B5563" className="text-sm"> {/* Warna teks abu-abu gelap, ukuran font kecil */}
      {`${(payload.value * 100).toFixed(0)}%`} {/* Menampilkan nilai sebagai persentase tanpa desimal */}
    </text>
  </g>
);

// Komponen kustom untuk tick pada YAxis (sumbu vertikal)
// Digunakan untuk mengontrol tampilan label pada sumbu Y (jenis penanganan)
const CustomYAxisTick = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dx={-10} textAnchor="end" fill="#4B5563" className="text-sm"> {/* Warna teks abu-abu gelap, ukuran font kecil, rata kanan */}
      {payload.value} {/* Menampilkan nama penanganan */}
    </text>
  </g>
);

export default function PrediksiMasalahGigi() {
  // State untuk menyimpan data formulir input pasien
  const [form, setForm] = useState({
    usia: '',
    jenis_kelamin: '',
    keluhan_utama: '',
    durasi_keluhan: '',
    riwayat_medis: '',
    riwayat_alergi: '',
    kebiasaan_buruk: '',
    kondisi_gigi_saat_ini: '',
    jumlah_gigi_berlubang: '',
    sensitivitas_gigi: '',
    nyeri_gigi: '',
    warna_gigi: ''
  });

  // State untuk menyimpan hasil prediksi dari backend
  const [predictionResult, setPredictionResult] = useState(null);
  // State untuk indikator loading saat proses prediksi
  const [loading, setLoading] = useState(false);
  // State untuk pesan error jika terjadi masalah
  const [error, setError] = useState(null);

  // Daftar opsi untuk dropdown yang digunakan di formulir
  const listJenisKelamin = ['Pria', 'Wanita'];
  const listDurasiKeluhan = ['1 hari', '3 hari', '1 minggu', '2 minggu', '1 bulan', '3 bulan', '6 bulan', '1 tahun', '2 tahun', 'lama', 'sejak kecil', 'baru saja'];
  const listKebiasaanBuruk = ['Tidak ada', 'Merokok', 'Mengunyah satu sisi', 'Menggertakkan gigi', 'Minum kopi', 'Teh'];
  const listKondisiGigiSaatIni = ['Gigi baik', 'Ada lubang kecil', 'Gigi karies parah', 'Gusi meradang', 'Banyak karang gigi', 'Gigi bersih', 'Tidak diketahui'];
  const listSensitivitasGigi = ['Ya', 'Tidak', 'Kadang'];
  const listWarnaGigi = ['Putih alami', 'Kuning', 'Agak kuning'];
  const listNyeriGigi = Array.from({length: 11}, (_, i) => i); // Skala nyeri 0 sampai 10

  // Handler untuk memperbarui state form saat input berubah
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler untuk mengirim data formulir ke backend saat submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman default
    setLoading(true); // Aktifkan indikator loading
    setError(null); // Hapus error sebelumnya

    // --- URL BACKEND ANDA ---
    // PENTING: PASTIKAN URL INI SELALU SESUAI DENGAN URL NGROK YANG AKTIF SAAT INI
    const backendUrl = 'https://1c64-34-125-68-121.ngrok-free.app/predict'; // GANTI INI DENGAN URL NGROK ANDA!

    try {
      // Mengirim data formulir sebagai JSON ke backend
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      // Cek jika respons tidak OK (misal: status 4xx atau 5xx)
      if (!response.ok) {
        const errorData = await response.json(); // Ambil pesan error dari backend
        throw new Error(errorData.error || 'Terjadi kesalahan saat memprediksi.');
      }

      // Jika respons OK, parse data JSON
      const data = await response.json();
      setPredictionResult(data); // Simpan hasil prediksi
    } catch (err) {
      // Tangani error jaringan atau error dari backend
      setError(err.message || 'Terjadi kesalahan jaringan atau server.');
    } finally {
      setLoading(false); // Nonaktifkan indikator loading
    }
  };

  // Handler untuk kembali ke formulir input
  const handleBackToForm = () => {
    setPredictionResult(null); // Hapus hasil prediksi
    setForm({ // Reset semua field formulir ke nilai awal
      usia: '',
      jenis_kelamin: '',
      keluhan_utama: '',
      durasi_keluhan: '',
      riwayat_medis: '',
      riwayat_alergi: '',
      kebiasaan_buruk: '',
      kondisi_gigi_saat_ini: '',
      jumlah_gigi_berlubang: '',
      sensitivitas_gigi: '',
      nyeri_gigi: '',
      warna_gigi: ''
    });
  };

  // Fungsi untuk menentukan warna bar pada chart berdasarkan tingkat kepercayaan
  const getBarColor = (confidence) => {
    if (confidence > 0.9) return '#047857'; // Hijau gelap untuk kepercayaan sangat tinggi
    if (confidence > 0.8) return '#10B981'; // Hijau untuk kepercayaan tinggi
    if (confidence > 0.6) return '#FCD34D'; // Kuning untuk kepercayaan sedang
    return '#EF4444'; // Merah untuk kepercayaan rendah
  };

  // Fungsi untuk memberikan deskripsi tekstual berdasarkan tingkat kepercayaan
  const getConfidenceDescription = (confidence) => {
    if (confidence > 0.95) return "Sangat Tinggi! Model sangat yakin.";
    if (confidence > 0.85) return "Tinggi. Model cukup yakin.";
    if (confidence > 0.70) return "Cukup. Model memiliki keyakinan sedang.";
    if (confidence > 0.50) return "Sedang. Mungkin perlu pertimbangan lebih.";
    return "Rendah. Hasil prediksi kurang pasti.";
  };

  return (
    // Kontainer utama aplikasi dengan latar belakang dan penataan posisi
    <div className="min-h-screen py-10 px-4 bg-pink-50 flex justify-center items-start font-sans">
      {/* Kondisional rendering: Tampilkan formulir jika belum ada hasil prediksi */}
      {!predictionResult ? (
        // Card untuk formulir input
        <div className="bg-white w-full max-w-5xl p-12 rounded-3xl shadow-xl border border-pink-200">
          <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-10 text-center">Form Prediksi Penanganan Gigi</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid untuk tata letak 2 kolom pada layar menengah ke atas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {/* Setiap div di bawah adalah satu baris input/select */}
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Usia</label>
                <input
                  type="number"
                  name="usia"
                  value={form.usia}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  required
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Jenis Kelamin</label>
                <select
                  name="jenis_kelamin"
                  value={form.jenis_kelamin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  required
                >
                  <option disabled value="">Pilih Jenis Kelamin</option>
                  {listJenisKelamin.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Keluhan Utama</label>
                <input
                  type="text"
                  name="keluhan_utama"
                  value={form.keluhan_utama}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  placeholder="Mis: Gigi berlubang besar, gusi bengkak dan berdarah"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Durasi Keluhan</label>
                <select
                  name="durasi_keluhan"
                  value={form.durasi_keluhan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  required
                >
                  <option disabled value="">Pilih Durasi Keluhan</option>
                  {listDurasiKeluhan.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Riwayat Medis</label>
                <input
                  type="text"
                  name="riwayat_medis"
                  value={form.riwayat_medis}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  placeholder="Mis: Diabetes, Hipertensi, Tidak ada"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Riwayat Alergi</label>
                <input
                  type="text"
                  name="riwayat_alergi"
                  value={form.riwayat_alergi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  placeholder="Mis: Penisilin, Amoksisilin, Tidak ada"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Kebiasaan Buruk</label>
                <select
                  name="kebiasaan_buruk"
                  value={form.kebiasaan_buruk}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  required
                >
                  <option disabled value="">Pilih Kebiasaan Buruk</option>
                  {listKebiasaanBuruk.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Kondisi Gigi Saat Ini</label>
                <select
                  name="kondisi_gigi_saat_ini"
                  value={form.kondisi_gigi_saat_ini}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  required
                >
                  <option disabled value="">Pilih Kondisi Gigi</option>
                  {listKondisiGigiSaatIni.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Jumlah Gigi Berlubang</label>
                <input
                  type="number"
                  name="jumlah_gigi_berlubang"
                  value={form.jumlah_gigi_berlubang}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  required
                  min="0"
                  max="32"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Sensitivitas Gigi</label>
                <select
                  name="sensitivitas_gigi"
                  value={form.sensitivitas_gigi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  required
                >
                  <option disabled value="">Pilih Sensitivitas</option>
                  {listSensitivitasGigi.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Tingkat Nyeri Gigi (Skala 0-10)</label>
                <select
                  name="nyeri_gigi"
                  value={form.nyeri_gigi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  required
                >
                  <option disabled value="">Pilih Tingkat Nyeri</option>
                  {listNyeriGigi.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Warna Gigi</label>
                <select
                  name="warna_gigi"
                  value={form.warna_gigi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 text-base"
                  required
                >
                  <option disabled value="">Pilih Warna Gigi</option>
                  {listWarnaGigi.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div> {/* Penutup div grid */}

            {/* Area pesan error */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-8 text-base">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            {/* Tombol submit formulir */}
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 ease-in-out flex items-center justify-center mt-10 text-lg"
              disabled={loading} // Tombol dinonaktifkan saat loading
            >
              {loading ? (
                // Animasi loading spinner
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Brush className="mr-2" size={20} /> // Ikon sikat gigi
              )}
              {loading ? 'Memprediksi...' : 'Dapatkan Prediksi Penanganan'}
            </button>
          </form>
        </div>
      ) : (
        // Tampilan hasil prediksi jika sudah ada
        <div className="bg-white w-full max-w-5xl p-12 rounded-3xl shadow-xl border border-pink-200">
          <h2 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-10 text-center">Hasil Prediksi Penanganan</h2>
          <div className="space-y-4 text-center mb-8">
            <p className="text-xl text-gray-700">Penanganan yang paling mungkin adalah:</p>
            <p className="text-5xl md:text-6xl font-extrabold text-pink-700 mb-2">{predictionResult.penanganan_prediksi}</p>
            <p className="text-lg text-gray-500">
                Dengan tingkat kepercayaan: <span className="font-bold">{(predictionResult.confidence * 100).toFixed(2)}%</span>
                <br/>
                <span className="text-base italic text-gray-600">{getConfidenceDescription(predictionResult.confidence)}</span>
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Probabilitas untuk Setiap Penanganan:</h3>
          {/* Kontainer responsif untuk Bar Chart */}
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={predictionResult.all_probas_penanganan}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical" // Orientasi bar chart vertikal
            >
              <CartesianGrid strokeDasharray="3 3" /> {/* Garis grid putus-putus */}
              {/* Sumbu X (horizontal) dengan tick kustom */}
              <XAxis
                type="number"
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} // Format label tick menjadi persentase
                tick={<CustomXAxisTick />} // Menggunakan komponen tick kustom
              />
              {/* Sumbu Y (vertikal) dengan tick kustom */}
              <YAxis
                type="category"
                dataKey="name" // Menggunakan 'name' dari data sebagai kategori
                width={160} // Lebar sumbu Y untuk label yang panjang
                tick={<CustomYAxisTick />} // Menggunakan komponen tick kustom
              />
              <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} /> {/* Tooltip saat hover */}
              <Bar dataKey="confidence"> {/* Bar chart berdasarkan nilai 'confidence' */}
                {predictionResult.all_probas_penanganan.map((entry, index) => (
                  // Warna bar: merah muda jika itu adalah prediksi utama, lainnya sesuai kepercayaan
                  <Cell key={`cell-${index}`} fill={entry.name === predictionResult.penanganan_prediksi ? '#F472B6' : getBarColor(entry.confidence)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Tombol untuk kembali ke formulir */}
          <button
            onClick={handleBackToForm}
            className="w-full mt-10 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl transition duration-300 ease-in-out flex items-center justify-center text-lg"
          >
            <PlusCircle className="mr-2" size={20} />
            Prediksi Lagi
          </button>
        </div>
      )}
    </div>
  );
}
