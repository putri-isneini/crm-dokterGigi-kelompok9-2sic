import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { GiftIcon, UserCircleIcon } from "lucide-react";

const HalamanProfil = () => {
  const navigate = useNavigate();
  const pasienId = localStorage.getItem("pasien_id");

  const [pasien, setPasien] = useState(null);
  const [diskon, setDiskon] = useState(null);

  useEffect(() => {
    if (!pasienId) {
      navigate("/registrasi");
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    const { data: pasienData, error: errorPasien } = await supabase
      .from("pasien")
      .select("*")
      .eq("id", pasienId)
      .single();

    if (errorPasien) {
      console.error(errorPasien);
      return;
    }

    setPasien(pasienData);

    if (pasienData.membership) {
      const { data: diskonData, error: errorDiskon } = await supabase
        .from("diskon_membership")
        .select("*")
        .eq("membership", pasienData.membership)
        .single();

      if (!errorDiskon) {
        setDiskon(diskonData);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-50 to-white py-12 px-6 md:px-20">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
        <UserCircleIcon className="w-20 h-20 text-pink-500" />
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Profil Pasien</h1>
          <p className="text-gray-500 text-lg">Selamat datang, {pasien?.nama || "Pasien"}!</p>
        </div>
      </div>

      {pasien ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-lg text-gray-800">
          {/* Biodata */}
          <div className="space-y-3">
            <p><span className="font-semibold">Nama:</span> {pasien.nama}</p>
            <p><span className="font-semibold">Email:</span> {pasien.email}</p>
            <p><span className="font-semibold">No HP:</span> {pasien.no_hp}</p>
            <p><span className="font-semibold">Alamat:</span> {pasien.alamat || "-"}</p>
            <p><span className="font-semibold">Jenis Kelamin:</span> {pasien.jenis_kelamin}</p>
            <p><span className="font-semibold">Tanggal Lahir:</span> {pasien.tanggal_lahir}</p>
          </div>

          {/* Membership & Diskon */}
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Membership:</span>{" "}
              <span className={`ml-2 px-3 py-1 text-white font-bold rounded-full
                ${pasien.membership === 'Platinum' ? 'bg-yellow-500' :
                  pasien.membership === 'Gold' ? 'bg-amber-400' :
                  'bg-gray-500'}`}>
                {pasien.membership}
              </span>
            </p>

            {diskon ? (
              <div className="bg-pink-100 border-l-4 border-pink-400 p-5 rounded-lg shadow-md mt-4">
                <div className="flex items-center mb-2 text-pink-600">
                  <GiftIcon className="w-6 h-6 mr-2" />
                  <h2 className="font-bold text-xl">Diskon Member</h2>
                </div>
                <p><strong>Nama Diskon:</strong> {diskon.nama_diskon}</p>
                <p><strong>Persen Diskon:</strong> {diskon.persen_diskon}%</p>
                <p><strong>Keterangan:</strong> {diskon.keterangan}</p>
              </div>
            ) : (
              <p className="italic text-gray-500 mt-2">Tidak ada diskon membership saat ini.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg mt-10">Memuat data pasien...</p>
      )}
    </div>
  );
};

export default HalamanProfil;
