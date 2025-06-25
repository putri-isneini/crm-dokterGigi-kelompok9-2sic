import { useState, useEffect } from 'react';

const FaqForm = ({ addFaq, updateFaq, editingFaq }) => {
  const [form, setForm] = useState({
    pertanyaan: '',
    jawaban: '',
    kategori: ''
  });

  // Jika sedang edit, isi form-nya; jika tidak, kosongkan
  useEffect(() => {
    if (editingFaq) {
      setForm(editingFaq);
    } else {
      setForm({ pertanyaan: '', jawaban: '', kategori: '' });
    }
  }, [editingFaq]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi input
    if (
      !form.pertanyaan.trim() ||
      !form.jawaban.trim() ||
      !form.kategori.trim()
    ) {
      alert('Semua kolom wajib diisi.');
      return;
    }

    // Simpan data
    if (editingFaq) {
      updateFaq(form);
    } else {
      addFaq(form);
    }

    // Reset form setelah submit
    setForm({ pertanyaan: '', jawaban: '', kategori: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Pertanyaan"
        className="w-full p-2 border rounded"
        value={form.pertanyaan}
        onChange={e => setForm({ ...form, pertanyaan: e.target.value })}
      />

      <textarea
        placeholder="Jawaban"
        className="w-full p-2 border rounded"
        rows={3}
        value={form.jawaban}
        onChange={e => setForm({ ...form, jawaban: e.target.value })}
      />

      <input
        type="text"
        placeholder="Kategori"
        className="w-full p-2 border rounded"
        value={form.kategori}
        onChange={e => setForm({ ...form, kategori: e.target.value })}
      />

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {editingFaq ? 'Perbarui' : 'Tambah'}
      </button>
    </form>
  );
};

export default FaqForm;
