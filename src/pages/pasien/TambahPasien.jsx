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
  const existingData = JSON.parse(localStorage.getItem("dataPasien")) || [];
  const newId = existingData.length ? existingData[existingData.length - 1].id + 1 : 1;
  const newData = { ...formData, id: newId };

  const updated = [...existingData, newData];
  localStorage.setItem("dataPasien", JSON.stringify(updated));
  alert("Pasien berhasil ditambahkan!");
  navigate("/pasien");
};


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">Tambah Pasien</h1>
      <input name="nama" value={formData.nama} onChange={handleChange} className="w-full border p-2 mb-2" />
      <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} className="w-full border p-2 mb-2" />
      <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="w-full border p-2 mb-2">
        <option value="">Pilih</option>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>
      <input name="telepon" value={formData.telepon} onChange={handleChange} className="w-full border p-2 mb-2" />
      <select name="membership" value={formData.membership} onChange={handleChange} className="w-full border p-2 mb-4">
        <option value="">Pilih</option>
        <option value="Gold">Gold</option>
        <option value="Platinum">Platinum</option>
        <option value="Silver">Silver</option>
      </select>
      <button onClick={handleSubmit} className="bg-pink-600 text-white px-4 py-2 rounded">Simpan</button>
    </div>
  );
}
