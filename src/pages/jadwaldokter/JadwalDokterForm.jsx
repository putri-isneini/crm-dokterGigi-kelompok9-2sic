// src/pages/JadwalDokterForm.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase'; // Pastikan path supabase benar
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs'; // Pastikan dayjs sudah terinstal (npm install dayjs)

function JadwalDokterForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const editingJadwal = location.state?.jadwal; // Jika diedit, data jadwal akan ada di state navigasi

    const [form, setForm] = useState({
        dokter_id: '',
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
    });
    const [dokterList, setDokterList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Effect untuk mengisi form jika dalam mode edit
    useEffect(() => {
        if (editingJadwal) {
            setForm({
                dokter_id: editingJadwal.dokter_id,
                hari: editingJadwal.hari,
                jam_mulai: editingJadwal.jam_mulai,
                jam_selesai: editingJadwal.jam_selesai,
            });
        }
    }, [editingJadwal]);

    // Effect untuk mengambil daftar dokter
    useEffect(() => {
        const fetchDokter = async () => {
            const { data, error } = await supabase
                .from('dokter')
                .select('id, nama')
                .order('nama', { ascending: true });

            if (error) {
                console.error('Gagal mengambil daftar dokter:', error.message);
                setError('Gagal memuat daftar dokter.');
            } else {
                setDokterList(data);
            }
        };
        fetchDokter();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validasi dasar
        if (!form.dokter_id || !form.hari || !form.jam_mulai || !form.jam_selesai) {
            alert('Semua field harus diisi!');
            setLoading(false);
            return;
        }

        // Validasi jam
        const startTime = dayjs(form.jam_mulai, 'HH:mm');
        const endTime = dayjs(form.jam_selesai, 'HH:mm');
        if (endTime.isBefore(startTime) || endTime.isSame(startTime)) {
            alert('Jam selesai harus setelah jam mulai!');
            setLoading(false);
            return;
        }

        try {
            if (editingJadwal) {
                // Mode Edit: Langsung panggil update Supabase
                const { error } = await supabase
                    .from('jadwal_dokter')
                    .update(form)
                    .eq('id', editingJadwal.id);

                if (error) throw error;
                alert('Jadwal dokter berhasil diperbarui!');
            } else {
                // Mode Tambah Baru: Langsung panggil insert Supabase
                const { error } = await supabase
                    .from('jadwal_dokter')
                    .insert(form);

                if (error) throw error;
                alert('Jadwal dokter berhasil ditambahkan!');
            }
            navigate('/jadwaldokterlist'); // Kembali ke daftar setelah berhasil
        } catch (err) {
            console.error('Error saat menyimpan jadwal:', err.message);
            setError('Gagal menyimpan jadwal: ' + err.message);
            alert('Gagal menyimpan jadwal: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto px-6 py-10 bg-pink-50 min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-3xl shadow-lg border border-pink-100 w-full"
            >
                <h2 className="text-3xl font-bold text-pink-600 mb-8 text-center tracking-tight">
                    {editingJadwal ? '✏️ Edit Jadwal Dokter' : '➕ Tambah Jadwal Dokter'}
                </h2>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

                <div className="space-y-5">
                    <div>
                        <label htmlFor="dokter_id" className="block text-sm font-semibold text-gray-700 mb-2">👩‍⚕️ Dokter</label>
                        <select
                            id="dokter_id"
                            name="dokter_id"
                            value={form.dokter_id}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            required
                        >
                            <option value="">Pilih Dokter</option>
                            {dokterList.map(dokter => (
                                <option key={dokter.id} value={dokter.id}>{dokter.nama}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="hari" className="block text-sm font-semibold text-gray-700 mb-2">📅 Hari</label>
                        <select
                            id="hari"
                            name="hari"
                            value={form.hari}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                            required
                        >
                            <option value="">Pilih Hari</option>
                            <option value="Senin">Senin</option>
                            <option value="Selasa">Selasa</option>
                            <option value="Rabu">Rabu</option>
                            <option value="Kamis">Kamis</option>
                            <option value="Jumat">Jumat</option>
                            <option value="Sabtu">Sabtu</option>
                            <option value="Minggu">Minggu</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="jam_mulai" className="block text-sm font-semibold text-gray-700 mb-2">⏰ Jam Mulai</label>
                            <input
                                type="time"
                                id="jam_mulai"
                                name="jam_mulai"
                                value={form.jam_mulai}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="jam_selesai" className="block text-sm font-semibold text-gray-700 mb-2">🏁 Jam Selesai</label>
                            <input
                                type="time"
                                id="jam_selesai"
                                name="jam_selesai"
                                value={form.jam_selesai}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 rounded-xl text-lg font-bold shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Menyimpan...' : (editingJadwal ? '💾 Perbarui Jadwal' : '🚀 Tambah Jadwal')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default JadwalDokterForm;
