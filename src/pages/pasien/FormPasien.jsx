import { useState, useEffect } from 'react';

const FormPasien = ({ addPasien, updatePasien, editingPasien }) => {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    no_hp: '',
    alamat: '',
    jenis_kelamin: '',
    tanggal_lahir: '',
    membership: 'Silver',
  });

  useEffect(() => {
    if (editingPasien) {
      setForm({
        ...editingPasien,
        tanggal_lahir: editingPasien.tanggal_lahir?.split('T')[0] || ''
      });
    } else {
      setForm({
        nama: '',
        email: '',
        no_hp: '',
        alamat: '',
        jenis_kelamin: '',
        tanggal_lahir: '',
        membership: 'Silver',
      });
    }
  }, [editingPasien]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, email, no_hp, alamat, jenis_kelamin, tanggal_lahir, membership } = form;

    if (!nama || !email || !no_hp || !alamat || !jenis_kelamin || !tanggal_lahir || !membership) return;

    editingPasien ? updatePasien(form) : addPasien(form);

    setForm({
      nama: '',
      email: '',
      no_hp: '',
      alamat: '',
      jenis_kelamin: '',
      tanggal_lahir: '',
      membership: 'Silver',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-pink-100 mb-10">
      <h2 className="text-2xl font-semibold text-pink-600 mb-6">
        {editingPasien ? 'Edit Data Pasien' : 'Tambah Data Pasien'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-pink-700 font-medium mb-1">Nama</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.nama}
            onChange={e => setForm({ ...form, nama: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">No. HP</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.no_hp}
            onChange={e => setForm({ ...form, no_hp: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Alamat</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.alamat}
            onChange={e => setForm({ ...form, alamat: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Jenis Kelamin</label>
          <select
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300 font-poppins"
            value={form.jenis_kelamin}
            onChange={e => setForm({ ...form, jenis_kelamin: e.target.value })}
          >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Tanggal Lahir</label>
          <input
            type="date"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300 font-arial"
            value={form.tanggal_lahir}
            onChange={e => setForm({ ...form, tanggal_lahir: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Membership</label>
          <select
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.membership}
            onChange={e => setForm({ ...form, membership: e.target.value })}
          >
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-lg font-semibold transition duration-200"
          >
            {editingPasien ? 'Perbarui Data' : 'Tambah Pasien'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormPasien;
