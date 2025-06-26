import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import BookingForm from './components/BookingForm';

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('booking')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setBookings(data);
  };

  const addBooking = async (booking) => {
    const { error } = await supabase.from('booking').insert(booking);
    if (error) console.error(error);
    else fetchBookings();
  };

  const updateBooking = async (booking) => {
    const { error } = await supabase
      .from('booking')
      .update(booking)
      .eq('id', booking.id);

    if (error) console.error(error);
    else {
      fetchBookings();
      setEditingBooking(null);
    }
  };

  const deleteBooking = async (id) => {
    const { error } = await supabase.from('booking').delete().eq('id', id);
    if (error) console.error(error);
    else fetchBookings();
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD Booking</h1>
      <BookingForm
        addBooking={addBooking}
        updateBooking={updateBooking}
        editingBooking={editingBooking}
      />
      <ul className="mt-4">
        {bookings.map((b) => (
          <li key={b.id} className="border p-2 my-2">
            <div>
              <p className="font-semibold">{b.kode_booking}</p>
              <p className="text-sm text-gray-600">
                Pasien: {b.pasien_id} | Dokter: {b.dokter_id} | Layanan: {b.layanan_id}
              </p>
              <p className="text-sm">
                {b.tanggal} jam {b.jam} - Status: <strong>{b.status}</strong>
              </p>
            </div>
            <div className="space-x-2 mt-2">
              <button
                onClick={() => setEditingBooking(b)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBooking(b.id)}
                className="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Booking;
