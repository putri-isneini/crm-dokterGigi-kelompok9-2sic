import { useState, useEffect } from 'react';

function FaqForm({ addFaq, updateFaq, editingFaq }) {
  const [pertanyaan, setPertanyaan] = useState('');
  const [jawaban, setJawaban] = useState('');

  useEffect(() => {
    if (editingFaq) {
      setPertanyaan(editingFaq.pertanyaan);
      setJawaban(editingFaq.jawaban);
    } else {
      setPertanyaan('');
      setJawaban('');
    }
  }, [editingFaq]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { pertanyaan, jawaban };

    if (editingFaq) {
      updateFaq({ ...data, id: editingFaq.id });
    } else {
      addFaq(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 shadow">
      <h2 className="text-pink-600 text-lg font-semibold mb-4">
        {editingFaq ? 'Edit FAQ' : 'Tambah FAQ'}
      </h2>

      <div className="mb-3">
        <label className="text-pink-600 text-sm block mb-1">Pertanyaan</label>
        <input
          type="text"
          value={pertanyaan}
          onChange={(e) => setPertanyaan(e.target.value)}
          placeholder="Masukkan pertanyaan"
          className="w-full p-2 rounded border bg-pink-50 focus:outline-pink-400"
          required
        />
      </div>

      <div className="mb-3">
        <label className="text-pink-600 text-sm block mb-1">Jawaban</label>
        <input
          type="text"
          value={jawaban}
          onChange={(e) => setJawaban(e.target.value)}
          placeholder="Masukkan jawaban"
          className="w-full p-2 rounded border bg-pink-50 focus:outline-pink-400"
          required
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded font-semibold"
      >
        {editingFaq ? 'Update FAQ' : 'Tambah FAQ'}
      </button>
    </form>
  );
}

export default FaqForm;
