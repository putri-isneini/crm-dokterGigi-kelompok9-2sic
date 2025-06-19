import React, { useState } from "react";

const Diskon = () => {
  const [level, setLevel] = useState("Bronze");
  const [harga, setHarga] = useState(20000);

  const getDiskon = () => {
    if (level === "Bronze") return 0.05;
    if (level === "Silver") return 0.10;
    if (level === "Gold") return 0.15;
    return 0;
  };

  const hargaDiskon = harga - harga * getDiskon();

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
          Diskon Membership
        </h2>

        <label className="block text-pink-700 mb-1 font-medium">Level Membership:</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full p-3 border border-pink-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
        </select>

        <label className="block text-pink-700 mb-1 font-medium">Harga Produk:</label>
        <input
          type="number"
          value={harga}
          onChange={(e) => setHarga(Number(e.target.value))}
          className="w-full p-3 border border-pink-300 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <div className="text-pink-700 font-medium mb-2">
          Diskon: {getDiskon() * 100}%
        </div>
        <div className="text-pink-900 font-semibold text-lg">
          Harga Setelah Diskon: <strong>Rp {hargaDiskon.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
};

export default Diskon;
