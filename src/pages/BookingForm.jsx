import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

function BookingForm({ addBooking, updateBooking, editingBooking }) {
  const [form, setForm] = useState({
    pasien_id: '',
    dokter_id: '',
    layanan_id: '',
    tanggal: '',
    jam: '',
    status: 'Menunggu',
    keluhan: '',
  });

  const [pasienList, setPasienList] = useState([]);
  const [dokterList, setDokterList] = useState([]);
  const [layananList, setLayananList] = useState([]);

  useEffect(() => {
    if (editingBooking) {
      const { kode_booking, ...rest } = editingBooking;
      setForm(rest);
    } else {
      setForm({
        pasien_id: '',
        dokter_id: '',
        layanan_id: '',
        tanggal: '',
        jam: '',
        status: 'Menunggu',
        keluhan: '',
      });
    }
  }, [editingBooking]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: pasien } = await supabase.from('pasien').select('*');
      const { data: dokter } = await supabase.from('dokter').select('*');
      const { data: layanan } = await supabase.from('layanan').select('*');

      setPasienList(pasien || []);
      setDokterList(dokter || []);
      setLayananList(layanan || []);
    };
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBooking) {
      updateBooking({ ...form, id: editingBooking.id });
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
      keluhan: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-xl border border-pink-300 shadow space-y-4">
      <h2 className="text-2xl font-bold text-pink-700 mb-2">
        {editingBooking ? 'Edit Booking' : 'Tambah Booking'}
      </h2>

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
          className="border border-pink-300 p-2 rounded-md"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-pink-700 mb-1">Jam</label>
        <input
          type="time"
          value={form.jam}
          onChange={(e) => setForm({ ...form, jam: e.target.value })}
          className="border border-pink-300 p-2 rounded-md"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-pink-700 mb-1">Keluhan</label>
        <textarea
          value={form.keluhan}
          onChange={(e) => setForm({ ...form, keluhan: e.target.value })}
          className="border border-pink-300 p-2 rounded-md bg-white"
          placeholder="Masukkan keluhan pasien"
          rows={3}
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 w-full"
      >
        {editingBooking ? 'Simpan Perubahan' : 'Tambah Booking'}
      </button>
    </form>
  );
}

export default BookingForm;

