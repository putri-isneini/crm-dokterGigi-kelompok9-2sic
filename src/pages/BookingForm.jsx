// src/components/BookingForm.js
import { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Pastikan path supabase benar
import dayjs from "dayjs"; // Pastikan dayjs sudah terinstal (npm install dayjs)

// Menambahkan props onSuccess dan onCancelEdit
const BookingForm = ({ editingBooking, setEditingBooking, onSuccess }) => {
  const [form, setForm] = useState({
    pasien_id: '',
    dokter_id: '',
    layanan_id: '',
    tanggal: '',
    jam: '',
    keluhan: '',
    status: 'Menunggu',
  });

  const [pasienOptions, setPasienOptions] = useState([]);
  const [dokterOptions, setDokterOptions] = useState([]);
  const [layananOptions, setLayananOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect untuk mengisi form jika dalam mode edit
  useEffect(() => {
    if (editingBooking) {
      setForm({
        // Pastikan merujuk ke booking.pasien.id atau booking.pasien_id
        pasien_id: editingBooking.pasien?.id || editingBooking.pasien_id || '', 
        dokter_id: editingBooking.dokter?.id || editingBooking.dokter_id || '',
        layanan_id: editingBooking.layanan?.id || editingBooking.layanan_id || '',
        tanggal: editingBooking.tanggal || '',
        jam: editingBooking.jam || '',
        keluhan: editingBooking.keluhan || '',
        status: editingBooking.status || 'Menunggu',
      });
    } else {
      // Reset form jika tidak ada editingBooking
      setForm({
        pasien_id: '',
        dokter_id: '',
        layanan_id: '',
        tanggal: '',
        jam: '',
        keluhan: '',
        status: 'Menunggu',
      });
    }
  }, [editingBooking]);

  // Effect untuk mengambil semua opsi (pasien, dokter, layanan)
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mengambil dari tabel 'pasien'
        const { data: pasienData, error: pasienError } = await supabase
          .from('pasien')
          .select('id, nama')
          .order('nama', { ascending: true });
        if (pasienError) throw pasienError;
        setPasienOptions(pasienData);

        const { data: dokterData, error: dokterError } = await supabase
          .from('dokter')
          .select('id, nama')
          .order('nama', { ascending: true });
        if (dokterError) throw dokterError;
        setDokterOptions(dokterData);

        const { data: layananData, error: layananError } = await supabase
          .from('layanan')
          .select('id, nama')
          .order('nama', { ascending: true });
        if (layananError) throw layananError;
        setLayananOptions(layayananData);

      } catch (err) {
        console.error("Error fetching options:", err.message);
        setError("Gagal memuat opsi: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validasi dasar
    if (!form.pasien_id || !form.dokter_id || !form.layanan_id || !form.tanggal || !form.jam) {
      alert("Mohon lengkapi semua field yang wajib.");
      setLoading(false);
      return;
    }

    try {
      if (editingBooking) {
        // Mode Edit
        const { error: updateError } = await supabase
          .from('booking')
          .update(form)
          .eq('id', editingBooking.id);

        if (updateError) throw updateError;
        alert('Booking berhasil diperbarui!');
      } else {
        // Mode Tambah Baru
        const kode_booking = `BK-${Date.now()}`; // Generate kode booking
        const { error: insertError } = await supabase
          .from('booking')
          .insert({ ...form, kode_booking });

        if (insertError) throw insertError;
        alert('Booking berhasil ditambahkan!');
      }
      if (onSuccess) {
        onSuccess(); // Panggil callback untuk refresh list
      }
      // Reset form dan keluar dari mode edit
      setForm({
        pasien_id: '',
        dokter_id: '',
        layanan_id: '',
        tanggal: '',
        jam: '',
        keluhan: '',
        status: 'Menunggu',
      });
      if (setEditingBooking) setEditingBooking(null);

    } catch (err) {
      console.error('Error saat menyimpan booking:', err.message);
      setError('Gagal menyimpan booking: ' + err.message);
      alert('Gagal menyimpan booking: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (setEditingBooking) {
      setEditingBooking(null);
      setForm({ // Reset form juga saat batal
        pasien_id: '',
        dokter_id: '',
        layanan_id: '',
        tanggal: '',
        jam: '',
        keluhan: '',
        status: 'Menunggu',
      });
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat formulir booking...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-pink-100 mb-10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-pink-600 mb-6 text-center">
        {editingBooking ? "Edit Booking" : "Tambah Booking Baru"}
      </h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-pink-700 font-medium mb-1">Pasien</label>
          <select 
            name="pasien_id" 
            className="w-full p-3 bg-pink-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300" 
            value={form.pasien_id} 
            onChange={handleChange}
            required
          >
            <option value="">Pilih Pasien</option>
            {pasienOptions.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Dokter</label>
          <select 
            name="dokter_id" 
            className="w-full p-3 bg-pink-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300" 
            value={form.dokter_id} 
            onChange={handleChange}
            required
          >
            <option value="">Pilih Dokter</option>
            {dokterOptions.map((d) => (
              <option key={d.id} value={d.id}>{d.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Layanan</label>
          <select 
            name="layanan_id" 
            className="w-full p-3 bg-pink-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300" 
            value={form.layanan_id} 
            onChange={handleChange}
            required
          >
            <option value="">Pilih Layanan</option>
            {layananOptions.map((l) => (
              <option key={l.id} value={l.id}>{l.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Tanggal</label>
          <input 
            type="date" 
            name="tanggal" 
            className="w-full p-3 bg-pink-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300" 
            value={form.tanggal} 
            onChange={handleChange} 
            required
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Jam</label>
          <input 
            type="time" 
            name="jam" 
            className="w-full p-3 bg-pink-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300" 
            value={form.jam} 
            onChange={handleChange} 
            required
          />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Keluhan</label>
          <input 
            type="text" 
            name="keluhan" 
            className="w-full p-3 bg-pink-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300" 
            value={form.keluhan} 
            onChange={handleChange} 
          />
        </div>
        
        {/* Status hanya bisa diubah saat edit */}
        {editingBooking && (
            <div>
                <label className="block text-pink-700 font-medium mb-1">Status</label>
                <select
                    name="status"
                    className="w-full p-3 bg-pink-50 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Batal">Batal</option>
                </select>
            </div>
        )}

        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (editingBooking ? "Memperbarui..." : "Menyimpan...") : (editingBooking ? "Perbarui Booking" : "Simpan Booking")}
          </button>
          {editingBooking && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-xl text-lg font-semibold shadow-md transition duration-200"
            >
              Batal Edit
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default BookingForm;
