import { useState, useEffect } from 'react';

function DiskonForm({ onSubmit, editingDiskon }) {
  const membershipDiskon = {
    Gold: 20,
    Silver: 15,
    Bronze: 10,
  };

  const [formData, setFormData] = useState({
    nama_diskon: '',
    membership: '',
    persen_diskon: '',
    keterangan: '',
  });

  useEffect(() => {
    if (editingDiskon) {
      setFormData(editingDiskon);
    } else {
      setFormData({
        nama_diskon: '',
        membership: '',
        persen_diskon: '',
        keterangan: '',
      });
    }
  }, [editingDiskon]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    setFormData({
      nama_diskon: '',
      membership: '',
      persen_diskon: '',
      keterangan: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-pink-50 p-6 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-bold text-pink-700 mb-4">
        {editingDiskon ? 'Edit Diskon' : 'Tambah Diskon'}
      </h2>

      {/* Nama Diskon */}
      <div>
        <label className="block font-semibold text-pink-700">Nama Diskon</label>
        <select
          name="nama_diskon"
          value={formData.nama_diskon}
          onChange={handleChange}
          className="w-full border border-pink-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
          required
        >
          <option value="">Pilih Jenis Diskon</option>
          <option value="Layanan">Layanan</option>
          <option value="Produk">Produk</option>
        </select>
      </div>

      {/* Membership */}
      <div>
        <label className="block font-semibold text-pink-700">Membership</label>
        <select
          name="membership"
          value={formData.membership}
          onChange={handleChange}
          className="w-full border border-pink-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
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
        <label className="block font-semibold text-pink-700">Persen Diskon (%)</label>
        <input
          type="number"
          name="persen_diskon"
          value={formData.persen_diskon}
          readOnly
          className="w-full border border-pink-300 rounded p-2 bg-pink-100 text-pink-700"
        />
      </div>

      {/* Keterangan */}
      <div>
        <label className="block font-semibold text-pink-700">Keterangan (opsional)</label>
        <textarea
          name="keterangan"
          value={formData.keterangan}
          onChange={handleChange}
          className="w-full border border-pink-300 rounded p-2"
          rows={2}
        />
      </div>

      {/* Tombol Submit */}
      <div className="text-right">
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition duration-200"
        >
          {editingDiskon ? 'Update Diskon' : 'Tambah Diskon'}
        </button>
      </div>
    </form>
  );
}

export default DiskonForm;
