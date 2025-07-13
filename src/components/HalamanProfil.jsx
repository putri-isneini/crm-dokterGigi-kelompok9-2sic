import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const HalamanProfil = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [userFeedback, setUserFeedback] = useState([]);
  const [error, setError] = useState(null);
  const [isInitialFetchComplete, setIsInitialFetchComplete] = useState(false); // State untuk menandakan fetch awal selesai

  useEffect(() => {
    const fetchUserData = async () => {
      setError(null); // Reset error
      setIsInitialFetchComplete(false); // Set false di awal fetch

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("HalamanProfil: User not logged in or session invalid.", userError?.message);
          navigate("/login", { replace: true });
          return;
        }
        console.log("HalamanProfil: User authenticated, fetching profile data for user ID:", user.id);

        // Fetch pasien_id dan data profil
        // ====================================================================================================
        // PENTING: Nama kolom 'nama_lengkap' diubah menjadi 'nama' agar sesuai dengan skema database Anda.
        // Berdasarkan gambar skema database yang Anda berikan, nama kolomnya adalah 'nama'.
        // ====================================================================================================
        const { data: pasienData, error: pasienError } = await supabase
          .from('pasien_user')
          .select('id, nama, no_hp, alamat, tanggal_lahir, jenis_kelamin, supabase_auth_id') // Mengubah 'nama_lengkap' menjadi 'nama'
          .eq('supabase_auth_id', user.id)
          .single();

        if (pasienError && pasienError.code !== 'PGRST116') { // PGRST116 berarti "tidak ada baris ditemukan"
          console.error("HalamanProfil: Error fetching pasien profile (not PGRST116):", pasienError.message);
          setError("Gagal memuat data profil: " + pasienError.message + ". Mohon periksa skema tabel 'pasien_user' Anda di Supabase.");
          setProfile(null); // Pastikan profile null jika ada error query
          return; // Hentikan eksekusi jika ada error lain selain data tidak ditemukan
        }
        
        if (!pasienData) { // Jika pasienData null (baik karena PGRST116 atau memang null)
            console.warn("HalamanProfil: Pasien profile data not found for user ID:", user.id);
            setProfile(null); // Pastikan profile null jika data tidak ditemukan
            // Tidak ada navigasi otomatis ke /profil-pasien-lengkap di sini.
            // Pesan "Profil Belum Lengkap" akan ditampilkan di bawah.
        } else {
            setProfile(pasienData);
            console.log("HalamanProfil: Pasien profile fetched:", pasienData);

            // Fetch user's bookings (hanya jika profile ditemukan)
            const { data: bookings, error: bookingsError } = await supabase
              .from('booking')
              .select(`
                id,
                kode_booking,
                tanggal,
                jam,
                keluhan,
                status,
                layanan(nama),
                dokter(nama)
              `)
              .eq('pasien_id', pasienData.id)
              .order('tanggal', { ascending: false });

            if (bookingsError) {
                console.error("HalamanProfil: Error fetching user bookings:", bookingsError.message);
                setError("Gagal memuat riwayat booking: " + bookingsError.message);
            } else {
                setUserBookings(bookings);
                console.log("HalamanProfil: User bookings fetched:", bookings);
            }

            // Fetch user's feedback (hanya jika profile ditemukan)
            const { data: feedback, error: feedbackError } = await supabase
              .from('feedback')
              .select('id, rating, komentar, created_at')
              .eq('pasien_id', pasienData.id)
              .order('created_at', { ascending: false });

            if (feedbackError) {
                console.error("HalamanProfil: Error fetching user feedback:", feedbackError.message);
                setError("Gagal memuat feedback Anda: " + feedbackError.message);
            } else {
                setUserFeedback(feedback);
                console.log("HalamanProfil: User feedback fetched:", feedback);
            }
        }

      } catch (err) {
        console.error("HalamanProfil: Unexpected error during data fetch:", err.message);
        setError("Gagal memuat data profil: " + err.message);
      } finally {
        setIsInitialFetchComplete(true); // Set true setelah semua upaya fetch selesai
        console.log("HalamanProfil: Initial fetch complete.");
      }
    };

    fetchUserData();
  }, [navigate]); // Tambahkan navigate ke dependency array

  // Tampilkan error jika ada
  if (error) {
    return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
  }

  // Jika fetch awal belum selesai, jangan tampilkan apa-apa (menghilangkan pesan "Memuat...")
  if (!isInitialFetchComplete) {
    console.log("HalamanProfil: Initial fetch not complete, returning null.");
    return null;
  }

  // Jika fetch awal sudah selesai tapi profile masih null (data pasien tidak ditemukan)
  if (!profile) {
    return (
      <div className="text-center mt-20 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-pink-600 mb-4">Profil Belum Lengkap</h3>
        <p className="text-gray-700 mb-6">
          Data profil pasien Anda tidak ditemukan. Silakan lengkapi informasi Anda untuk melanjutkan.
        </p>
        <button
          onClick={() => { alert("Fitur lengkapi profil belum tersedia. Mohon hubungi admin untuk melengkapi profil Anda."); }}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Lengkapi Profil Sekarang
        </button>
      </div>
    );
  }

  // Jika profile sudah ada, tampilkan konten profil
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-pink-700 mb-6">Profil Pasien</h2>
      {/* Tampilkan detail profil */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-pink-600 mb-4">Informasi Pribadi</h3>
        <p><strong>Nama Lengkap:</strong> {profile.nama}</p> {/* Mengubah 'nama_lengkap' menjadi 'nama' */}
        <p><strong>No. HP:</strong> {profile.no_hp}</p>
        <p><strong>Alamat:</strong> {profile.alamat}</p>
        <p><strong>Tanggal Lahir:</strong> {profile.tanggal_lahir}</p>
        <p><strong>Jenis Kelamin:</strong> {profile.jenis_kelamin}</p>
      </div>

      {/* Tampilkan riwayat booking pengguna */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-pink-600 mb-4">Riwayat Booking Anda</h3>
        {userBookings.length > 0 ? (
          <ul className="space-y-4">
            {userBookings.map(booking => (
              <li key={booking.id} className="p-4 border rounded-lg bg-pink-50">
                <p><strong>Kode Booking:</strong> {booking.kode_booking}</p>
                <p><strong>Layanan:</strong> {booking.layanan?.nama || 'N/A'}</p>
                <p><strong>Dokter:</strong> {booking.dokter?.nama || 'N/A'}</p>
                <p><strong>Tanggal:</strong> {booking.tanggal}</p>
                <p><strong>Jam:</strong> {booking.jam}</p>
                <p><strong>Keluhan:</strong> {booking.keluhan}</p>
                <p><strong>Status:</strong> {booking.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Anda belum memiliki riwayat booking.</p>
        )}
      </div>

      {/* Tampilkan feedback pengguna */}
      <div>
        <h3 className="text-xl font-semibold text-pink-600 mb-4">Feedback Anda</h3>
        {userFeedback.length > 0 ? (
          <ul className="space-y-4">
            {userFeedback.map(feedbackItem => (
              <li key={feedbackItem.id} className="p-4 border rounded-lg bg-blue-50">
                <p><strong>Rating:</strong> {feedbackItem.rating} Bintang</p>
                <p><strong>Komentar:</strong> {feedbackItem.komentar}</p>
                <p className="text-sm text-gray-500">
                  Tanggal: {new Date(feedbackItem.created_at).toLocaleDateString('id-ID')}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">Anda belum memberikan feedback.</p>
        )}
      </div>
    </div>
  );
};

export default HalamanProfil;
