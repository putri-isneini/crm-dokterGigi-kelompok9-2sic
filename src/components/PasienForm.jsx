import { useState, useEffect } from 'react';

const PasienForm = ({ addPasien, updatePasien, editingPasien }) => {
  const [form, setForm] = useState({
    nama_lengkap: '',
    jenis_kelamin: '',
    usia: '',
    no_hp: '',
    created_at: '',
  });

  useEffect(() => {
    if (editingPasien) {
      setForm(editingPasien);
    } else {
      setForm({
        nama_lengkap: '',
        jenis_kelamin: '',
        usia: '',
        no_hp: '',
        created_at: '',
      });
    }
  }, [editingPasien]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama_lengkap, jenis_kelamin, usia, no_hp } = form;
    if (!nama_lengkap || !jenis_kelamin || !usia || !no_hp) {
      alert("Semua kolom wajib diisi.");
      return;
    }

    const dataSiap = {
      ...form,
      usia: Number(form.usia),
      no_hp: form.no_hp,
      created_at: form.created_at || new Date().toISOString(),
    };

    editingPasien ? updatePasien(dataSiap) : addPasien(dataSiap);

    setForm({
      nama_lengkap: '',
      jenis_kelamin: '',
      usia: '',
      no_hp: '',
      created_at: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Nama Lengkap"
        className="w-full p-2 border rounded"
        value={form.nama_lengkap}
        onChange={e => setForm({ ...form, nama_lengkap: e.target.value })}
      />
      <select
        className="w-full p-2 border rounded"
        value={form.jenis_kelamin}
        onChange={e => setForm({ ...form, jenis_kelamin: e.target.value })}
      >
        <option value="">Pilih Jenis Kelamin</option>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>
      <input
        type="number"
        placeholder="Usia"
        className="w-full p-2 border rounded"
        value={form.usia}
        onChange={e => setForm({ ...form, usia: e.target.value })}
      />
      <input
        type="tel"
        placeholder="No HP"
        className="w-full p-2 border rounded"
        value={form.no_hp}
        onChange={e => setForm({ ...form, no_hp: e.target.value })}
      />
      <input
        type="datetime-local"
        placeholder="Created At (opsional)"
        className="w-full p-2 border rounded"
        value={form.created_at}
        onChange={e => setForm({ ...form, created_at: e.target.value })}
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {editingPasien ? 'Perbarui Pasien' : 'Tambah Pasien'}
      </button>
    </form>
  );
};

export default PasienForm;
