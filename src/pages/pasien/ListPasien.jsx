import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import FormPasien from './FormPasien';

function ListPasien() {
  const [pasienList, setPasienList] = useState([]);
  const [editingPasien, setEditingPasien] = useState(null);

  const fetchPasien = async () => {
    const { data, error } = await supabase
      .from('pasien')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal mengambil data:', error.message);
    } else {
      setPasienList(data);
    }
  };

  const addPasien = async (pasien) => {
    const { error } = await supabase.from('pasien').insert(pasien);
    if (error) {
      console.error('Gagal menambahkan pasien:', error.message);
    } else {
      fetchPasien();
    }
  };

  const updatePasien = async (pasien) => {
    const { error } = await supabase
      .from('pasien')
      .update({
        nama: pasien.nama,
        email: pasien.email,
        no_hp: pasien.no_hp,
        alamat: pasien.alamat,
        jenis_kelamin: pasien.jenis_kelamin,
        tanggal_lahir: pasien.tanggal_lahir,
        membership: pasien.membership,
      })
      .eq('id', pasien.id);

    if (error) {
      console.error('Gagal mengubah data:', error.message);
    } else {
      fetchPasien();
      setEditingPasien(null);
    }
  };

  const deletePasien = async (id) => {
    const { error } = await supabase.from('pasien').delete().eq('id', id);
    if (error) {
      console.error('Gagal menghapus data:', error.message);
    } else {
      fetchPasien();
    }
  };

  useEffect(() => {
    fetchPasien();
  }, []);

  return (
    <div className="max-w-full px-10 py-8 bg-pink-50 min-h-screen">
      <h1 className="text-4xl font-bold text-pink-600 mb-10 text-center">Manajemen Data Pasien</h1>

      <div className="mb-12">
        <FormPasien
          addPasien={addPasien}
          updatePasien={updatePasien}
          editingPasien={editingPasien}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-xl border border-pink-200 bg-white">
        <table className="w-full text-md text-left">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">No. HP</th>
              <th className="px-6 py-4">Alamat</th>
              <th className="px-6 py-4">Jenis Kelamin</th>
              <th className="px-6 py-4">Tanggal Lahir</th>
              <th className="px-6 py-4">Membership</th>
              <th className="px-6 py-4">Tanggal Dibuat</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pasienList.length > 0 ? (
              pasienList.map((pasien) => (
                <tr key={pasien.id} className="border-t hover:bg-pink-50 transition duration-200">
                  <td className="px-6 py-4 text-gray-700">{pasien.nama}</td>
                  <td className="px-6 py-4 text-gray-700">{pasien.email}</td>
                  <td className="px-6 py-4 text-gray-700">{pasien.no_hp}</td>
                  <td className="px-6 py-4 text-gray-700">{pasien.alamat}</td>
                  <td className="px-6 py-4 text-gray-700">{pasien.jenis_kelamin}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {pasien.tanggal_lahir
                      ? new Date(pasien.tanggal_lahir).toLocaleDateString('id-ID')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{pasien.membership}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(pasien.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => setEditingPasien(pasien)}
                      className="bg-pink-400 hover:bg-pink-500 text-white py-1 px-3 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePasien(pasien.id)}
                      className="bg-red-400 hover:bg-red-500 text-white py-1 px-3 rounded-lg transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center px-6 py-8 text-gray-500 italic">
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
