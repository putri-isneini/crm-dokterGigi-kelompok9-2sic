import { useState, useEffect } from "react";

const BookingForm = ({ onSubmit, editing, pasienOptions, dokterOptions, layananOptions }) => {
  const [form, setForm] = useState({
    pasien_id: '',
    dokter_id: '',
    layanan_id: '',
    tanggal: '',
    jam: '',
    keluhan: '',
    status: 'Menunggu',
  });

  useEffect(() => {
    if (editing) {
      setForm(editing);
    } else {
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
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      pasien_id: '',
      dokter_id: '',
      layanan_id: '',
      tanggal: '',
      jam: '',
      keluhan: '',
      status: 'Menunggu',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-pink-100 mb-10">
      <h2 className="text-2xl font-semibold text-pink-600 mb-6">
        {editing ? "Edit Booking" : "Tambah Booking"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-pink-700 font-medium mb-1">Pasien</label>
          <select name="pasien_id" className="w-full p-3 bg-pink-50 rounded-xl" value={form.pasien_id} onChange={handleChange}>
            <option value="">Pilih Pasien</option>
            {pasienOptions.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Dokter</label>
          <select name="dokter_id" className="w-full p-3 bg-pink-50 rounded-xl" value={form.dokter_id} onChange={handleChange}>
            <option value="">Pilih Dokter</option>
            {dokterOptions.map((d) => (
              <option key={d.id} value={d.id}>{d.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Layanan</label>
          <select name="layanan_id" className="w-full p-3 bg-pink-50 rounded-xl" value={form.layanan_id} onChange={handleChange}>
            <option value="">Pilih Layanan</option>
            {layananOptions.map((l) => (
              <option key={l.id} value={l.id}>{l.nama}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Tanggal</label>
          <input type="date" name="tanggal" className="w-full p-3 bg-pink-50 rounded-xl" value={form.tanggal} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Jam</label>
          <input type="time" name="jam" className="w-full p-3 bg-pink-50 rounded-xl" value={form.jam} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-pink-700 font-medium mb-1">Keluhan</label>
          <input type="text" name="keluhan" className="w-full p-3 bg-pink-50 rounded-xl" value={form.keluhan} onChange={handleChange} />
        </div>

        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-lg font-semibold transition"
          >
            {editing ? "Perbarui Booking" : "Simpan Booking"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BookingForm;
