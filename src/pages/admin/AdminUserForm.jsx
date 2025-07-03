import { useState, useEffect } from 'react';

const AdminUserForm = ({ addUser, updateUser, editingUser }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'Admin',
  });

  useEffect(() => {
    if (editingUser) {
      setForm({
        username: editingUser.username || '',
        password: '',
        role: editingUser.role || 'Admin',
      });
    } else {
      setForm({ username: '', password: '', role: 'Admin' });
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username.trim() || (!editingUser && !form.password.trim())) {
      alert('Username dan Password wajib diisi.');
      return;
    }

    const userData = {
      id: editingUser?.id,
      username: form.username.trim(),
      role: form.role,
      ...(form.password.trim() && { password: form.password }),
    };

    if (editingUser) {
      updateUser(userData);
    } else {
      addUser(userData);
    }

    setForm({ username: '', password: '', role: 'Admin' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-pink-600 text-lg font-semibold mb-4">
        {editingUser ? 'Edit Admin User' : 'Tambah Admin User'}
      </h2>

      <div className="mb-3">
        <label className="text-pink-600 text-sm block mb-1">Username</label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Masukkan username"
          className="w-full p-2 border rounded bg-pink-50 focus:outline-pink-400"
          required
        />
      </div>

      <div className="mb-3">
        <label className="text-pink-600 text-sm block mb-1">Password</label>
        <input
          type="password"
          autoComplete="off"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder={
            editingUser ? 'Kosongkan jika tidak ingin mengganti password' : 'Masukkan password'
          }
          className="w-full p-2 border rounded bg-pink-50 focus:outline-pink-400"
          required={!editingUser}
        />
      </div>

      <div className="mb-3">
        <label className="text-pink-600 text-sm block mb-1">Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full p-2 border rounded bg-pink-50 focus:outline-pink-400"
        >
          <option value="Admin">Admin</option>
          <option value="Dokter">Dokter</option>
          <option value="Staf">Staf</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold"
      >
        {editingUser ? 'Perbarui Admin' : 'Tambah Admin'}
      </button>
    </form>
  );
};

export default AdminUserForm;
