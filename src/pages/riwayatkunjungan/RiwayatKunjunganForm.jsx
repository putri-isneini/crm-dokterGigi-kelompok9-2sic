import { useState, useEffect } from 'react';

const RiwayatKunjunganForm = ({ addKunjungan, updateKunjungan, editingKunjungan, pasienList, dokterList }) => {
  const [form, setForm] = useState({
    pasien_id: '',
    dokter_id: '',
    tanggal: '',
    catatan: ''
  });

  useEffect(() => {
    if (editingKunjungan) {
      setForm({
        pasien_id: editingKunjungan.pasien_id || '',
        dokter_id: editingKunjungan.dokter_id || '',
        tanggal: editingKunjungan.tanggal || '',
        catatan: editingKunjungan.catatan || ''
      });
    } else {
      setForm({
        pasien_id: '',
        dokter_id: '',
        tanggal: '',
        catatan: ''
      });
    }
  }, [editingKunjungan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pasien_id || !form.tanggal) return;

    editingKunjungan ? updateKunjungan(form) : addKunjungan(form);
    setForm({ pasien_id: '', dokter_id: '', tanggal: '', catatan: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Pilih Pasien */}
      <select
        className="w-full p-2 border rounded"
        value={form.pasien_id}
        onChange={e => setForm({ ...form, pasien_id: e.target.value })}
      >
        <option value="">Pilih Pasien</option>
        {pasienList.map(p => (
          <option key={p.id} value={p.id}>
            {p.nama}
          </option>
        ))}
      </select>

      {/* Pilih Dokter */}
      <select
        className="w-full p-2 border rounded"
        value={form.dokter_id}
        onChange={e => setForm({ ...form, dokter_id: e.target.value })}
      >
        <option value="">Pilih Dokter</option>
        {dokterList.map(d => (
          <option key={d.id} value={d.id}>
            {d.nama}
          </option>
        ))}
      </select>

      {/* Tanggal */}
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={form.tanggal}
        onChange={e => setForm({ ...form, tanggal: e.target.value })}
      />

      {/* Catatan */}
      <textarea
        placeholder="Catatan kunjungan"
        className="w-full p-2 border rounded"
        rows={3}
        value={form.catatan}
        onChange={e => setForm({ ...form, catatan: e.target.value })}
      />

      {/* Tombol Simpan */}
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {editingKunjungan ? 'Perbarui' : 'Tambah'}
      </button>
    </form>
  );
};

export default RiwayatKunjunganForm;
