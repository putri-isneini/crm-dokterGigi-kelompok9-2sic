import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function BookingForm({ addBooking, updateBooking, editingBooking }) {
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

    const { pasien_id, dokter_id, layanan_id, tanggal, jam, kode_booking, keluhan } = form;

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
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-pink-100 p-6 md:p-12 lg:p-16 rounded-lg shadow-md"
      >
        <div className="flex flex-col">
          <label className="text-sm text-pink-700 mb-1">Pasien</label>
          <select
            value={form.pasien_id}
            onChange={(e) => setForm({ ...form, pasien_id: e.target.value })}
            className="border border-pink-300 p-2 rounded-md bg-white"
            required
          >
            <option value="">Pilih Pasien</option>
            {pasienList.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-pink-700 mb-1">Dokter</label>
          <select
            value={form.dokter_id}
            onChange={(e) => setForm({ ...form, dokter_id: e.target.value })}
            className="border border-pink-300 p-2 rounded-md bg-white"
            required
          >
            <option value="">Pilih Dokter</option>
            {dokterList.map((d) => (
              <option key={d.id} value={d.id}>{d.nama}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-pink-700 mb-1">Layanan</label>
          <select
            value={form.layanan_id}
            onChange={(e) => setForm({ ...form, layanan_id: e.target.value })}
            className="border border-pink-300 p-2 rounded-md bg-white"
            required
          >
            <option value="">Pilih Layanan</option>
            {layananList.map((l) => (
              <option key={l.id} value={l.id}>{l.nama}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-pink-700 mb-1">Tanggal</label>
          <input
            type="date"
            value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
            className="border border-pink-300 p-2 rounded-md bg-white"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-pink-700 mb-1">Jam</label>
          <input
            type="time"
            value={form.jam}
            onChange={(e) => setForm({ ...form, jam: e.target.value })}
            className="border border-pink-300 p-2 rounded-md bg-white"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-pink-700 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-pink-300 p-2 rounded-md bg-white"
            required
          >
            <option value="Menunggu">Menunggu</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        <div className="md:col-span-2 flex flex-col">
          <label className="text-sm text-pink-700 mb-1">Kode Booking</label>
          <input
            type="text"
            placeholder="Kosongkan jika ingin otomatis"
            value={form.kode_booking}
            onChange={(e) => setForm({ ...form, kode_booking: e.target.value })}
            className="border border-pink-300 p-2 rounded-md bg-white"
            required
          />
        </div>

        <div className="md:col-span-2 flex flex-col">
          <label className="text-sm text-pink-700 mb-1">Keluhan</label>
          <textarea
            className="border border-pink-300 p-2 rounded-md bg-white"
            value={form.keluhan}
            onChange={(e) => setForm({ ...form, keluhan: e.target.value })}
            placeholder="Tuliskan keluhan pasien"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-xl font-semibold transition"
          >
            {editingBooking ? 'Update Booking' : 'Tambah Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
