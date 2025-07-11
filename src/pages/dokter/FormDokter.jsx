// src/pages/dokter/FormDokter.jsx
import { useState, useEffect } from 'react';

const FormDokter = ({ addDokter, updateDokter, editingDokter, setEditingDokter }) => {
    const [form, setForm] = useState({
        nama: '',
        spesialisasi: '',
        no_telepon: '',
        email: '',
        foto: '', // Tambahkan state untuk kolom 'foto'
    });

    useEffect(() => {
        if (editingDokter) {
            setForm({ ...editingDokter });
        } else {
            setForm({
                nama: '',
                spesialisasi: '',
                no_telepon: '',
                email: '',
                foto: '',
            });
        }
    }, [editingDokter]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const { nama, spesialisasi, no_telepon, email, foto } = form; // Ambil foto dari form

        if (!nama || !spesialisasi || !no_telepon || !email) return; // Sesuaikan validasi jika foto opsional

        editingDokter ? updateDokter(form) : addDokter(form);

        setForm({
            nama: '',
            spesialisasi: '',
            no_telepon: '',
            email: '',
            foto: '',
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-10 rounded-3xl shadow-lg border border-pink-100 transition-all duration-300"
        >
            <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center tracking-tight">
                {editingDokter ? '✨ Edit Dokter' : '➕ Tambah Dokter Baru'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">👩‍⚕️ Nama Dokter</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={form.nama}
                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                        placeholder="Contoh: Drg. Budi Santoso"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">🦷 Spesialisasi</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={form.spesialisasi}
                        onChange={(e) => setForm({ ...form, spesialisasi: e.target.value })}
                        placeholder="Contoh: Ortodonti"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📞 No. Telepon</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={form.no_telepon}
                        onChange={(e) => setForm({ ...form, no_telepon: e.target.value })}
                        placeholder="Contoh: 081234567890"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📧 Email</label>
                    <input
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="Contoh: dokter.budi@klinik.com"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📸 URL Foto Dokter (Opsional)</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        value={form.foto}
                        onChange={(e) => setForm({ ...form, foto: e.target.value })}
                        placeholder="Contoh: https://example.com/foto-dokter.jpg"
                    />
                </div>

                {form.foto && (
                    <div className="md:col-span-2 flex justify-center mt-4">
                        <img
                            src={form.foto}
                            alt="Preview Foto Dokter"
                            className="rounded-xl border border-pink-200 shadow-md max-h-48 object-cover"
                        />
                    </div>
                )}

                <div className="md:col-span-2 mt-6">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 rounded-xl text-lg font-bold shadow-md transition duration-200"
                    >
                        {editingDokter ? '💾 Perbarui Dokter' : '🚀 Tambah Dokter'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FormDokter;
