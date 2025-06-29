import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import FormProdukPasien from './FormProdukPasien';

function ListProdukPasien() {
  const [produkList, setProdukList] = useState([]);
  const [editingProduk, setEditingProduk] = useState(null);

  const fetchProduk = async () => {
    const { data, error } = await supabase
      .from('produk_pasien')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal mengambil data:', error.message);
    } else {
      setProdukList(data);
    }
  };

  const addProduk = async (produk) => {
    const { error } = await supabase.from('produk_pasien').insert(produk);
    if (error) {
      console.error('Gagal menambahkan produk:', error.message);
    } else {
      fetchProduk();
    }
  };

  const updateProduk = async (produk) => {
    const { error } = await supabase
      .from('produk_pasien')
      .update({
        nama_produk: produk.nama_produk,
        deskripsi: produk.deskripsi,
        harga: produk.harga,
        stok: produk.stok,
      })
      .eq('id', produk.id);

    if (error) {
      console.error('Gagal mengubah data:', error.message);
    } else {
      fetchProduk();
      setEditingProduk(null);
    }
  };

  const deleteProduk = async (id) => {
    const { error } = await supabase.from('produk_pasien').delete().eq('id', id);
    if (error) {
      console.error('Gagal menghapus data:', error.message);
    } else {
      fetchProduk();
    }
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  return (
    <div className="max-w-full px-10 py-8 bg-pink-50 min-h-screen">
      <h1 className="text-4xl font-bold text-pink-600 mb-10 text-center">Manajemen Produk Pasien</h1>

      <div className="mb-12">
        <FormProdukPasien
          addProduk={addProduk}
          updateProduk={updateProduk}
          editingProduk={editingProduk}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-xl border border-pink-200 bg-white">
        <table className="w-full text-md text-left">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-6 py-4">Nama Produk</th>
              <th className="px-6 py-4">Deskripsi</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Stok</th>
              <th className="px-6 py-4">Tanggal Dibuat</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {produkList.length > 0 ? (
              produkList.map((produk) => (
                <tr key={produk.id} className="border-t hover:bg-pink-50 transition duration-200 font-sans">
                  <td className="px-6 py-4 text-gray-700">{produk.nama_produk}</td>
                  <td className="px-6 py-4 text-gray-700">{produk.deskripsi || '-'}</td>
                  <td className="px-6 py-4 text-gray-700">{produk.harga}</td>
                  <td className="px-6 py-4 text-gray-700">{produk.stok}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(produk.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => setEditingProduk(produk)}
                      className="bg-pink-400 hover:bg-pink-500 text-white py-1 px-3 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduk(produk.id)}
                      className="bg-red-400 hover:bg-red-500 text-white py-1 px-3 rounded-lg transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center px-6 py-8 text-gray-500 italic">
                  Tidak ada data produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListProdukPasien;