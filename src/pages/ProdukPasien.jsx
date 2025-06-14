import { useEffect, useState } from 'react'

const dataAwal = [
  {
    nama: 'Sikat Gigi Ortho',
    harga: 'Rp15.000',
    stok: 100,
    gambar: 'https://www.tokodental.com/image-product/img1804-1652684892.jpg',
  },
  {
    nama: 'Obat Kumur Antiseptik',
    harga: 'Rp25.000',
    stok: 50,
    gambar: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//95/MTA-23296702/betadine_betadine-obat-kumur-antiseptik-190-ml_full01.jpg',
  },
  {
    nama: 'Pasta Gigi Sensitif',
    harga: 'Rp20.000',
    stok: 80,
    gambar: 'https://assets.unileversolutions.com/v1/2238574.png',
  },
  {
    nama: 'Mouthwash Herbal',
    harga: 'Rp28.000',
    stok: 70,
    gambar: 'https://maxmartonline.com/images/thumbs/0016628_pepsodent-mouth-wash-herbal-naturals-500ml_510.jpeg',
  },
  {
    nama: 'Pasta Gigi Anak',
    harga: 'Rp25.000',
    stok: 90,
    gambar: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//98/MTA-4158719/enzim_enzim_pasta_gigi_anak-anak_strawberry_50ml_full02.jpg',
  },
  {
    nama: 'Tablet Fluoride',
    harga: 'Rp30.000',
    stok: 40,
    gambar: 'https://image-cdn.medkomtek.com/nDG8oIh43yEZyyj0qv2gaUZgR1I=/673x373/smart/klikdokter-media-buckets/medias/2311541/original/026451400_1578452502-vinafluor_fluoride_1mg_100tablet_2.jpg',
  },
  {
    nama: 'Tongue Cleaner',
    harga: 'Rp10.000',
    stok: 75,
    gambar: 'https://healthnutsaustralia.com.au/cdn/shop/files/DU01_2.webp?v=1710066102&width=1445',
  },
  {
    nama: 'Sikat Interdental',
    harga: 'Rp16.000',
    stok: 55,
    gambar: 'https://axeldental.id/wp-content/uploads/2024/05/Sikat-Gigi-interdental-800-x-490px.jpg',
  },
  {
    nama: 'Pelembap Bibir Pasien',
    harga: 'Rp8.000',
    stok: 200,
    gambar: 'https://d2qjkwm11akmwu.cloudfront.net/products/63611_24-5-2021_10-0-15-1665807880.webp',
  },
  {
    nama: 'Obat Nyeri Gigi',
    harga: 'Rp18.000',
    stok: 100,
    gambar: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/medium//94/MTA-22434069/mefinal_mefinal-250-mg-strip-10-kapsul_full01.jpg',
  },
  {
    nama: 'Benang Gigi/Dental Floss',
    harga: 'Rp8.000',
    stok: 50,
    gambar: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/97/MTA-146445504/no-brand_taffomicron-dental-floss-benang-gigi-toothpicks-50-pcs_full01.jpg',
  },
]

const ProdukPasien = () => {
  const [produk, setProduk] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ nama: '', harga: '', stok: '', gambar: '' })
  const [editIndex, setEditIndex] = useState(null)

  useEffect(() => {
    const dataLocal = localStorage.getItem('produkPasien')
    if (dataLocal) {
      setProduk(JSON.parse(dataLocal))
    } else {
      setProduk(dataAwal)
      localStorage.setItem('produkPasien', JSON.stringify(dataAwal))
    }
  }, [])

  const simpanLocal = (data) => {
    localStorage.setItem('produkPasien', JSON.stringify(data))
  }

  const resetDataAwal = () => {
    if (confirm('Yakin ingin reset ke data awal? Semua data akan diganti.')) {
      localStorage.setItem('produkPasien', JSON.stringify(dataAwal))
      setProduk(dataAwal)
      setForm({ nama: '', harga: '', stok: '', gambar: '' })
      setEditIndex(null)
    }
  }

  const handleTambahAtauEdit = () => {
    if (!form.nama || !form.harga || !form.stok || !form.gambar) {
      alert('Harap lengkapi semua field.')
      return
    }

    const produkBaru = { ...form, stok: parseInt(form.stok) }

    if (editIndex !== null) {
      const data = [...produk]
      data[editIndex] = produkBaru
      setProduk(data)
      simpanLocal(data)
      setEditIndex(null)
    } else {
      const data = [...produk, produkBaru]
      setProduk(data)
      simpanLocal(data)
    }

    setForm({ nama: '', harga: '', stok: '', gambar: '' })
  }

  const handleHapus = (index) => {
    const konfirmasi = confirm('Yakin ingin menghapus produk ini?')
    if (!konfirmasi) return

    const baru = [...produk]
    baru.splice(index, 1)
    setProduk(baru)
    simpanLocal(baru)
  }

  const handleEdit = (index) => {
    const item = produk[index]
    setForm({ ...item, stok: item.stok.toString() })
    setEditIndex(index)
  }

  const produkFilter = produk.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-pink-800 mb-4">
        Produk Pasien
      </h1>

      {/* Form Tambah/Edit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Nama Produk"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Harga (mis: Rp20.000)"
          value={form.harga}
          onChange={(e) => setForm({ ...form, harga: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Stok"
          value={form.stok}
          onChange={(e) => setForm({ ...form, stok: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="URL Gambar"
          value={form.gambar}
          onChange={(e) => setForm({ ...form, gambar: e.target.value })}
          className="p-2 border rounded"
        />
        <button
          onClick={handleTambahAtauEdit}
          className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-800 w-full md:w-auto col-span-full"
        >
          {editIndex !== null ? 'Simpan Perubahan' : '+ Tambah Produk'}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Cari produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md"
      />

      {/* Tabel Produk */}
      <table className="w-full border text-sm">
        <thead>
          <tr>
            <th className="border p-2 text-left">Gambar</th>
            <th className="border p-2 text-left">Nama Produk</th>
            <th className="border p-2 text-left">Harga</th>
            <th className="border p-2 text-left">Stok</th>
            <th className="border p-2 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {produkFilter.length > 0 ? (
            produkFilter.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    className="w-20 h-20 object-contain"
                  />
                </td>
                <td className="border p-2">{item.nama}</td>
                <td className="border p-2">{item.harga}</td>
                <td
                  className={`border p-2 ${
                    item.stok < 10 ? 'text-red-600 font-semibold' : ''
                  }`}
                >
                  {item.stok}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleHapus(index)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border p-4 text-center text-gray-500">
                Produk tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={resetDataAwal}
        className="mt-6 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      >
        Reset ke Produk Awal
      </button>
    </div>
  )
}

export default ProdukPasien
