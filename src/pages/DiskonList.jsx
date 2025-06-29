import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function DiskonList() {
  const membershipDiskon = {
    Gold: 30,
    Silver: 20,
    Bronze: 10,
  };

  const [formData, setFormData] = useState({
    nama_diskon: '',
    membership: '',
    persen_diskon: '',
    keterangan: '',
  });

  const [diskonList, setDiskonList] = useState([]);
  const [editingDiskon, setEditingDiskon] = useState(null);

  const fetchDiskon = async () => {
    const { data, error } = await supabase
      .from('diskon_membership')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error.message);
    } else {
      setDiskonList(data);
    }
  };

  useEffect(() => {
    fetchDiskon();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'membership') {
      setFormData((prev) => ({
        ...prev,
        membership: value,
        persen_diskon: membershipDiskon[value] || '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      persen_diskon: parseFloat(formData.persen_diskon),
    };

    if (editingDiskon) {
      const { error } = await supabase
        .from('diskon_membership')
        .update(finalData)
        .eq('id', editingDiskon.id);

      if (!error) {
        setEditingDiskon(null);
      } else {
        console.error('Update error:', error.message);
      }
    } else {
      const { error } = await supabase.from('diskon_membership').insert(finalData);
      if (error) {
        console.error('Insert error:', error.message);
      }
    }

    setFormData({
      nama_diskon: '',
      membership: '',
      persen_diskon: '',
      keterangan: '',
    });

    fetchDiskon();
  };

  const handleEdit = (diskon) => {
    setEditingDiskon(diskon);
    setFormData({
      nama_diskon: diskon.nama_diskon,
      membership: diskon.membership,
      persen_diskon: diskon.persen_diskon,
      keterangan: diskon.keterangan || '',
    });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('diskon_membership').delete().eq('id', id);
    if (!error) {
      fetchDiskon();
    } else {
      console.error('Delete error:', error.message);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 bg-pink-50">
      <h1 className="text-3xl font-bold mb-6 text-pink-700">Diskon Membership</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Nama Diskon */}
        <div>
          <label className="block font-medium text-pink-700">Nama Diskon</label>
          <select
            name="nama_diskon"
            value={formData.nama_diskon}
            onChange={handleChange}
            className="w-full border border-pink-300 rounded p-2 bg-white"
            required
          >
            <option value="">Pilih Jenis Diskon</option>
            <option value="Layanan">Layanan</option>
            <option value="Produk">Produk</option>
          </select>
        </div>

        {/* Membership */}
        <div>
          <label className="block font-medium text-pink-700">Membership</label>
          <select
            name="membership"
            value={formData.membership}
            onChange={handleChange}
            className="w-full border border-pink-300 rounded p-2 bg-white"
            required
          >
            <option value="">Pilih Membership</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
          </select>
        </div>

        {/* Persen Diskon */}
        <div>
          <label className="block font-medium text-pink-700">Persen Diskon (%)</label>
          <input
            type="number"
            name="persen_diskon"
            value={formData.persen_diskon}
            className="w-full border border-pink-300 rounded p-2 bg-white"
            readOnly
          />
        </div>

        {/* Keterangan */}
        <div>
          <label className="block font-medium text-pink-700">Keterangan</label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            className="w-full border border-pink-300 rounded p-2 bg-white"
            rows={2}
          />
        </div>

        {/* Tombol Submit */}
        <div className="col-span-full">
          <button
            type="submit"
            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
          >
            {editingDiskon ? 'Update Diskon' : 'Tambah Diskon'}
          </button>
        </div>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {diskonList.map((diskon) => (
          <div key={diskon.id} className="border border-pink-200 rounded p-4 bg-white shadow-sm">
            <div className="font-semibold text-pink-700">{diskon.nama_diskon}</div>
            <div className="text-sm text-pink-600">
              {diskon.membership} - {diskon.persen_diskon}% diskon
            </div>
            {diskon.keterangan && (
              <div className="text-sm italic text-pink-500">{diskon.keterangan}</div>
            )}
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(diskon)}
                className="text-pink-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(diskon.id)}
                className="text-red-500 hover:underline"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiskonList;
