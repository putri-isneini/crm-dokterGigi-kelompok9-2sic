// src/pages/BookingList.js (Perubahan minor pada select layanan)
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BookingForm from "../components/BookingForm"; // Pastikan path benar

const BookingList = () => {
  const [bookingList, setBookingList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [pasienList, setPasienList] = useState([]);
  const [dokterList, setDokterList] = useState([]);
  const [layananList, setLayananList] = useState([]);

  const fetchData = async () => {
    // Gunakan Promise.all untuk fetch data secara paralel
    const [{ data: booking, error: bookingError }, { data: pasien, error: pasienError }, { data: dokter, error: dokterError }, { data: layanan, error: layananError }] = await Promise.all([
      supabase
        .from("booking")
        .select(`
          id,
          kode_booking,
          tanggal,
          jam,
          status,
          keluhan,
          created_at,
          pasien ( id, nama ),
          dokter ( id, nama ),
          layanan ( id, nama ) -- Ubah nama_layanan menjadi 'nama' jika tabel layanan hanya memiliki kolom 'nama'
        `)
        .order("created_at", { ascending: false }),
      supabase.from("pasien").select("id, nama"),
      supabase.from("dokter").select("id, nama"),
      supabase.from("layanan").select("id, nama"), // Pastikan ini juga mengambil 'nama'
    ]);

    if (bookingError) console.error("Error fetching bookings:", bookingError.message);
    if (pasienError) console.error("Error fetching pasien:", pasienError.message);
    if (dokterError) console.error("Error fetching dokter:", dokterError.message);
    if (layananError) console.error("Error fetching layanan:", layananError.message);

    setBookingList(booking || []);
    setPasienList(pasien || []);
    setDokterList(dokter || []);
    setLayananList(layanan || []);
  };

  const handleSubmit = async (data) => {
    if (data.id) {
      await supabase.from("booking").update({
        pasien_id: data.pasien_id,
        dokter_id: data.dokter_id,
        layanan_id: data.layanan_id,
        tanggal: data.tanggal,
        jam: data.jam,
        keluhan: data.keluhan,
        status: data.status,
      }).eq("id", data.id);
    } else {
      const kode_booking = `BK-${Date.now()}`;
      await supabase.from("booking").insert([{ ...data, kode_booking }]);
    }
    fetchData();
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus booking ini?")) {
      await supabase.from("booking").delete().eq("id", id);
      fetchData();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    console.log("⏳ Mengubah status booking:", id, "→", newStatus);
    const { data, error } = await supabase
      .from("booking")
      .update({ status: newStatus })
      .eq("id", id)
      .select();

    if (error) {
      console.error("❌ Gagal mengubah status:", error.message);
      alert("Gagal mengubah status.");
    } else {
      console.log("✅ Status berhasil diubah:", data);
      fetchData();
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Menunggu":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Terjadwal":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Selesai":
        return "bg-green-100 text-green-800 border-green-300";
      case "Batal":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-full px-10 py-8 bg-pink-50 min-h-screen">
      <h1 className="text-4xl font-bold text-pink-600 mb-10 text-center">Manajemen Booking Pasien</h1>

      <div className="mb-12">
        <BookingForm
          onSubmit={handleSubmit}
          editing={editing}
          pasienOptions={pasienList}
          dokterOptions={dokterList}
          layananOptions={layananList}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-xl border border-pink-200 bg-white">
        <table className="w-full text-md text-left">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-6 py-4">Kode</th>
              <th className="px-6 py-4">Pasien</th>
              <th className="px-6 py-4">Dokter</th>
              <th className="px-6 py-4">Layanan</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Jam</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Keluhan</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bookingList.length > 0 ? (
              bookingList.map((b) => (
                <tr key={b.id} className="border-t hover:bg-pink-50 transition duration-200">
                  <td className="px-6 py-4">{b.kode_booking}</td>
                  <td className="px-6 py-4">{b.pasien?.nama}</td>
                  <td className="px-6 py-4">{b.dokter?.nama}</td>
                  <td className="px-6 py-4">{b.layanan?.nama}</td>
                  <td className="px-6 py-4">{b.tanggal}</td>
                  <td className="px-6 py-4">{b.jam}</td>
                  <td className="px-6 py-4">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className={`px-2 py-1 rounded-lg border ${getStatusClass(b.status)}`}
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Terjadwal">Terjadwal</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Batal">Batal</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">{b.keluhan}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => setEditing(b)}
                      className="bg-pink-400 hover:bg-pink-500 text-white py-1 px-3 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bg-red-400 hover:bg-red-500 text-white py-1 px-3 rounded-lg"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center px-6 py-8 text-gray-500 italic">
                  Tidak ada data booking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;