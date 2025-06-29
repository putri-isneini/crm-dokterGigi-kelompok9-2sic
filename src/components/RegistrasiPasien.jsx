import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function RegisterPasien() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    alamat: '',
    jenis_kelamin: '',
    tanggal_lahir: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simpan ke tabel pasien Supabase
    const { data, error } = await supabase
      .from('pasien')
      .insert([formData])
      .select()
      .single();

    if (error) {
      console.error('Gagal registrasi:', error.message);
      alert('Registrasi gagal, silakan coba lagi.');
    } else {
      alert('Registrasi berhasil!');
      navigate('/booking', { state: { pasienId: data.id } });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-pink-600">Registrasi Pasien</h2>

      <input
        type="text"
        name="nama"
        value={formData.nama}
        onChange={handleChange}
        placeholder="Nama Lengkap"
        required
        className="w-full border border-gray-300 rounded p-2"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        className="w-full border border-gray-300 rounded p-2"
      />

      <input
        type="text"
        name="no_hp"
        value={formData.no_hp}
        onChange={handleChange}
        placeholder="Nomor HP"
        required
        className="w-full border border-gray-300 rounded p-2"
      />

      <input
        type="text"
        name="alamat"
        value={formData.alamat}
        onChange={handleChange}
        placeholder="Alamat"
        className="w-full border border-gray-300 rounded p-2"
      />

      <select
        name="jenis_kelamin"
        value={formData.jenis_kelamin}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded p-2"
      >
        <option value="">Pilih Jenis Kelamin</option>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>

      <input
        type="date"
        name="tanggal_lahir"
        value={formData.tanggal_lahir}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded p-2"
      />

      <button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded"
      >
        Daftar
      </button>
    </form>
  );
}
