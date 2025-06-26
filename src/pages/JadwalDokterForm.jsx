// src/components/JadwalDokterForm.jsx
import { useState, useEffect } from 'react';

const JadwalDokterForm = ({ addJadwal, updateJadwal, editingJadwal }) => {
  const [form, setForm] = useState({
    dokter_id: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
  });

  useEffect(() => {
    if (editingJadwal) setForm(editingJadwal);
    else setForm({ dokter_id: '', hari: '', jam_mulai: '', jam_selesai: '' });
  }, [editingJadwal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.dokter_id || !form.hari || !form.jam_mulai || !form.jam_selesai) return;
    editingJadwal ? updateJadwal(form) : addJadwal(form);
    setForm({ dokter_id: '', hari: '', jam_mulai: '', jam_selesai: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Dokter ID"
        className="w-full p-2 border rounded"
        value={form.dokter_id}
        onChange={e => setForm({ ...form, dokter_id: e.target.value })}
      />
      <input
        type="text"
        placeholder="Hari"
        className="w-full p-2 border rounded"
        value={form.hari}
        onChange={e => setForm({ ...form, hari: e.target.value })}
      />
      <input
        type="time"
        placeholder="Jam Mulai"
        className="w-full p-2 border rounded"
        value={form.jam_mulai}
        onChange={e => setForm({ ...form, jam_mulai: e.target.value })}
      />
      <input
        type="time"
        placeholder="Jam Selesai"
        className="w-full p-2 border rounded"
        value={form.jam_selesai}
        onChange={e => setForm({ ...form, jam_selesai: e.target.value })}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingJadwal ? 'Perbarui' : 'Tambah'}
      </button>
    </form>
  );
};

export default JadwalDokterForm;
