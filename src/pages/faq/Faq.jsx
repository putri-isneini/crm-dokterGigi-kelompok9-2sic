import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import FaqForm from './FaqForm'; // ✅ pastikan file FaqForm masih di folder yang sama

function Faq() {
  const [faqList, setFaqList] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);

  // Ambil semua FAQ dari Supabase
  const fetchFaq = async () => {
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Gagal fetch FAQ:', error);
    else setFaqList(data);
  };

  // Tambah FAQ baru
  const addFaq = async (data) => {
    const { error } = await supabase.from('faq').insert(data);
    if (error) console.error('Gagal tambah FAQ:', error);
    else fetchFaq();
  };

  // Update FAQ yang sedang diedit
  const updateFaq = async (data) => {
    const { error } = await supabase
      .from('faq')
      .update(data)
      .eq('id', data.id);

    if (error) console.error('Gagal update FAQ:', error);
    else {
      fetchFaq();
      setEditingFaq(null); // reset form edit
    }
  };

  // Hapus FAQ
  const deleteFaq = async (id) => {
    const { error } = await supabase
      .from('faq')
      .delete()
      .eq('id', id);

    if (error) console.error('Gagal hapus FAQ:', error);
    else fetchFaq();
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar FAQ</h1>

      <FaqForm
        addFaq={addFaq}
        updateFaq={updateFaq}
        editingFaq={editingFaq}
      />

      <ul className="mt-4">
        {faqList.map((faq) => (
          <li key={faq.id} className="border p-3 mb-2 rounded shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-gray-800">{faq.pertanyaan}</p>
                <p className="text-sm text-gray-600 mt-1">{faq.jawaban}</p>
                <p className="text-xs text-gray-500 mt-1 italic">Kategori: {faq.kategori}</p>
              </div>
              <div className="text-right text-sm space-y-1">
                <button
                  onClick={() => setEditingFaq(faq)}
                  className="text-blue-600 hover:underline block"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteFaq(faq.id)}
                  className="text-red-600 hover:underline block"
                >
                  Hapus
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Faq;
