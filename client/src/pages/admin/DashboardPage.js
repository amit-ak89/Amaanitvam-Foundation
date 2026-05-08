import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import StatCard from '../../components/StatCard';
import API from '../../utils/api';
import { FiUsers, FiCheckCircle, FiAward, FiClock } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6'];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          API.get('/applications/stats/dashboard'),
          API.get('/applications?limit=5'),
        ]);
        setStats(statsRes.data.stats);
        setRecentApps(appsRes.data.applications);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = stats ? [
    { name: 'Pending', value: stats.pending },
    { name: 'Selected', value: stats.selected },
    { name: 'Rejected', value: stats.rejected },
    { name: 'Completed', value: stats.completed },
  ] : [];

  const barData = stats ? [
    { name: 'Pending', count: stats.pending },
    { name: 'Selected', count: stats.selected },
    { name: 'Rejected', count: stats.rejected },
    { name: 'Completed', count: stats.completed },
  ] : [];

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Applicants" value={stats?.total || 0} icon={FiUsers} color="bg-blue-500" />
          <StatCard title="Pending Review" value={stats?.pending || 0} icon={FiClock} color="bg-yellow-500" />
          <StatCard title="Selected Interns" value={stats?.selected || 0} icon={FiCheckCircle} color="bg-green-600" />
          <StatCard title="Completed" value={stats?.completed || 0} icon={FiAward} color="bg-purple-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-base font-bold text-gray-900 mb-4">Applications by Status</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-base font-bold text-gray-900 mb-4">Status Distribution</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Recent Applications</h2>
            <a href="/admin/applications" className="text-sm text-green-600 hover:underline font-medium">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Name', 'Email', 'Role', 'College', 'Status'].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-medium text-gray-900">{app.fullName}</td>
                    <td className="py-3 px-3 text-gray-500">{app.email}</td>
                    <td className="py-3 px-3 text-gray-600">{app.role}</td>
                    <td className="py-3 px-3 text-gray-500">{app.college}</td>
                    <td className="py-3 px-3">
                      <span className={`badge-${app.status}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
