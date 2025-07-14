// src/components/FormBooking.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/id'; // Import locale Indonesia untuk nama hari
import { Calendar, MessageSquare, PlusCircle, User, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'; // Import ikon baru

dayjs.locale('id'); // Set locale ke Indonesia

const FormBooking = () => {
    const [pasienId, setPasienId] = useState(null);
    const [layanans, setLayanans] = useState([]);
    const [selectedLayanan, setSelectedLayanan] = useState('');
    const [tanggalBooking, setTanggalBooking] = useState('');
    const [keluhan, setKeluhan] = useState('');
    const [availableSchedules, setAvailableSchedules] = useState([]); // Jadwal yang tersedia untuk tanggal yang dipilih
    const [autoSelectedDokterId, setAutoSelectedDokterId] = useState(null);
    const [autoSelectedDokterNama, setAutoSelectedDokterNama] = useState('');
    const [autoSelectedJam, setAutoSelectedJam] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    // Efek untuk mengambil data awal (layanan dan ID pasien)
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) {
                    throw new Error('Pengguna tidak terautentikasi. Harap login kembali.');
                }
                setPasienId(user.id);

                // Ambil daftar layanan
                const { data: layananData, error: layananError } = await supabase
                    .from('layanan')
                    .select('id, nama');
                if (layananError) throw layananError;
                setLayanans(layananData);

            } catch (err) {
                console.error('Error fetching initial data for booking:', err.message);
                setError('Gagal memuat data awal: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Efek untuk mengambil jadwal dokter dan memilih dokter/jam secara otomatis
    useEffect(() => {
        const fetchSchedulesAndAutoSelect = async () => {
            // Reset pilihan otomatis jika tanggal atau layanan belum dipilih
            if (!tanggalBooking || !selectedLayanan) {
                setAutoSelectedDokterId(null);
                setAutoSelectedDokterNama('');
                setAutoSelectedJam('');
                setAvailableSchedules([]);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const dayOfWeek = dayjs(tanggalBooking).format('dddd'); // Mendapatkan nama hari (e.g., "Senin", "Selasa")

                // Ambil jadwal dokter untuk hari yang dipilih
                const { data: schedules, error: scheduleError } = await supabase
                    .from('jadwal_dokter')
                    .select(`
                        id,
                        hari,
                        jam_mulai,
                        jam_selesai,
                        dokter_id,
                        dokter (nama)
                    `)
                    .eq('hari', dayOfWeek); // Filter berdasarkan hari yang dipilih

                if (scheduleError) throw scheduleError;

                // Urutkan jadwal berdasarkan jam mulai untuk mendapatkan yang paling awal
                schedules.sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));

                const now = dayjs();
                const today = dayjs(tanggalBooking).startOf('day'); // Awal hari dari tanggal booking

                // Cari slot jadwal yang tersedia dan masih di masa depan
                const availableSlot = schedules.find(schedule => {
                    const [hour, minute, second] = schedule.jam_mulai.split(':').map(Number);
                    const slotDateTime = today.hour(hour).minute(minute).second(second);
                    
                    // Jika tanggal booking adalah hari ini, pastikan jamnya di masa depan
                    if (dayjs(tanggalBooking).isSame(now, 'day')) {
                        return slotDateTime.isAfter(now);
                    }
                    // Jika tanggal booking di masa depan, semua jam di hari itu valid
                    return true;
                });

                if (availableSlot) {
                    setAutoSelectedDokterId(availableSlot.dokter_id);
                    setAutoSelectedDokterNama(availableSlot.dokter.nama);
                    setAutoSelectedJam(availableSlot.jam_mulai.substring(0, 5)); // Format HH:MM
                    setAvailableSchedules(schedules); // Simpan semua jadwal yang tersedia untuk tanggal ini
                } else {
                    setError('Tidak ada jadwal dokter yang tersedia untuk tanggal dan layanan ini. Silakan pilih tanggal lain.');
                    setAutoSelectedDokterId(null);
                    setAutoSelectedDokterNama('');
                    setAutoSelectedJam('');
                    setAvailableSchedules([]);
                }

            } catch (err) {
                console.error('Error fetching schedules:', err.message);
                setError('Gagal memuat jadwal dokter: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedulesAndAutoSelect();
    }, [tanggalBooking, selectedLayanan]); // Efek ini bergantung pada perubahan tanggal dan layanan

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        // Validasi input
        if (!pasienId) {
            setError('Pasien ID tidak ditemukan. Harap login kembali.');
            setLoading(false);
            return;
        }
        if (!selectedLayanan || !tanggalBooking || !keluhan || !autoSelectedDokterId || !autoSelectedJam) {
            setError('Harap lengkapi semua bidang yang diperlukan (Layanan, Tanggal, Keluhan). Dokter dan Jam akan otomatis terisi.');
            setLoading(false);
            return;
        }

        try {
            // Insert data booking ke tabel 'booking'
            const { data, error: insertError } = await supabase
                .from('booking')
                .insert({
                    pasien_id: pasienId,
                    dokter_id: autoSelectedDokterId, // Gunakan dokter yang otomatis terpilih
                    layanan_id: selectedLayanan,
                    tanggal: tanggalBooking,
                    jam: autoSelectedJam, // Gunakan jam yang otomatis terpilih
                    keluhan,
                    status: 'Menunggu', // Status awal booking
                    feedback_submitted: false, // Inisialisasi feedback_submitted
                })
                .select('id'); // Minta ID dari booking yang baru dibuat

            if (insertError) {
                throw insertError;
            }

            const newBookingId = data[0].id; // Ambil ID booking yang baru

            setMessage('Booking berhasil dibuat! Anda akan diarahkan ke halaman feedback.');
            // Reset form
            setSelectedLayanan('');
            setTanggalBooking('');
            setKeluhan('');
            setAutoSelectedDokterId(null);
            setAutoSelectedDokterNama('');
            setAutoSelectedJam('');
            setAvailableSchedules([]);

            // Redirect ke halaman feedback dengan ID booking yang baru
            setTimeout(() => {
                navigate(`/feedback/${newBookingId}`);
            }, 2000);

        } catch (err) {
            console.error('Error creating booking:', err.message);
            setError(err.message || 'Terjadi kesalahan saat membuat booking.');
        } finally {
            setLoading(false);
        }
    };

    // Tampilkan pesan loading jika data awal belum dimuat
    if (loading && !layanans.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin w-16 h-16 text-pink-500 mb-4" />
                    <div className="text-pink-600 text-lg font-semibold">
                        Memuat data layanan...
                    </div>
                </div>
            </div>
        );
    }

    if (error && !loading) { // Tampilkan error card jika ada error dan tidak sedang loading
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-700 mb-4">Terjadi Kesalahan!</h3>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button onClick={() => navigate('/profil-pasien')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md">
                        Kembali ke Profil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 py-24 bg-cover bg-center relative" // Menambah py-24 untuk mendorong ke bawah
            style={{
                backgroundImage: `url('/bg1.jpg')` // Path ke gambar di folder public
            }}
        >
            {/* Overlay untuk efek blur pada latar belakang dan warna pink transparan */}
            <div
                className="absolute inset-0"
                style={{
                    backdropFilter: 'blur(10px)', // Sesuaikan nilai blur sesuai keinginan
                    WebkitBackdropFilter: 'blur(10px)', // Untuk kompatibilitas browser
                    backgroundColor: 'rgba(255, 192, 203, 0.3)' // Overlay pink transparan (pink muda dengan opasitas 0.3)
                }}
            ></div>

            <div className="bg-white/70 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-pink-100 transform transition-all duration-300 hover:scale-[1.01] z-10">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-pink-700 mb-2">Buat Janji Booking</h2>
                    <p className="text-gray-600 text-lg">Pilih layanan, tanggal, dan keluhan Anda.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Pilih Layanan */}
                    <div>
                        <label htmlFor="layanan" className="block text-gray-700 text-lg font-semibold mb-2">Pilih Layanan</label>
                        <div className="relative">
                            <PlusCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                            <select
                                id="layanan"
                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                                value={selectedLayanan}
                                onChange={(e) => setSelectedLayanan(e.target.value)}
                                required
                            >
                                <option value="">-- Pilih Layanan --</option>
                                {layanans.map(layanan => (
                                    <option key={layanan.id} value={layanan.id}>{layanan.nama}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Tanggal Booking */}
                    <div>
                        <label htmlFor="tanggal" className="block text-gray-700 text-lg font-semibold mb-2">Tanggal Booking</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                            <input
                                type="date"
                                id="tanggal"
                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                value={tanggalBooking}
                                onChange={(e) => setTanggalBooking(e.target.value)}
                                min={dayjs().format('YYYY-MM-DD')} // Hanya izinkan tanggal hari ini atau setelahnya
                                required
                            />
                        </div>
                    </div>

                    {/* Tampilkan Dokter dan Jam yang Otomatis Terpilih (Read-only) */}
                    {(tanggalBooking && selectedLayanan) && (
                        <div className="mb-4 p-4 bg-pink-50 rounded-lg border border-pink-200 shadow-sm">
                            {loading ? (
                                <p className="text-pink-600 text-center flex items-center justify-center">
                                    <Loader2 className="animate-spin w-5 h-5 mr-2" /> Mencari jadwal...
                                </p>
                            ) : autoSelectedDokterNama && autoSelectedJam ? (
                                <>
                                    <p className="text-gray-700 text-base font-bold mb-1 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-pink-600" /> Dokter Terpilih: <span className="ml-2 text-lg font-semibold text-pink-700">{autoSelectedDokterNama}</span>
                                    </p>
                                    <p className="text-gray-700 text-base font-bold mt-2 mb-1 flex items-center">
                                        <Clock className="w-5 h-5 mr-2 text-pink-600" /> Jam Terpilih: <span className="ml-2 text-lg font-semibold text-pink-700">{autoSelectedJam} WIB</span>
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        (Dokter dan jam otomatis dipilih berdasarkan ketersediaan jadwal.)
                                    </p>
                                </>
                            ) : (
                                <p className="text-orange-600 text-center flex items-center justify-center">
                                    <XCircle className="w-5 h-5 mr-2" /> Tidak ada jadwal dokter yang tersedia untuk tanggal ini.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Keluhan */}
                    <div>
                        <label htmlFor="keluhan" className="block text-gray-700 text-lg font-semibold mb-2">Keluhan</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 text-pink-400" size={20} />
                            <textarea
                                id="keluhan"
                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 resize-y"
                                value={keluhan}
                                onChange={(e) => setKeluhan(e.target.value)}
                                rows="4"
                                placeholder="Jelaskan keluhan Anda..."
                                required
                            ></textarea>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-200">
                            {error}
                        </p>
                    )}
                    {message && (
                        <p className="text-green-500 text-sm text-center bg-green-100 p-3 rounded-lg border border-green-200">
                            {message}
                        </p>
                    )}

                    <div className="flex items-center justify-center pt-4">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                            disabled={loading || !autoSelectedDokterId} // Disable jika loading atau dokter belum terpilih otomatis
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-3 text-white" />
                                    Membuat Janji...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" /> Buat Janji
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormBooking;
