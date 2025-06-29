import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import JadwalDokterForm from './JadwalDokterForm';

function JadwalDokter() {
  const [jadwal, setJadwal] = useState([]);
  const [editingJadwal, setEditingJadwal] = useState(null);
  const [dokterMap, setDokterMap] = useState({});

  const fetchJadwal = async () => {
    const { data, error } = await supabase
      .from('jadwal_dokter')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    else setJadwal(data);
  };

  const fetchDokter = async () => {
    const { data, error } = await supabase.from('dokter').select('*');
    if (!error) {
      const map = {};
      data.forEach((d) => (map[d.id] = d.nama));
      setDokterMap(map);
    }
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
    fetchDokter();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-6">Jadwal Dokter</h1>

     <div className="w-full space-y-8">
        <JadwalDokterForm
          addJadwal={addJadwal}
          updateJadwal={updateJadwal}
          editingJadwal={editingJadwal}
        />

        <div className="space-y-4">
          {jadwal.map((j) => (
            <div
              key={j.id}
              className="bg-white p-4 border border-pink-200 rounded-lg shadow flex justify-between items-start"
            >
              <div>
                <p className="font-semibold text-pink-700">
                  {dokterMap[j.dokter_id] || 'Dokter tidak ditemukan'}
                </p>
                <p className="text-sm text-gray-600">
                  {j.hari}, {j.jam_mulai} - {j.jam_selesai}
                </p>
              </div>
              <div className="space-x-3 text-sm mt-1">
                <button
                  onClick={() => setEditingJadwal(j)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteJadwal(j.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JadwalDokter;
