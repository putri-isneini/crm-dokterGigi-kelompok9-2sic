import { useState, useEffect } from 'react';

const DiskonForm = ({ addDiskon, updateDiskon, editingDiskon }) => {
  const [form, setForm] = useState({
    membership: '',
    nama_diskon: '',
    persen_diskon: '',
    keterangan: ''
  });

  useEffect(() => {
    if (editingDiskon) setForm(editingDiskon);
    else setForm({
      membership: '',
      nama_diskon: '',
      persen_diskon: '',
      keterangan: ''
    });
  }, [editingDiskon]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.membership || !form.nama_diskon || !form.persen_diskon) return;

    editingDiskon ? updateDiskon(form) : addDiskon(form);
    setForm({
      membership: '',
      nama_diskon: '',
      persen_diskon: '',
      keterangan: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <select
        className="w-full p-2 border rounded"
        value={form.membership}
        onChange={e => setForm({ ...form, membership: e.target.value })}
      >
        <option value="">Pilih Membership</option>
        <option value="Platinum">Platinum</option>
        <option value="Gold">Gold</option>
        <option value="Silver">Silver</option>
      </select>
      
      <input
        type="text"
        placeholder="Nama Diskon"
        className="w-full p-2 border rounded"
        value={form.nama_diskon}
        onChange={e => setForm({ ...form, nama_diskon: e.target.value })}
      />

      <input
        type="number"
        placeholder="Persen Diskon"
        className="w-full p-2 border rounded"
        value={form.persen_diskon}
        onChange={e => setForm({ ...form, persen_diskon: e.target.value })}
      />

      <textarea
        placeholder="Keterangan (opsional)"
        className="w-full p-2 border rounded"
        value={form.keterangan}
        onChange={e => setForm({ ...form, keterangan: e.target.value })}
      />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {editingDiskon ? 'Perbarui' : 'Tambah'}
      </button>
    </form>
  );
};

export default DiskonForm;