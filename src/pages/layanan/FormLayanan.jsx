import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase'; // Pastikan path benar

function FormLayanan({ addLayanan, updateLayanan, editingLayanan, setEditingLayanan }) {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [gambarFile, setGambarFile] = useState(null); // State untuk file gambar yang dipilih
  const [gambarPreview, setGambarPreview] = useState(null); // State untuk preview gambar
  const [uploading, setUploading] = useState(false); // State untuk indikator upload

  useEffect(() => {
    if (editingLayanan) {
      setNama(editingLayanan.nama);
      setDeskripsi(editingLayanan.deskripsi);
      setHarga(editingLayanan.harga);
      setGambarPreview(editingLayanan.gambar); // Set preview jika ada gambar existing
    } else {
      resetForm();
    }
  }, [editingLayanan]);

  const resetForm = () => {
    setNama('');
    setDeskripsi('');
    setHarga('');
    setGambarFile(null);
    setGambarPreview(null);
    setEditingLayanan(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambarFile(file);
      setGambarPreview(URL.createObjectURL(file)); // Buat URL preview
    } else {
      setGambarFile(null);
      setGambarPreview(null);
    }
  };

  const uploadGambar = async (file) => {
    if (!file) return null;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`; // Nama unik
    const filePath = `layanan_images/${fileName}`; // Folder di bucket Anda

    const { data, error } = await supabase.storage
      .from('layanan-gambar') // <<< SUDAH DISESUAIKAN KE 'layanan-gambar'
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    setUploading(false);

    if (error) {
      console.error('Gagal mengunggah gambar:', error.message);
      alert('Gagal mengunggah gambar: ' + error.message);
      return null;
    }

    // Dapatkan URL publik setelah upload
    const { data: publicUrlData } = supabase.storage
      .from('layanan-gambar') // <<< SUDAH DISESUAIKAN KE 'layanan-gambar'
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = editingLayanan ? editingLayanan.gambar : null; // Default ke gambar existing
    if (gambarFile) { // Jika ada file baru dipilih
      imageUrl = await uploadGambar(gambarFile);
      if (!imageUrl) {
        // Jika upload gagal, hentikan proses submit
        return;
      }
    }

    const layananData = {
      nama,
      deskripsi,
      harga: parseFloat(harga),
      gambar: imageUrl, // Gunakan URL gambar
    };

    if (editingLayanan) {
      await updateLayanan({ ...layananData, id: editingLayanan.id });
    } else {
      await addLayanan(layananData);
    }
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-pink-200">
      <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">
        {editingLayanan ? 'Edit Layanan' : 'Tambah Layanan Baru'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nama" className="block text-gray-700 text-lg font-semibold mb-2">Nama Layanan</label>
          <input
            type="text"
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent transition"
            placeholder="Misal: Pembersihan Karang Gigi"
          />
        </div>

        <div>
          <label htmlFor="harga" className="block text-gray-700 text-lg font-semibold mb-2">Harga (Rp)</label>
          <input
            type="number"
            id="harga"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            required
            className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent transition"
            placeholder="Misal: 350000"
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="deskripsi" className="block text-gray-700 text-lg font-semibold mb-2">Deskripsi</label>
        <textarea
          id="deskripsi"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows="4"
          className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent transition resize-y"
          placeholder="Jelaskan detail layanan ini..."
        ></textarea>
      </div>

      <div className="mt-6">
        <label htmlFor="gambar" className="block text-gray-700 text-lg font-semibold mb-2">Gambar Layanan</label>
        <input
          type="file"
          id="gambar"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
        />
        {gambarPreview && (
          <div className="mt-4">
            <p className="text-gray-600 text-sm mb-2">Preview Gambar:</p>
            <img src={gambarPreview} alt="Preview" className="w-40 h-40 object-cover rounded-xl shadow-md border border-gray-200" />
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={uploading}
        >
          {uploading ? 'Mengunggah...' : (editingLayanan ? 'Update Layanan' : 'Tambah Layanan')}
        </button>
        {editingLayanan && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-8 rounded-full shadow-md transition duration-200"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

export default FormLayanan;