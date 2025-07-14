import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(weekday);
dayjs.extend(isSameOrAfter);

// Import icons from lucide-react
import {
    User, Tooth, Stethoscope, Calendar, Clock, MessageSquare, CheckCircle, AlertCircle,
    Save, XCircle, Loader2, CalendarPlus
} from 'lucide-react';

const BookingForm = ({ editingBooking, setEditingBooking, onFormSubmitSuccess }) => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        pasien_id: '',
        dokter_id: '',
        layanan_id: '',
        tanggal: '',
        jam: '',
        keluhan: '',
        status: 'Menunggu',
        kode_booking: '', // Will be generated on new booking
        feedback_submitted: false,
    });

    const [pasienList, setPasienList] = useState([]);
    const [dokterList, setDokterList] = useState([]);
    const [layananList, setLayananList] = useState([]);
    const [availableJams, setAvailableJams] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null); // For success messages

    const isEditMode = Boolean(editingBooking && editingBooking.id);

    useEffect(() => {
        if (editingBooking) {
            setForm({
                ...editingBooking,
                tanggal: dayjs(editingBooking.tanggal).format('YYYY-MM-DD'),
            });
        } else {
            setForm({
                pasien_id: '',
                dokter_id: '',
                layanan_id: '',
                tanggal: '',
                jam: '',
                keluhan: '',
                status: 'Menunggu',
                kode_booking: '',
                feedback_submitted: false,
            });
            setError(null);
            setMessage(null);
        }
    }, [editingBooking]);

    useEffect(() => {
        const fetchMasterData = async () => {
            setError(null);
            try {
                const { data: pasienData, error: pasienError } = await supabase
                    .from("pasien_user")
                    .select("id, nama")
                    .order('nama', { ascending: true });
                if (pasienError) throw pasienError;
                setPasienList(pasienData);

                const { data: dokterData, error: dokterError } = await supabase
                    .from("dokter")
                    .select("id, nama")
                    .order('nama', { ascending: true });
                if (dokterError) throw dokterError;
                setDokterList(dokterData);

                const { data: layananData, error: layananError } = await supabase
                    .from("layanan")
                    .select("id, nama")
                    .order('nama', { ascending: true });
                if (layananError) throw layananError;
                setLayananList(layananData);
            } catch (err) {
                console.error("Gagal memuat data master:", err.message);
                setError("Gagal memuat data master: " + err.message);
            }
        };
        fetchMasterData();
    }, []);

    const getHariIndo = (tanggal) => {
        const hariInggris = dayjs(tanggal).format("dddd");
        const mapHari = {
            Sunday: "Minggu",
            Monday: "Senin",
            Tuesday: "Selasa",
            Wednesday: "Rabu",
            Thursday: "Kamis",
            Friday: "Jumat",
            Saturday: "Sabtu",
        };
        return mapHari[hariInggris];
    };

    const cariSlotJamTersedia = useCallback(async () => {
        const { dokter_id, tanggal } = form;
        if (!dokter_id || !tanggal) {
            setAvailableJams([]);
            // Clear jam if dokter or tanggal changes and we are not in edit mode
            // or if we are in edit mode but the date has changed from original editingBooking.tanggal
            if (form.jam && (!isEditMode || (isEditMode && dayjs(tanggal).format("YYYY-MM-DD") !== dayjs(editingBooking?.tanggal).format("YYYY-MM-DD")))) {
                setForm(prevForm => ({ ...prevForm, jam: "" }));
            }
            return;
        }

        const hari = getHariIndo(tanggal);
        const today = dayjs();
        const selectedDate = dayjs(tanggal);
        const isToday = selectedDate.isSame(today, "day");

        const { data: jadwalDokter, error: errJadwal } = await supabase
            .from("jadwal_dokter")
            .select("jam_mulai, jam_selesai")
            .eq("dokter_id", dokter_id)
            .eq("hari", hari)
            .single();

        if (errJadwal || !jadwalDokter) {
            console.warn(
                "Tidak ada jadwal untuk dokter ini pada hari yang dipilih atau error:",
                errJadwal?.message
            );
            setAvailableJams([]);
            if (form.jam && (!isEditMode || (isEditMode && dayjs(tanggal).format("YYYY-MM-DD") !== dayjs(editingBooking?.tanggal).format("YYYY-MM-DD")))) {
                setForm(prevForm => ({ ...prevForm, jam: "" }));
            }
            return;
        }

        // Fetch existing bookings, excluding the current booking if in edit mode
        const { data: existingBookings, error: errBookings } = await supabase
            .from("booking")
            .select("jam")
            .eq("dokter_id", dokter_id)
            .eq("tanggal", tanggal)
            .not('status', 'eq', 'Batal') // Exclude cancelled bookings
            .not('id', 'eq', editingBooking?.id || null); // Exclude the current booking being edited

        if (errBookings) {
            console.error("Error fetching existing bookings:", errBookings.message);
            setAvailableJams([]);
            return;
        }

        const bookedJams = new Set(existingBookings.map((b) => b.jam));
        const newAvailableJams = [];

        const start = dayjs(`${tanggal} ${jadwalDokter.jam_mulai}`);
        const end = dayjs(`${tanggal} ${jadwalDokter.jam_selesai}`);

        for (let jam = start; jam.isBefore(end); jam = jam.add(30, "minute")) {
            const jamStr = jam.format("HH:mm");

            // If it's today, only include future slots (at least 30 minutes from now)
            if (isToday && jam.isBefore(today.add(30, 'minute'))) {
                continue;
            }

            if (!bookedJams.has(jamStr)) {
                newAvailableJams.push(jamStr);
            }
        }
        setAvailableJams(newAvailableJams);
    }, [form.dokter_id, form.tanggal, form.jam, editingBooking, isEditMode]);

    useEffect(() => {
        cariSlotJamTersedia();
    }, [cariSlotJamTersedia]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));

        // Reset jam when dokter or tanggal changes, unless it's the current editing jam
        if ((name === "dokter_id" || name === "tanggal") && form.jam !== "") {
            // Only clear jam if the new selection makes the current jam unavailable
            // or if it's not the original jam in edit mode
            if (!isEditMode || (isEditMode && value !== (editingBooking?.[name] || '') && !availableJams.includes(form.jam))) {
                setForm((prevForm) => ({ ...prevForm, jam: "" }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        if (
            !form.pasien_id ||
            !form.dokter_id ||
            !form.layanan_id ||
            !form.tanggal ||
            !form.jam ||
            !form.keluhan ||
            !form.status
        ) {
            setError("Semua field harus diisi.");
            setIsSubmitting(false);
            return;
        }

        const selectedJamIsAvailable = availableJams.includes(form.jam);
        const selectedJamIsOriginalAndInEditMode = isEditMode && form.jam === editingBooking.jam;

        // If not in edit mode, or if in edit mode and the selected jam is neither newly available nor the original jam, then it's invalid
        if (!selectedJamIsAvailable && !selectedJamIsOriginalAndInEditMode) {
            setError("Jam yang dipilih tidak tersedia atau sudah diambil oleh booking lain. Silakan pilih jam lain.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (isEditMode) {
                const { id, ...updateData } = form; // Destructure to exclude 'id' from update data directly if 'id' is not part of table columns
                const { error: updateError } = await supabase
                    .from("booking")
                    .update(updateData)
                    .eq("id", editingBooking.id);

                if (updateError) {
                    throw updateError;
                }
                setMessage("Booking berhasil diperbarui!");
            } else {
                const kode_booking = `BK-${Date.now()}`;
                const { error: insertError } = await supabase.from("booking").insert([
                    {
                        ...form,
                        kode_booking,
                        feedback_submitted: false,
                    },
                ]);

                if (insertError) {
                    throw insertError;
                }
                setMessage("Booking berhasil ditambahkan!");
            }
            onFormSubmitSuccess(); // Call callback to refresh list and hide form
        } catch (err) {
            console.error("Gagal menyimpan booking:", err.message);
            setError("Gagal menyimpan booking: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setEditingBooking(null); // This will clear editingBooking and hide the form
        // If this form is used in a separate route, you might navigate back:
        // navigate('/bookinglist');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
            <div className="py-8 pl-56 pr-8 w-full"> {/* Consistent padding for the main content area */}
                <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-pink-100 transform transition-all duration-300 hover:scale-[1.01]">
                    <h2 className="text-3xl font-bold text-pink-700 mb-8 text-center">
                        {isEditMode ? '✏️ Edit Booking' : '➕ Tambah Booking Baru'}
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
                        {/* Pasien */}
                        <div>
                            <label htmlFor="pasien_id" className="block text-gray-700 text-sm font-bold mb-2">Pasien</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                <select
                                    id="pasien_id"
                                    name="pasien_id"
                                    value={form.pasien_id}
                                    onChange={handleChange}
                                    required
                                    disabled={pasienList.length === 0 || isEditMode} 
                                    className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                                >
                                    <option value="">{pasienList.length === 0 ? "Memuat Pasien..." : "Pilih Pasien"}</option>
                                    {pasienList.map((pasien) => (
                                        <option key={pasien.id} value={pasien.id}>
                                            {pasien.nama}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                                </div>
                            </div>
                        </div>

                        {/* Layanan */}
                        <div>
                            <label htmlFor="layanan_id" className="block text-gray-700 text-sm font-bold mb-2">Layanan</label>
                            <div className="relative">
                                <Tooth className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                <select
                                    id="layanan_id"
                                    name="layanan_id"
                                    value={form.layanan_id}
                                    onChange={handleChange}
                                    required
                                    disabled={layananList.length === 0}
                                    className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                                >
                                    <option value="">{layananList.length === 0 ? "Memuat Layanan..." : "Pilih Layanan"}</option>
                                    {layananList.map((layanan) => (
                                        <option key={layanan.id} value={layanan.id}>
                                            {layanan.nama}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                                </div>
                            </div>
                        </div>

                        {/* Dokter */}
                        <div>
                            <label htmlFor="dokter_id" className="block text-gray-700 text-sm font-bold mb-2">Dokter</label>
                            <div className="relative">
                                <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                <select
                                    id="dokter_id"
                                    name="dokter_id"
                                    value={form.dokter_id}
                                    onChange={handleChange}
                                    required
                                    disabled={dokterList.length === 0}
                                    className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                                >
                                    <option value="">{dokterList.length === 0 ? "Memuat Dokter..." : "Pilih Dokter"}</option>
                                    {dokterList.map((dokter) => (
                                        <option key={dokter.id} value={dokter.id}>
                                            {dokter.nama}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                                </div>
                            </div>
                        </div>

                        {/* Tanggal */}
                        <div>
                            <label htmlFor="tanggal" className="block text-gray-700 text-sm font-bold mb-2">Tanggal</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                <input
                                    type="date"
                                    id="tanggal"
                                    name="tanggal"
                                    value={form.tanggal}
                                    onChange={handleChange}
                                    required
                                    min={dayjs().format("YYYY-MM-DD")}
                                    className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Jam */}
                        <div>
                            <label htmlFor="jam" className="block text-gray-700 text-sm font-bold mb-2">Jam</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                <select
                                    id="jam"
                                    name="jam"
                                    value={form.jam}
                                    onChange={handleChange}
                                    required
                                    disabled={!form.dokter_id || !form.tanggal || availableJams.length === 0}
                                    className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                                >
                                    <option value="">Pilih Jam</option>
                                    {availableJams.length > 0 ? (
                                        availableJams.map((jam) => (
                                            <option key={jam} value={jam}>
                                                {jam}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>
                                            {!form.dokter_id || !form.tanggal
                                                ? "Pilih Dokter & Tanggal dulu"
                                                : "Tidak ada jam tersedia"}
                                        </option>
                                    )}
                                    {/* Display current editing jam if it's not in the available list (e.g., already booked by another person) but it's the one being edited */}
                                    {isEditMode && editingBooking?.jam && form.jam === editingBooking.jam && !availableJams.includes(form.jam) && (
                                        <option value={form.jam} key="current-edit-jam">{form.jam} (Jam Saat Ini)</option>
                                    )}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                                </div>
                            </div>
                            {!form.dokter_id || !form.tanggal ? (
                                <p className="mt-2 text-sm text-gray-500">Pilih dokter dan tanggal untuk melihat jam tersedia.</p>
                            ) : availableJams.length === 0 && !isEditMode && (
                                <p className="mt-2 text-sm text-red-600">Tidak ada slot jam tersedia untuk dokter dan tanggal ini.</p>
                            )}
                        </div>

                        {/* Keluhan */}
                        <div>
                            <label htmlFor="keluhan" className="block text-gray-700 text-sm font-bold mb-2">Keluhan</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-3 text-pink-400" size={20} />
                                <textarea
                                    id="keluhan"
                                    name="keluhan"
                                    value={form.keluhan}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 resize-y"
                                />
                            </div>
                        </div>

                        {/* Status Booking (only visible in edit mode) */}
                        {isEditMode && (
                            <div>
                                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status Booking</label>
                                <div className="relative">
                                    <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                    <select
                                        id="status"
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                                    >
                                        <option value="Menunggu">Menunggu</option>
                                        <option value="Terjadwal">Terjadwal</option>
                                        <option value="Selesai">Selesai</option>
                                        <option value="Batal">Batal</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-center space-x-4 mt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                            >
                                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                {isSubmitting ? 'Menyimpan...' : (isEditMode ? 'Perbarui Booking' : 'Tambah Booking')}
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
};

export default BookingForm;
