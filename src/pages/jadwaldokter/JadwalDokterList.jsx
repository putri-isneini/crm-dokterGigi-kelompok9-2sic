// src/pages/JadwalDokterList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/id'; // Import locale for Indonesian dates
dayjs.locale('id');

// Import icons from lucide-react for a modern look
import {
    CalendarDays, UserCircle2, Clock, Calendar, Edit, Trash2, PlusCircle,
    Loader2, AlertCircle, CheckCircle, Info // Added Info for empty state
} from 'lucide-react';

function JadwalDokterList() {
    const [jadwalList, setJadwalList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null); // For success messages
    const navigate = useNavigate();

    const fetchJadwal = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('jadwal_dokter')
                .select(`
                    id,
                    hari,
                    jam_mulai,
                    jam_selesai,
                    created_at,
                    dokter(id, nama)
                `)
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }
            setJadwalList(data);
            console.log("JadwalDokterList: Fetched jadwal data:", data);
        } catch (err) {
            console.error('Error fetching jadwal:', err.message);
            setError('Gagal memuat daftar jadwal: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJadwal();
    }, [fetchJadwal]);

    const handleDelete = async (id) => {
        // Custom confirmation dialog
        const isConfirmed = await new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50';
            dialog.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm text-center">
                    <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h3>
                    <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus jadwal ini?</p>
                    <div class="flex justify-center space-x-4">
                        <button id="confirmDeleteBtn" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-colors">Hapus</button>
                        <button id="cancelDeleteBtn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors">Batal</button>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);

            document.getElementById('confirmDeleteBtn').onclick = () => {
                document.body.removeChild(dialog);
                resolve(true);
            };
            document.getElementById('cancelDeleteBtn').onclick = () => {
                document.body.removeChild(dialog);
                resolve(false);
            };
        });

        if (!isConfirmed) {
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error: deleteError } = await supabase
                .from('jadwal_dokter')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            setMessage('Jadwal berhasil dihapus!');
            fetchJadwal(); // Refresh list
        } catch (err) {
            console.error('Error deleting jadwal:', err.message);
            setError('Gagal menghapus jadwal: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder for handleEdit - assuming a form route for editing
    const handleEdit = (id) => {
        navigate(`/jadwaldokterform/${id}`); // Navigate to a form for editing
    };

    // Loading state for initial fetch
    if (loading && !jadwalList.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin w-16 h-16 text-pink-500 mb-4" />
                    <div className="text-pink-600 text-lg font-semibold">
                        Memuat daftar jadwal dokter...
                    </div>
                </div>
            </div>
        );
    }

    // Error state for initial fetch
    if (error && !jadwalList.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-700 mb-4">Terjadi Kesalahan!</h3>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button onClick={fetchJadwal} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md">
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50"> {/* Consistent background */}
            <div className="py-8 pl-56 pr-8"> {/* Consistent padding */}
                <h2 className="text-5xl font-extrabold text-pink-800 mb-12 text-center drop-shadow-lg leading-tight">
                    <span className="block text-pink-600">Manajemen</span> Jadwal Dokter <CalendarDays className="inline-block ml-4 text-pink-500" size={50} />
                </h2>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-8 w-full shadow-md flex items-center justify-center" role="alert">
                        <CheckCircle className="mr-3 h-6 w-6" />
                        <span className="block sm:inline font-semibold">{message}</span>
                    </div>
                )}

                {/* Link to add new schedule */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={() => navigate('/jadwaldokterform')}
                        className="flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-xl transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                    >
                        <PlusCircle className="mr-3 h-6 w-6" />
                        Tambah Jadwal Baru
                    </button>
                </div>

                {jadwalList.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-6 gap-4 p-6 bg-pink-100 font-bold text-pink-700 text-lg border-b border-pink-200">
                            <div className="col-span-1 flex items-center"><UserCircle2 className="mr-2" size={18} />Dokter</div>
                            <div className="col-span-1 flex items-center"><CalendarDays className="mr-2" size={18} />Hari</div>
                            <div className="col-span-1 flex items-center"><Clock className="mr-2" size={18} />Jam Mulai</div>
                            <div className="col-span-1 flex items-center"><Clock className="mr-2" size={18} />Jam Selesai</div>
                            <div className="col-span-1 flex items-center"><Calendar className="mr-2" size={18} />Dibuat Pada</div>
                            <div className="col-span-1 text-right">Aksi</div>
                        </div>

                        {/* Table Rows */}
                        {jadwalList.map((jadwal, index) => (
                            <div
                                key={jadwal.id}
                                className={`grid grid-cols-6 gap-4 p-6 text-gray-800 border-b border-pink-50
                                    ${index % 2 === 0 ? 'bg-white' : 'bg-pink-50'}
                                    hover:bg-pink-100 transition-colors duration-200 ease-in-out
                                    items-center
                                `}
                            >
                                <div className="col-span-1 font-semibold flex items-center">
                                    {jadwal.dokter?.nama || 'N/A'}
                                </div>
                                <div className="col-span-1 flex items-center">
                                    {jadwal.hari}
                                </div>
                                <div className="col-span-1 flex items-center">
                                    {jadwal.jam_mulai}
                                </div>
                                <div className="col-span-1 flex items-center">
                                    {jadwal.jam_selesai}
                                </div>
                                <div className="col-span-1 flex items-center text-sm">
                                    {dayjs(jadwal.created_at).format('DD MMM YYYY HH:mm')}
                                </div>
                                <div className="col-span-1 flex justify-end space-x-3">
                                    <button
                                        onClick={() => handleEdit(jadwal.id)}
                                        className="flex items-center text-pink-600 hover:text-pink-800 font-semibold text-sm transition-colors duration-200 transform hover:scale-105"
                                        title="Edit Jadwal"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(jadwal.id)}
                                        className="flex items-center text-red-600 hover:text-red-800 font-semibold text-sm transition-colors duration-200 transform hover:scale-105"
                                        title="Hapus Jadwal"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-700 p-10 bg-white rounded-xl shadow-lg border border-pink-200 w-full">
                        <Info className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                        <p className="text-2xl font-semibold mb-4">Belum ada jadwal dokter yang ditambahkan.</p>
                        <p className="text-lg">Klik "Tambah Jadwal Baru" untuk mulai menambahkan jadwal.</p>
                        <img
                            src="https://placehold.co/300x200/FCE7F3/BE185D?text=No+Schedules"
                            alt="No Schedules Placeholder"
                            className="mx-auto mt-6 rounded-lg shadow-md"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default JadwalDokterList;
