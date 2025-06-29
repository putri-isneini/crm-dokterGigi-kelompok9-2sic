import { useState, useEffect } from 'react';

const FormTentangKami = ({ addData, updateData, editingData }) => {
  const [form, setForm] = useState({
    deskripsi: '',
    visi: '',
    misi: '',
  });

  useEffect(() => {
    if (editingData && Array.isArray(editingData)) {
      const dataMap = { deskripsi: '', visi: '', misi: '' };
      editingData.forEach((item) => {
        dataMap[item.tipe] = item.konten;
      });
      setForm(dataMap);
    } else {
      setForm({ deskripsi: '', visi: '', misi: '' });
    }
  }, [editingData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.deskripsi || !form.visi || !form.misi) return;

    if (editingData) {
      updateData(form);
    } else {
      addData(form);
    }

    // Reset setelah submit
    setForm({ deskripsi: '', visi: '', misi: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-md border border-pink-100 mb-10"
    >
      <h2 className="text-2xl font-semibold text-pink-600 mb-6">
        {editingData ? 'Edit Konten Tentang Kami' : 'Tambah Konten Tentang Kami'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-pink-700 font-medium mb-1">Deskripsi</label>
          <textarea
            className="w-full p-3 border rounded-xl bg-pink-50 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.deskripsi}
            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Visi</label>
          <textarea
            className="w-full p-3 border rounded-xl bg-pink-50 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.visi}
            onChange={(e) => setForm({ ...form, visi: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Misi</label>
          <textarea
            className="w-full p-3 border rounded-xl bg-pink-50 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={form.misi}
            onChange={(e) => setForm({ ...form, misi: e.target.value })}
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-lg font-semibold transition duration-200"
          >
            {editingData ? 'Simpan Perubahan' : 'Tambah Konten'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormTentangKami;
