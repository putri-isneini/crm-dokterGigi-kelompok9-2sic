import { useState, useEffect } from 'react';

const DokterForm = ({ addDokter, updateDokter, editingDokter }) => {
  const [form, setForm] = useState({
    nama_dokter: '',
    spesialis: '',
    tanggal: '',
    start_time: '',
    end_time: '',
    created_at: '',
  });

  useEffect(() => {
    if (editingDokter) setForm(editingDokter);
    else setForm({
      nama_dokter: '',
      spesialis: '',
      tanggal: '',
      start_time: '',
      end_time: '',
      created_at: '',
    });
  }, [editingDokter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama_dokter, spesialis, tanggal, start_time, end_time } = form;
    if (!nama_dokter || !spesialis || !tanggal || !start_time || !end_time) return;

    editingDokter ? updateDokter(form) : addDokter(form);
    setForm({
      nama_dokter: '',
      spesialis: '',
      tanggal: '',
      start_time: '',
      end_time: '',
      created_at: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Nama Dokter"
        className="w-full p-2 border rounded"
        value={form.nama_dokter}
        onChange={e => setForm({ ...form, nama_dokter: e.target.value })}
      />
      <input
        type="text"
        placeholder="Spesialis"
        className="w-full p-2 border rounded"
        value={form.spesialis}
        onChange={e => setForm({ ...form, spesialis: e.target.value })}
      />
      <input
        type="number"
        placeholder="Tanggal (contoh: 20250620)"
        className="w-full p-2 border rounded"
        value={form.tanggal}
        onChange={e => setForm({ ...form, tanggal: e.target.value })}
      />
      <input
        type="number"
        step="0.5"
        placeholder="Jam Mulai (contoh: 8 atau 14.5)"
        className="w-full p-2 border rounded"
        value={form.start_time}
        onChange={e => setForm({ ...form, start_time: e.target.value })}
      />
      <input
        type="number"
        step="0.5"
        placeholder="Jam Selesai (contoh: 10 atau 17.5)"
        className="w-full p-2 border rounded"
        value={form.end_time}
        onChange={e => setForm({ ...form, end_time: e.target.value })}
      />
      <input
        type="datetime-local"
        placeholder="Created At (Opsional)"
        className="w-full p-2 border rounded"
        value={form.created_at}
        onChange={e => setForm({ ...form, created_at: e.target.value })}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingDokter ? 'Perbarui' : 'Tambah'}
      </button>
    </form>
  );
};

export default DokterForm;
