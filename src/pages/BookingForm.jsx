import { useState, useEffect } from 'react';

const BookingForm = ({ addBooking, updateBooking, editingBooking }) => {
  const [form, setForm] = useState({
    pasien_id: '',
    dokter_id: '',
    layanan_id: '',
    tanggal: '',
    jam: '',
    status: 'Menunggu',
    kode_booking: ''
  });

  useEffect(() => {
    if (editingBooking) setForm(editingBooking);
    else setForm({
      pasien_id: '',
      dokter_id: '',
      layanan_id: '',
      tanggal: '',
      jam: '',
      status: 'Menunggu',
      kode_booking: ''
    });
  }, [editingBooking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pasien_id || !form.dokter_id || !form.layanan_id || !form.tanggal || !form.jam || !form.kode_booking) return;

    editingBooking ? updateBooking(form) : addBooking(form);
    setForm({
      pasien_id: '',
      dokter_id: '',
      layanan_id: '',
      tanggal: '',
      jam: '',
      status: 'Menunggu',
      kode_booking: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="ID Pasien"
        className="w-full p-2 border rounded"
        value={form.pasien_id}
        onChange={e => setForm({ ...form, pasien_id: e.target.value })}
      />
      <input
        type="text"
        placeholder="ID Dokter"
        className="w-full p-2 border rounded"
        value={form.dokter_id}
        onChange={e => setForm({ ...form, dokter_id: e.target.value })}
      />
      <input
        type="text"
        placeholder="ID Layanan"
        className="w-full p-2 border rounded"
        value={form.layanan_id}
        onChange={e => setForm({ ...form, layanan_id: e.target.value })}
      />
      <input
        type="date"
        className="w-full p-2 border rounded"
        value={form.tanggal}
        onChange={e => setForm({ ...form, tanggal: e.target.value })}
      />
      <input
        type="time"
        className="w-full p-2 border rounded"
        value={form.jam}
        onChange={e => setForm({ ...form, jam: e.target.value })}
      />
      <select
        className="w-full p-2 border rounded"
        value={form.status}
        onChange={e => setForm({ ...form, status: e.target.value })}
      >
        <option value="Menunggu">Menunggu</option>
        <option value="Terjadwal">Terjadwal</option>
        <option value="Selesai">Selesai</option>
        <option value="Batal">Batal</option>
      </select>
      <input
        type="text"
        placeholder="Kode Booking"
        className="w-full p-2 border rounded"
        value={form.kode_booking}
        onChange={e => setForm({ ...form, kode_booking: e.target.value })}
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {editingBooking ? 'Perbarui' : 'Tambah'}
      </button>
    </form>
  );
};

export default BookingForm;
