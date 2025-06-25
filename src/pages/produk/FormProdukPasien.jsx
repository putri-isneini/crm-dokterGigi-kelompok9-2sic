import { useState, useEffect } from 'react';

const FormProdukPasien = ({ addProduk, updateProduk, editingProduk }) => {
  const [form, setForm] = useState({
    nama_produk: '',
    deskripsi: '',
    harga: '',
    stok: '',
  });

  useEffect(() => {
    if (editingProduk) {
      setForm({
        nama_produk: editingProduk.nama_produk || '',
        deskripsi: editingProduk.deskripsi || '',
        harga: editingProduk.harga || '',
        stok: editingProduk.stok || '',
      });
    } else {
      setForm({
        nama_produk: '',
        deskripsi: '',
        harga: '',
        stok: '',
      });
    }
  }, [editingProduk]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama_produk, harga, stok } = form;
    if (!nama_produk || !harga || !stok) return;

    editingProduk ? updateProduk({ ...form, id: editingProduk.id }) : addProduk(form);

    setForm({
      nama_produk: '',
      deskripsi: '',
      harga: '',
      stok: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-md border border-pink-100 mb-10"
    >
      <h2 className="text-2xl font-semibold text-pink-600 mb-6">
        {editingProduk ? 'Edit Produk Pasien' : 'Tambah Produk Pasien'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-pink-700 font-medium mb-1">Nama Produk</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.nama_produk}
            onChange={(e) => setForm({ ...form, nama_produk: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Deskripsi</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Harga</label>
          <input
            type="number"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Stok</label>
          <input
            type="number"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.stok}
            onChange={(e) => setForm({ ...form, stok: e.target.value })}
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-lg font-semibold transition duration-200"
          >
            {editingProduk ? 'Perbarui Produk' : 'Tambah Produk'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormProdukPasien;
