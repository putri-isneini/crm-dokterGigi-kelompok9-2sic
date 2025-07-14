// src/pages/Dashboard.jsx
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
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, TrendingUp, ShoppingBag, Loader2, LogOut } from 'lucide-react'; // Import icons

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
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        let role = session.user.user_metadata?.role || localStorage.getItem("userRole");
        setUserRole(role);
      } else {
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
      navigate("/login");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin w-16 h-16 text-pink-500 mb-4" />
          <div className="text-pink-600 text-lg font-semibold">
            Memuat dashboard...
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Pendapatan Hari Ini", value: "$53,000", percent: "+55%", color: "rose", icon: <DollarSign size={24} className="text-rose-500" /> },
    { label: "Pengguna Hari Ini", value: "2,300", percent: "+3%", color: "pink", icon: <Users size={24} className="text-pink-500" /> },
    { label: "Klien Baru", value: "+3,462", percent: "-2%", color: "fuchsia", icon: <TrendingUp size={24} className="text-fuchsia-500" /> },
    { label: "Penjualan", value: "$103,430", percent: "+5%", color: "purple", icon: <ShoppingBag size={24} className="text-purple-500" /> },
  ]

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    datasets: [
      {
        label: "Penjualan (dalam ribuan $)",
        data: [12, 19, 14, 17, 22, 30, 28, 26, 32, 35, 40, 45],
        backgroundColor: "rgba(236, 72, 153, 0.8)", // Solid pink
        borderRadius: 8, // More rounded bar corners
        hoverBackgroundColor: "rgba(236, 72, 153, 1)",
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#525252', // Legend text color
        }
      },
      title: {
        display: true,
        text: '📊 Penjualan Bulanan Tahun Ini',
        color: '#4a4a4a', // Title text color
        font: {
          size: 18,
          weight: 'bold',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyColor: '#fff',
        titleColor: '#fff',
        borderColor: '#ec4899',
        borderWidth: 1,
        cornerRadius: 6,
      }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
              color: '#737373', // X-axis label text color
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(200, 200, 200, 0.15)' // More transparent horizontal grid color
            },
            ticks: {
              color: '#737373', // Y-axis label text color
            }
        }
    }
  }

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    datasets: [
      {
        label: "Jumlah Pelanggan",
        data: [50, 75, 120, 180, 220, 260, 300, 350, 400, 430, 460, 500],
        borderColor: "#ec4899",
        backgroundColor: "rgba(236, 72, 153, 0.2)", // More transparent pink
        fill: true,
        tension: 0.4,
        pointRadius: 6, // Larger point size
        pointBackgroundColor: "#ec4899",
        pointBorderColor: "#fff",
        pointHoverRadius: 8,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#525252',
        }
      },
      title: {
        display: true,
        text: '📈 Pertumbuhan Pelanggan Tahun Ini',
        color: '#4a4a4a',
        font: {
          size: 18,
          weight: 'bold',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyColor: '#fff',
        titleColor: '#fff',
        borderColor: '#ec4899',
        borderWidth: 1,
        cornerRadius: 6,
      }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
              color: '#737373',
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(200, 200, 200, 0.15)'
            },
            ticks: {
              color: '#737373',
            }
        }
    }
  }

  const pieData = {
    labels: ['Pendaftaran Online', 'Pendaftaran Langsung'],
    datasets: [
      {
        label: 'Jumlah',
        data: [300, 500],
        backgroundColor: ['#f472b6', '#a78bfa'], // Pink and purple
        borderColor: '#fff', // White border
        borderWidth: 2, // Thicker border
      },
    ],
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#525252',
        }
      },
      title: {
        display: true,
        text: '🧾 Statistik Pendaftaran Pasien',
        color: '#4a4a4a',
        font: {
          size: 18,
          weight: 'bold',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyColor: '#fff',
        titleColor: '#fff',
        borderColor: '#f472b6',
        borderWidth: 1,
        cornerRadius: 6,
      }
    },
  }

  const radarData = {
    labels: ['Scaling', 'Tambal Gigi', 'Behel', 'Bleaching', 'Perawatan Gusi', 'Cabut Gigi'],
    datasets: [
      {
        label: 'Popularitas Layanan',
        data: [85, 70, 65, 60, 75, 50],
        backgroundColor: 'rgba(244, 114, 182, 0.3)', // Transparent pink
        borderColor: '#f472b6', // Pink
        pointBackgroundColor: '#ec4899', // Darker pink
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ec4899',
      },
    ],
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#525252',
        }
      },
      title: {
        display: true,
        text: '🌟 Popularitas Layanan Klinik Gigi',
        color: '#4a4a4a',
        font: {
          size: 18,
          weight: 'bold',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyColor: '#fff',
        titleColor: '#fff',
        borderColor: '#f472b6',
        borderWidth: 1,
        cornerRadius: 6,
      }
    },
    scales: {
        r: {
            angleLines: {
                color: 'rgba(200, 200, 200, 0.2)'
            },
            grid: {
                color: 'rgba(200, 200, 200, 0.2)'
            },
            pointLabels: {
                color: '#525252', // Point label text color
                font: {
                  size: 14,
                }
            },
            ticks: {
                backdropColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent ticks background
                color: '#737373', // Ticks text color
            }
        }
    }
  }

  return (
    <div className="py-10 pl-56 pr-0 space-y-10 min-h-screen bg-gradient-to-br from-pink-50 to-white"> {/* Adjusted pl-56 and pr-0 */}
      <div className="flex justify-between items-center pb-5 border-b border-pink-200">
        <h1 className="text-4xl font-extrabold text-pink-700">Dashboard <span className="text-rose-500">{userRole}</span></h1>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center"
        >
          <LogOut size={18} className="mr-2" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, percent, color, icon }) => (
          <div key={label} className="bg-white rounded-2xl shadow-xl p-6 border border-pink-100 flex items-center space-x-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className={`p-3 rounded-full bg-${color}-100`}>
              {icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <span className={`text-${color}-600`}>{value}</span>
                <span className={`text-sm font-semibold ${percent.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{percent}</span>
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-pink-100 h-96 flex items-center justify-center">
          <Bar options={barOptions} data={barData} />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-pink-100 h-96 flex items-center justify-center">
          <Line options={lineOptions} data={lineData} />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-pink-100 h-96 flex items-center justify-center">
          <Doughnut options={pieOptions} data={pieData} />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-pink-100 h-96 flex items-center justify-center">
          <Radar options={radarOptions} data={radarData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
