import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Trash2, PlusCircle } from 'lucide-react'

const FAQList = () => {
  const navigate = useNavigate()
  const [faqs, setFaqs] = useState(JSON.parse(localStorage.getItem('faqs')) || [])

  const handleDelete = (id) => {
    const updated = faqs.filter((faq) => faq.id !== id)
    setFaqs(updated)
    localStorage.setItem('faqs', JSON.stringify(updated))
  }

  return (
    <div className="p-8 bg-pink-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-rose-600">FAQ (Pertanyaan Umum)</h1>
        <Link
          to="/faq/tambah"
          className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition inline-flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Tambah FAQ
        </Link>
      </div>

      <div className="space-y-4">
        {faqs.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-xl p-4 border-l-4 border-rose-300 flex justify-between items-start"
          >
            <div>
              <h2 className="text-lg font-semibold text-rose-700">{item.question}</h2>
              <p className="mt-2 text-gray-700">{item.answer}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/faq/edit/${item.id}`)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQList
