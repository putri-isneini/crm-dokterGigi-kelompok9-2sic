import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import BookingForm from './BookingForm';

function BookingList() {
  const [bookingList, setBookingList] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);

  const fetchBooking = async () => {
    const { data, error } = await supabase
      .from('booking')
      .select(`
        id, tanggal, jam, status, kode_booking, keluhan,
        pasien:pasien_id (id, nama),
        dokter:dokter_id (id, nama),
        layanan:layanan_id (id, nama)
      `)
      .order('created_at', { ascending: false });

    if (error) console.error('Fetch error:', error);
    else setBookingList(data);
  };

  const addBooking = async (form) => {
    const { error } = await supabase.from('booking').insert([form]);
    if (error) console.error('Insert error:', error);
    else fetchBooking();
  };

  const updateBooking = async (form) => {
    const { id, ...data } = form;
    const { error } = await supabase.from('booking').update(data).eq('id', id);
    if (error) console.error('Update error:', error);
    else {
      setEditingBooking(null);
      fetchBooking();
    }
  };

  const deleteBooking = async (id) => {
    const { error } = await supabase.from('booking').delete().eq('id', id);
    if (error) console.error('Delete error:', error);
    else fetchBooking();
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 px-4 py-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-6 text-center">Dashboard Booking Pasien</h1>

      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Form di kiri */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-lg font-semibold mb-3 text-pink-600">
            {editingBooking ? 'Edit Booking' : 'Tambah Booking'}
          </h2>
          <BookingForm
            addBooking={addBooking}
            updateBooking={updateBooking}
            editingBooking={editingBooking}
          />
        </div>

        {/* List di kanan */}
        <div className="w-full lg:w-1/2 space-y-4">
          <h2 className="text-lg font-semibold mb-3 text-pink-600">Daftar Booking</h2>
          {bookingList.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-pink-300 p-4 rounded-xl shadow-md"
            >
              <p className="font-semibold text-pink-800">Kode: {booking.kode_booking}</p>
              <p>Pasien: {booking.pasien?.nama || '-'}</p>
              <p>Dokter: {booking.dokter?.nama || '-'}</p>
              <p>Layanan: {booking.layanan?.nama || '-'}</p>
              <p>Tanggal: {booking.tanggal} - {booking.jam}</p>
              <p>Status: <span className="italic">{booking.status}</span></p>
              <p>Keluhan: {booking.keluhan}</p>

              <div className="space-x-3 mt-3">
                <button
                  onClick={() => setEditingBooking(booking)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBooking(booking.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingList;
