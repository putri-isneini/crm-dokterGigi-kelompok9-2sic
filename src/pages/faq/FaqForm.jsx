// src/pages/faq/FaqForm.jsx
import { useState, useEffect } from 'react';

function FaqForm({ addFaq, updateFaq, editingFaq, setEditingFaq }) {
  const [pertanyaan, setPertanyaan] = useState('');
  const [jawaban, setJawaban] = useState('');
  const [kategori, setKategori] = useState(''); // Tambahkan state untuk kategori

  useEffect(() => {
    if (editingFaq) {
      setPertanyaan(editingFaq.pertanyaan);
      setJawaban(editingFaq.jawaban);
      setKategori(editingFaq.kategori || ''); // Isi kategori jika ada
    } else {
      setPertanyaan('');
      setJawaban('');
      setKategori('');
    }
  }, [editingFaq]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { pertanyaan, jawaban, kategori }; // Sertakan kategori dalam data

    if (editingFaq) {
      updateFaq({ ...data, id: editingFaq.id });
    } else {
      addFaq(data);
    }
    // Reset form setelah submit
    setPertanyaan('');
    setJawaban('');
    setKategori('');
    setEditingFaq(null); // Keluar dari mode edit
  };

  const handleCancelEdit = () => {
    setEditingFaq(null);
    setPertanyaan('');
    setJawaban('');
    setKategori('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
        {editingFaq ? '✏️ Edit FAQ' : '➕ Tambah FAQ'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pertanyaan</label>
          <input
            type="text"
            value={pertanyaan}
            onChange={(e) => setPertanyaan(e.target.value)}
            placeholder="Masukkan pertanyaan"
            className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Jawaban</label>
          <textarea
            value={jawaban}
            onChange={(e) => setJawaban(e.target.value)}
            placeholder="Masukkan jawaban"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori (Opsional)</label>
          <input
            type="text"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            placeholder="Contoh: Umum, Pembayaran, Layanan"
            className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 rounded-xl text-lg font-bold shadow-md transition duration-200"
          >
            {editingFaq ? '💾 Perbarui FAQ' : '🚀 Tambah FAQ'}
          </button>
          {editingFaq && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-xl text-lg font-bold shadow-md transition duration-200"
            >
              Batal
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default FaqForm;
