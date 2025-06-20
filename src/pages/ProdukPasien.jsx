import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const dataAwal = [

];

const ProdukPasien = () => {
  const [produk, setProduk] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ nama: '', harga: '', stok: '', gambar: '' });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const dataLocal = localStorage.getItem('produkPasien');
    if (dataLocal) {
      setProduk(JSON.parse(dataLocal));
    } else {
      setProduk(dataAwal);
      localStorage.setItem('produkPasien', JSON.stringify(dataAwal));
    }
  }, []);

  const simpanLocal = (data) => {
    localStorage.setItem('produkPasien', JSON.stringify(data));
  };

  const resetDataAwal = () => {
    if (confirm('Yakin ingin reset ke data awal? Semua data akan diganti.')) {
      localStorage.setItem('produkPasien', JSON.stringify(dataAwal));
      setProduk(dataAwal);
      setForm({ nama: '', harga: '', stok: '', gambar: '' });
      setEditIndex(null);
    }
  };

  const handleTambahAtauEdit = () => {
    if (!form.nama || !form.harga || !form.stok || !form.gambar) {
      alert('Harap lengkapi semua field.');
      return;
    }

    const produkBaru = { ...form, stok: parseInt(form.stok) };

    let data;
    if (editIndex !== null) {
      data = [...produk];
      data[editIndex] = produkBaru;
      setEditIndex(null);
    } else {
      data = [...produk, produkBaru];
    }

    setProduk(data);
    simpanLocal(data);
    setForm({ nama: '', harga: '', stok: '', gambar: '' });
  };

  const handleHapus = (index) => {
    const konfirmasi = confirm('Yakin ingin menghapus produk ini?');
    if (!konfirmasi) return;

    const baru = [...produk];
    baru.splice(index, 1);
    setProduk(baru);
    simpanLocal(baru);
  };

  const handleEdit = (index) => {
    const item = produk[index];
    setForm({ ...item, stok: item.stok.toString() });
    setEditIndex(index);
  };

  const produkFilter = produk.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-pink-50 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-pink-800 mb-6 text-center">Produk Pasien</h1>

      {/* Form Tambah/Edit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Nama Produk"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          placeholder="Harga (mis: Rp20.000)"
          value={form.harga}
          onChange={(e) => setForm({ ...form, harga: e.target.value })}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="number"
          placeholder="Stok"
          value={form.stok}
          onChange={(e) => setForm({ ...form, stok: e.target.value })}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          placeholder="URL Gambar"
          value={form.gambar}
          onChange={(e) => setForm({ ...form, gambar: e.target.value })}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          onClick={handleTambahAtauEdit}
          className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800 transition w-full md:w-auto col-span-full"
        >
          {editIndex !== null ? 'Simpan Perubahan' : '+ Tambah Produk'}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Cari produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      {/* Tabel Produk */}
      <div className="overflow-auto">
        <table className="w-full border text-sm bg-white rounded shadow">
          <thead className="bg-pink-100 text-pink-900">
            <tr>
              <th className="border p-2 text-left">Gambar</th>
              <th className="border p-2 text-left">Nama Produk</th>
              <th className="border p-2 text-left">Harga</th>
              <th className="border p-2 text-left">Stok</th>
              <th className="border p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {produkFilter.length > 0 ? (
              produkFilter.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      className="w-20 h-20 object-contain"
                    />
                  </td>
                  <td className="border p-2">{item.nama}</td>
                  <td className="border p-2">{item.harga}</td>
                  <td
                    className={`border p-2 ${
                      item.stok < 10 ? 'text-red-600 font-semibold' : ''
                    }`}
                  >
                    {item.stok}
                  </td>
                  <td className="border p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleHapus(index)}
                        className="text-red-600 hover:bg-red-100 p-1 rounded"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border p-4 text-center text-gray-500">
                  Produk tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={resetDataAwal}
        className="mt-6 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
      >
        Reset ke Produk Awal
      </button>
    </div>
  );
};

export default ProdukPasien;
