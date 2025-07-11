// src/pages/dokter/ListDokter.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import FormDokter from './FormDokter'; // Pastikan path ini benar

function ListDokter() {
    const [dokterList, setDokterList] = useState([]);
    const [editingDokter, setEditingDokter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDokter = async () => {
        setLoading(true);
        setError(null);
        try {
            // Memilih kolom 'foto' juga
            const { data, error } = await supabase
                .from('dokter')
                .select('*') // Mengambil semua kolom, termasuk 'foto'
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }
            setDokterList(data);
        } catch (err) {
            console.error('Gagal mengambil data dokter:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addDokter = async (dokter) => {
        // Pastikan objek dokter yang diinsert memiliki kolom 'foto'
        const { error } = await supabase.from('dokter').insert(dokter);
        if (error) {
            alert('Gagal menambahkan dokter: ' + error.message);
            console.error('Add Dokter Error:', error); // Log error lebih detail
        } else {
            fetchDokter();
        }
    };

    const updateDokter = async (dokter) => {
        const { error } = await supabase
            .from('dokter')
            .update({
                nama: dokter.nama,
                spesialisasi: dokter.spesialisasi,
                no_telepon: dokter.no_telepon,
                email: dokter.email,
                foto: dokter.foto, // Pastikan kolom 'foto' diupdate
            })
            .eq('id', dokter.id);

        if (error) {
            alert('Gagal mengubah data: ' + error.message);
            console.error('Update Dokter Error:', error); // Log error lebih detail
        } else {
            fetchDokter();
            setEditingDokter(null);
        }
    };

    const deleteDokter = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus dokter ini?')) {
            const { error } = await supabase.from('dokter').delete().eq('id', id);
            if (error) {
                alert('Gagal menghapus data: ' + error.message);
            } else {
                fetchDokter();
            }
        }
    };

    useEffect(() => {
        fetchDokter();
    }, []);

    if (loading) {
        return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat daftar dokter...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 bg-pink-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-pink-700 mb-10 text-center">
                👩‍⚕️ Manajemen Dokter
            </h1>

            <div className="mb-12">
                <FormDokter
                    addDokter={addDokter}
                    updateDokter={updateDokter}
                    editingDokter={editingDokter}
                    setEditingDokter={setEditingDokter}
                />
            </div>

            {dokterList.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-pink-100">
                    <table className="min-w-full divide-y divide-pink-200">
                        <thead className="bg-pink-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Foto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Spesialisasi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">No. Telepon</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Dibuat Pada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-pink-200">
                            {dokterList.map((dokter) => (
                                <tr key={dokter.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {dokter.foto ? (
                                            <img src={dokter.foto} alt={dokter.nama} className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">No Foto</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dokter.nama}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dokter.spesialisasi}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dokter.no_telepon}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dokter.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {new Date(dokter.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => setEditingDokter(dokter)}
                                            className="text-pink-600 hover:text-pink-900 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteDokter(dokter.id)}
                                            className="text-red-600 hover:text-red-900"
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
                    Belum ada dokter yang ditambahkan.
                </p>
            )}
        </div>
    );
}

export default ListDokter;
