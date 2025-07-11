// src/components/FaqSection.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // Pastikan path supabase benar
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'; // Untuk ikon accordion

const FaqSection = () => {
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null); // State untuk mengontrol accordion

  useEffect(() => {
    const fetchFaq = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ambil semua FAQ, karena ini untuk tampilan publik
        const { data, error } = await supabase
          .from('faq')
          .select('id, pertanyaan, jawaban, kategori')
          .order('created_at', { ascending: true }); // Urutkan berdasarkan tanggal dibuat

        if (error) {
          throw error;
        }
        setFaqList(data);
      } catch (err) {
        console.error('Gagal fetch FAQ untuk halaman depan:', err.message);
        setError('Gagal memuat pertanyaan umum. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return <div className="text-center text-gray-600 py-10">Memuat pertanyaan umum...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  }

  if (faqList.length === 0) {
    return <div className="text-center text-gray-500 py-10 italic">Belum ada pertanyaan umum yang tersedia.</div>;
  }

  return (
    <section className="py-16 bg-pink-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-5xl font-extrabold text-pink-700 text-center mb-12 leading-tight">
          Pertanyaan yang Sering Diajukan <span className="text-pink-400">❓</span>
        </h2>

        <div className="space-y-6">
          {faqList.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden transition-all duration-300 ease-in-out"
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-opacity-75"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-xl font-semibold text-gray-800">
                  {faq.pertanyaan}
                </span>
                {openIndex === index ? (
                  <ChevronUpIcon className="w-6 h-6 text-pink-500" />
                ) : (
                  <ChevronDownIcon className="w-6 h-6 text-pink-500" />
                )}
              </button>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{
                  maxHeight: openIndex === index ? '1000px' : '0', // Nilai besar untuk transisi
                  opacity: openIndex === index ? '1' : '0',
                }}
              >
                <div className="p-6 pt-0 text-gray-700 border-t border-pink-100">
                  <p>{faq.jawaban}</p>
                  {faq.kategori && (
                    <span className="mt-4 inline-block bg-pink-100 text-pink-600 text-xs font-medium px-3 py-1 rounded-full">
                      {faq.kategori}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
