import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TambahPasien() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    tanggalLahir: "",
    jenisKelamin: "",
    telepon: "",
    membership: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.nama || !formData.tanggalLahir || !formData.jenisKelamin || !formData.telepon || !formData.membership) {
      alert("Mohon lengkapi semua data!");
      return;
    }

    const existingData = JSON.parse(localStorage.getItem("dataPasien")) || [];
    const newId = existingData.length ? existingData[existingData.length - 1].id + 1 : 1;
    const newData = { ...formData, id: newId };

    const updated = [...existingData, newData];
    localStorage.setItem("dataPasien", JSON.stringify(updated));
    alert("Pasien berhasil ditambahkan!");
    navigate("/pasien");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-[#ffeef6]">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Tambah Data Pasien</h1>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Nama</label>
          <input
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            placeholder="Masukkan nama pasien"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Tanggal Lahir</label>
          <input
            type="date"
            name="tanggalLahir"
            value={formData.tanggalLahir}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
          <select
            name="jenisKelamin"
            value={formData.jenisKelamin}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Pilih</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">No. HP</label>
          <input
            name="telepon"
            value={formData.telepon}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Membership</label>
          <select
            name="membership"
            value={formData.membership}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Pilih</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
            <option value="Silver">Silver</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
