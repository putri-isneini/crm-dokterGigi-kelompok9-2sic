// src/components/Dashboard.js
import React, { useEffect, useState } from 'react'
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
  Filler,
} from 'chart.js'

import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'; // Import useNavigate

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
  Legend,
  Filler,
)

const Dashboard = () => {
  const navigate = useNavigate(); // Inisialisasi useNavigate
  const [userRole, setUserRole] = useState(null); // State untuk menyimpan role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Ambil role dari metadata atau localStorage
        let role = session.user.user_metadata?.role || localStorage.getItem("userRole");
        setUserRole(role);
      } else {
        // Jika tidak ada sesi, user seharusnya sudah di-redirect oleh PrivateRoute
        navigate("/login"); 
      }
      setLoading(false);
    };
    fetchUserRole();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert("Gagal logout: " + error.message);
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUserId');
      alert("Anda telah logout.");
      navigate("/login"); // Redirect ke halaman login setelah logout
    }
  }

  if (loading) {
    return <div className="text-center mt-20 text-lg text-pink-600 font-semibold">Memuat dashboard...</div>;
  }

  // Dashboard ini seharusnya hanya diakses oleh Admin atau Dokter.
  // PrivateRoute sudah menangani otorisasi, jadi tidak perlu `if (!allowed)` di sini lagi.
  // Namun, jika Anda ingin menampilkan pesan berbeda atau fitur spesifik berdasarkan role di dalam dashboard,
  // Anda bisa menggunakan state `userRole`.

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pink-600">Dashboard {userRole} Klinik</h1> {/* Tampilkan role */}
        <button
          onClick={handleLogout}
          className="bg-pink-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, percent, color }) => (
          <div key={label} className="bg-white rounded-2xl shadow p-5 border border-pink-100">
            <p className="text-sm text-gray-500">{label}</p>
            <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: `var(--tw-text-opacity, 1)` }}>
              <span className={`text-${color}-600`}>{value}</span>
              <span className={`text-sm text-${color}-500 font-semibold`}>{percent}</span>
            </h2>
          </div>
        ))}
      </div>

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