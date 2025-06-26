import { useState, useEffect } from 'react';

const FormLayanan = ({ addLayanan, updateLayanan, editingLayanan }) => {
  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
  });

  useEffect(() => {
    if (editingLayanan) {
      setForm({
        nama: editingLayanan.nama || '',
        deskripsi: editingLayanan.deskripsi || '',
        harga: editingLayanan.harga || '',
      });
    } else {
      setForm({
        nama: '',
        deskripsi: '',
        harga: '',
      });
    }
  }, [editingLayanan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, deskripsi, harga } = form;
    if (!nama || !harga) return;

    if (editingLayanan) {
      updateLayanan({ ...editingLayanan, ...form });
    } else {
      addLayanan(form);
    }

    setForm({ nama: '', deskripsi: '', harga: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-md border border-pink-100 mb-10"
    >
      <h2 className="text-2xl font-semibold text-pink-600 mb-6">
        {editingLayanan ? 'Edit Layanan' : 'Tambah Layanan'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Nama Layanan
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">
            Harga
          </label>
          <input
            type="number"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-pink-700 font-medium mb-1">
            Deskripsi
          </label>
          <textarea
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            rows={4}
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-lg font-semibold transition duration-200"
          >
            {editingLayanan ? 'Perbarui Layanan' : 'Tambah Layanan'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormLayanan;
