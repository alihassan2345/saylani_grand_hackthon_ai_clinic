import React, { useState, useEffect } from 'react';
import { getDoctorAnalyticsAPI } from '../../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/shared/StatCard';
import { Calendar, CheckCircle, Clock, XCircle, FileText, TrendingUp, Activity, Users } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Emerald for completed, amber for pending, red for cancelled
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DoctorAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDoctorAnalyticsAPI().then(r => setStats(r.data.data)).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div></div>;

    const pieData = [
        { name: 'Completed', value: stats?.completed || 0 },
        { name: 'Pending', value: stats?.pending || 0 },
        { name: 'Cancelled', value: stats?.cancelled || 0 },
    ];

    const weekData = (stats?.weeklyData || []).map(d => ({
        day: DAYS[(d._id - 1) % 7] || `D${d._id}`,
        count: d.count,
    }));

    const completionRate = stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="font-semibold text-sky-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-sky-500 rounded-full"></span>
                    Doctor Analytics
                </h2>
                <p className="text-sm text-sky-600 mt-0.5">Track your performance and appointment statistics</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    icon={Calendar} 
                    label="Total Appointments" 
                    value={stats?.total || 0} 
                    color="sky" 
                />
                <StatCard 
                    icon={CheckCircle} 
                    label="Completed" 
                    value={stats?.completed || 0} 
                    color="emerald" 
                    subtext={`${completionRate}% rate`}
                />
                <StatCard 
                    icon={Clock} 
                    label="Pending" 
                    value={stats?.pending || 0} 
                    color="amber" 
                />
                <StatCard 
                    icon={FileText} 
                    label="Prescriptions" 
                    value={stats?.totalPrescriptions || 0} 
                    color="purple" 
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Appointment Breakdown
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie 
                                data={pieData} 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={90} 
                                paddingAngle={3} 
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e0f2fe',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)'
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Weekly Activity
                    </h3>
                    {weekData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={weekData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                                <XAxis 
                                    dataKey="day" 
                                    tick={{ fontSize: 12, fill: '#0284c7' }} 
                                    axisLine={{ stroke: '#bae6fd' }}
                                />
                                <YAxis 
                                    tick={{ fontSize: 12, fill: '#0284c7' }} 
                                    axisLine={{ stroke: '#bae6fd' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: '1px solid #e0f2fe',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar 
                                    dataKey="count" 
                                    fill="#0ea5e9" 
                                    radius={[4, 4, 0, 0]} 
                                    background={{ fill: '#f0f9ff' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-40">
                            <div className="text-center">
                                <Activity size={32} className="mx-auto text-sky-300 mb-2" />
                                <p className="text-sm text-sky-400">No weekly data yet</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm">
                <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                    Performance Summary
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Completion Rate */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-5 border border-emerald-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-emerald-700 text-sm font-medium">Completion Rate</span>
                            <TrendingUp size={16} className="text-emerald-600" />
                        </div>
                        <p className="text-3xl font-bold text-emerald-700">{completionRate}%</p>
                        <p className="text-xs text-emerald-600 mt-1">
                            {stats?.completed} of {stats?.total} appointments completed
                        </p>
                    </div>

                    {/* Today's Appointments */}
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-5 border border-amber-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-amber-700 text-sm font-medium">Today's Appointments</span>
                            <Calendar size={16} className="text-amber-600" />
                        </div>
                        <p className="text-3xl font-bold text-amber-700">{stats?.todayAppointments || 0}</p>
                        <p className="text-xs text-amber-600 mt-1">
                            Scheduled for today
                        </p>
                    </div>

                    {/* Cancelled */}
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl p-5 border border-rose-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-rose-700 text-sm font-medium">Cancelled</span>
                            <XCircle size={16} className="text-rose-600" />
                        </div>
                        <p className="text-3xl font-bold text-rose-700">{stats?.cancelled || 0}</p>
                        <p className="text-xs text-rose-600 mt-1">
                            {stats?.total ? `${Math.round((stats.cancelled / stats.total) * 100)}%` : '0%'} cancellation rate
                        </p>
                    </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-sky-100">
                    <div className="text-center">
                        <p className="text-xs text-sky-500">Avg. per Day</p>
                        <p className="text-lg font-semibold text-sky-900">
                            {stats?.weeklyData?.length ? 
                                Math.round(stats.weeklyData.reduce((acc, d) => acc + d.count, 0) / stats.weeklyData.length) 
                                : 0}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-sky-500">Peak Day</p>
                        <p className="text-lg font-semibold text-sky-900">
                            {stats?.weeklyData?.length ? 
                                Math.max(...stats.weeklyData.map(d => d.count)) 
                                : 0}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-sky-500">Patients Seen</p>
                        <p className="text-lg font-semibold text-sky-900">{stats?.completed || 0}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-sky-500">Prescriptions</p>
                        <p className="text-lg font-semibold text-sky-900">{stats?.totalPrescriptions || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorAnalytics;