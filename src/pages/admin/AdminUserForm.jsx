import { useState, useEffect } from 'react';

const AdminUserForm = ({ addUser, updateUser, editingUser }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: 'Admin'
  });

  // Isi form saat mode edit
  useEffect(() => {
    if (editingUser) {
      setForm({
        username: editingUser.username || '',
        password: '', // password tidak ditampilkan saat edit
        role: editingUser.role || 'Admin'
      });
    } else {
      setForm({ username: '', password: '', role: 'Admin' });
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi input
    if (!form.username.trim() || (!editingUser && !form.password.trim())) {
      alert('Username dan Password wajib diisi.');
      return;
    }

    const userData = {
      id: editingUser?.id, // penting untuk update
      username: form.username.trim(),
      role: form.role,
      ...(form.password.trim() && { password: form.password })
    };

    if (editingUser) {
      updateUser(userData);
    } else {
      addUser(userData);
    }

    // Reset form
    setForm({ username: '', password: '', role: 'Admin' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border rounded"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        autoComplete="off"
        placeholder={editingUser ? 'Kosongkan jika tidak diganti' : 'Password'}
        className="w-full p-2 border rounded"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select
        className="w-full p-2 border rounded"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="Admin">Admin</option>
        <option value="Dokter">Dokter</option>
        <option value="Staf">Staf</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {editingUser ? 'Perbarui' : 'Tambah'}
      </button>
    </form>
  );
};

export default AdminUserForm;
