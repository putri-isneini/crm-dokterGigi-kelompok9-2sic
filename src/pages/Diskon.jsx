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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Simulasi Diskon Membership</h2>
      
      <label className="block mb-2">Level Membership:</label>
      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="p-2 border rounded mb-4"
      >
        <option value="Bronze">Bronze</option>
        <option value="Silver">Silver</option>
        <option value="Gold">Gold</option>
      </select>

      <label className="block mb-2">Harga Produk:</label>
      <input
        type="number"
        value={harga}
        onChange={(e) => setHarga(Number(e.target.value))}
        className="p-2 border rounded mb-4"
      />

      <p>Diskon: {getDiskon() * 100}%</p>
      <p>Harga Setelah Diskon: <strong>Rp {hargaDiskon.toLocaleString()}</strong></p>
    </div>
  );
};

export default Diskon;
