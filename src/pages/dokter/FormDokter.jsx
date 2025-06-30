import { useState, useEffect } from 'react';

const FormDokter = ({ addDokter, updateDokter, editingDokter }) => {
  const [form, setForm] = useState({
    nama: '',
    spesialis: '',
    no_hp: '',
    foto: '',
  });

  useEffect(() => {
    if (editingDokter) {
      setForm({ ...editingDokter });
    } else {
      setForm({
        nama: '',
        spesialis: '',
        no_hp: '',
        foto: '',
      });
    }
  }, [editingDokter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, spesialis, no_hp, foto } = form;

    if (!nama || !spesialis || !no_hp || !foto) return;

    editingDokter ? updateDokter(form) : addDokter(form);

    setForm({
      nama: '',
      spesialis: '',
      no_hp: '',
      foto: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-md border border-pink-100 mb-10"
    >
      <h2 className="text-2xl font-semibold text-pink-600 mb-6">
        {editingDokter ? 'Edit Data Dokter' : 'Tambah Data Dokter'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-pink-700 font-medium mb-1">Nama</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Spesialis</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.spesialis}
            onChange={(e) => setForm({ ...form, spesialis: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">No. HP</label>
          <input
            type="text"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.no_hp}
            onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Foto (URL)</label>
          <input
            type="text"
            placeholder="https://link-ke-gambar.jpg"
            className="w-full p-3 border rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.foto}
            onChange={(e) => setForm({ ...form, foto: e.target.value })}
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-lg font-semibold transition duration-200"
          >
            {editingDokter ? 'Perbarui Data' : 'Tambah Dokter'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormDokter;
