import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pasien() {
  const navigate = useNavigate();
  const [dataPasien, setDataPasien] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dataPasien")) || [];
    setDataPasien(data);
  }, []);

  const handleHapus = (id) => {
    if (window.confirm("Yakin hapus data?")) {
      const update = dataPasien.filter((p) => p.id !== id);
      localStorage.setItem("dataPasien", JSON.stringify(update));
      setDataPasien(update);
    }
  };

  const filteredPasien = dataPasien.filter((p) =>
    p.nama.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-white">
      <div className="rounded-lg bg-[#ffeef6] p-6 shadow">
        <h1 className="text-2xl font-bold mb-4 text-pink-600">Halaman Data Pasien</h1>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Cari nama pasien..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border px-3 py-2 rounded w-1/3"
          />
          <button
            onClick={() => navigate("/pasien/tambah")}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
          >
            + Tambah Pasien
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Tanggal Lahir</th>
                <th className="px-4 py-3">Jenis Kelamin</th>
                <th className="px-4 py-3">No. HP</th>
                <th className="px-4 py-3">Membership</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPasien.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.nama}</td>
                  <td className="px-4 py-3">{p.tanggalLahir}</td>
                  <td className="px-4 py-3">{p.jenisKelamin}</td>
                  <td className="px-4 py-3">{p.telepon}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        p.membership === "Gold"
                          ? "bg-yellow-100 text-yellow-800"
                          : p.membership === "Platinum"
                          ? "bg-blue-100 text-blue-800"
                          : p.membership === "Silver"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.membership}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/pasien/edit/${p.id}`, { state: p })
                      }
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleHapus(p.id)}
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPasien.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Tidak ada data pasien
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
