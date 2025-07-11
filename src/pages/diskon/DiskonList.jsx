// src/pages/DiskonList.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import DiskonForm from './DiskonForm'; // Pastikan path ini benar

function DiskonList() {
    const [diskonList, setDiskonList] = useState([]);
    const [editingDiskon, setEditingDiskon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDiskon = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('diskon_membership')
                .select('*')
                .order('created_at', { ascending: false }); // Order by created_at

            if (error) {
                throw error;
            }
            setDiskonList(data);
        } catch (err) {
            console.error('Fetch error:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addDiskon = async (diskon) => {
        const { error } = await supabase.from('diskon_membership').insert(diskon);
        if (error) {
            alert('Gagal menambahkan diskon: ' + error.message);
        } else {
            fetchDiskon();
        }
    };

    const updateDiskon = async (diskon) => {
        const { error } = await supabase
            .from('diskon_membership')
            .update({
                membership: diskon.membership,
                nama_diskon: diskon.nama_diskon,
                persen_diskon: diskon.persen_diskon,
                keterangan: diskon.keterangan,
            })
            .eq('id', diskon.id);

        if (error) {
            alert('Gagal mengubah data: ' + error.message);
        } else {
            fetchDiskon();
            setEditingDiskon(null);
        }
    };

    const deleteDiskon = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus diskon ini?')) {
            const { error } = await supabase.from('diskon_membership').delete().eq('id', id);
            if (error) {
                alert('Gagal menghapus data: ' + error.message);
            } else {
                fetchDiskon();
            }
        }
    };

    useEffect(() => {
        fetchDiskon();
    }, []);

    if (loading) {
        return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat daftar diskon...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 bg-pink-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-pink-700 mb-10 text-center">
                🎁 Manajemen Diskon Membership
            </h1>

            <div className="mb-12">
                <DiskonForm
                    addDiskon={addDiskon}
                    updateDiskon={updateDiskon}
                    editingDiskon={editingDiskon}
                    setEditingDiskon={setEditingDiskon}
                />
            </div>

            {diskonList.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-pink-100">
                    <table className="min-w-full divide-y divide-pink-200">
                        <thead className="bg-pink-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Membership</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Nama Diskon</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Persen Diskon (%)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Keterangan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Dibuat Pada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-pink-200">
                            {diskonList.map((diskon) => (
                                <tr key={diskon.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{diskon.membership}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{diskon.nama_diskon}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{diskon.persen_diskon}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{diskon.keterangan}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {new Date(diskon.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => setEditingDiskon(diskon)}
                                            className="text-pink-600 hover:text-pink-900 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteDiskon(diskon.id)}
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
                    Belum ada diskon membership yang ditambahkan.
                </p>
            )}
        </div>
    );
}

export default DiskonList;
