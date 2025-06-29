import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const JadwalDokterForm = ({ addJadwal, updateJadwal, editingJadwal }) => {
  const [form, setForm] = useState({
    dokter_id: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
  });

  const [dokterList, setDokterList] = useState([]);
  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  useEffect(() => {
    const fetchDokter = async () => {
      const { data, error } = await supabase.from('dokter').select('*');
      if (!error) setDokterList(data);
    };
    fetchDokter();
  }, []);

  useEffect(() => {
    if (editingJadwal) {
      setForm(editingJadwal);
    } else {
      setForm({ dokter_id: '', hari: '', jam_mulai: '', jam_selesai: '' });
    }
  }, [editingJadwal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.dokter_id || !form.hari || !form.jam_mulai || !form.jam_selesai) return;

    editingJadwal ? updateJadwal(form) : addJadwal(form);
    setForm({ dokter_id: '', hari: '', jam_mulai: '', jam_selesai: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-pink-100 p-6 rounded-xl shadow"
    >
      <div>
        <label className="text-sm text-pink-700 mb-1 block">Pilih Dokter</label>
        <select
          className="w-full p-2 border border-pink-300 rounded-md bg-white"
          value={form.dokter_id}
          onChange={(e) => setForm({ ...form, dokter_id: e.target.value })}
        >
          <option value="">-- Pilih Dokter --</option>
          {dokterList.map((dokter) => (
            <option key={dokter.id} value={dokter.id}>
              {dokter.nama}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-pink-700 mb-1 block">Hari</label>
        <select
          className="w-full p-2 border border-pink-300 rounded-md bg-white"
          value={form.hari}
          onChange={(e) => setForm({ ...form, hari: e.target.value })}
        >
          <option value="">-- Pilih Hari --</option>
          {hariList.map((hari) => (
            <option key={hari} value={hari}>
              {hari}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-pink-700 mb-1 block">Jam Mulai</label>
        <input
          type="time"
          className="w-full p-2 border border-pink-300 rounded-md bg-white"
          value={form.jam_mulai}
          onChange={(e) => setForm({ ...form, jam_mulai: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm text-pink-700 mb-1 block">Jam Selesai</label>
        <input
          type="time"
          className="w-full p-2 border border-pink-300 rounded-md bg-white"
          value={form.jam_selesai}
          onChange={(e) => setForm({ ...form, jam_selesai: e.target.value })}
        />
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold"
        >
          {editingJadwal ? 'Perbarui Jadwal' : 'Tambah Jadwal'}
        </button>
      </div>
    </form>
  );
};

export default JadwalDokterForm;
