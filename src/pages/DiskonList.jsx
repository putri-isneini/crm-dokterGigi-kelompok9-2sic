import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import DiskonForm from './DiskonForm'; // ganti dari UserForm ke DiskonForm

function DiskonList() {
  const [diskonList, setDiskonList] = useState([]);
  const [editingDiskon, setEditingDiskon] = useState(null);

  const fetchDiskon = async () => {
    const { data, error } = await supabase
      .from('diskon_membership')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setDiskonList(data);
  };

  const addDiskon = async (diskon) => {
    const { error } = await supabase.from('diskon_membership').insert(diskon);
    if (error) console.error(error);
    else fetchDiskon();
  };

  const updateDiskon = async (diskon) => {
    const { error } = await supabase
      .from('diskon_membership')
      .update(diskon)
      .eq('id', diskon.id);

    if (error) console.error(error);
    else {
      fetchDiskon();
      setEditingDiskon(null);
    }
  };

  const deleteDiskon = async (id) => {
    const { error } = await supabase.from('diskon_membership').delete().eq('id', id);
    if (error) console.error(error);
    else fetchDiskon();
  };

  useEffect(() => {
    fetchDiskon();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CRUD Diskon Membership dengan Supabase</h1>
      <DiskonForm
        addDiskon={addDiskon}
        updateDiskon={updateDiskon}
        editingDiskon={editingDiskon}
      />
      <ul className="mt-4">
        {diskonList.map((diskon) => (
          <li key={diskon.id} className="border p-2 my-2">
            <div>
              <p className="font-semibold">{diskon.nama_diskon}</p>
              <p className="text-sm text-gray-600">
                {diskon.membership} - {diskon.persen_diskon}% diskon
              </p>
              {diskon.keterangan && (
                <p className="text-sm italic text-gray-500">{diskon.keterangan}</p>
              )}
            </div>
            <div className="space-x-2 mt-2">
              <button
                onClick={() => setEditingDiskon(diskon)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteDiskon(diskon.id)}
                className="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DiskonList;