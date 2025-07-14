import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabase';

// Import icons from lucide-react
import {
    Building, FileText, Eye, Target, Edit, Trash2, Save, XCircle,
    Loader2, AlertCircle, CheckCircle, Info
} from 'lucide-react';

function ListTentangKami() {
    const [data, setData] = useState({ deskripsi: '', visi: '', misi: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility
    const [isSubmitting, setIsSubmitting] = useState(false); // For form submission loading

    // Function to fetch data from 'tentang_kami' table
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { data: fetchedData, error: fetchError } = await supabase.from('tentang_kami').select('*');
            if (fetchError) {
                throw fetchError;
            }

            const result = { deskripsi: '', visi: '', 'misi': '' }; // Ensure 'misi' is correctly initialized
            if (fetchedData && fetchedData.length > 0) {
                fetchedData.forEach((item) => {
                    if (item.tipe === 'deskripsi') result.deskripsi = item.konten;
                    if (item.tipe === 'visi') result.visi = item.konten;
                    if (item.tipe === 'misi') result.misi = item.konten;
                });
            }
            setData(result);
        } catch (err) {
            console.error('Gagal mengambil data:', err.message);
            setError('Gagal memuat data: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle form submission (add or update)
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        if (!data.deskripsi && !data.visi && !data.misi) {
            setError('Setidaknya satu field (Deskripsi, Visi, atau Misi) harus diisi.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Delete existing entries first to ensure only one set of data
            // Using a dummy condition to delete all, as .delete() without eq() clause might not work on all Supabase setups
            const { error: deleteError } = await supabase.from('tentang_kami').delete().neq('tipe', 'NON_EXISTENT_TYPE');
            if (deleteError) {
                console.error('Error deleting old data:', deleteError.message);
                throw deleteError;
            }

            const entriesToInsert = [];
            if (data.deskripsi) entriesToInsert.push({ tipe: 'deskripsi', konten: data.deskripsi });
            if (data.visi) entriesToInsert.push({ tipe: 'visi', konten: data.visi });
            if (data.misi) entriesToInsert.push({ tipe: 'misi', konten: data.misi });

            if (entriesToInsert.length > 0) {
                const { error: insertError } = await supabase.from('tentang_kami').insert(entriesToInsert);
                if (insertError) {
                    throw insertError;
                }
            }

            setMessage('Konten "Tentang Kami" berhasil disimpan!');
            setShowForm(false); // Hide form after saving
            fetchData(); // Refresh data
        } catch (err) {
            console.error('Gagal menyimpan:', err.message);
            setError('Gagal menyimpan konten: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete all content
    const handleDelete = async () => {
        const isConfirmed = await new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50';
            dialog.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm text-center">
                    <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h3>
                    <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus SEMUA konten "Tentang Kami"? Tindakan ini tidak dapat dibatalkan.</p>
                    <div class="flex justify-center space-x-4">
                        <button id="confirmDeleteBtn" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-colors">Hapus</button>
                        <button id="cancelDeleteBtn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors">Batal</button>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);

            document.getElementById('confirmDeleteBtn').onclick = () => {
                document.body.removeChild(dialog);
                resolve(true);
            };
            document.getElementById('cancelDeleteBtn').onclick = () => {
                document.body.removeChild(dialog);
                resolve(false);
            };
        });

        if (!isConfirmed) {
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            // Using a dummy condition to delete all, as .delete() without eq() clause might not work on all Supabase setups
            const { error: deleteError } = await supabase.from('tentang_kami').delete().neq('tipe', 'NON_EXISTENT_TYPE');
            if (deleteError) {
                throw deleteError;
            }
            setData({ deskripsi: '', visi: '', misi: '' }); // Clear local state
            setMessage('Semua konten "Tentang Kami" berhasil dihapus!');
        } catch (err) {
            console.error('Gagal menghapus:', err.message);
            setError('Gagal menghapus konten: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setShowForm(true);
        setError(null); // Clear previous errors
        setMessage(null); // Clear previous messages
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setError(null); // Clear errors
        setMessage(null); // Clear messages
        fetchData(); // Re-fetch data to revert any unsaved changes in form
    };

    // Loading state for initial fetch
    if (loading && !showForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin w-16 h-16 text-pink-500 mb-4" />
                    <div className="text-pink-600 text-lg font-semibold">
                        Memuat konten "Tentang Kami"...
                    </div>
                </div>
            </div>
        );
    }

    // Error state for initial fetch
    if (error && !showForm && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-700 mb-4">Terjadi Kesalahan!</h3>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button onClick={fetchData} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md">
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
            <div className="py-8 pl-56 pr-8"> {/* Consistent padding */}
                <h2 className="text-5xl font-extrabold text-pink-800 mb-12 text-center drop-shadow-lg leading-tight">
                    <span className="block text-pink-600">Manajemen</span> Tentang Kami <Building className="inline-block ml-4 text-pink-500" size={50} />
                </h2>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-8 w-full shadow-md flex items-center justify-center" role="alert">
                        <CheckCircle className="mr-3 h-6 w-6" />
                        <span className="block sm:inline font-semibold">{message}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-8 w-full shadow-md flex items-center justify-center" role="alert">
                        <AlertCircle className="mr-3 h-6 w-6" />
                        <span className="block sm:inline font-semibold">{error}</span>
                    </div>
                )}

                {showForm ? (
                    // Form View
                    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-pink-100 transform transition-all duration-300 hover:scale-[1.01]">
                        <h3 className="text-3xl font-bold text-pink-700 mb-8 text-center">
                            Edit Konten "Tentang Kami"
                        </h3>
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Deskripsi */}
                            <div>
                                <label htmlFor="deskripsi" className="block text-gray-700 text-sm font-bold mb-2">Deskripsi</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-pink-400" size={20} />
                                    <textarea
                                        id="deskripsi"
                                        name="deskripsi"
                                        value={data.deskripsi}
                                        onChange={(e) => setData(prev => ({ ...prev, deskripsi: e.target.value }))}
                                        rows="6"
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 resize-y"
                                        placeholder="Tulis deskripsi tentang klinik Anda..."
                                    />
                                </div>
                            </div>

                            {/* Visi */}
                            <div>
                                <label htmlFor="visi" className="block text-gray-700 text-sm font-bold mb-2">Visi</label>
                                <div className="relative">
                                    <Eye className="absolute left-3 top-3 text-pink-400" size={20} />
                                    <textarea
                                        id="visi"
                                        name="visi"
                                        value={data.visi}
                                        onChange={(e) => setData(prev => ({ ...prev, visi: e.target.value }))}
                                        rows="4"
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 resize-y"
                                        placeholder="Tulis visi klinik Anda..."
                                    />
                                </div>
                            </div>

                            {/* Misi */}
                            <div>
                                <label htmlFor="misi" className="block text-gray-700 text-sm font-bold mb-2">Misi</label>
                                <div className="relative">
                                    <Target className="absolute left-3 top-3 text-pink-400" size={20} />
                                    <textarea
                                        id="misi"
                                        name="misi"
                                        value={data.misi}
                                        onChange={(e) => setData(prev => ({ ...prev, misi: e.target.value }))}
                                        rows="4"
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 resize-y"
                                        placeholder="Tulis misi klinik Anda..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-center space-x-4 mt-8">
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelForm}
                                    className="flex items-center px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-75"
                                >
                                    <XCircle className="mr-2 h-5 w-5" />
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    // Preview View
                    <div className="max-w-4xl mx-auto rounded-2xl shadow-xl border border-pink-100 bg-white p-8 transition-all duration-300 hover:shadow-2xl">
                        <h3 className="text-3xl font-bold text-pink-700 mb-6 text-center">Preview Konten "Tentang Kami"</h3>

                        <div className="space-y-8 text-gray-800 leading-relaxed">
                            {/* Deskripsi */}
                            <div>
                                <h4 className="text-xl font-semibold text-pink-600 mb-2 flex items-center">
                                    <FileText className="mr-2 text-pink-500" size={20} /> Deskripsi
                                </h4>
                                <p className="font-sans text-lg text-gray-700">
                                    {data.deskripsi || <span className="text-gray-400 italic">Belum ada deskripsi. Klik "Edit Konten" untuk menambahkan.</span>}
                                </p>
                            </div>

                            {/* Visi */}
                            <div>
                                <h4 className="text-xl font-semibold text-pink-600 mb-2 flex items-center">
                                    <Eye className="mr-2 text-pink-500" size={20} /> Visi
                                </h4>
                                <p className="font-sans text-lg text-gray-700">
                                    {data.visi || <span className="text-gray-400 italic">Belum ada visi. Klik "Edit Konten" untuk menambahkan.</span>}
                                </p>
                            </div>

                            {/* Misi */}
                            <div>
                                <h4 className="text-xl font-semibold text-pink-600 mb-2 flex items-center">
                                    <Target className="mr-2 text-pink-500" size={20} /> Misi
                                </h4>
                                <p className="font-sans text-lg text-gray-700">
                                    {data.misi || <span className="text-gray-400 italic">Belum ada misi. Klik "Edit Konten" untuk menambahkan.</span>}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 mt-10">
                            <button
                                onClick={handleEditClick}
                                className="flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-xl transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                            >
                                <Edit className="mr-3 h-6 w-6" />
                                Edit Konten
                            </button>

                            <button
                                onClick={handleDelete}
                                className="flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-full shadow-xl transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-75"
                            >
                                <Trash2 className="mr-3 h-6 w-6" />
                                Hapus Semua
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListTentangKami;
