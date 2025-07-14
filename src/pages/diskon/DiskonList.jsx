import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabase';
import dayjs from 'dayjs'; // For date formatting
import 'dayjs/locale/id'; // For Indonesian locale
dayjs.locale('id');

// Import icons from lucide-react
import {
    Gift, Award, Tag, Percent, ClipboardList, Calendar, Edit, Trash2, PlusCircle, Save, XCircle,
    Loader2, AlertCircle, CheckCircle, Info
} from 'lucide-react';

function DiskonList() {
    const [diskonList, setDiskonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility
    const [editingDiskon, setEditingDiskon] = useState(null); // Diskon object being edited
    const [isSubmitting, setIsSubmitting] = useState(false); // For form submission loading

    // Form state (moved from DiskonForm)
    const [form, setForm] = useState({
        id: null, // For editing
        membership: '',
        nama_diskon: '',
        persen_diskon: '',
        keterangan: '',
    });

    // Effect to populate form when editingDiskon changes
    useEffect(() => {
        if (editingDiskon) {
            setForm({
                id: editingDiskon.id,
                membership: editingDiskon.membership,
                nama_diskon: editingDiskon.nama_diskon,
                persen_diskon: editingDiskon.persen_diskon,
                keterangan: editingDiskon.keterangan,
            });
        } else {
            setForm({ id: null, membership: '', nama_diskon: '', persen_diskon: '', keterangan: '' }); // Reset form for new entry
        }
    }, [editingDiskon]);


    // Function to fetch all diskon
    const fetchDiskon = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('diskon_membership')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }
            setDiskonList(data);
        } catch (err) {
            console.error('Fetch error:', err.message);
            setError('Gagal memuat daftar diskon: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on component mount
    useEffect(() => {
        fetchDiskon();
    }, [fetchDiskon]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    // Handle form submission (add or update)
    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        // Basic validation
        if (!form.membership || !form.nama_diskon || form.persen_diskon === '' || !form.keterangan) {
            setError('Semua field harus diisi.');
            setIsSubmitting(false);
            return;
        }

        const persenDiskonNum = parseFloat(form.persen_diskon);
        if (isNaN(persenDiskonNum) || persenDiskonNum < 0 || persenDiskonNum > 100) {
            setError('Persen Diskon harus angka antara 0 dan 100.');
            setIsSubmitting(false);
            return;
        }

        try {
            if (form.id) { // Update existing diskon
                const { error: updateError } = await supabase
                    .from('diskon_membership')
                    .update({
                        membership: form.membership,
                        nama_diskon: form.nama_diskon,
                        persen_diskon: persenDiskonNum,
                        keterangan: form.keterangan,
                    })
                    .eq('id', form.id);

                if (updateError) throw updateError;
                setMessage('Diskon berhasil diperbarui!');
            } else { // Add new diskon
                const { error: addError } = await supabase.from('diskon_membership').insert({
                    membership: form.membership,
                    nama_diskon: form.nama_diskon,
                    persen_diskon: persenDiskonNum,
                    keterangan: form.keterangan,
                });

                if (addError) throw addError;
                setMessage('Diskon berhasil ditambahkan!');
            }
            setShowForm(false); // Hide form
            setEditingDiskon(null); // Clear editing state
            fetchDiskon(); // Refresh list
        } catch (err) {
            console.error('Gagal menyimpan diskon:', err.message);
            setError('Gagal menyimpan diskon: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete diskon
    const handleDelete = async (id) => {
        const isConfirmed = await new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50';
            dialog.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm text-center">
                    <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h3>
                    <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus diskon ini?</p>
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
            const { error: deleteError } = await supabase.from('diskon_membership').delete().eq('id', id);
            if (deleteError) {
                throw deleteError;
            }
            setMessage('Diskon berhasil dihapus!');
            fetchDiskon(); // Refresh list
        } catch (err) {
            console.error('Gagal hapus diskon:', err.message);
            setError('Gagal menghapus diskon: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingDiskon(null); // Clear editing state for new entry
        setShowForm(true);
        setError(null);
        setMessage(null);
    };

    const handleEditClick = (diskon) => {
        setEditingDiskon(diskon);
        setShowForm(true);
        setError(null);
        setMessage(null);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingDiskon(null); // Clear editing state
        setError(null);
        setMessage(null);
    };

    // Loading state for initial fetch
    if (loading && !diskonList.length && !showForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin w-16 h-16 text-pink-500 mb-4" />
                    <div className="text-pink-600 text-xl font-semibold">
                        Memuat daftar diskon...
                    </div>
                </div>
            </div>
        );
    }

    // Error state for initial fetch
    if (error && !diskonList.length && !showForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-red-700 mb-4">Terjadi Kesalahan!</h3>
                    <p className="text-lg text-gray-700 mb-6">{error}</p>
                    <button onClick={fetchDiskon} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md">
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
            <div className="py-8 pl-56 pr-8"> {/* Consistent padding */}
                <h2 className="text-6xl font-extrabold text-pink-800 mb-12 text-center drop-shadow-lg leading-tight tracking-wide">
                    <span className="block text-pink-600">Manajemen</span> Diskon <Gift className="inline-block ml-4 text-pink-500" size={60} />
                </h2>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-8 w-full shadow-md flex items-center justify-center text-lg" role="alert">
                        <CheckCircle className="mr-3 h-6 w-6" />
                        <span className="block sm:inline font-semibold">{message}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-8 w-full shadow-md flex items-center justify-center text-lg" role="alert">
                        <AlertCircle className="mr-3 h-6 w-6" />
                        <span className="block sm:inline font-semibold">{error}</span>
                    </div>
                )}

                {showForm ? (
                    // Form View
                    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-pink-100 transform transition-all duration-300 hover:scale-[1.01]">
                        <h3 className="text-4xl font-bold text-pink-700 mb-8 text-center">
                            {editingDiskon ? 'Edit Diskon' : 'Tambah Diskon Baru'}
                        </h3>
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Membership */}
                            <div>
                                <label htmlFor="membership" className="block text-gray-700 text-base font-bold mb-2">Membership</label>
                                <div className="relative">
                                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                    <select
                                        id="membership"
                                        name="membership"
                                        value={form.membership}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-base text-gray-800 appearance-none"
                                    >
                                        <option value="">Pilih Tipe Membership</option>
                                        <option value="Bronze">Bronze</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Platinum">Platinum</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Nama Diskon */}
                            <div>
                                <label htmlFor="nama_diskon" className="block text-gray-700 text-base font-bold mb-2">Nama Diskon</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                    <input
                                        type="text"
                                        id="nama_diskon"
                                        name="nama_diskon"
                                        value={form.nama_diskon}
                                        onChange={handleChange}
                                        required
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-base text-gray-800"
                                        placeholder="Contoh: Diskon Awal Tahun"
                                    />
                                </div>
                            </div>

                            {/* Persen Diskon */}
                            <div>
                                <label htmlFor="persen_diskon" className="block text-gray-700 text-base font-bold mb-2">Persen Diskon (%)</label>
                                <div className="relative">
                                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                    <input
                                        type="number"
                                        id="persen_diskon"
                                        name="persen_diskon"
                                        value={form.persen_diskon}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-base text-gray-800"
                                        placeholder="Contoh: 10.5"
                                    />
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div>
                                <label htmlFor="keterangan" className="block text-gray-700 text-base font-bold mb-2">Keterangan</label>
                                <div className="relative">
                                    <ClipboardList className="absolute left-3 top-3 text-pink-400" size={20} />
                                    <textarea
                                        id="keterangan"
                                        name="keterangan"
                                        value={form.keterangan}
                                        onChange={handleChange}
                                        rows="4"
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-base text-gray-800 resize-y"
                                        placeholder="Berikan deskripsi singkat tentang diskon ini..."
                                        required
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
                                    {isSubmitting ? 'Menyimpan...' : (editingDiskon ? 'Perbarui Diskon' : 'Tambah Diskon')}
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
                    // List View
                    <>
                        {/* Button to add new Diskon */}
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={handleAddClick}
                                className="flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-xl transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                            >
                                <PlusCircle className="mr-3 h-6 w-6" />
                                Tambah Diskon Baru
                            </button>
                        </div>

                        {diskonList.length === 0 ? (
                            <div className="text-center text-gray-700 p-10 bg-white rounded-xl shadow-lg border border-pink-200 w-full">
                                <Info className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                                <p className="text-3xl font-semibold mb-4">Tidak ada data diskon yang ditemukan.</p>
                                <p className="text-xl">Mulai tambahkan diskon membership baru di sini.</p>
                                <img
                                    src="https://placehold.co/300x200/FCE7F3/BE185D?text=No+Discounts"
                                    alt="No Discounts Placeholder"
                                    className="mx-auto mt-6 rounded-lg shadow-md"
                                />
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
                                {/* Table Header */}
                                <div className="grid grid-cols-10 gap-4 p-6 bg-pink-100 font-bold text-pink-700 text-xl border-b border-pink-200">
                                    <div className="col-span-2 flex items-center"><Award className="mr-2" size={20} />Membership</div>
                                    <div className="col-span-2 flex items-center"><Tag className="mr-2" size={20} />Nama Diskon</div>
                                    <div className="col-span-1 flex items-center"><Percent className="mr-2" size={20} />Diskon (%)</div>
                                    <div className="col-span-3 flex items-center"><ClipboardList className="mr-2" size={20} />Keterangan</div>
                                    <div className="col-span-1 flex items-center"><Calendar className="mr-2" size={20} />Dibuat Pada</div>
                                    <div className="col-span-1 text-right">Aksi</div>
                                </div>

                                {/* Table Rows */}
                                {diskonList.map((diskon, index) => (
                                    <div
                                        key={diskon.id}
                                        className={`grid grid-cols-10 gap-4 p-6 text-gray-800 border-b border-pink-50
                                            ${index % 2 === 0 ? 'bg-white' : 'bg-pink-50'}
                                            hover:bg-pink-100 transition-colors duration-200 ease-in-out
                                            items-center
                                        `}
                                    >
                                        <div className="col-span-2 font-semibold flex items-center text-base">
                                            {diskon.membership}
                                        </div>
                                        <div className="col-span-2 flex items-center text-base truncate max-w-full">
                                            {diskon.nama_diskon}
                                        </div>
                                        <div className="col-span-1 flex items-center text-base">
                                            {diskon.persen_diskon}%
                                        </div>
                                        <div className="col-span-3 flex items-center text-base truncate max-w-full">
                                            {diskon.keterangan}
                                        </div>
                                        <div className="col-span-1 flex items-center text-base">
                                            {dayjs(diskon.created_at).format('DD MMM YYYY HH:mm')}
                                        </div>
                                        <div className="col-span-1 flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEditClick(diskon)}
                                                className="flex items-center text-pink-600 hover:text-pink-800 font-semibold text-base transition-colors duration-200 transform hover:scale-105"
                                                title="Edit Diskon"
                                            >
                                                <Edit size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(diskon.id)}
                                                className="flex items-center text-red-600 hover:text-red-800 font-semibold text-base transition-colors duration-200 transform hover:scale-105"
                                                title="Hapus Diskon"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default DiskonList;
