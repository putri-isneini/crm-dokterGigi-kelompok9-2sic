import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import PasienForm from '../components/PasienForm';

function ListPasien() {
  const [pasienList, setPasienList] = useState([]);
  const [editingPasien, setEditingPasien] = useState(null);

  const fetchPasien = async () => {
    const { data, error } = await supabase
      .from('pasien')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Gagal mengambil data:', error);
    else setPasienList(data);
  };

  const addPasien = async (pasien) => {
    const { error } = await supabase.from('pasien').insert(pasien);
    if (error) console.error('Gagal menambahkan pasien:', error);
    else fetchPasien();
  };

  const updatePasien = async (pasien) => {
    const { error } = await supabase
      .from('pasien')
      .update({
        nama_lengkap: pasien.nama_lengkap,
        jenis_kelamin: pasien.jenis_kelamin,
        usia: pasien.usia,
        no_hp: pasien.no_hp,
        created_at: pasien.created_at,
      })
      .eq('id', pasien.id);

    if (error) console.error('Gagal mengubah data:', error);
    else {
      fetchPasien();
      setEditingPasien(null);
    }
  };

  const deletePasien = async (id) => {
    const { error } = await supabase.from('pasien').delete().eq('id', id);
    if (error) console.error('Gagal menghapus data:', error);
    else fetchPasien();
  };

  useEffect(() => {
    fetchPasien();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manajemen Data Pasien</h1>

      <PasienForm
        addPasien={addPasien}
        updatePasien={updatePasien}
        editingPasien={editingPasien}
      />

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Nama Lengkap</th>
              <th className="p-2">Jenis Kelamin</th>
              <th className="p-2">Usia</th>
              <th className="p-2">No. HP</th>
              <th className="p-2">Tanggal Dibuat</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pasienList.map((pasien) => (
              <tr key={pasien.id} className="border-t">
                <td className="p-2">{pasien.nama_lengkap}</td>
                <td className="p-2">{pasien.jenis_kelamin}</td>
                <td className="p-2">{pasien.usia}</td>
                <td className="p-2">{pasien.no_hp}</td>
                <td className="p-2">{new Date(pasien.created_at).toLocaleDateString()}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    onClick={() => setEditingPasien(pasien)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePasien(pasien.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {pasienList.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Tidak ada data pasien.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListPasien;
