import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import FormLayanan from './FormLayanan';

function ListLayanan() {
  const [layananList, setLayananList] = useState([]);
  const [editingLayanan, setEditingLayanan] = useState(null);

  const fetchLayanan = async () => {
    const { data, error } = await supabase
      .from('layanan')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal mengambil data layanan:', error.message);
    } else {
      setLayananList(data);
    }
  };

  const addLayanan = async (layanan) => {
    const { error } = await supabase.from('layanan').insert(layanan);
    if (error) {
      console.error('Gagal menambahkan layanan:', error.message);
    } else {
      fetchLayanan();
    }
  };

  const updateLayanan = async (newData) => {
    const oldData = editingLayanan;

    const dataToUpdate = {
      nama: newData.nama || oldData.nama,
      gambar: newData.gambar || oldData.gambar,
      deskripsi: newData.deskripsi || oldData.deskripsi,
      harga: newData.harga ? parseFloat(newData.harga) : oldData.harga,
    };

    const { error } = await supabase
      .from('layanan')
      .update(dataToUpdate)
      .eq('id', newData.id);

    if (error) {
      console.error('Gagal mengubah layanan:', error.message);
    } else {
      fetchLayanan();
      setEditingLayanan(null);
    }
  };

  const deleteLayanan = async (id) => {
    const konfirmasi = confirm("Yakin ingin menghapus layanan ini?");
    if (!konfirmasi) return;

    const { error } = await supabase.from('layanan').delete().eq('id', id);
    if (error) {
      console.error('Gagal menghapus layanan:', error.message);
    } else {
      fetchLayanan();
    }
  };

  useEffect(() => {
    fetchLayanan();
  }, []);

  return (
    <div className="max-w-full px-10 py-8 bg-pink-50 min-h-screen">
      <h1 className="text-4xl font-bold text-pink-600 mb-10 text-center">Manajemen Layanan</h1>

      <div className="mb-12">
        <FormLayanan
          addLayanan={addLayanan}
          updateLayanan={updateLayanan}
          editingLayanan={editingLayanan}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-xl border border-pink-200 bg-white">
        <table className="w-full text-md text-left font-sans">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-6 py-4">Gambar</th>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Deskripsi</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Tanggal Dibuat</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {layananList.length > 0 ? (
              layananList.map((layanan) => (
                <tr key={layanan.id} className="border-t hover:bg-pink-50 transition duration-200">
                  <td className="px-6 py-4">
                    {layanan.gambar ? (
                      <img
                        src={layanan.gambar}
                        alt="Gambar Layanan"
                        className="w-20 h-20 object-cover rounded-xl shadow"
                      />
                    ) : (
                      <span className="text-gray-400 italic">Tidak ada gambar</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{layanan.nama}</td>
                  <td className="px-6 py-4 text-gray-700">{layanan.deskripsi}</td>
                  <td className="px-6 py-4 text-pink-700 font-semibold">
                    Rp {parseInt(layanan.harga).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(layanan.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => setEditingLayanan(layanan)}
                      className="bg-pink-400 hover:bg-pink-500 text-white py-1 px-3 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteLayanan(layanan.id)}
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
                  Tidak ada data layanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListLayanan;
