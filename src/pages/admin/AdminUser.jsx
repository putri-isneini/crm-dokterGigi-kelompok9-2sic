import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import AdminUserForm from './AdminUserForm';

function AdminUser() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    const { data, error } = await supabase
      .from('admin_user')
      .select('id, email, username, role, password_hash, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal fetch admin_user:', error);
    } else {
      setAdminUsers(data);
    }
  };

  const addUser = async (formData) => {
    const { email, password, username, role } = formData;

    if (!email || !password || !username || !role) {
      alert("Semua field wajib diisi");
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      alert("Email tidak valid");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter");
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error("Gagal daftar Supabase Auth:", signUpError.message);
      alert("Gagal daftar: " + signUpError.message);
      return;
    }

    const userId = signUpData?.user?.id;

    const { error: insertError } = await supabase
      .from("admin_user")
      .insert({
        id: userId,
        email,
        username,
        role,
        password_hash: password, // password disimpan ke kolom password_hash
      });

    if (insertError) {
      console.error("Gagal tambah ke admin_user:", insertError.message);
      alert("Gagal simpan admin_user: " + insertError.message);
    } else {
      alert("Admin berhasil ditambahkan");
      fetchAdminUsers();
    }
  };

  const updateUser = async (formData) => {
    const { id, email, username, role, password } = formData;

    const { error } = await supabase
      .from('admin_user')
      .update({
        email,
        username,
        role,
        password_hash: password,
      })
      .eq('id', id);

    if (error) {
      console.error('Gagal update user:', error.message);
    } else {
      fetchAdminUsers();
      setEditingUser(null);
    }
  };

  const deleteUser = async (id) => {
    const { error } = await supabase
      .from('admin_user')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Gagal hapus user:', error.message);
    } else {
      fetchAdminUsers();
    }
  };

  const togglePassword = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-pink-50 min-h-screen flex justify-center py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-center text-pink-600 mb-6">
          Manajemen Admin User
        </h1>

        <AdminUserForm
          addUser={addUser}
          updateUser={updateUser}
          editingUser={editingUser}
        />

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-pink-100 text-pink-700">
              <tr>
                <th className="border p-3">Email</th>
                <th className="border p-3">Username</th>
                <th className="border p-3">Role</th>
                <th className="border p-3">Password</th>
                <th className="border p-3">Tanggal Dibuat</th>
                <th className="border p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {adminUsers.length > 0 ? (
                adminUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="border p-3">{user.email}</td>
                    <td className="border p-3">{user.username}</td>
                    <td className="border p-3">{user.role}</td>
                    <td className="border p-3">
                      {showPasswords[user.id] ? (
                        <span>{user.password_hash}</span>
                      ) : (
                        <span>{'●'.repeat(user.password_hash?.length || 8)}</span>
                      )}
                      <button
                        onClick={() => togglePassword(user.id)}
                        className="ml-2 text-xs text-blue-600 underline"
                      >
                        {showPasswords[user.id] ? 'Sembunyikan' : 'Lihat'}
                      </button>
                    </td>
                    <td className="border p-3">
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="border p-3 space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-pink-600 hover:bg-pink-700 text-white text-xs px-3 py-1 rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="italic text-gray-500 p-4">
                    Belum ada data admin
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUser;
