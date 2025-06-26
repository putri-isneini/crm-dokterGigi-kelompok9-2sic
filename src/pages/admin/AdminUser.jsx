import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import AdminUserForm from "./AdminUserForm";

function AdminUser() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // Ambil semua data admin
  const fetchAdminUsers = async () => {
    const { data, error } = await supabase
      .from('admin_user')
      .select('id, username, role, created_at') // jangan ambil password_hash
      .order('created_at', { ascending: false });

    if (error) console.error('Gagal fetch admin_user:', error);
    else setAdminUsers(data);
  };

  // Tambah user baru
  const addUser = async (formData) => {
    const { password, ...rest } = formData;
    if (!password) return alert('Password wajib diisi');

    const { error } = await supabase
      .from('admin_user')
      .insert({ ...rest, password_hash: password });

    if (error) console.error('Gagal tambah user:', error);
    else fetchAdminUsers();
  };

  // Perbarui data user
  const updateUser = async (formData) => {
    const { password, ...rest } = formData;

    const updateData = {
      ...rest,
      ...(password && { password_hash: password })
    };

    const { error } = await supabase
      .from('admin_user')
      .update(updateData)
      .eq('id', formData.id);

    if (error) console.error('Gagal update user:', error);
    else {
      fetchAdminUsers();
      setEditingUser(null); // reset mode edit
    }
  };

  // Hapus user
  const deleteUser = async (id) => {
    const { error } = await supabase
      .from('admin_user')
      .delete()
      .eq('id', id);

    if (error) console.error('Gagal hapus user:', error);
    else fetchAdminUsers();
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manajemen Admin User</h1>

      <AdminUserForm
        addUser={addUser}
        updateUser={updateUser}
        editingUser={editingUser}
      />

      <ul className="mt-4">
        {adminUsers.map(user => (
          <li key={user.id} className="border p-2 my-2 flex justify-between items-start">
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
            </div>
            <div className="space-x-2 text-sm">
              <button
                onClick={() => setEditingUser(user)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUser;
