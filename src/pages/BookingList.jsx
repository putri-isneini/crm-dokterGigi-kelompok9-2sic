// src/pages/BookingList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

// Import icons from lucide-react
import {
    CalendarCheck, User, Stethoscope, Briefcase, Calendar, Clock, MessageSquare, CheckCircle, AlertCircle,
    Edit, Trash2, PlusCircle, Loader2, RefreshCw, Info, XCircle, Save, Ticket
} from 'lucide-react';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [currentBookingToUpdate, setCurrentBookingToUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const navigate = useNavigate();

    const fetchBooking = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('booking')
                .select(`
                    id, kode_booking, tanggal, jam, keluhan, status, feedback_submitted,
                    pasien_id, layanan_id, dokter_id,
                    pasien_user(nama),
                    layanan(nama),
                    dokter(nama)
                `)
                .order('tanggal', { ascending: false })
                .order('jam', { ascending: false });

            if (fetchError) throw fetchError;
            setBookings(data);
        } catch (err) {
            console.error('Gagal mengambil data booking:', err.message);
            setError(err.message || 'Terjadi kesalahan saat memuat daftar booking.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    const handleEdit = (id) => {
        navigate(`/edit-booking/${id}`);
    };

    const handleDelete = async (id) => {
        const isConfirmed = await new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50';
            dialog.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm text-center">
                    <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h3>
                    <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus booking ini?</p>
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
                .from('booking')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            setMessage('Booking berhasil dihapus!');
            fetchBooking();
        } catch (err) {
            console.error('Error deleting booking:', err.message);
            setError('Gagal menghapus booking: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const openStatusModal = (booking) => {
        setCurrentBookingToUpdate(booking);
        setNewStatus(booking.status); // Set initial status in modal
        setShowStatusModal(true);
        setError(null); // Clear previous errors
        setMessage(null); // Clear previous messages
    };

    const handleUpdateStatus = async () => {
        if (!currentBookingToUpdate || !newStatus) {
            setError('Status baru tidak boleh kosong.');
            return;
        }

        // No need for 'allowed' array validation here, as dropdown restricts input
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const {
                data: { session },
                error: tokenError
            } = await supabase.auth.getSession();

            if (tokenError || !session) {
                throw new Error("Gagal mendapatkan token pengguna. Silakan login ulang.");
            }

            const res = await fetch('https://ppakjdgfzuvirtrjfnwg.functions.supabase.co/smart-action', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ id: currentBookingToUpdate.id, status: newStatus }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Gagal update');

            setMessage(`Status booking berhasil diperbarui ke ${newStatus}`);
            setShowStatusModal(false); // Close modal
            setCurrentBookingToUpdate(null);
            fetchBooking();
        } catch (err) {
            console.error('Error updating booking status:', err.message);
            setError('Gagal memperbarui status booking: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !bookings.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin w-16 h-16 text-pink-500 mb-4" />
                    <div className="text-pink-600 text-lg font-semibold">
                        Memuat daftar booking...
                    </div>
                </div>
            </div>
        );
    }

    if (error && !bookings.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-700 mb-4">Terjadi Kesalahan!</h3>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button onClick={fetchBooking} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md">
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
            <div className="py-8 pl-56 pr-8"> {/* Consistent padding */}
                <h2 className="text-5xl font-extrabold text-pink-800 mb-12 text-center drop-shadow-lg leading-tight">
                    <span className="block text-pink-600">Manajemen</span> Booking <CalendarCheck className="inline-block ml-4 text-pink-500" size={50} />
                </h2>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-8 w-full shadow-md flex items-center justify-center" role="alert">
                        <CheckCircle className="mr-3 h-6 w-6" />
                        <span className="block sm:inline font-semibold">{message}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-8 w-full shadow-md flex items-center justify-center" role="alert">
                        <AlertCircle className="mr-3 h-6 w-6" />
                        <span className="block sm:inline font-semibold">{error}</span>
                    </div>
                )}

                {/* Button to add new booking */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={() => navigate('/add-booking')}
                        className="flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-xl transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                    >
                        <PlusCircle className="mr-3 h-6 w-6" />
                        Tambah Booking Baru
                    </button>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center text-gray-700 p-10 bg-white rounded-xl shadow-lg border border-pink-200 w-full">
                        <Info className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                        <p className="text-2xl font-semibold mb-4">Tidak ada data booking yang ditemukan.</p>
                        <p className="text-lg">Mulai tambahkan booking baru untuk melihat daftar di sini.</p>
                        <img
                            src="https://placehold.co/300x200/FCE7F3/BE185D?text=No+Bookings"
                            alt="No Bookings Placeholder"
                            className="mx-auto mt-6 rounded-lg shadow-md"
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-10 gap-4 p-6 bg-pink-100 font-bold text-pink-700 text-lg border-b border-pink-200">
                            <div className="col-span-1 flex items-center"><Ticket className="mr-2" size={18} />Kode Booking</div>
                            <div className="col-span-1 flex items-center"><User className="mr-2" size={18} />Pasien</div>
                            <div className="col-span-1 flex items-center"><Stethoscope className="mr-2" size={18} />Dokter</div>
                            <div className="col-span-1 flex items-center"><Briefcase className="mr-2" size={18} />Layanan</div>
                            <div className="col-span-1 flex items-center"><Calendar className="mr-2" size={18} />Tanggal</div>
                            <div className="col-span-1 flex items-center"><Clock className="mr-2" size={18} />Jam</div>
                            <div className="col-span-2 flex items-center"><MessageSquare className="mr-2" size={18} />Keluhan</div>
                            <div className="col-span-1 flex items-center"><CheckCircle className="mr-2" size={18} />Status</div>
                            <div className="col-span-1 text-right">Aksi</div>
                        </div>

                        {/* Table Rows */}
                        {bookings.map((booking, index) => (
                            <div
                                key={booking.id}
                                className={`grid grid-cols-10 gap-4 p-6 text-gray-800 border-b border-pink-50
                                    ${index % 2 === 0 ? 'bg-white' : 'bg-pink-50'}
                                    hover:bg-pink-100 transition-colors duration-200 ease-in-out
                                    items-center
                                `}
                            >
                                <div className="col-span-1 font-semibold flex items-center">
                                    {booking.kode_booking}
                                </div>
                                <div className="col-span-1 flex items-center">
                                    {booking.pasien_user?.nama || 'N/A'}
                                </div>
                                <div className="col-span-1 flex items-center">
                                    {booking.dokter?.nama || 'N/A'}
                                </div>
                                <div className="col-span-1 flex items-center">
                                    {booking.layanan?.nama || 'N/A'}
                                </div>
                                <div className="col-span-1 flex items-center text-sm">
                                    {dayjs(booking.tanggal).format('DD MMM YYYY')}
                                </div>
                                <div className="col-span-1 flex items-center text-sm">
                                    {booking.jam?.slice(0, 5)}
                                </div>
                                <div className="col-span-2 flex items-center text-sm truncate max-w-full">
                                    {booking.keluhan || '-'}
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <span className={`px-2 py-0.5 text-white text-xs font-semibold rounded-full ${booking.status === 'Selesai' ? 'bg-green-500' :
                                        booking.status === 'Terjadwal' ? 'bg-blue-500' :
                                            booking.status === 'Batal' ? 'bg-red-500' :
                                                'bg-yellow-500'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div className="col-span-1 flex justify-end space-x-2">
                                    <button
                                        onClick={() => openStatusModal(booking)}
                                        className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors duration-200 transform hover:scale-105"
                                        title="Ubah Status"
                                    >
                                        <RefreshCw size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(booking.id)}
                                        className="flex items-center text-pink-600 hover:text-pink-800 font-semibold text-sm transition-colors duration-200 transform hover:scale-105"
                                        title="Edit Booking"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(booking.id)}
                                        className="flex items-center text-red-600 hover:text-red-800 font-semibold text-sm transition-colors duration-200 transform hover:scale-105"
                                        title="Hapus Booking"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                        <h3 className="text-2xl font-bold text-pink-700 mb-6">Ubah Status Booking</h3>
                        {error && (
                            <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-200 mb-4 flex items-center justify-center">
                                <AlertCircle className="mr-2 h-5 w-5" /> {error}
                            </p>
                        )}
                        <div className="mb-6 text-left relative"> {/* Added relative for dropdown arrow positioning */}
                            <label htmlFor="newStatus" className="block text-gray-700 text-sm font-bold mb-2">Pilih Status Baru:</label>
                            <select
                                id="newStatus"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="pl-4 pr-10 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none" // Added appearance-none to hide default arrow
                            >
                                <option value="Menunggu">Menunggu</option>
                                <option value="Terjadwal">Terjadwal</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Batal">Batal</option>
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                            </div>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleUpdateStatus}
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                {loading ? 'Memperbarui...' : 'Perbarui'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowStatusModal(false);
                                    setError(null); // Clear error when closing modal
                                }}
                                className="flex items-center px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-75"
                            >
                                <XCircle className="mr-2 h-5 w-5" />
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingList;
