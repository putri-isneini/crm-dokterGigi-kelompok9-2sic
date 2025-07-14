import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabase';
import dayjs from 'dayjs'; // For date formatting
import 'dayjs/locale/id'; // For Indonesian locale
dayjs.locale('id');

// Import icons from lucide-react
import {
    HelpCircle, Info, MessageSquare, Calendar, Edit, Trash2, PlusCircle, Save, XCircle,
    Loader2, AlertCircle, CheckCircle
} from 'lucide-react';

function Faq() {
    const [faqList, setFaqList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility
    const [editingFaq, setEditingFaq] = useState(null); // FAQ object being edited
    const [isSubmitting, setIsSubmitting] = useState(false); // For form submission loading

    // Form state (moved from FaqForm)
    const [form, setForm] = useState({
        id: null, // For editing
        pertanyaan: '',
        jawaban: '',
    });

    // Effect to populate form when editingFaq changes
    useEffect(() => {
        if (editingFaq) {
            setForm({
                id: editingFaq.id,
                pertanyaan: editingFaq.pertanyaan,
                jawaban: editingFaq.jawaban,
            });
        } else {
            setForm({ id: null, pertanyaan: '', jawaban: '' }); // Reset form for new entry
        }
    }, [editingFaq]);


    // Function to fetch all FAQs
    const fetchFaq = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('faq')
                .select('id, pertanyaan, jawaban, created_at')
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }
            setFaqList(data);
        } catch (err) {
            console.error('Gagal fetch FAQ:', err.message);
            setError('Gagal memuat daftar FAQ: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on component mount
    useEffect(() => {
        fetchFaq();
    }, [fetchFaq]);

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

        if (!form.pertanyaan || !form.jawaban) {
            setError('Pertanyaan dan Jawaban harus diisi.');
            setIsSubmitting(false);
            return;
        }

        try {
            if (form.id) { // Update existing FAQ
                const { error: updateError } = await supabase
                    .from('faq')
                    .update({ pertanyaan: form.pertanyaan, jawaban: form.jawaban })
                    .eq('id', form.id);

                if (updateError) throw updateError;
                setMessage('FAQ berhasil diperbarui!');
            } else { // Add new FAQ
                const { error: addError } = await supabase.from('faq').insert({
                    pertanyaan: form.pertanyaan,
                    jawaban: form.jawaban
                });

                if (addError) throw addError;
                setMessage('FAQ berhasil ditambahkan!');
            }
            setShowForm(false); // Hide form
            setEditingFaq(null); // Clear editing state
            fetchFaq(); // Refresh list
        } catch (err) {
            console.error('Gagal menyimpan FAQ:', err.message);
            setError('Gagal menyimpan FAQ: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete FAQ
    const handleDelete = async (id) => {
        const isConfirmed = await new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50';
            dialog.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm text-center">
                    <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h3>
                    <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus FAQ ini?</p>
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
            const { error: deleteError } = await supabase.from('faq').delete().eq('id', id);
            if (deleteError) {
                throw deleteError;
            }
            setMessage('FAQ berhasil dihapus!');
            fetchFaq(); // Refresh list
        } catch (err) {
            console.error('Gagal hapus FAQ:', err.message);
            setError('Gagal menghapus FAQ: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setEditingFaq(null); // Clear editing state for new entry
        setShowForm(true);
        setError(null);
        setMessage(null);
    };

    const handleEditClick = (faq) => {
        setEditingFaq(faq);
        setShowForm(true);
        setError(null);
        setMessage(null);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingFaq(null); // Clear editing state
        setError(null);
        setMessage(null);
    };

    // Loading state for initial fetch
    if (loading && !faqList.length && !showForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin w-16 h-16 text-pink-500 mb-4" />
                    <div className="text-pink-600 text-xl font-semibold"> {/* Increased font size */}
                        Memuat daftar FAQ...
                    </div>
                </div>
            </div>
        );
    }

    // Error state for initial fetch
    if (error && !faqList.length && !showForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-red-700 mb-4">Terjadi Kesalahan!</h3> {/* Increased font size */}
                    <p className="text-lg text-gray-700 mb-6">{error}</p> {/* Increased font size */}
                    <button onClick={fetchFaq} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md">
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
            <div className="py-8 pl-56 pr-8"> {/* Consistent padding */}
                <h2 className="text-6xl font-extrabold text-pink-800 mb-12 text-center drop-shadow-lg leading-tight tracking-wide"> {/* Increased font size and tracking */}
                    <span className="block text-pink-600">Manajemen</span> FAQ <HelpCircle className="inline-block ml-4 text-pink-500" size={60} /> {/* Increased icon size */}
                </h2>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-8 w-full shadow-md flex items-center justify-center text-lg" role="alert"> {/* Increased font size */}
                        <CheckCircle className="mr-3 h-6 w-6" />
                        <span className="block sm:inline font-semibold">{message}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-8 w-full shadow-md flex items-center justify-center text-lg" role="alert"> {/* Increased font size */}
                        <AlertCircle className="mr-3 h-6 w-6" />
                        <span className="block sm:inline font-semibold">{error}</span>
                    </div>
                )}

                {showForm ? (
                    // Form View
                    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-pink-100 transform transition-all duration-300 hover:scale-[1.01]">
                        <h3 className="text-4xl font-bold text-pink-700 mb-8 text-center"> 
                            {editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru'}
                        </h3>
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Pertanyaan */}
                            <div>
                                <label htmlFor="pertanyaan" className="block text-gray-700 text-base font-bold mb-2">Pertanyaan</label> 
                                <div className="relative">
                                    <Info className="absolute left-3 top-3 text-pink-400" size={20} />
                                    <textarea
                                        id="pertanyaan"
                                        name="pertanyaan"
                                        value={form.pertanyaan}
                                        onChange={handleChange}
                                        rows="4"
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-base text-gray-800 resize-y" 
                                        placeholder="Tulis pertanyaan FAQ di sini..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Jawaban */}
                            <div>
                                <label htmlFor="jawaban" className="block text-gray-700 text-base font-bold mb-2">Jawaban</label> 
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3 text-pink-400" size={20} />
                                    <textarea
                                        id="jawaban"
                                        name="jawaban"
                                        value={form.jawaban}
                                        onChange={handleChange}
                                        rows="6"
                                        className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-base text-gray-800 resize-y" 
                                        placeholder="Tulis jawaban FAQ di sini..."
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
                                    {isSubmitting ? 'Menyimpan...' : (editingFaq ? 'Perbarui FAQ' : 'Tambah FAQ')}
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
                        {/* Button to add new FAQ */}
                        <div className="flex justify-end mb-8">
                            <button
                                onClick={handleAddClick}
                                className="flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-xl transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                            >
                                <PlusCircle className="mr-3 h-6 w-6" />
                                Tambah FAQ Baru
                            </button>
                        </div>

                        {faqList.length === 0 ? (
                            <div className="text-center text-gray-700 p-10 bg-white rounded-xl shadow-lg border border-pink-200 w-full">
                                <Info className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                                <p className="text-3xl font-semibold mb-4">Tidak ada data FAQ yang ditemukan.</p> {/* Increased font size */}
                                <p className="text-xl">Mulai tambahkan pertanyaan dan jawaban FAQ baru di sini.</p> {/* Increased font size */}
                                <img
                                    src="https://placehold.co/300x200/FCE7F3/BE185D?text=No+FAQs"
                                    alt="No FAQs Placeholder"
                                    className="mx-auto mt-6 rounded-lg shadow-md"
                                />
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
                                {/* Table Header */}
                                <div className="grid grid-cols-10 gap-4 p-6 bg-pink-100 font-bold text-pink-700 text-xl border-b border-pink-200"> {/* Increased font size */}
                                    <div className="col-span-4 flex items-center"><Info className="mr-2" size={20} />Pertanyaan</div> {/* Increased icon size */}
                                    <div className="col-span-4 flex items-center"><MessageSquare className="mr-2" size={20} />Jawaban</div> {/* Increased icon size */}
                                    <div className="col-span-1 flex items-center"><Calendar className="mr-2" size={20} />Dibuat Pada</div> {/* Increased icon size */}
                                    <div className="col-span-1 text-right">Aksi</div>
                                </div>

                                {/* Table Rows */}
                                {faqList.map((faq, index) => (
                                    <div
                                        key={faq.id}
                                        className={`grid grid-cols-10 gap-4 p-6 text-gray-800 border-b border-pink-50
                                            ${index % 2 === 0 ? 'bg-white' : 'bg-pink-50'}
                                            hover:bg-pink-100 transition-colors duration-200 ease-in-out
                                            items-center
                                        `}
                                    >
                                        <div className="col-span-4 font-semibold flex items-center truncate max-w-full text-base"> {/* Increased font size */}
                                            {faq.pertanyaan}
                                        </div>
                                        <div className="col-span-4 flex items-center text-base truncate max-w-full"> {/* Increased font size */}
                                            {faq.jawaban}
                                        </div>
                                        <div className="col-span-1 flex items-center text-base"> {/* Increased font size */}
                                            {dayjs(faq.created_at).format('DD MMM YYYY')}
                                        </div>
                                        <div className="col-span-1 flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEditClick(faq)}
                                                className="flex items-center text-pink-600 hover:text-pink-800 font-semibold text-base transition-colors duration-200 transform hover:scale-105" 
                                                title="Edit FAQ"
                                            >
                                                <Edit size={20} /> 
                                            </button>
                                            <button
                                                onClick={() => handleDelete(faq.id)}
                                                className="flex items-center text-red-600 hover:text-red-800 font-semibold text-base transition-colors duration-200 transform hover:scale-105" 
                                                title="Hapus FAQ"
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

export default Faq;
