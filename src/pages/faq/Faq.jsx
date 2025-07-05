import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import FaqForm from './FaqForm';

function Faq() {
  const [faqList, setFaqList] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    const { data, error } = await supabase
      .from('faq')
      .select('id, pertanyaan, jawaban, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal fetch FAQ:', error);
    } else {
      setFaqList(data);
    }
  };

  const addFaq = async (data) => {
    const { error } = await supabase.from('faq').insert(data);
    if (error) {
      console.error('Gagal tambah FAQ:', error);
    } else {
      fetchFaq();
    }
  };

  const updateFaq = async (data) => {
    const { error } = await supabase
      .from('faq')
      .update(data)
      .eq('id', data.id);

    if (error) {
      console.error('Gagal update FAQ:', error);
    } else {
      fetchFaq();
      setEditingFaq(null);
    }
  };

  const deleteFaq = async (id) => {
    const { error } = await supabase.from('faq').delete().eq('id', id);
    if (error) {
      console.error('Gagal hapus FAQ:', error);
    } else {
      fetchFaq();
    }
  };

  return (
    <div className="bg-pink-50 min-h-screen flex justify-center py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-center text-pink-600 mb-6">
          Manajemen FAQ
        </h1>

        <FaqForm
          addFaq={addFaq}
          updateFaq={updateFaq}
          editingFaq={editingFaq}
        />

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-pink-100 text-pink-700">
              <tr>
                <th className="border p-3">Pertanyaan</th>
                <th className="border p-3">Jawaban</th>
                <th className="border p-3">Tanggal Dibuat</th>
                <th className="border p-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {faqList.length > 0 ? (
                faqList.map((faq) => (
                  <tr key={faq.id}>
                    <td className="border p-3">{faq.pertanyaan}</td>
                    <td className="border p-3">{faq.jawaban}</td>
                    <td className="border p-3">
                      {new Date(faq.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="border p-3 space-x-2">
                      <button
                        onClick={() => setEditingFaq(faq)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFaq(faq.id)}
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
                    Belum ada data FAQ
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

export default Faq;
