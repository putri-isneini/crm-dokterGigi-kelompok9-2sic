import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

export default function CardMembership({ pasienId }) {
  const [membership, setMembership] = useState('');

  useEffect(() => {
    const fetchMembership = async () => {
      const { data } = await supabase.from('pasien').select('membership').eq('id', pasienId).single();
      setMembership(data?.membership || '');
    };
    fetchMembership();
  }, [pasienId]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border text-center">
      <h2 className="text-lg font-bold text-pink-600">Membership Kamu</h2>
      <p className="text-2xl text-pink-700 mt-2 font-semibold">{membership}</p>
      <p className="text-sm text-gray-500 mt-1">
        {membership === 'Platinum'
          ? 'Terima kasih sudah setia!'
          : 'Tingkatkan jumlah booking untuk naik level.'}
      </p>
    </div>
  );
}
