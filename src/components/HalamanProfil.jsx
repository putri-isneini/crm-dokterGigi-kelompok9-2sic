// src/components/HalamanProfil.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { GiftIcon, UserCircleIcon, ClipboardListIcon } from "lucide-react";

const HalamanProfil = () => {
  const navigate = useNavigate();
  const [pasien, setPasien] = useState(null);
  const [diskon, setDiskon] = useState(null);
  const [riwayatBooking, setRiwayatBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError.message);
        setError("Gagal memuat sesi pengguna. Silakan login kembali.");
        setLoading(false);
        navigate("/login");
        return;
      }

      if (!session || !session.user) {
        console.warn("No active session found. Redirecting to login.");
        setError("Anda belum login. Silakan login.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const authUserId = session.user.id; // Ini adalah ID dari tabel auth.users
      const userEmail = session.user.email; // Ambil email dari sesi auth

      try {
        // Ambil data pasien dari tabel 'pasien' menggunakan authUserId
        const { data: pasienData, error: errorPasien } = await supabase
          .from("pasien") // Ubah ke tabel 'pasien'
          .select("*")
          .eq("id", authUserId) // Kolom 'id' di tabel pasien harus sama dengan user.id dari auth.users
          .single();

        if (errorPasien) {
          if (errorPasien.code === 'PGRST116') {
            console.warn("Profil pasien tidak ditemukan di tabel pasien. Mungkin perlu melengkapi data.");
            setError("Profil Anda belum lengkap. Silakan lengkapi data Anda.");
          } else {
            throw errorPasien;
          }
        }

        const combinedPasienData = {
          ...pasienData,
          email: userEmail,
          no_telepon: pasienData?.no_hp, // Petakan no_hp ke no_telepon jika diperlukan
        };
        setPasien(combinedPasienData);

        const pasienIdFromTable = pasienData?.id; // ID pasien dari tabel 'pasien'

        if (combinedPasienData?.membership) {
          const { data: diskonData, error: errorDiskon } = await supabase
            .from("diskon_membership")
            .select("*")
            .eq("membership", combinedPasienData.membership)
            .single();

          if (errorDiskon) console.error("Error fetching diskon:", errorDiskon.message);
          setDiskon(diskonData);
        }

        if (pasienIdFromTable) {
          const { data: bookingData, error: errorBooking } = await supabase
            .from("booking")
            .select(`
              id, tanggal, jam, status, keluhan, kode_booking,
              dokter (nama),
              layanan (nama)
            `)
            .eq("pasien_id", pasienIdFromTable) // Menggunakan ID dari tabel pasien
            .order("created_at", { ascending: false });

          if (errorBooking) console.error("Error fetching booking history:", errorBooking.message);
          setRiwayatBooking(bookingData || []);
        } else {
          setRiwayatBooking([]);
        }

      } catch (err) {
        console.error("Gagal memuat data profil:", err.message);
        setError("Gagal memuat data profil Anda. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat data profil...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
  }

  if (!pasien) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-pink-50">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-pink-600">Profil Tidak Lengkap</h2>
          <p className="text-gray-700 mb-4">Data profil Anda belum lengkap. Silakan lengkapi data Anda.</p>
          <p className="text-gray-600 text-sm mb-6">Ini mungkin terjadi jika Anda baru mendaftar.</p>
          <button
            onClick={() => navigate('/registrasi')}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded w-full"
          >
            Lengkapi Profil Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-pink-50 py-12 px-6 md:px-20">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-10">
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-start md:items-center">
          <div className="bg-pink-100 p-6 rounded-full">
            <UserCircleIcon className="w-20 h-20 text-pink-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Profil Pasien</h1>
            <p className="text-gray-500 text-lg">
              Selamat datang kembali,{" "}
              <span className="text-pink-600 font-semibold">{pasien?.nama || "Pasien"}</span>!
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-12 text-lg text-gray-700">
          <div>
            <h2 className="text-pink-600 font-bold mb-3">Informasi Pribadi</h2>
            <p><strong>Nama:</strong> {pasien?.nama}</p>
            <p><strong>Email:</strong> {pasien?.email}</p>
            <p><strong>No HP:</strong> {pasien?.no_hp || "-"}</p> {/* Menggunakan no_hp */}
            <p><strong>Alamat:</strong> {pasien?.alamat || "-"}</p>
            <p><strong>Jenis Kelamin:</strong> {pasien?.jenis_kelamin || "-"}</p>
            <p><strong>Tanggal Lahir:</strong> {pasien?.tanggal_lahir || "-"}</p>
          </div>

          <div>
            <h2 className="text-pink-600 font-bold mb-3">Keanggotaan</h2>
            <p className="mb-2">
              <strong>Membership:</strong>{" "}
              <span className={`ml-2 px-3 py-1 text-white rounded-full font-semibold ${
                pasien?.membership === "Platinum" ? "bg-yellow-500" :
                pasien?.membership === "Gold" ? "bg-amber-400" :
                pasien?.membership === "Silver" ? "bg-gray-400" : "bg-gray-300"
              }`}>
                {pasien?.membership || "Tidak Ada"}
              </span>
            </p>

            {diskon ? (
              <div className="bg-pink-100 border-l-4 border-pink-400 p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-pink-600 mb-2">
                  <GiftIcon className="w-5 h-5" />
                  <span className="font-semibold text-md">Diskon Member</span>
                </div>
                <p><strong>Nama Diskon:</strong> {diskon.nama_diskon}</p>
                <p><strong>Diskon:</strong> {diskon.persen_diskon}%</p>
                <p><strong>Keterangan:</strong> {diskon.keterangan}</p>
              </div>
            ) : (
              <p className="italic text-gray-500 mt-2">Tidak ada diskon saat ini.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-pink-600 mb-5 flex items-center gap-2">
            <ClipboardListIcon className="w-6 h-6" />
            Riwayat Booking
          </h2>
          {riwayatBooking.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {riwayatBooking.map((b) => (
                <div key={b.id} className="bg-white border border-pink-200 rounded-xl shadow-md p-5 hover:shadow-lg transition">
                  <p className="text-sm text-gray-500 mb-2">Kode Booking: <strong>{b.kode_booking}</strong></p>
                  <p><strong>Dokter:</strong> {b.dokter?.nama || "-"}</p>
                  <p><strong>Layanan:</strong> {b.layanan?.nama || "-"}</p>
                  <p><strong>Tanggal:</strong> {new Date(b.tanggal).toLocaleDateString("id-ID")}</p>
                  <p><strong>Jam:</strong> {b.jam?.slice(0, 5)}</p>
                  <p><strong>Status:</strong>
                    <span className={`ml-2 px-2 py-0.5 text-white text-sm rounded-full ${
                      b.status === "Selesai" ? "bg-green-500" :
                      b.status === "Terjadwal" ? "bg-blue-500" :
                      b.status === "Batal" ? "bg-red-500" : "bg-yellow-500"
                    }`}>
                      {b.status}
                    </span>
                  </p>
                  {b.keluhan && <p><strong>Keluhan:</strong> {b.keluhan}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-500">Belum ada riwayat booking.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HalamanProfil;
