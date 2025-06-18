import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TambahFAQ = () => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const faqs = JSON.parse(localStorage.getItem('faqs')) || []
    const newFaq = { id: Date.now(), question, answer }
    const updatedFaqs = [...faqs, newFaq]
    localStorage.setItem('faqs', JSON.stringify(updatedFaqs))
    navigate('/faq')
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md border border-rose-200 w-full max-w-xl"
      >
        <h1 className="text-2xl font-bold text-rose-600 mb-6 text-center">Tambah FAQ Baru</h1>
        <label className="block text-rose-700 mb-2">Pertanyaan</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 border border-rose-300 rounded-lg mb-4"
          required
        />
        <label className="block text-rose-700 mb-2">Jawaban</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-3 border border-rose-300 rounded-lg mb-6 h-28 resize-none"
          required
        />
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/faq')}
            className="text-rose-500 hover:underline"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  )
}

export default TambahFAQ
