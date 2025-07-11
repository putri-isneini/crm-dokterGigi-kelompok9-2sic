// src/components/HalamanProfil.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { GiftIcon, UserCircleIcon, ClipboardListIcon, EditIcon, SaveIcon } from "lucide-react"; // Tambah ikon edit dan save

const HalamanProfil = () => {
  const navigate = useNavigate();
  const [pasien, setPasien] = useState(null);
  const [diskon, setDiskon] = useState(null);
  const [riwayatBooking, setRiwayatBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State untuk mode edit

  // State untuk form edit
  const [editNama, setEditNama] = useState('');
  const [editTanggalLahir, setEditTanggalLahir] = useState('');
  const [editAlamat, setEditAlamat] = useState('');
  const [editNoHp, setEditNoHp] = useState('');
  const [editJenisKelamin, setEditJenisKelamin] = useState('');

  // Fungsi untuk mengambil data profil pengguna dari Supabase
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

    const authUserId = session.user.id;
    const userEmail = session.user.email;

    try {
      // Mengambil data pasien dari tabel 'pasien_user'
      const { data: pasienData, error: errorPasien } = await supabase
        .from("pasien_user") 
        .select("*")
        .eq("supabase_auth_id", authUserId) 
        .single();

      if (errorPasien && errorPasien.code === 'PGRST116') {
        // Jika profil pasien belum ada di tabel pasien_user, inisialisasi mode edit
        console.warn("Profil pasien tidak ditemukan di tabel pasien_user. Mengaktifkan mode lengkapi profil.");
        setPasien({ email: userEmail, supabase_auth_id: authUserId }); // Set email dan auth_id awal
        setIsEditing(true); // Langsung masuk mode edit untuk melengkapi
        setLoading(false);
        return;
      } else if (errorPasien) {
        // Tangani error lain selain 'tidak ditemukan'
        throw errorPasien;
      }

      // Jika data pasien ditemukan, set state dan inisialisasi form edit
      const combinedPasienData = {
        ...pasienData,
        email: userEmail,
      };
      setPasien(combinedPasienData);
      setEditNama(pasienData?.nama || '');
      setEditTanggalLahir(pasienData?.tanggal_lahir || '');
      setEditAlamat(pasienData?.alamat || '');
      setEditNoHp(pasienData?.no_hp || '');
      setEditJenisKelamin(pasienData?.jenis_kelamin || '');
      setIsEditing(false); // Default ke mode tampilan jika data ditemukan

      // Mengambil data diskon jika ada membership
      if (combinedPasienData?.membership) {
        const { data: diskonData, error: errorDiskon } = await supabase
          .from("diskon_membership")
          .select("*")
          .eq("membership", combinedPasienData.membership)
          .single();
        if (errorDiskon) console.error("Error fetching diskon:", errorDiskon.message);
        setDiskon(diskonData);
      } else {
        setDiskon(null); // Reset diskon jika tidak ada membership
      }

      // Mengambil riwayat booking
      const pasienIdFromTable = pasienData?.id;
      if (pasienIdFromTable) {
        const { data: bookingData, error: errorBooking } = await supabase
          .from("booking")
          .select(`
            id, tanggal, jam, status, keluhan, kode_booking,
            dokter (nama),
            layanan (nama)
          `)
          .eq("pasien_id", pasienIdFromTable)
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

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]); // Jalankan hanya saat komponen dimuat atau navigate berubah

  // Fungsi untuk menyimpan atau memperbarui profil
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('Sesi pengguna tidak valid. Silakan login kembali.');
      setLoading(false);
      navigate('/login');
      return;
    }
    const authUserId = user.id;

    try {
      const profileDataToSave = {
        nama: editNama,
        tanggal_lahir: editTanggalLahir,
        alamat: editAlamat,
        no_hp: editNoHp,
        jenis_kelamin: editJenisKelamin,
      };

      // Cek apakah entri pasien_user sudah ada
      const { data: existingPasien, error: checkError } = await supabase
        .from('pasien_user')
        .select('id')
        .eq('supabase_auth_id', authUserId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError; // Error lain selain "tidak ditemukan"
      }

      let saveError = null;
      if (existingPasien) {
        // Update data yang sudah ada
        const { error: updateError } = await supabase
          .from('pasien_user')
          .update(profileDataToSave)
          .eq('supabase_auth_id', authUserId);
        saveError = updateError;
      } else {
        // Insert data baru
        const { error: insertError } = await supabase
          .from('pasien_user')
          .insert({
            supabase_auth_id: authUserId,
            ...profileDataToSave,
          });
        saveError = insertError;
      }

      if (saveError) {
        throw saveError;
      }

      alert('Profil berhasil disimpan!');
      // Setelah berhasil menyimpan, perbarui state 'pasien' secara langsung
      // dan keluar dari mode edit
      setPasien(prevPasien => ({
        ...prevPasien, // Pertahankan email dan supabase_auth_id
        ...profileDataToSave, // Perbarui data profil yang baru disimpan
        id: existingPasien ? existingPasien.id : prevPasien?.id, // Pertahankan ID pasien jika sudah ada
      }));
      setIsEditing(false); // Kembali ke mode tampilan

    } catch (err) {
      console.error('Error saving profile:', err.message);
      setError('Gagal menyimpan profil: ' + err.message);
      alert('Gagal menyimpan profil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat data profil...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
  }

  // Tampilkan pesan jika pasien null dan tidak dalam mode loading/error
  if (!pasien && !loading && !error) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-pink-50">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6 text-pink-600">Profil Tidak Lengkap</h2>
          <p className="text-gray-700 mb-4">Data profil Anda belum lengkap. Silakan lengkapi data Anda.</p>
          <p className="text-gray-600 text-sm mb-6">Ini mungkin terjadi jika Anda baru mendaftar.</p>
          <button
            onClick={() => setIsEditing(true)} // Langsung aktifkan mode edit
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
              Selamat Datang,{" "}
              <span className="text-pink-600 font-semibold">{pasien?.nama || "Pasien"}</span>!
            </p>
          </div>
          <div className="ml-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md flex items-center gap-2 transition"
              >
                <EditIcon className="w-5 h-5" /> Edit Profil
              </button>
            ) : (
              <button
                onClick={handleSaveProfile}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md flex items-center gap-2 transition"
                disabled={loading}
              >
                <SaveIcon className="w-5 h-5" /> {loading ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="grid md:grid-cols-2 gap-10 mb-12 text-lg text-gray-700">
            <div>
              <h2 className="text-pink-600 font-bold mb-3">Informasi Pribadi</h2>
              <div className="mb-4">
                <label htmlFor="editNama" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  id="editNama"
                  value={editNama}
                  onChange={(e) => setEditNama(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editNoHp" className="block text-sm font-medium text-gray-700">No HP</label>
                <input
                  type="tel"
                  id="editNoHp"
                  value={editNoHp}
                  onChange={(e) => setEditNoHp(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editAlamat" className="block text-sm font-medium text-gray-700">Alamat</label>
                <textarea
                  id="editAlamat"
                  value={editAlamat}
                  onChange={(e) => setEditAlamat(e.target.value)}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="editJenisKelamin" className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <select
                  id="editJenisKelamin"
                  value={editJenisKelamin}
                  onChange={(e) => setEditJenisKelamin(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="editTanggalLahir" className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                <input
                  type="date"
                  id="editTanggalLahir"
                  value={editTanggalLahir}
                  onChange={(e) => setEditTanggalLahir(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>
            {/* Bagian Keanggotaan tetap tampil meskipun dalam mode edit */}
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
          </form>
        ) : (
          <div className="grid md:grid-cols-2 gap-10 mb-12 text-lg text-gray-700">
            <div>
              <h2 className="text-pink-600 font-bold mb-3">Informasi Pribadi</h2>
              <p><strong>Nama:</strong> {pasien?.nama || "-"}</p>
              <p><strong>Email:</strong> {pasien?.email || "-"}</p>
              <p><strong>No HP:</strong> {pasien?.no_hp || "-"}</p>
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
        )}

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
