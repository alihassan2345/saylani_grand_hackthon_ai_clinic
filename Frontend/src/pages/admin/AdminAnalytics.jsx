import React, { useState, useEffect } from 'react';
import { getAdminAnalytics } from '../../services/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#0284c7', '#0369a1']; // Medical soft blue theme

const AdminAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminAnalytics().then(r => setStats(r.data.data)).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div></div>;

    const pieData = [
        { name: 'Completed', value: stats?.completedAppointments || 0 },
        { name: 'Pending', value: stats?.pendingAppointments || 0 },
        { name: 'Cancelled', value: stats?.cancelledAppointments || 0 },
    ];

    const monthlyBarData = (stats?.monthlyAppointments || []).map(item => ({
        name: MONTHS[(item._id.month - 1)] || `M${item._id.month}`,
        appointments: item.count,
    }));

    const staffData = [
        { name: 'Doctors', value: stats?.totalDoctors || 0 },
        { name: 'Receptionists', value: stats?.totalReceptionists || 0 },
        { name: 'Patients', value: stats?.totalPatients || 0 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Appointment Status
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Monthly Appointments
                    </h3>
                    {monthlyBarData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={monthlyBarData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                                <Tooltip />
                                <Bar dataKey="appointments" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-sky-400 text-sm">No appointment data yet</div>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Staff Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={staffData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#64748b" />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={90} stroke="#64748b" />
                            <Tooltip />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {staffData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Key Metrics
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Total Appointments', value: stats?.totalAppointments || 0, color: 'bg-sky-500', icon: '📊' },
                            { label: 'Completed Appointments', value: stats?.completedAppointments || 0, color: 'bg-sky-400', icon: '✅' },
                            { label: 'Estimated Revenue (PKR)', value: (stats?.estimatedRevenue || 0).toLocaleString(), color: 'bg-sky-600', icon: '💰' },
                            { label: 'Total Staff', value: (stats?.totalDoctors || 0) + (stats?.totalReceptionists || 0), color: 'bg-sky-700', icon: '👥' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-sky-50 transition-colors">
                                <div className={`w-8 h-8 rounded-lg ${item.color} bg-opacity-10 flex items-center justify-center text-lg`}>
                                    {item.icon}
                                </div>
                                <span className="text-sm text-sky-700 flex-1">{item.label}</span>
                                <span className="font-semibold text-sky-900">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;