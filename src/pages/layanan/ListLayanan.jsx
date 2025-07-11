import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import FormLayanan from './FormLayanan';

function ListLayanan() {
  const [layananList, setLayananList] = useState([]);
  const [editingLayanan, setEditingLayanan] = useState(null);

  const fetchLayanan = async () => {
    const { data, error } = await supabase
      .from('layanan')
      .select(`
        *,
        diskon_membership (
          id,
          membership,
          nama_diskon,
          persen_diskon
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Gagal mengambil data:', error.message);
    } else {
      setLayananList(data);
    }
  };

  const addLayanan = async (layanan) => {
    const { error } = await supabase.from('layanan').insert(layanan);
    if (error) {
      console.error('Gagal menambahkan layanan:', error.message);
    } else {
      fetchLayanan();
    }
  };

  const updateLayanan = async (layanan) => {
    const { error } = await supabase
      .from('layanan')
      .update({
        nama: layanan.nama,
        deskripsi: layanan.deskripsi,
        harga: layanan.harga,
        gambar: layanan.gambar,
      })
      .eq('id', layanan.id);

    if (error) {
      console.error('Gagal mengubah data:', error.message);
    } else {
      fetchLayanan();
      setEditingLayanan(null);
    }
  };

  const deleteLayanan = async (id) => {
    const { error } = await supabase.from('layanan').delete().eq('id', id);
    if (error) {
      console.error('Gagal menghapus data:', error.message);
    } else {
      fetchLayanan();
    }
  };

  useEffect(() => {
    fetchLayanan();
  }, []);

  const getBadgeColor = (membership) => {
    switch (membership) {
      case 'Silver':
        return 'bg-gray-200 text-gray-700';
      case 'Gold':
        return 'bg-yellow-200 text-yellow-800';
      case 'Platinum':
        return 'bg-purple-200 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-pink-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-pink-700 mb-10 text-center">
        🦷 Manajemen Layanan Klinik
      </h1>

      <div className="mb-12">
        <FormLayanan
          addLayanan={addLayanan}
          updateLayanan={updateLayanan}
          editingLayanan={editingLayanan}
          setEditingLayanan={setEditingLayanan}
        />
      </div>

      {layananList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {layananList.map((layanan) => (
            <div
              key={layanan.id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col border border-pink-100 hover:shadow-lg transition-all duration-200"
            >
              {layanan.gambar && (
                <img
                  src={layanan.gambar}
                  alt={layanan.nama}
                  className="w-full h-52 object-cover rounded-xl mb-4 shadow-sm"
                />
              )}
              <h2 className="text-xl font-bold text-pink-700 mb-2">🪥 {layanan.nama}</h2>
              <p className="text-gray-700 text-sm mb-3">{layanan.deskripsi}</p>

              <p className="text-lg font-bold text-rose-600 mb-4">
                💸 Rp {layanan.harga?.toLocaleString('id-ID')}
              </p>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-1">🎁 Diskon Membership:</p>
                {layanan.diskon_membership && layanan.diskon_membership.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {layanan.diskon_membership
                      .sort((a, b) => {
                        const order = { Silver: 1, Gold: 2, Platinum: 3 };
                        return order[a.membership] - order[b.membership];
                      })
                      .map((diskon) => (
                        <li key={diskon.id}>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getBadgeColor(
                              diskon.membership
                            )}`}
                          >
                            {diskon.membership}
                          </span>{' '}
                          {diskon.nama_diskon} ({diskon.persen_diskon}%)
                        </li>
                      ))}
                  </ul>
                ) : (
                  <span className="italic text-gray-400">Tidak ada diskon</span>
                )}
              </div>

              <p className="text-xs text-gray-400 mb-4">
                📅 {new Date(layanan.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => setEditingLayanan(layanan)}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteLayanan(layanan.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic mt-12">
          Belum ada layanan yang ditambahkan.
        </p>
      )}
    </div>
  );
}

export default ListLayanan;
