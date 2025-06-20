import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Pasien() {
  const navigate = useNavigate();
  const [dataPasien, setDataPasien] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("dataPasien")) || [];
    setDataPasien(data);
  }, []);

  const handleHapus = (id) => {
    const konfirmasi = window.confirm("Yakin hapus data?");
    if (!konfirmasi) return;
    const update = dataPasien.filter((p) => p.id !== id);
    localStorage.setItem("dataPasien", JSON.stringify(update));
    setDataPasien(update);
  };

  return (
    <div className="p-6 max-w-[98%] mx-auto">
      {/* CARD PINK BESAR */}
      <div className="bg-pink-50 border border-pink-200 rounded-3xl shadow-xl p-6">
        {/* JUDUL DAN TOMBOL */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-pink-700">
            🦷 Data Pasien Klinik Tia
          </h1>
          <button
            onClick={() => navigate("/pasien/tambah")}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition text-white font-semibold px-6 py-2 rounded-xl shadow text-base"
          >
            + Tambah Pasien
          </button>
        </div>

        {/* ISI: LIST PASIEN */}
        {dataPasien.length === 0 ? (
          <div className="text-center text-gray-500 py-6 text-lg">
            Tidak ada data pasien 😕
          </div>
        ) : (
          <div className="space-y-4">
            {dataPasien.map((pasien) => (
              <div
                key={pasien.id}
                className="bg-white rounded-2xl border border-pink-100 p-6 shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-pink-700">
                      {pasien.nama}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                      {pasien.tanggalLahir}
                    </p>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        <strong>Jenis Kelamin:</strong> {pasien.jenisKelamin}
                      </p>
                      <p>
                        <strong>Telepon:</strong> {pasien.telepon}
                      </p>
                      <p>
                        <strong>Membership:</strong>{" "}
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${getBadgeColor(
                            pasien.membership
                          )}`}
                        >
                          {pasien.membership}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/pasien/edit/${pasien.id}`, {
                          state: pasien,
                        })
                      }
                      className="text-blue-500 hover:text-blue-700 text-xl"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleHapus(pasien.id)}
                      className="text-red-500 hover:text-red-700 text-xl"
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getBadgeColor(level) {
  switch (level) {
    case "Gold":
      return "bg-yellow-100 text-yellow-800";
    case "Platinum":
      return "bg-gray-300 text-gray-800";
    case "Silver":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-500";
  }
}
