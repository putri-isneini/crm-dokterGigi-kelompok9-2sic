import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import AdminUserForm from './AdminUserForm';

function AdminUser() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    const { data, error } = await supabase
      .from('admin_user')
      .select('id, username, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal fetch admin_user:', error);
    } else {
      setAdminUsers(data);
    }
  };

  const addUser = async (formData) => {
    const { password, ...rest } = formData;

    if (!password) {
      alert('Password wajib diisi');
      return;
    }

    const { error } = await supabase
      .from('admin_user')
      .insert({ ...rest, password_hash: password });

    if (error) {
      console.error('Gagal tambah user:', error);
    } else {
      fetchAdminUsers();
    }
  };

  const updateUser = async (formData) => {
    const { password, ...rest } = formData;

    const updateData = {
      ...rest,
      ...(password && { password_hash: password }),
    };

    const { error } = await supabase
      .from('admin_user')
      .update(updateData)
      .eq('id', formData.id);

    if (error) {
      console.error('Gagal update user:', error);
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
      console.error('Gagal hapus user:', error);
    } else {
      fetchAdminUsers();
    }
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
                <th className="border p-3">Username</th>
                <th className="border p-3">Role</th>
                <th className="border p-3">Tanggal Dibuat</th>
                <th className="border p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {adminUsers.length > 0 ? (
                adminUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="border p-3">{user.username}</td>
                    <td className="border p-3">{user.role}</td>
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
                  <td colSpan="4" className="italic text-gray-500 p-4">
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
