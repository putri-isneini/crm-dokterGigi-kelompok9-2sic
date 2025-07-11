// src/pages/JadwalDokterList.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function JadwalDokterList() {
    const [jadwalList, setJadwalList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Inisialisasi useNavigate

    useEffect(() => {
        const fetchJadwal = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, error } = await supabase
                    .from('jadwal_dokter')
                    .select(`
                        id,
                        hari,
                        jam_mulai,
                        jam_selesai,
                        created_at,
                        dokter(id, nama)
                    `)
                    .order('created_at', { ascending: false }); // Order by created_at

                if (error) {
                    throw error;
                }
                setJadwalList(data);
            } catch (err) {
                console.error('Gagal mengambil data jadwal:', err); // Log objek error
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJadwal();
    }, []);

    const deleteJadwal = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            const { error } = await supabase
                .from('jadwal_dokter')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Gagal menghapus jadwal: ' + error.message);
            } else {
                setJadwalList(prevJadwal => prevJadwal.filter(jadwal => jadwal.id !== id));
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat daftar jadwal dokter...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 bg-pink-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-pink-700 mb-10 text-center">
                ⏰ Manajemen Jadwal Dokter
            </h1>

            {/* Link to add new schedule */}
            <div className="mb-8 text-right">
                <button
                    onClick={() => navigate('/jadwaldokterform')} // Navigasi ke FormJadwalDokter
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
                >
                    + Tambah Jadwal Baru
                </button>
            </div>

            {jadwalList.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-pink-100">
                    <table className="min-w-full divide-y divide-pink-200">
                        <thead className="bg-pink-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Dokter</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Hari</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Jam Mulai</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Jam Selesai</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Dibuat Pada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-pink-200">
                            {jadwalList.map((jadwal) => (
                                <tr key={jadwal.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{jadwal.dokter?.nama || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{jadwal.hari}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{jadwal.jam_mulai}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{jadwal.jam_selesai}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {new Date(jadwal.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* Edit button would go here */}
                                        <button
                                            onClick={() => deleteJadwal(jadwal.id)}
                                            className="text-red-600 hover:text-red-900 ml-2"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500 italic mt-12">
                    Belum ada jadwal dokter yang ditambahkan.
                </p>
            )}
        </div>
    );
}

export default JadwalDokterList;
