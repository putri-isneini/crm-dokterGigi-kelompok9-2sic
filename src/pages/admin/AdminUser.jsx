// src/pages/admin/AdminUser.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';

function AdminUser() {
    const [adminUsers, setAdminUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchAdminUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('admin_user')
                .select('id, email, nama, role, created_at') // Select 'nama' instead of 'username'
                .order('created_at', { ascending: false }); // Order by created_at

            if (error) {
                throw error;
            }
            setAdminUsers(data);
        } catch (err) {
            console.error('Gagal fetch admin_user:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteAdminUser = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus user admin ini?')) {
            const { error } = await supabase
                .from('admin_user')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Gagal menghapus user admin: ' + error.message);
            } else {
                fetchAdminUsers();
            }
        }
    };

    useEffect(() => {
        fetchAdminUsers();
    }, []);

    if (loading) {
        return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat daftar admin user...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-lg text-red-600 font-semibold">Error: {error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 bg-pink-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-pink-700 mb-10 text-center">
                👥 Manajemen Admin & Staf
            </h1>

            <div className="mb-8 text-right">
                <button
                    onClick={() => navigate('/admin/tambah')}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
                >
                    + Tambah Admin/Staf Baru
                </button>
            </div>

            {adminUsers.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-pink-100">
                    <table className="min-w-full divide-y divide-pink-200">
                        <thead className="bg-pink-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Dibuat Pada</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-pink-200">
                            {adminUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nama || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* Edit button would go here, if you have an edit form */}
                                        <button
                                            onClick={() => deleteAdminUser(user.id)}
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
                    Belum ada user admin/staf yang ditambahkan.
                </p>
            )}
        </div>
    );
}

export default AdminUser;
