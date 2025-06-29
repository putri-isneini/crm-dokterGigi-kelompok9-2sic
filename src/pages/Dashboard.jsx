import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
)

const Dashboard = () => {
  const stats = [
    { label: "Pendapatan Hari Ini", value: "$53,000", percent: "+55%", color: "rose" },
    { label: "Pengguna Hari Ini", value: "2,300", percent: "+3%", color: "pink" },
    { label: "Klien Baru", value: "+3,462", percent: "-2%", color: "fuchsia" },
    { label: "Penjualan", value: "$103,430", percent: "+5%", color: "purple" },
  ]

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    datasets: [
      {
        label: "Penjualan (dalam ribuan $)",
        data: [12, 19, 14, 17, 22, 30, 28, 26, 32, 35, 40, 45],
        backgroundColor: "rgba(236, 72, 153, 0.7)",
        borderRadius: 6,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '📊 Penjualan Bulanan Tahun Ini' },
    },
  }

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    datasets: [
      {
        label: "Jumlah Pelanggan",
        data: [50, 75, 120, 180, 220, 260, 300, 350, 400, 430, 460, 500],
        borderColor: "#ec4899",
        backgroundColor: "rgba(236, 72, 153, 0.3)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '📈 Pertumbuhan Pelanggan Tahun Ini' },
    },
  }

  const pieData = {
    labels: ['Pendaftaran Online', 'Pendaftaran Langsung'],
    datasets: [
      {
        label: 'Jumlah',
        data: [300, 500],
        backgroundColor: ['#f472b6', '#a78bfa'],
        borderWidth: 1,
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: '🧾 Statistik Pendaftaran Pasien' },
    },
  }

  const radarData = {
    labels: ['Scaling', 'Tambal Gigi', 'Behel', 'Bleaching', 'Perawatan Gusi', 'Cabut Gigi'],
    datasets: [
      {
        label: 'Popularitas Layanan',
        data: [85, 70, 65, 60, 75, 50],
        backgroundColor: 'rgba(244, 114, 182, 0.3)',
        borderColor: '#f472b6',
        pointBackgroundColor: '#ec4899',
      },
    ],
  }

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '🌟 Popularitas Layanan Klinik Gigi' },
    },
  }

  return (
    <div className="p-6 space-y-10 bg-pink-50 min-h-screen">
      <h1 className="text-3xl font-bold text-pink-600">Dashboard Admin Klinik</h1>

      {/* Stat Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, percent, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow p-5 border border-pink-100">
            <p className="text-sm text-gray-500">{label}</p>
            <h2 className={`text-2xl font-bold text-${color}-600 flex items-center gap-2`}>
              {value}
              <span className={`text-xs font-semibold text-${color}-500`}>{percent}</span>
            </h2>
          </div>
        ))}
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 border border-pink-100">
          <Bar options={barOptions} data={barData} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-pink-100">
          <Line options={lineOptions} data={lineData} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-pink-100">
          <Doughnut options={pieOptions} data={pieData} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-pink-100">
          <Radar options={radarOptions} data={radarData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
