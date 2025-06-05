import React, { useState } from "react";

const initialBookings = [
  {
    id: 1,
    bookingCode: "BOOK-001",
    patientName: "Budi Santoso",
    date: "2025-06-05",
    status: "Terjadwal",
  },
  {
    id: 2,
    bookingCode: "BOOK-002",
    patientName: "Siti Aminah",
    date: "2025-06-06",
    status: "Selesai",
  },
];

export default function BookingAdmin() {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleStatusChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: newStatus } : b
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus booking ini?")) {
      setBookings(bookings.filter((b) => b.id !== id));
    }
  };

  const filteredBookings = bookings.filter((b) => {
    return (
      b.patientName.toLowerCase().includes(searchName.toLowerCase()) &&
      (filterStatus ? b.status === filterStatus : true)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Halaman Booking - Admin</h1>

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
          <option value="Terjadwal">Terjadwal</option>
          <option value="Selesai">Selesai</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
      </div>

      {/* Total Booking */}
      <div className="mb-4 font-medium">
        Total Booking: <span className="text-indigo-600">{filteredBookings.length}</span>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Kode Booking</th>
              <th className="px-4 py-3">Nama Pasien</th>
              <th className="px-4 py-3">Tanggal</th>
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
                <td className="px-4 py-3 text-center">
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
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
