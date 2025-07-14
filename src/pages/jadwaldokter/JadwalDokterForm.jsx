// src/pages/JadwalDokterForm.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/id'; // Ensure dayjs locale is imported for consistent date formatting
dayjs.locale('id');

// Import icons from lucide-react
import {
    UserCircle2, CalendarDays, Clock, Save, XCircle,
    Loader2, AlertCircle, CheckCircle
} from 'lucide-react';

function JadwalDokterForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const editingJadwal = location.state?.jadwal; // If editing, schedule data will be in navigation state

    const [form, setForm] = useState({
        dokter_id: '',
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
    });
    const [dokterList, setDokterList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null); // For success messages

    // Effect to populate the form if in edit mode
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

    // Effect to fetch doctor list
    useEffect(() => {
        const fetchDokter = async () => {
            try {
                const { data, error: fetchError } = await supabase
                    .from('dokter')
                    .select('id, nama')
                    .order('nama', { ascending: true });

                if (fetchError) {
                    throw fetchError;
                }
                setDokterList(data);
            } catch (err) {
                console.error('Failed to fetch doctor list:', err.message);
                setError('Gagal memuat daftar dokter: ' + err.message);
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
        setMessage(null);

        // Basic validation
        if (!form.dokter_id || !form.hari || !form.jam_mulai || !form.jam_selesai) {
            setError('Semua field harus diisi!');
            setLoading(false);
            return;
        }

        // Time validation
        const startTime = dayjs(form.jam_mulai, 'HH:mm');
        const endTime = dayjs(form.jam_selesai, 'HH:mm');
        if (endTime.isBefore(startTime) || endTime.isSame(startTime)) {
            setError('Jam selesai harus setelah jam mulai!');
            setLoading(false);
            return;
        }

        try {
            if (editingJadwal) {
                // Edit Mode: Call Supabase update directly
                const { error: updateError } = await supabase
                    .from('jadwal_dokter')
                    .update(form)
                    .eq('id', editingJadwal.id);

                if (updateError) throw updateError;
                setMessage('Jadwal dokter berhasil diperbarui!');
            } else {
                // Add New Mode: Call Supabase insert directly
                const { error: insertError } = await supabase
                    .from('jadwal_dokter')
                    .insert(form);

                if (insertError) throw insertError;
                setMessage('Jadwal dokter berhasil ditambahkan!');
            }
            // Navigate back to list after successful operation
            setTimeout(() => { // Give time for message to be seen
                navigate('/jadwaldokterlist');
            }, 1500);
        } catch (err) {
            console.error('Error saving schedule:', err.message);
            setError('Gagal menyimpan jadwal: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/jadwaldokterlist'); // Go back to the list page
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center"> {/* Consistent background and centering */}
            <div className="py-8 pl-56 pr-8 w-full"> {/* Consistent padding */}
                <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-pink-100 transform transition-all duration-300 hover:scale-[1.01]"> {/* Increased max-width here */}
                    <h2 className="text-3xl font-bold text-pink-700 mb-8 text-center">
                        {editingJadwal ? '✏️ Edit Jadwal Dokter' : '➕ Tambah Jadwal Dokter'}
                    </h2>

                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-200 mb-4 flex items-center justify-center">
                            <AlertCircle className="mr-2 h-5 w-5" /> {error}
                        </p>
                    )}
                    {message && (
                        <p className="text-green-500 text-sm text-center bg-green-100 p-3 rounded-lg border border-green-200 mb-4 flex items-center justify-center">
                            <CheckCircle className="mr-2 h-5 w-5" /> {message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Dokter */}
                        <div>
                            <label htmlFor="dokter_id" className="block text-gray-700 text-sm font-bold mb-2">Dokter</label>
                            <div className="relative">
                                <UserCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                <select
                                    id="dokter_id"
                                    name="dokter_id"
                                    value={form.dokter_id}
                                    onChange={handleChange}
                                    className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                                    required
                                >
                                    <option value="">Pilih Dokter</option>
                                    {dokterList.map(dokter => (
                                        <option key={dokter.id} value={dokter.id}>{dokter.nama}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                                </div>
                            </div>
                        </div>

                        {/* Hari */}
                        <div>
                            <label htmlFor="hari" className="block text-gray-700 text-sm font-bold mb-2">Hari</label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                <select
                                    id="hari"
                                    name="hari"
                                    value={form.hari}
                                    onChange={handleChange}
                                    className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
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
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                                </div>
                            </div>
                        </div>

                        {/* Jam Mulai & Jam Selesai */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="jam_mulai" className="block text-gray-700 text-sm font-bold mb-2">Jam Mulai</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                    <input
                                        type="time"
                                        id="jam_mulai"
                                        name="jam_mulai"
                                        value={form.jam_mulai}
                                        onChange={handleChange}
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="jam_selesai" className="block text-gray-700 text-sm font-bold mb-2">Jam Selesai</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                    <input
                                        type="time"
                                        id="jam_selesai"
                                        name="jam_selesai"
                                        value={form.jam_selesai}
                                        onChange={handleChange}
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-4 mt-8">
                            <button
                                type="submit"
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                {loading ? 'Menyimpan...' : (editingJadwal ? 'Perbarui Jadwal' : 'Tambah Jadwal')}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex items-center px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-75"
                            >
                                <XCircle className="mr-2 h-5 w-5" />
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default JadwalDokterForm;
