import React, { useState } from "react";

const DataDokter = () => {
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: "drg. Tia",
      specialization: "Ortodonti",
      schedule: "Senin & Rabu, 09.00 - 12.00"
    },
    {
      id: 2,
      name: "drg. Budi",
      specialization: "Konservasi Gigi",
      schedule: "Selasa & Kamis, 13.00 - 16.00"
    }
  ]);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    schedule: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = () => {
    if (!form.name || !form.specialization || !form.schedule)
      return alert("Lengkapi semua data!");
    setDoctors([
      ...doctors,
      { id: doctors.length + 1, ...form }
    ]);
    setForm({ name: "", specialization: "", schedule: "" });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Data Dokter Gigi</h2>

      <table className="w-full border mb-6">
        <thead className="bg-purple-200 text-left">
          <tr>
            <th className="p-2">Nama</th>
            <th className="p-2">Spesialisasi</th>
            <th className="p-2">Jadwal Praktik</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id} className="border-b">
              <td className="p-2">{doc.name}</td>
              <td className="p-2">{doc.specialization}</td>
              <td className="p-2">{doc.schedule}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-2">
        <input
          type="text"
          name="name"
          placeholder="Nama Dokter"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="specialization"
          placeholder="Spesialisasi"
          value={form.specialization}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="schedule"
          placeholder="Jadwal Praktik (cth: Senin, 08.00-12.00)"
          value={form.schedule}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={handleAddDoctor}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Tambah Dokter
        </button>
      </div>
    </div>
  );
};

export default DataDokter;
