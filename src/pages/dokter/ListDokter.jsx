import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import FormDokter from './FormDokter';

function ListDokter() {
  const [dokterList, setDokterList] = useState([]);
  const [editingDokter, setEditingDokter] = useState(null);

  const fetchDokter = async () => {
    const { data, error } = await supabase
      .from('dokter')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal mengambil data:', error.message);
    } else {
      setDokterList(data);
    }
  };

  const addDokter = async (dokter) => {
    const { error } = await supabase.from('dokter').insert(dokter);
    if (error) {
      console.error('Gagal menambahkan dokter:', error.message);
    } else {
      fetchDokter();
    }
  };

  const updateDokter = async (dokter) => {
    const { error } = await supabase
      .from('dokter')
      .update({
        nama: dokter.nama,
        spesialis: dokter.spesialis,
        no_hp: dokter.no_hp,
        foto: dokter.foto,
      })
      .eq('id', dokter.id);

    if (error) {
      console.error('Gagal mengubah data:', error.message);
    } else {
      fetchDokter();
      setEditingDokter(null);
    }
  };

  const deleteDokter = async (id) => {
    const { error } = await supabase.from('dokter').delete().eq('id', id);
    if (error) {
      console.error('Gagal menghapus data:', error.message);
    } else {
      fetchDokter();
    }
  };

  useEffect(() => {
    fetchDokter();
  }, []);

  return (
    <div className="max-w-full px-10 py-8 bg-pink-50 min-h-screen">
      <h1 className="text-4xl font-bold text-pink-600 mb-10 text-center">Manajemen Data Dokter</h1>

      <div className="mb-12">
        <FormDokter
          addDokter={addDokter}
          updateDokter={updateDokter}
          editingDokter={editingDokter}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-xl border border-pink-200 bg-white">
        <table className="w-full text-md text-left">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Spesialis</th>
              <th className="px-6 py-4">No. HP</th>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4">Tanggal Dibuat</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dokterList.length > 0 ? (
              dokterList.map((dokter) => (
                <tr key={dokter.id} className="border-t hover:bg-pink-50 transition duration-200">
                  <td className="px-6 py-4 text-gray-700 font-sans">{dokter.nama}</td>
                  <td className="px-6 py-4 text-gray-700 font-sans">{dokter.spesialis}</td>
                  <td className="px-6 py-4 text-gray-700 font-sans">{dokter.no_hp}</td>
                  <td className="px-6 py-4">
                    {dokter.foto ? (
                      <img
                        src={dokter.foto}
                        alt={dokter.nama}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ) : (
                      <span className="text-gray-400 italic font-sans">Tidak ada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-sans">
                    {new Date(dokter.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => setEditingDokter(dokter)}
                      className="bg-pink-400 hover:bg-pink-500 text-white py-1 px-3 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteDokter(dokter.id)}
                      className="bg-red-400 hover:bg-red-500 text-white py-1 px-3 rounded-lg transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center px-6 py-8 text-gray-500 italic font-sans">
                  Tidak ada data dokter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListDokter;
