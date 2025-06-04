import React, { useState } from "react";

const dataAwalPasien = [
  {
    id: 1,
    fullName: "Ahmad Wijaya",
    gender: "Laki-laki",
    age: 30,
    phone: "081234567890",
    active: true,
  },
  {
    id: 2,
    fullName: "Siti Rahma",
    gender: "Perempuan",
    age: 25,
    phone: "081987654321",
    active: false,
  },
];

export default function Pasien() {
  const [pasien, setPasien] = useState(dataAwalPasien);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    age: "",
    phone: "",
    active: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [sortOrder, setSortOrder] = useState("terbaru"); // 'terbaru' atau 'terlama'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTambahPasien = () => {
    if (!formData.fullName || !formData.gender || !formData.age || !formData.phone) {
      alert("Semua kolom harus diisi");
      return;
    }

    if (editId !== null) {
      // Simpan edit
      const pasienDiedit = pasien.map((p) =>
        p.id === editId ? { ...formData, id: editId, age: parseInt(formData.age) } : p
      );
      setPasien(pasienDiedit);
      setEditId(null);
    } else {
      // Tambah baru
      const pasienBaru = {
        ...formData,
        id: pasien.length + 1,
        age: parseInt(formData.age),
      };
      setPasien([...pasien, pasienBaru]);
    }

    setFormData({ fullName: "", gender: "", age: "", phone: "", active: true });
    setShowForm(false);
  };

  const handleEdit = (data) => {
    setEditId(data.id);
    setFormData({
      fullName: data.fullName,
      gender: data.gender,
      age: data.age.toString(),
      phone: data.phone,
      active: data.active,
    });
    setShowForm(true);
  };

  const handleBatalEdit = () => {
    setEditId(null);
    setFormData({ fullName: "", gender: "", age: "", phone: "", active: true });
    setShowForm(false);
  };

  const handleHapus = (id) => {
    if (window.confirm("Yakin ingin menghapus data pasien ini?")) {
      setPasien(pasien.filter((p) => p.id !== id));
    }
  };

  const hasilFilter = pasien
    .filter((p) =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "terbaru") {
        return b.id - a.id; // id lebih besar dianggap terbaru
      } else {
        return a.id - b.id; // id lebih kecil dianggap lebih lama
      }
    });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Manajemen Data Pasien</h1>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari nama pasien..."
          className="w-full sm:w-64 px-3 py-2 border rounded focus:ring-indigo-400 focus:outline-none"
        />
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            if (editId !== null) handleBatalEdit();
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {showForm ? (editId !== null ? "Batal Edit" : "Batal Tambah") : "Tambah Pasien"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 border border-gray-300 rounded bg-white shadow-sm">
          <div className="mb-2">
            <label className="block mb-1 font-medium">Nama Lengkap</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Masukkan nama pasien"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Jenis Kelamin</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">-- Pilih --</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">Usia</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              min="0"
            />
          </div>
          <div className="mb-2">
            <label className="block mb-1 font-medium">No. Telepon</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Contoh: 081234567890"
            />
          </div>

          <button
            onClick={handleTambahPasien}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
          >
            {editId !== null ? "Simpan Perubahan" : "Simpan Data Pasien"}
          </button>
          {editId !== null && (
            <button
              onClick={handleBatalEdit}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Batal Edit
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase flex items-center justify-between">
                <span>Nama</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="ml-2 border rounded px-1 py-0.5 text-xs"
                >
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                </select>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Kelamin</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Usia</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Telepon</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {hasilFilter.map((data) => (
              <tr key={data.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{data.fullName}</td>
                <td className="px-6 py-4">{data.gender}</td>
                <td className="px-6 py-4 text-right">{data.age}</td>
                <td className="px-6 py-4 text-right">{data.phone}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => handleEdit(data)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleHapus(data.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {hasilFilter.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Tidak ada data pasien ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
