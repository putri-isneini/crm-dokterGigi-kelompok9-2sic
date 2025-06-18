import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditDokter = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    specialization: '',
    date: '',
    startTime: '',
    endTime: '',
    photo: ''
  });

  const [preview, setPreview] = useState('');

  useEffect(() => {
    const doctors = JSON.parse(localStorage.getItem('dokterList') || '[]');
    const doc = doctors.find((d) => d.id === parseInt(id));
    if (doc) {
      const [day, timeRange] = doc.schedule.split(', ');
      const [startTime, endTime] = timeRange.split(' - ');
      const formattedDate = new Date().toISOString().split('T')[0];
      setForm({
        name: doc.name,
        specialization: doc.specialization,
        date: formattedDate,
        startTime,
        endTime,
        photo: doc.photo || ''
      });
      setPreview(doc.photo || '');
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, photo: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    const doctors = JSON.parse(localStorage.getItem('dokterList') || '[]');
    const updatedDoctors = doctors.map((d) =>
      d.id === parseInt(id)
        ? {
            ...d,
            ...form,
            schedule: `${new Date(form.date).toLocaleDateString('id-ID', { weekday: 'long' })}, ${form.startTime} - ${form.endTime}`
          }
        : d
    );
    localStorage.setItem('dokterList', JSON.stringify(updatedDoctors));
    navigate('/data-dokter');
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-rose-200">
        <h2 className="text-2xl font-bold mb-6 text-rose-600">Edit Dokter Gigi</h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Dokter"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl border-pink-300"
          />
          <input
            type="text"
            name="specialization"
            placeholder="Spesialisasi"
            value={form.specialization}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl border-pink-300"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl border-pink-300"
          />
          <div className="flex gap-4">
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl border-pink-300"
            />
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl border-pink-300"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full p-2"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full border border-rose-300 mx-auto mt-2"
            />
          )}
        </div>

        <button
          onClick={handleUpdate}
          className="mt-6 w-full bg-rose-500 text-white py-3 rounded-xl hover:bg-rose-600 transition"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default EditDokter;
