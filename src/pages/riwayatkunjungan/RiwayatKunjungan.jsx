import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

function RiwayatKunjungan() {
  const [kunjunganList, setKunjunganList] = useState([]);
  const [editingKunjungan, setEditingKunjungan] = useState(null);
  const [pasienList, setPasienList] = useState([]);
  const [dokterList, setDokterList] = useState([]);

  // Ambil data kunjungan dari tabel 'riwayat_kunjungan' dan join dengan pasien & dokter
  const fetchKunjungan = async () => {
    const { data, error } = await supabase
      .from('riwayat_kunjungan')
      .select(`
        id,
        pasien_id,
        dokter_id,
        tanggal,
        catatan,
        created_at,
        pasien (nama),
        dokter (nama)
      `)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetch kunjungan:', error);
    else setKunjunganList(data);
  };

  // Ambil daftar pasien (hanya id dan nama)
  const fetchPasien = async () => {
    const { data, error } = await supabase.from('pasien').select('id, nama');
    if (error) console.error('Error fetch pasien:', error);
    else setPasienList(data);
  };

  // Ambil daftar dokter (hanya id dan nama)
  const fetchDokter = async () => {
    const { data, error } = await supabase.from('dokter').select('id, nama');
    if (error) console.error('Error fetch dokter:', error);
    else setDokterList(data);
  };

  // Tambah kunjungan baru
  const addKunjungan = async (data) => {
    const { error } = await supabase.from('riwayat_kunjungan').insert(data);
    if (error) console.error('Error insert kunjungan:', error);
    else fetchKunjungan();
  };

  // Update data kunjungan
  const updateKunjungan = async (data) => {
    const { error } = await supabase
      .from('riwayat_kunjungan')
      .update(data)
      .eq('id', data.id);

    if (error) console.error('Error update kunjungan:', error);
    else {
      fetchKunjungan();
      setEditingKunjungan(null); // keluar dari mode edit
    }
  };

  // Hapus kunjungan
  const deleteKunjungan = async (id) => {
    const { error } = await supabase
      .from('riwayat_kunjungan')
      .delete()
      .eq('id', id);

    if (error) console.error('Error delete kunjungan:', error);
    else fetchKunjungan();
  };

  // Jalankan saat komponen dimuat
  useEffect(() => {
    fetchKunjungan();
    fetchPasien();
    fetchDokter();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Riwayat Kunjungan Pasien</h1>

      <RiwayatKunjunganForm
        addKunjungan={addKunjungan}
        updateKunjungan={updateKunjungan}
        editingKunjungan={editingKunjungan}
        pasienList={pasienList}
        dokterList={dokterList}
      />

      <ul className="mt-4">
        {kunjunganList.map(k => (
          <li key={k.id} className="border p-2 my-2 flex justify-between items-start">
            <div>
              <p className="font-semibold">{k.tanggal}</p>
              <p className="text-sm text-gray-600">Pasien: {k.pasien?.nama || '-'}</p>
              <p className="text-sm text-gray-600">Dokter: {k.dokter?.nama || '-'}</p>
              <p className="text-sm mt-1">{k.catatan}</p>
            </div>
            <div className="space-x-2 text-sm">
              <button
                onClick={() => setEditingKunjungan(k)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteKunjungan(k.id)}
                className="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RiwayatKunjungan;
