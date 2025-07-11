import { useState, useEffect } from 'react';

const FormLayanan = ({ addLayanan, updateLayanan, editingLayanan }) => {
  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    gambar: '',
  });

  useEffect(() => {
    if (editingLayanan) {
      setForm({ ...editingLayanan });
    } else {
      setForm({
        nama: '',
        deskripsi: '',
        harga: '',
        gambar: '',
      });
    }
  }, [editingLayanan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, deskripsi, harga, gambar } = form;

    if (!nama || !deskripsi || !harga || !gambar) return;

    editingLayanan ? updateLayanan(form) : addLayanan({ ...form, harga: parseFloat(harga) });

    setForm({
      nama: '',
      deskripsi: '',
      harga: '',
      gambar: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-3xl shadow-lg border border-pink-100 transition-all duration-300"
    >
      <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center tracking-tight">
        {editingLayanan ? '✨ Edit Layanan' : '➕ Tambah Layanan Baru'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">🪥 Nama Layanan</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Contoh: Scaling Gigi"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Harga (Rp)</label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: e.target.value })}
            placeholder="Contoh: 150000"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Deskripsi</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            rows="3"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            placeholder="Jelaskan layanan secara singkat dan jelas"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">🌄 URL Gambar</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.gambar}
            onChange={(e) => setForm({ ...form, gambar: e.target.value })}
            placeholder="Contoh: https://..."
          />
        </div>

        {form.gambar && (
          <div className="md:col-span-2 flex justify-center mt-4">
            <img
              src={form.gambar}
              alt="Preview"
              className="rounded-xl border border-pink-200 shadow-md max-h-48 object-cover"
            />
          </div>
        )}

        <div className="md:col-span-2 mt-6">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 rounded-xl text-lg font-bold shadow-md transition duration-200"
          >
            {editingLayanan ? '💾 Perbarui Layanan' : '🚀 Tambah Layanan'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormLayanan;
