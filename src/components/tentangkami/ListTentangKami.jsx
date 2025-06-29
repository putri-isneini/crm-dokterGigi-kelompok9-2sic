import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import FormTentangKami from './FormTentangKami';

function ListTentangKami() {
  const [data, setData] = useState({ deskripsi: '', visi: '', misi: '' });
  const [editing, setEditing] = useState(false);

  const fetchData = async () => {
    const { data, error } = await supabase.from('tentang_kami').select('*');
    if (error) {
      console.error('Gagal mengambil data:', error.message);
    } else {
      const result = { deskripsi: '', visi: '', misi: '' };
      data.forEach((item) => {
        if (item.tipe === 'deskripsi') result.deskripsi = item.konten;
        if (item.tipe === 'visi') result.visi = item.konten;
        if (item.tipe === 'misi') result.misi = item.konten;
      });
      setData(result);
    }
  };

  const addData = async (form) => {
    const entries = [
      { tipe: 'deskripsi', konten: form.deskripsi },
      { tipe: 'visi', konten: form.visi },
      { tipe: 'misi', konten: form.misi },
    ];
    await supabase.from('tentang_kami').delete().neq('id', '');
    const { error } = await supabase.from('tentang_kami').insert(entries);
    if (error) {
      console.error('Gagal menyimpan:', error.message);
    } else {
      fetchData();
      setEditing(false);
    }
  };

  const updateData = (form) => addData(form);

  const handleDelete = async () => {
    const { error } = await supabase.from('tentang_kami').delete().neq('id', '');
    if (error) {
      console.error('Gagal menghapus:', error.message);
    } else {
      setData({ deskripsi: '', visi: '', misi: '' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-full px-10 py-8 bg-pink-50 min-h-screen">
      <h1 className="text-4xl font-bold text-pink-600 mb-10 text-center">
        Manajemen Tentang Kami
      </h1>

      <div className="mb-12">
        <FormTentangKami
          addData={addData}
          updateData={updateData}
          editingData={
            editing
              ? [
                  { tipe: 'deskripsi', konten: data.deskripsi },
                  { tipe: 'visi', konten: data.visi },
                  { tipe: 'misi', konten: data.misi },
                ]
              : null
          }
        />
      </div>

      <div className="rounded-2xl shadow-xl border border-pink-200 bg-white p-8 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-pink-600 mb-6">Preview Konten</h2>

        <div className="space-y-6 text-gray-800 leading-relaxed">
          <div>
            <h3 className="text-lg font-semibold text-pink-500 mb-1">Deskripsi</h3>
            <p>{data.deskripsi || <span className="text-gray-400 italic">Belum ada data</span>}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-pink-500 mb-1">Visi</h3>
            <p>{data.visi || <span className="text-gray-400 italic">Belum ada data</span>}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-pink-500 mb-1">Misi</h3>
            <p>{data.misi || <span className="text-gray-400 italic">Belum ada data</span>}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setEditing(true)}
            className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-5 rounded-xl font-medium transition"
          >
            Edit Konten
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-400 hover:bg-red-500 text-white py-2 px-5 rounded-xl font-medium transition"
          >
            Hapus Semua
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListTentangKami;
