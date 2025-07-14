// src/components/HalamanProfil.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import 'dayjs/locale/id';
import { User, Calendar, MessageSquare, LogOut, Edit, CheckCircle, XCircle, Clock } from 'lucide-react'; // Tambahkan ikon

dayjs.locale('id');

// Pastikan Anda menerima setIsLoggedIn dan setUserRole di props
const HalamanProfil = ({ setIsLoggedIn, setUserRole }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [userBookings, setUserBookings] = useState([]);
    const [userFeedback, setUserFeedback] = useState([]);
    const [error, setError] = useState(null);
    const [isInitialFetchComplete, setIsInitialFetchComplete] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setError(null);
            setIsInitialFetchComplete(false);

            try {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.error("User not authenticated or session expired:", userError?.message);
                    if (setIsLoggedIn) setIsLoggedIn(false);
                    if (setUserRole) setUserRole(null);
                    localStorage.clear();
                    navigate("/login", { replace: true });
                    return;
                }

                setUserEmail(user.email);

                // Mengambil data pasien_user menggunakan user.id (yang sekarang adalah id tabel pasien_user)
                const { data: pasienData, error: pasienError } = await supabase
                    .from("pasien_user")
                    .select(
                        "id, nama, no_hp, alamat, tanggal_lahir, jenis_kelamin, membership"
                    )
                    .eq("id", user.id) 
                    .single();

                if (pasienError && pasienError.code !== "PGRST116") { // PGRST116 = No rows found
                    console.error("Gagal mengambil data pasien (HalamanProfil):", pasienError.message);
                    setError(
                        "Gagal memuat data profil. Pastikan struktur tabel pasien_user sudah benar dan ada data untuk user ini."
                    );
                    return;
                }

                if (!pasienData) {
                    setProfile(null);
                } else {
                    setProfile(pasienData);

                    // Ambil data booking berdasarkan pasien_id (yang sekarang sama dengan auth.uid())
                    const { data: bookings, error: bookingsError } = await supabase
                        .from("booking")
                        .select(`
                            id, kode_booking, tanggal, jam, keluhan, status, feedback_submitted,
                            layanan(nama), dokter(nama)
                        `)
                        .eq("pasien_id", user.id) 
                        .order("tanggal", { ascending: false })
                        .order("jam", { ascending: false });

                    if (bookingsError) {
                        console.error("Gagal ambil data booking:", bookingsError.message);
                        setError("Gagal memuat riwayat booking.");
                    } else {
                        setUserBookings(bookings);
                    }

                    // Ambil data feedback berdasarkan pasien_id (yang sekarang sama dengan auth.uid())
                    const { data: feedback, error: feedbackError } = await supabase
                        .from("feedback")
                        .select("id, rating, komentar, created_at")
                        .eq("pasien_id", user.id) 
                        .order("created_at", { ascending: false });

                    if (feedbackError) {
                        console.error("Gagal ambil feedback:", feedbackError.message);
                        setError("Gagal memuat feedback.");
                    } else {
                        setUserFeedback(feedback);
                    }
                }
            } catch (err) {
                console.error("Unexpected error during fetchUserData:", err.message);
                setError("Terjadi kesalahan saat memuat data.");
            } finally {
                setIsInitialFetchComplete(true);
            }
        };

        fetchUserData();
    }, [navigate, setIsLoggedIn, setUserRole]); 

    const handleProvideFeedback = (bookingId) => {
        navigate(`/feedback/${bookingId}`);
    };

    const handleViewBookingDetail = (bookingId) => {
        alert(`Melihat detail booking dengan ID: ${bookingId}. Fitur detail lebih lanjut akan datang.`);
    };

    // Fungsi untuk Logout
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
            alert('Gagal logout: ' + error.message);
        } else {
            if (setIsLoggedIn) setIsLoggedIn(false);
            if (setUserRole) setUserRole(null);
            localStorage.clear(); 
            navigate('/login', { replace: true }); 
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.532 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.777.565-1.832-.197-1.532-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
            );
        }
        return <div className="flex items-center">{stars}</div>;
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-700 mb-4">Terjadi Kesalahan!</h3>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button onClick={() => navigate('/')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md">
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );
    }

    if (!isInitialFetchComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mb-4"></div>
                    <div className="text-pink-600 text-lg font-semibold">
                        Memuat data profil...
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-pink-200 max-w-md">
                    <User className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-pink-700 mb-4">Profil Belum Lengkap</h3>
                    <p className="text-gray-700 mb-6">
                        Data profil pasien tidak ditemukan. Ini kemungkinan karena data profil belum tersimpan di database setelah pendaftaran.
                        Silakan hubungi administrator klinik untuk bantuan atau lengkapi profil Anda.
                    </p>
                    <button
                        onClick={() => alert("Fitur lengkapi profil akan datang.")} 
                        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md mr-4"
                    >
                        Lengkapi Profil
                    </button>
                    <button
                        onClick={handleLogout} 
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md"
                    >
                        Keluar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-24 px-4 sm:px-6 lg:px-8"> {/* Increased py-16 to py-24 */}
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-pink-100"> {/* Increased max-w-5xl to max-w-6xl */}
                <h2 className="text-4xl font-extrabold text-pink-800 mb-10 text-center relative pb-4">
                    Profil Pasien
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-24 h-1.5 bg-rose-500 rounded-full"></span>
                </h2>

                {/* Informasi Pribadi */}
                <div className="mb-12 p-6 md:p-8 border border-pink-200 rounded-2xl bg-pink-50 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-2xl font-bold text-pink-700 mb-6 flex items-center">
                        <User className="w-7 h-7 mr-3 text-pink-600" /> Informasi Pribadi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700">
                        <p><strong>Nama Lengkap:</strong> <span className="font-medium text-gray-800">{profile.nama}</span></p>
                        <p><strong>Email:</strong> <span className="font-medium text-gray-800">{userEmail}</span></p>
                        <p><strong>No. HP:</strong> <span className="font-medium text-gray-800">{profile.no_hp}</span></p>
                        <p><strong>Alamat:</strong> <span className="font-medium text-gray-800">{profile.alamat}</span></p>
                        <p>
                            <strong>Tanggal Lahir:</strong>{" "}
                            <span className="font-medium text-gray-800">
                                {profile.tanggal_lahir
                                    ? dayjs(profile.tanggal_lahir).format("DD MMMM YYYY")
                                    : "-"}
                            </span>
                        </p>
                        <p><strong>Jenis Kelamin:</strong> <span className="font-medium text-gray-800">{profile.jenis_kelamin}</span></p>
                        <p><strong>Membership:</strong> <span className="font-medium text-pink-600">{profile.membership}</span></p>
                    </div>
                    <button
                        onClick={() => alert("Fitur edit profil belum tersedia. Anda bisa mengembangkan ini nanti.")}
                        className="mt-8 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-full text-base shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                        <Edit className="inline-block w-5 h-5 mr-2" /> Edit Profil
                    </button>
                </div>

                {/* Riwayat Booking Anda */}
                <div className="mb-12 p-6 md:p-8 border border-pink-200 rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-2xl font-bold text-pink-700 mb-6 flex items-center">
                        <Calendar className="w-7 h-7 mr-3 text-pink-600" /> Riwayat Booking Anda
                    </h3>
                    {userBookings.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-pink-100">
                            <table className="min-w-full divide-y divide-pink-200">
                                <thead className="bg-pink-100">
                                    <tr>
                                        {[
                                            "Kode Booking", "Layanan", "Dokter", "Tanggal", "Jam", "Status", "Aksi",
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="px-4 py-3 text-left text-sm font-semibold text-pink-700 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-pink-100">
                                    {userBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-pink-50 transition-colors duration-150">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {booking.kode_booking}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {booking.layanan?.nama || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {booking.dokter?.nama || "N/A"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {dayjs(booking.tanggal).format("DD MMMM YYYY")}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                {booking.jam?.slice(0, 5)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                <span
                                                    className={`px-2.5 py-1 text-white text-xs font-semibold rounded-full inline-flex items-center ${
                                                        booking.status === "Selesai" ? "bg-green-500" :
                                                        booking.status === "Terjadwal" ? "bg-blue-500" :
                                                        booking.status === "Batal" ? "bg-red-500" : "bg-yellow-500"
                                                    }`}
                                                >
                                                    {booking.status === "Selesai" && <CheckCircle className="w-3 h-3 mr-1" />}
                                                    {booking.status === "Terjadwal" && <Clock className="w-3 h-3 mr-1" />}
                                                    {booking.status === "Batal" && <XCircle className="w-3 h-3 mr-1" />}
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                {booking.status === "Selesai" &&
                                                !booking.feedback_submitted ? (
                                                    <button
                                                        onClick={() => handleProvideFeedback(booking.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                                    >
                                                        Beri Feedback
                                                    </button>
                                                ) : booking.feedback_submitted ? (
                                                    <span className="text-green-600 font-semibold text-xs">
                                                        Feedback Diberikan
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleViewBookingDetail(booking.id)}
                                                        className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                                                    >
                                                        Detail
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 italic text-lg">Anda belum memiliki booking.</p>
                    )}
                </div>

                {/* Feedback Anda */}
                <div className="p-6 md:p-8 border border-pink-200 rounded-2xl bg-pink-50 shadow-lg transition-all duration-300 hover:shadow-xl">
                    <h3 className="text-2xl font-bold text-pink-700 mb-6 flex items-center">
                        <MessageSquare className="w-7 h-7 mr-3 text-pink-600" /> Feedback Anda
                    </h3>
                    {userFeedback.length > 0 ? (
                        <ul className="space-y-6">
                            {userFeedback.map((feedbackItem) => (
                                <li
                                    key={feedbackItem.id}
                                    className="p-5 border border-pink-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex items-center mb-2">
                                        <strong className="text-gray-800 mr-2">Rating:</strong> {renderStars(feedbackItem.rating)}
                                    </div>
                                    <p className="text-gray-700 mb-2 leading-relaxed">
                                        <strong className="text-gray-800">Komentar:</strong> "{feedbackItem.komentar}"
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Tanggal:{" "}
                                        {dayjs(feedbackItem.created_at).format("DD MMMM YYYY HH:mm")}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 italic text-lg">Anda belum memberikan feedback.</p>
                    )}
                </div>

                {/* Tombol Logout */}
                <div className="mt-12 text-center">
                    <button
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3.5 px-8 rounded-full transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center mx-auto"
                    >
                        <LogOut className="w-5 h-5 mr-2" /> Keluar dari Akun
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HalamanProfil;
