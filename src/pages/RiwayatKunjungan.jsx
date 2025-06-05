import React, { useState } from "react";

const dataRiwayat = [
  {
    tanggal: '2025-06-03',
    namaPasien: 'Andi Saputra',
    tindakan: 'Tambal Gigi',
    catatan: 'Pasien merasa ngilu saat makan manis.',
    resep: 'Paracetamol 500mg, gunakan 3x sehari setelah makan.'
  },
  {
    tanggal: '2025-05-25',
    namaPasien: 'Siti Nurhaliza',
    tindakan: 'Cabut Gigi Bungsu',
    catatan: 'Disarankan kontrol seminggu lagi.',
    resep: 'Amoxicillin 500mg, 3x sehari. Obat kumur antiseptik.'
  },
  {
    tanggal: '2025-05-10',
    namaPasien: 'Budi Santoso',
    tindakan: 'Scaling',
    catatan: 'Plak gigi cukup tebal, edukasi sikat gigi 2x sehari.',
    resep: 'Tidak diberikan resep.'
  }
]

const RiwayatKunjungan = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-purple-700">Riwayat Kunjungan Pasien</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-purple-100 text-left text-sm font-semibold text-purple-800">
              <th className="p-3 border-b">Tanggal</th>
              <th className="p-3 border-b">Nama Pasien</th>
              <th className="p-3 border-b">Tindakan</th>
              <th className="p-3 border-b">Catatan Dokter</th>
              <th className="p-3 border-b">Resep Obat</th>
            </tr>
          </thead>
          <tbody>
            {dataRiwayat.map((data, index) => (
              <tr key={index} className="hover:bg-purple-50">
                <td className="p-3 border-b text-sm">{data.tanggal}</td>
                <td className="p-3 border-b text-sm">{data.namaPasien}</td>
                <td className="p-3 border-b text-sm">{data.tindakan}</td>
                <td className="p-3 border-b text-sm">{data.catatan}</td>
                <td className="p-3 border-b text-sm">{data.resep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RiwayatKunjungan
