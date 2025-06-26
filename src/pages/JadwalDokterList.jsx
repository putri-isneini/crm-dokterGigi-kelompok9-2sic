// src/JadwalDokter.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import JadwalDokterForm from './JadwalDokterForm';

function JadwalDokter() {
  const [jadwal, setJadwal] = useState([]);
  const [editingJadwal, setEditingJadwal] = useState(null);

  const fetchJadwal = async () => {
    const { data, error } = await supabase
      .from('jadwal_dokter')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setJadwal(data);
  };

  const addJadwal = async (item) => {
    const { error } = await supabase.from('jadwal_dokter').insert(item);
    if (error) console.error(error);
    else fetchJadwal();
  };

  const updateJadwal = async (item) => {
    const { error } = await supabase.from('jadwal_dokter').update(item).eq('id', item.id);
    if (error) console.error(error);
    else {
      fetchJadwal();
      setEditingJadwal(null);
    }
  };

  const deleteJadwal = async (id) => {
    const { error } = await supabase.from('jadwal_dokter').delete().eq('id', id);
    if (error) console.error(error);
    else fetchJadwal();
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Jadwal Dokter</h1>
      <JadwalDokterForm
        addJadwal={addJadwal}
        updateJadwal={updateJadwal}
        editingJadwal={editingJadwal}
      />
      <ul className="mt-4">
        {jadwal.map(j => (
          <li key={j.id} className="border p-2 my-2 flex justify-between">
            <div>
              <p className="font-semibold">Dokter ID: {j.dokter_id}</p>
              <p className="text-sm text-gray-600">
                {j.hari}, {j.jam_mulai} - {j.jam_selesai}
              </p>
            </div>
            <div className="space-x-2">
              <button onClick={() => setEditingJadwal(j)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => deleteJadwal(j.id)} className="text-red-600 hover:underline">Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JadwalDokter;
