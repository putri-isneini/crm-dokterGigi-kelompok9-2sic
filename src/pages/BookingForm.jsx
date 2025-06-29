import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const BookingForm = ({ addBooking, updateBooking, editingBooking }) => {
  const [form, setForm] = useState({
    pasien_id: '',
    dokter_id: '',
    layanan_id: '',
    tanggal: '',
    jam: '',
    status: 'Menunggu',
    kode_booking: '',
    keluhan: ''
  });

  const [pasienList, setPasienList] = useState([]);
  const [dokterList, setDokterList] = useState([]);
  const [layananList, setLayananList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: pasien } = await supabase.from('pasien').select('id, nama');
      const { data: dokter } = await supabase.from('dokter').select('id, nama');
      const { data: layanan } = await supabase.from('layanan').select('id, nama');

      setPasienList(pasien || []);
      setDokterList(dokter || []);
      setLayananList(layanan || []);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editingBooking) {
      setForm(editingBooking);
    } else {
      setForm({
        pasien_id: '',
        dokter_id: '',
        layanan_id: '',
        tanggal: '',
        jam: '',
        status: 'Menunggu',
        kode_booking: '',
        keluhan: ''
      });
    }
  }, [editingBooking]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      pasien_id,
      dokter_id,
      layanan_id,
      tanggal,
      jam,
      kode_booking,
      keluhan
    } = form;

    if (!pasien_id || !dokter_id || !layanan_id || !tanggal || !jam || !kode_booking || !keluhan) {
      alert('Mohon lengkapi semua field.');
      return;
    }

    if (editingBooking) {
      updateBooking(form);
    } else {
      addBooking(form);
    }

    setForm({
      pasien_id: '',
      dokter_id: '',
      layanan_id: '',
      tanggal: '',
      jam: '',
      status: 'Menunggu',
      kode_booking: '',
      keluhan: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 border rounded-lg">
      <select
        value={form.pasien_id}
        onChange={(e) => setForm({ ...form, pasien_id: e.target.value })}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Pilih Pasien</option>
        {pasienList.map((p) => (
          <option key={p.id} value={p.id}>{p.nama}</option>
        ))}
      </select>

      <select
        value={form.dokter_id}
        onChange={(e) => setForm({ ...form, dokter_id: e.target.value })}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Pilih Dokter</option>
        {dokterList.map((d) => (
          <option key={d.id} value={d.id}>{d.nama}</option>
        ))}
      </select>

      <select
        value={form.layanan_id}
        onChange={(e) => setForm({ ...form, layanan_id: e.target.value })}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Pilih Layanan</option>
        {layananList.map((l) => (
          <option key={l.id} value={l.id}>{l.nama}</option>
        ))}
      </select>

      <input
        type="date"
        className="w-full p-2 border rounded"
        value={form.tanggal}
        onChange={e => setForm({ ...form, tanggal: e.target.value })}
        required
      />

      <input
        type="time"
        className="w-full p-2 border rounded"
        value={form.jam}
        onChange={e => setForm({ ...form, jam: e.target.value })}
        required
      />

      <textarea
        className="w-full p-2 border rounded"
        value={form.keluhan}
        onChange={e => setForm({ ...form, keluhan: e.target.value })}
        placeholder="Tuliskan keluhan pasien"
        required
      ></textarea>

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
        required
      />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {editingBooking ? 'Perbarui' : 'Tambah'}
      </button>
    </form>
  );
};

export default BookingForm;
