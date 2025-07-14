// src/pages/pasien/ListPasien.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

// Icons (using Lucide React for modern, clean icons)
import {
    Edit, Trash2, PlusCircle, User, Mail, Phone, MapPin, Calendar, Heart, Award, XCircle, Save,
    Loader2, Lock, AlertCircle, CheckCircle, Users // Added Users icon for the main title
} from 'lucide-react';

const ListPasien = () => {
    // State for list view
    const [pasienList, setPasienList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // State for form view
    const [showForm, setShowForm] = useState(false);
    const [editingPasienId, setEditingPasienId] = useState(null);
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [noHp, setNoHp] = useState('');
    const [alamat, setAlamat] = useState('');
    const [tanggalLahir, setTanggalLahir] = useState('');
    const [jenisKelamin, setJenisKelamin] = useState('');
    const [membership, setMembership] = useState('Silver');

    const navigate = useNavigate();

    // Function to fetch all patients for the list view
    const fetchPasien = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('pasien_user')
                .select('*')
                .order('nama', { ascending: true });

            if (fetchError) throw fetchError;
            setPasienList(data);
            console.log("ListPasien: Fetched pasien data:", data);
        } catch (err) {
            console.error('Error fetching pasien for admin:', err.message);
            setError('Gagal memuat daftar pasien: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to load patient data when editingPasienId changes
    useEffect(() => {
        if (editingPasienId) {
            const fetchPasienForEdit = async () => {
                setLoading(true);
                setError(null);
                try {
                    const { data, error: fetchError } = await supabase
                        .from('pasien_user')
                        .select('*')
                        .eq('id', editingPasienId)
                        .single();

                    if (fetchError) throw fetchError;
                    if (data) {
                        setNama(data.nama);
                        setEmail(data.email);
                        setNoHp(data.no_hp || '');
                        setAlamat(data.alamat || '');
                        setTanggalLahir(data.tanggal_lahir || '');
                        setJenisKelamin(data.jenis_kelamin || '');
                        setMembership(data.membership || 'Silver');
                    }
                } catch (err) {
                    console.error('Error fetching pasien for edit:', err.message);
                    setError('Gagal memuat data pasien untuk diedit.');
                } finally {
                    setLoading(false);
                }
            };
            fetchPasienForEdit();
        } else {
            // Reset form fields when not editing
            setNama('');
            setEmail('');
            setPassword('');
            setNoHp('');
            setAlamat('');
            setTanggalLahir('');
            setJenisKelamin('');
            setMembership('Silver');
        }
    }, [editingPasienId]);

    // Initial fetch when component mounts
    useEffect(() => {
        fetchPasien();
    }, [fetchPasien]);

    // Handle form submission (Add or Edit)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (editingPasienId) {
                // Update existing patient
                const { error: updateError } = await supabase
                    .from('pasien_user')
                    .update({
                        nama,
                        no_hp: noHp,
                        alamat,
                        tanggal_lahir: tanggalLahir || null,
                        jenis_kelamin: jenisKelamin || null,
                        membership,
                    })
                    .eq('id', editingPasienId);

                if (updateError) throw updateError;
                setMessage('Data pasien berhasil diperbarui!');
            } else {
                // Add new patient
                if (!password) {
                    throw new Error("Password diperlukan untuk membuat akun pasien baru.");
                }

                // 1. Create user in Supabase Auth
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            role: 'Pasien'
                        }
                    }
                });

                if (authError) {
                    throw authError;
                }

                // 2. If auth registration is successful, add patient details to pasien_user table
                if (authData.user) {
                    const { error: pasienInsertError } = await supabase
                        .from('pasien_user')
                        .insert({
                            id: authData.user.id,
                            email: authData.user.email,
                            nama,
                            no_hp: noHp,
                            alamat,
                            tanggal_lahir: tanggalLahir,
                            jenis_kelamin: jenisKelamin,
                            membership: 'Silver'
                        });

                    if (pasienInsertError) {
                        console.error("Error inserting into pasien_user, attempting to delete auth user:", pasienInsertError.message);
                        throw pasienInsertError;
                    }
                    setMessage('Pasien baru berhasil ditambahkan dan akun dibuat!');
                }
            }

            // Hide form and refresh list after successful submission
            setShowForm(false);
            setEditingPasienId(null);
            fetchPasien();

        } catch (err) {
            console.error('Error saving pasien:', err.message);
            setError(err.message || 'Terjadi kesalahan saat menyimpan data pasien.');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete patient
    const handleDelete = async (id) => {
        // Using a custom modal/dialog instead of window.confirm
        const isConfirmed = await new Promise((resolve) => {
            const dialog = document.createElement('div');
            dialog.className = 'fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50';
            dialog.innerHTML = `
                <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm text-center">
                    <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h3>
                    <p class="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus pasien ini? Ini juga akan menghapus akun loginnya!</p>
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
        try {
            const { error: deletePasienError } = await supabase
                .from('pasien_user')
                .delete()
                .eq('id', id);

            if (deletePasienError) {
                throw deletePasienError;
            }

            const { error: deleteAuthUserError } = await supabase.auth.admin.deleteUser(id);
            if (deleteAuthUserError) {
                console.warn("Gagal menghapus user dari auth.users (mungkin karena izin):", deleteAuthUserError.message);
            } else {
                console.log(`User ${id} deleted from auth.users.`);
            }

            setMessage('Pasien berhasil dihapus!');
            fetchPasien(); // Refresh list
        } catch (err) {
            console.error('Error deleting pasien:', err.message);
            setError('Gagal menghapus pasien: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to open form for adding new patient
    const handleAddPasien = () => {
        setEditingPasienId(null); // Clear any editing state
        setShowForm(true);
        setError(null); // Clear previous errors
        setMessage(null); // Clear previous messages
    };

    // Function to open form for editing patient
    const handleEditPasien = (id) => {
        setEditingPasienId(id);
        setShowForm(true);
        setError(null); // Clear previous errors
        setMessage(null); // Clear previous messages
    };

    // Function to close the form
    const handleCancelForm = () => {
        setShowForm(false);
        setEditingPasienId(null); // Clear editing state
        setError(null); // Clear errors
        setMessage(null); // Clear messages
    };

    // Loading state for initial list fetch
    if (loading && !pasienList.length && !showForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50"> {/* Background adjusted */}
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin w-16 h-16 text-pink-500 mb-4" />
                    <div className="text-pink-600 text-lg font-semibold">
                        Memuat daftar pasien...
                    </div>
                </div>
            </div>
        );
    }

    // Error state for list view
    if (error && !showForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-pink-50 p-6">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-red-700 mb-4">Terjadi Kesalahan!</h3>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button onClick={() => navigate('/dashboard')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md">
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50"> {/* Background adjusted */}
            <div className="py-8 pl-56 pr-8"> {/* Adjusted padding for right side */}
                <h2 className="text-5xl font-extrabold text-pink-800 mb-12 text-center drop-shadow-lg leading-tight">
                    <span className="block text-pink-600">Manajemen</span> Daftar Pasien <Users className="inline-block ml-4 text-pink-500" size={50} />
                </h2>

                {showForm ? (
                    // Form View (Styled like Diskon form)
                    <div className="p-8 bg-white rounded-2xl shadow-xl  transform transition-all duration-300 hover:scale-[1.01]"> {/* Removed max-w-3xl mx-auto */}
                        <h3 className="text-3xl font-bold text-pink-700 mb-8 text-center">
                            {editingPasienId ? 'Edit Data Pasien' : 'Tambah Pasien Baru'}
                        </h3>
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Lengkap */}
                                <div>
                                    <label htmlFor="nama" className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                        <input
                                            type="text"
                                            id="nama"
                                            className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            placeholder="Nama Lengkap"
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                        <input
                                            type="email"
                                            id="email"
                                            className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="email@example.com"
                                            required
                                            disabled={editingPasienId !== null}
                                        />
                                    </div>
                                </div>
                                {/* Password (only for new patient) */}
                                {!editingPasienId && (
                                    <div>
                                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password (untuk akun baru)</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                            <input
                                                type="password"
                                                id="password"
                                                className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="********"
                                                required={!editingPasienId}
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* No. HP */}
                                <div>
                                    <label htmlFor="noHp" className="block text-gray-700 text-sm font-bold mb-2">No. HP</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                        <input
                                            type="tel"
                                            id="noHp"
                                            className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                            value={noHp}
                                            onChange={(e) => setNoHp(e.target.value)}
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>
                                </div>
                                {/* Tanggal Lahir */}
                                <div>
                                    <label htmlFor="tanggalLahir" className="block text-gray-700 text-sm font-bold mb-2">Tanggal Lahir</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                        <input
                                            type="date"
                                            id="tanggalLahir"
                                            className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800"
                                            value={tanggalLahir}
                                            onChange={(e) => setTanggalLahir(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {/* Jenis Kelamin */}
                                <div>
                                    <label htmlFor="jenisKelamin" className="block text-gray-700 text-sm font-bold mb-2">Jenis Kelamin</label>
                                    <div className="relative">
                                        <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                        <select
                                            id="jenisKelamin"
                                            className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                                            value={jenisKelamin}
                                            onChange={(e) => setJenisKelamin(e.target.value)}
                                        >
                                            <option value="">Pilih</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                                        </div>
                                    </div>
                                </div>
                                {/* Alamat (full width) */}
                                <div className="md:col-span-2">
                                    <label htmlFor="alamat" className="block text-gray-700 text-sm font-bold mb-2">Alamat</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-pink-400" size={20} />
                                        <textarea
                                            id="alamat"
                                            className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 resize-y"
                                            value={alamat}
                                            onChange={(e) => setAlamat(e.target.value)}
                                            placeholder="Alamat lengkap"
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                                {/* Membership (full width) */}
                                <div className="md:col-span-2">
                                    <label htmlFor="membership" className="block text-gray-700 text-sm font-bold mb-2">Membership</label>
                                    <div className="relative">
                                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
                                        <select
                                            id="membership"
                                            className="pl-10 pr-4 py-2 w-full border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 appearance-none"
                                            value={membership}
                                            onChange={(e) => setMembership(e.target.value)}
                                        >
                                            <option value="Silver">Silver</option>
                                            <option value="Gold">Gold</option>
                                            <option value="Platinum">Platinum</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pink-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg border border-red-200 mb-4">
                                    {error}
                                </p>
                            )}
                            {message && (
                                <p className="text-green-500 text-sm text-center bg-green-100 p-3 rounded-lg border border-green-200 mb-4">
                                    {message}
                                </p>
                            )}

                            <div className="flex items-center justify-center space-x-4 mt-8">
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                    {loading ? 'Menyimpan...' : 'Simpan'}
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
                    // List View (Table-like structure, styled like Diskon table)
                    <>
                        <div className="flex justify-end mb-8"> {/* Removed pr-4, now parent handles right padding */}
                            <button
                                onClick={handleAddPasien}
                                className="flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-xl transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300 focus:ring-opacity-75"
                            >
                                <PlusCircle className="mr-3 h-6 w-6" />
                                Tambah Pasien Baru
                            </button>
                        </div>

                        {message && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-8 w-full shadow-md flex items-center justify-center" role="alert">
                                <CheckCircle className="mr-3 h-6 w-6" />
                                <span className="block sm:inline font-semibold">{message}</span>
                            </div>
                        )}

                        {pasienList.length === 0 ? (
                            <div className="text-center text-gray-700 p-10 bg-white rounded-xl shadow-lg border border-pink-200 w-full">
                                <p className="text-2xl font-semibold mb-4">Tidak ada data pasien yang ditemukan.</p>
                                <p className="text-lg">Mulai tambahkan pasien baru untuk melihat daftar di sini.</p>
                                <img
                                    src="https://placehold.co/300x200/FCE7F3/BE185D?text=No+Patients"
                                    alt=""
                                    className="mx-auto mt-6 rounded-lg shadow-md"
                                />
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 p-6 bg-pink-100 font-bold text-pink-700 text-lg border-b border-pink-200">
                                    <div className="col-span-2 flex items-center"><User className="mr-2" size={18} />Nama</div>
                                    <div className="col-span-3 flex items-center"><Mail className="mr-2" size={18} />Email</div>
                                    <div className="col-span-1 flex items-center"><Phone className="mr-2" size={18} />No. HP</div>
                                    <div className="col-span-2 flex items-center"><MapPin className="mr-2" size={18} />Alamat</div>
                                    <div className="col-span-1 flex items-center"><Calendar className="mr-2" size={18} />Tgl. Lahir</div>
                                    <div className="col-span-1 flex items-center"><Heart className="mr-2" size={18} />Jenis Kelamin</div>
                                    <div className="col-span-1 text-right">Aksi</div>
                                </div>

                                {/* Table Rows */}
                                {pasienList.map((pasien, index) => (
                                    <div
                                        key={pasien.id}
                                        className={`grid grid-cols-12 gap-4 p-6 text-gray-800 border-b border-pink-50
                                            ${index % 2 === 0 ? 'bg-white' : 'bg-pink-50'}
                                            hover:bg-pink-100 transition-colors duration-200 ease-in-out
                                            items-center
                                        `}
                                    >
                                        {/* Nama */}
                                        <div className="col-span-2 font-semibold flex items-center">
                                            {pasien.nama}
                                        </div>
                                        {/* Email */}
                                        <div className="col-span-3 flex items-center">
                                            <span className="truncate">{pasien.email}</span>
                                        </div>
                                        {/* No. HP */}
                                        <div className="col-span-1 flex items-center">
                                            {pasien.no_hp || 'N/A'}
                                        </div>
                                        {/* Alamat */}
                                        <div className="col-span-2 flex items-center">
                                            <span className="truncate">{pasien.alamat || 'N/A'}</span>
                                        </div>
                                        {/* Tanggal Lahir */}
                                        <div className="col-span-1 flex items-center">
                                            {pasien.tanggal_lahir ? dayjs(pasien.tanggal_lahir).format('DD MMM YYYY') : 'N/A'}
                                        </div>
                                        {/* Jenis Kelamin */}
                                        <div className="col-span-1 flex items-center">
                                            {pasien.jenis_kelamin || 'N/A'}
                                        </div>
                                        {/* Actions */}
                                        <div className="col-span-1 flex justify-end space-x-3">
                                            <button
                                                onClick={() => handleEditPasien(pasien.id)}
                                                className="flex items-center text-pink-600 hover:text-pink-800 font-semibold text-sm transition-colors duration-200 transform hover:scale-105"
                                                title="Edit Pasien"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pasien.id)}
                                                className="flex items-center text-red-600 hover:text-red-800 font-semibold text-sm transition-colors duration-200 transform hover:scale-105"
                                                title="Hapus Pasien"
                                            >
                                                <Trash2 size={18} />
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
};

export default ListPasien;
