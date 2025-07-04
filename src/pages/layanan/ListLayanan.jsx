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
    const oldData = editingLayanan; // Data lama dari state editingLayanan

    // Kita hanya mengupdate kolom yang benar-benar berubah atau yang baru dari form
    const dataToUpdate = {
      nama: newData.nama, // Ambil dari newData (sudah pasti ada dari form)
      deskripsi: newData.deskripsi,
      harga: parseFloat(newData.harga),
      gambar: newData.gambar, // <-- Ini penting, ambil URL gambar terbaru dari newData
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

    // Opsional: Hapus juga file gambar dari Supabase Storage jika ada
    const { data: layananToDelete, error: fetchError } = await supabase
      .from('layanan')
      .select('gambar')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Gagal mengambil data layanan untuk dihapus:', fetchError.message);
      return;
    }

    if (layananToDelete && layananToDelete.gambar) {
      // Perhatikan bagian ini: Split URL untuk mendapatkan path relatif.
      // Jika URL Supabase public storage Anda seperti:
      // https://[project-ref].supabase.co/storage/v1/object/public/layanan-gambar/layanan_images/namafile.jpg
      // Maka kita perlu mengambil bagian setelah 'layanan-gambar/'
      const bucketName = 'layanan-gambar'; // Nama bucket Anda
      const urlParts = layananToDelete.gambar.split(`${bucketName}/`);
      const filePath = urlParts.length > 1 ? urlParts[1] : null;

      if (filePath) {
        const { error: deleteStorageError } = await supabase.storage
          .from(bucketName) // <<< SUDAH DISESUAIKAN KE 'layanan-gambar'
          .remove([filePath]);

        if (deleteStorageError) {
          console.error('Gagal menghapus gambar dari storage:', deleteStorageError.message);
        }
      }
    }

    // Hapus entri dari database
    const { error: deleteDbError } = await supabase.from('layanan').delete().eq('id', id);
    if (deleteDbError) {
      console.error('Gagal menghapus layanan dari database:', deleteDbError.message);
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
          setEditingLayanan={setEditingLayanan}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-xl border border-pink-200 bg-white">
        <table className="w-full text-md text-left font-sans">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-6 py-4">Gambar</th> {/* Pastikan kolom ini ada */}
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