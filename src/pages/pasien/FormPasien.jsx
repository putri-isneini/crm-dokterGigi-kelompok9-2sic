// src/pages/pasien/FormPasien.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

const FormPasien = () => {
    const [id, setId] = useState(null); 
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [noHp, setNoHp] = useState('');
    const [alamat, setAlamat] = useState('');
    const [tanggalLahir, setTanggalLahir] = useState('');
    const [jenisKelamin, setJenisKelamin] = useState('');
    const [membership, setMembership] = useState('Silver'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const pasienId = queryParams.get('id');
        if (pasienId) {
            setId(pasienId);
            const fetchPasien = async () => {
                setLoading(true);
                setError(null);
                try {
                    const { data, error: fetchError } = await supabase
                        .from('pasien_user')
                        .select('*')
                        .eq('id', pasienId)
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
            fetchPasien();
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (id) {
                // Update pasien yang sudah ada
                const { error: updateError } = await supabase
                    .from('pasien_user')
                    .update({
                        nama,
                        // Email tidak diupdate di sini karena itu kunci di auth.users
                        no_hp: noHp,
                        alamat,
                        tanggal_lahir: tanggalLahir || null,
                        jenis_kelamin: jenisKelamin || null,
                        membership,
                    })
                    .eq('id', id);

                if (updateError) throw updateError;
                setMessage('Data pasien berhasil diperbarui!');
            } else {
                // Tambah pasien baru
                if (!password) {
                    throw new Error("Password diperlukan untuk membuat akun pasien baru.");
                }

                // 1. Buat user di Supabase Auth
                // Peran 'Pasien' akan disetel di user_metadata
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

                // 2. Jika pendaftaran auth berhasil, tambahkan detail pasien ke tabel pasien_user
                // ID pasien_user akan sama dengan ID dari Supabase Auth
                if (authData.user) {
                    const { error: pasienInsertError } = await supabase
                        .from('pasien_user')
                        .insert({
                            id: authData.user.id, // Gunakan ID dari Supabase Auth sebagai PK
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
                        // Jika gagal menyimpan ke pasien_user, hapus user dari auth
                        // Ini memerlukan service_role key di Supabase untuk bisa menghapus user auth dari client-side
                        // Jika tidak, user auth akan tetap ada tanpa profil pasien
                        // await supabase.auth.admin.deleteUser(authData.user.id);
                        throw pasienInsertError;
                    }
                    setMessage('Pasien baru berhasil ditambahkan dan akun dibuat!');
                }
            }

            setTimeout(() => {
                navigate('/listpasien');
            }, 1500);

        } catch (err) {
            console.error('Error saving pasien:', err.message);
            setError(err.message || 'Terjadi kesalahan saat menyimpan data pasien.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center">
                {id ? 'Edit Data Pasien' : 'Tambah Pasien Baru'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="nama" className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                    <input
                        type="text"
                        id="nama"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={id !== null} // Email tidak bisa diubah saat edit karena itu PK auth.users
                    />
                </div>
                {!id && ( // Tampilkan password hanya saat tambah baru
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password (untuk akun baru)</label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!id} // Wajib diisi hanya saat tambah baru
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="noHp" className="block text-gray-700 text-sm font-bold mb-2">No. HP</label>
                    <input
                        type="tel"
                        id="noHp"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={noHp}
                        onChange={(e) => setNoHp(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="alamat" className="block text-gray-700 text-sm font-bold mb-2">Alamat</label>
                    <textarea
                        id="alamat"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        rows="3"
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="tanggalLahir" className="block text-gray-700 text-sm font-bold mb-2">Tanggal Lahir</label>
                    <input
                        type="date"
                        id="tanggalLahir"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={tanggalLahir}
                        onChange={(e) => setTanggalLahir(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="jenisKelamin" className="block text-gray-700 text-sm font-bold mb-2">Jenis Kelamin</label>
                    <select
                        id="jenisKelamin"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={jenisKelamin}
                        onChange={(e) => setJenisKelamin(e.target.value)}
                    >
                        <option value="">Pilih</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="membership" className="block text-gray-700 text-sm font-bold mb-2">Membership</label>
                    <select
                        id="membership"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={membership}
                        onChange={(e) => setMembership(e.target.value)}
                    >
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                    </select>
                </div>

                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/listpasien')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormPasien;
