import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import BookingForm from './BookingForm';

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('booking')
      .select(`
        id, tanggal, jam, status, kode_booking, keluhan,
        pasien:pasien_id (id, nama),
        dokter:dokter_id (id, nama),
        layanan:layanan_id (id, nama)
      `)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setBookings(data);
  };

  const deleteBooking = async (id) => {
    const { error } = await supabase.from('booking').delete().eq('id', id);
    if (error) console.error(error);
    else fetchBookings();
  };

  const addBooking = async (form) => {
    const { error } = await supabase.from('booking').insert([form]);
    if (error) console.error(error);
    else fetchBookings();
  };

  const updateBooking = async (form) => {
    const { id, ...data } = form;
    const { error } = await supabase.from('booking').update(data).eq('id', id);
    if (error) console.error(error);
    else {
      setEditingBooking(null);
      fetchBookings();
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-pink-600 text-center">Dashboard Booking Pasien</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          {editingBooking ? 'Edit Booking' : 'Tambah Booking'}
        </h2>
        <BookingForm
          addBooking={addBooking}
          updateBooking={updateBooking}
          editingBooking={editingBooking}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {bookings.map((b) => (
          <div key={b.id} className="border bg-white rounded-xl p-5 shadow text-sm text-gray-800">
            <div><strong>Kode Booking:</strong> {b.kode_booking}</div>
            <div><strong>Pasien:</strong> {b.pasien?.nama}</div>
            <div><strong>Dokter:</strong> {b.dokter?.nama}</div>
            <div><strong>Layanan:</strong> {b.layanan?.nama}</div>
            <div><strong>Tanggal:</strong> {b.tanggal}</div>
            <div><strong>Jam:</strong> {b.jam}</div>
            <div><strong>Keluhan:</strong> {b.keluhan}</div>
            <div><strong>Status:</strong> {b.status}</div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditingBooking(b)}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBooking(b.id)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingList;
