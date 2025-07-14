import { useState, useEffect } from 'react';
import { supabase } from '../../supabase'; // Pastikan path supabase benar

const PasienForm = ({ addPasien, updatePasien, editingPasien }) => {
  const [form, setForm] = useState({
    nama: '',
    email: '', // Ini hanya untuk menampilkan, tidak akan dikirim ke tabel pasien_user
    no_hp: '',
    alamat: '',
    jenis_kelamin: '',
    tanggal_lahir: '',
    membership: 'Silver',
    supabase_auth_id: null, // Ini akan diisi jika pasien memiliki akun Supabase Auth
  });

  useEffect(() => {
    if (editingPasien) {
      setForm({
        ...editingPasien,
        // Format tanggal untuk input type="date"
        tanggal_lahir: editingPasien.tanggal_lahir ? editingPasien.tanggal_lahir.split('T')[0] : '',
        // Pastikan email diambil dari prop editingPasien jika ada
        email: editingPasien.email || ''
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
        supabase_auth_id: null,
      });
    }
  }, [editingPasien]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, no_hp, alamat, jenis_kelamin, tanggal_lahir, membership } = form; // Tidak mengambil 'email' di sini

    if (!nama || !no_hp || !alamat || !jenis_kelamin || !tanggal_lahir || !membership) {
        alert("Mohon lengkapi semua field yang diperlukan.");
        return;
    }

    // Untuk update, kita hanya mengirimkan field yang relevan untuk tabel pasien_user.
    // Email dari `auth.users` tidak dapat diupdate melalui form ini secara langsung di sisi klien.
    const pasienDataToSend = {
      nama,
      no_hp,
      alamat,
      jenis_kelamin,
      tanggal_lahir,
      membership,
      // Jika sedang mengedit dan pasien memiliki supabase_auth_id, pertahankan nilainya
      ...(editingPasien && editingPasien.supabase_auth_id && { supabase_auth_id: editingPasien.supabase_auth_id })
    };

    if (editingPasien) {
      updatePasien({ id: editingPasien.id, ...pasienDataToSend }); // Kirim ID untuk update
    } else {
      // Ketika menambah pasien dari admin, supabase_auth_id mungkin null (jika pasien belum punya akun auth)
      // atau bisa diset jika memang ditautkan ke user auth yang sudah ada.
      // Pastikan backend/policy Supabase menanganinya.
      addPasien(pasienDataToSend);
    }

    // Reset form setelah submit
    setForm({
      nama: '',
      email: '',
      no_hp: '',
      alamat: '',
      jenis_kelamin: '',
      tanggal_lahir: '',
      membership: 'Silver',
      supabase_auth_id: null,
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
            required
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            disabled={!!editingPasien} // Email dinonaktifkan jika mode edit
            title={editingPasien ? "Email dikelola oleh sistem autentikasi, tidak bisa diubah langsung dari sini." : ""}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">No. HP</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.no_hp}
            onChange={e => setForm({ ...form, no_hp: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Alamat</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.alamat}
            onChange={e => setForm({ ...form, alamat: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Jenis Kelamin</label>
          <select
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300 font-poppins"
            value={form.jenis_kelamin}
            onChange={e => setForm({ ...form, jenis_kelamin: e.target.value })}
            required
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
            required
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Membership</label>
          <select
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.membership}
            onChange={e => setForm({ ...form, membership: e.target.value })}
            required
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

export default PasienForm;