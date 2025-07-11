// src/pages/BookingList.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import BookingForm from '../components/BookingForm'; // Import BookingForm
import { PencilIcon, Trash2Icon } from 'lucide-react'; // Import ikon

function BookingList() {
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null); // State untuk data booking yang sedang diedit

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('booking')
        .select(`
          id, kode_booking, tanggal, jam, keluhan, status, feedback_submitted,
          pasien_user(id, nama, no_hp), -- Menggunakan pasien_user dan no_hp
          dokter(id, nama),
          layanan(id, nama)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      setBookingList(data);
    } catch (err) {
      console.error('Gagal fetch booking:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus booking ini?')) {
      const { error } = await supabase.from('booking').delete().eq('id', id);
      if (error) {
        alert('Gagal menghapus booking: ' + error.message);
        console.error('Gagal hapus booking:', error);
      } else {
        fetchBookings(); // Refresh list setelah hapus
      }
    }
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    // Scroll ke atas form jika diperlukan
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccessForm = () => {
    fetchBookings(); // Muat ulang daftar booking setelah form berhasil
    setEditingBooking(null); // Keluar dari mode edit
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat daftar booking...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
  }

  return (
    <div className="bg-pink-50 min-h-screen flex flex-col items-center py-8 px-4">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-5xl border border-pink-100">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
          🗓️ Manajemen Booking
        </h1>

        {/* Booking Form (Tambah/Edit) */}
        <div className="mb-8">
          <BookingForm
            editingBooking={editingBooking}
            setEditingBooking={setEditingBooking}
            onSuccess={handleSuccessForm}
          />
        </div>

        {/* Booking List */}
        {bookingList.length > 0 ? (
          <div className="mt-6 overflow-x-auto bg-white rounded-xl shadow-sm border border-pink-100">
            <table className="min-w-full divide-y divide-pink-200">
              <thead className="bg-pink-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Kode Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Pasien</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Dokter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Layanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Jam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Keluhan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Feedback</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-200">
                {bookingList.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.kode_booking}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.pasien_user?.nama || 'N/A'}</td> {/* Menggunakan pasien_user */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.dokter?.nama || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.layanan?.nama || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(booking.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.jam?.slice(0, 5)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.keluhan || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <span className={`px-2 py-0.5 text-white text-xs rounded-full ${
                        booking.status === "Selesai" ? "bg-green-500" :
                        booking.status === "Terjadwal" ? "bg-blue-500" :
                        booking.status === "Batal" ? "bg-red-500" : "bg-yellow-500"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.feedback_submitted ? (
                        <span className="text-green-600 font-semibold">Sudah</span>
                      ) : (
                        <span className="text-red-500">Belum</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className="text-pink-600 hover:text-pink-900 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 italic mt-12">
            Belum ada data booking. Tambahkan booking pertama Anda!
          </p>
        )}
      </div>
    </div>
  );
}

export default BookingList;
