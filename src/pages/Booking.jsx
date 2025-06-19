import React, { useState } from "react";

export default function Booking({ bookings, onStatusChange }) {
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredBookings = bookings.filter((b) => {
    return (
      b.patientName.toLowerCase().includes(searchName.toLowerCase()) &&
      (filterStatus ? b.status === filterStatus : true)
    );
  });

  const handleStatusChange = (id, newStatus) => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-[#ffeef6]">
      <h1 className="text-2xl font-bold mb-4 text-pink-600">
        Halaman Booking - Admin
      </h1>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Cari nama pasien..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Semua Status</option>
          <option value="Menunggu">Menunggu</option>
          <option value="Terjadwal">Terjadwal</option>
          <option value="Selesai">Selesai</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
      </div>

      <div className="mb-4 font-medium">
        Total Booking:{" "}
        <span className="text-indigo-600">{filteredBookings.length}</span>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow mb-8">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Kode Booking</th>
              <th className="px-4 py-3">Nama Pasien</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Jam</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{b.bookingCode}</td>
                <td className="px-4 py-3">{b.patientName}</td>
                <td className="px-4 py-3">{b.date}</td>
                <td className="px-4 py-3">{b.time}</td>
                <td className="px-4 py-3 text-center">
                  {b.status === "Menunggu" ? (
                    <span className="bg-pink-100 text-pink-600 font-semibold px-2 py-1 rounded">
                      Menunggu
                    </span>
                  ) : (
                    <select
                      value={b.status}
                      onChange={(e) =>
                        handleStatusChange(b.id, e.target.value)
                      }
                      className="bg-pink-100 text-pink-600 font-medium border rounded px-2 py-1"
                    >
                      <option value="Terjadwal">Terjadwal</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  )}
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  {b.status === "Menunggu" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(b.id, "Terjadwal")
                        }
                        className="text-red-600 hover:underline font-medium"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(b.id, "Dibatalkan")
                        }
                        className="text-black hover:underline font-medium"
                      >
                        Tolak
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Tidak ada data booking
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
