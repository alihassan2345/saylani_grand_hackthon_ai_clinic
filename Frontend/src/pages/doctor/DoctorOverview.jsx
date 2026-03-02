import React, { useState, useEffect } from 'react';
import { getDoctorAnalyticsAPI, getDoctorAppointmentsAPI } from '../../services/api';
import StatCard from '../../components/shared/StatCard';
import { Calendar, CheckCircle, Clock, FileText, Users, User, Clock as ClockIcon } from 'lucide-react';

const DoctorOverview = () => {
    const [stats, setStats] = useState(null);
    const [todayAppts, setTodayAppts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        Promise.all([
            getDoctorAnalyticsAPI(),
            getDoctorAppointmentsAPI({ date: today }),
        ]).then(([statsRes, apptRes]) => {
            setStats(statsRes.data.data);
            setTodayAppts(apptRes.data.data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div></div>;

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
            cancelled: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
            confirmed: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
            pending: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        return `${config.bg} ${config.text} ${config.border}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="font-semibold text-sky-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-sky-500 rounded-full"></span>
                    Doctor Overview
                </h2>
                <p className="text-sm text-sky-600 mt-0.5">Welcome back! Here's your practice summary</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    icon={Calendar} 
                    label="Today's Appointments" 
                    value={stats?.todayAppointments ?? 0} 
                    color="sky" 
                    subtext={stats?.todayAppointments ? `${stats.todayAppointments} scheduled` : 'No appointments'}
                />
                <StatCard 
                    icon={CheckCircle} 
                    label="Completed Total" 
                    value={stats?.completed ?? 0} 
                    color="emerald" 
                    subtext={`${stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate`}
                />
                <StatCard 
                    icon={Clock} 
                    label="Pending" 
                    value={stats?.pending ?? 0} 
                    color="amber" 
                    subtext="Awaiting consultation"
                />
                <StatCard 
                    icon={FileText} 
                    label="Prescriptions Written" 
                    value={stats?.totalPrescriptions ?? 0} 
                    color="purple" 
                    subtext="Total prescriptions issued"
                />
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sky-900 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Today's Schedule
                    </h3>
                    <span className="text-xs text-sky-500 bg-sky-50 px-2 py-1 rounded-full border border-sky-200">
                        {todayAppts.length} appointment{todayAppts.length !== 1 ? 's' : ''}
                    </span>
                </div>
                
                {todayAppts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Calendar size={32} className="text-sky-300" />
                        </div>
                        <p className="text-sky-500 font-medium">No appointments scheduled for today</p>
                        <p className="text-xs text-sky-400 mt-1">Enjoy your day!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todayAppts.map((appt, index) => (
                            <div 
                                key={appt._id} 
                                className="flex items-center gap-4 p-3 bg-gradient-to-r from-sky-50 to-white rounded-xl border border-sky-100 hover:border-sky-200 transition-all hover:shadow-sm"
                            >
                                {/* Token Number */}
                                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-400 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                    <span className="text-white font-bold text-sm">#{appt.tokenNumber}</span>
                                </div>
                                
                                {/* Patient Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sky-900 text-sm truncate">{appt.patient?.name}</p>
                                        {index === 0 && (
                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                                                Next
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1 text-xs text-sky-600">
                                            <ClockIcon size={10} className="text-sky-400" />
                                            {appt.timeSlot}
                                        </span>
                                        <span className="text-xs text-sky-400">•</span>
                                        <span className="text-xs text-sky-600 capitalize">{appt.type}</span>
                                    </div>
                                </div>
                                
                                {/* Status */}
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(appt.status)}`}>
                                    {appt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-sky-50 rounded-lg p-3 text-center border border-sky-100">
                    <p className="text-xs text-sky-600">Patients Today</p>
                    <p className="text-lg font-semibold text-sky-900">{todayAppts.length}</p>
                </div>
                <div className="bg-sky-50 rounded-lg p-3 text-center border border-sky-100">
                    <p className="text-xs text-sky-600">Completed</p>
                    <p className="text-lg font-semibold text-emerald-600">{todayAppts.filter(a => a.status === 'completed').length}</p>
                </div>
                <div className="bg-sky-50 rounded-lg p-3 text-center border border-sky-100">
                    <p className="text-xs text-sky-600">Pending</p>
                    <p className="text-lg font-semibold text-amber-600">{todayAppts.filter(a => a.status === 'pending' || a.status === 'confirmed').length}</p>
                </div>
                <div className="bg-sky-50 rounded-lg p-3 text-center border border-sky-100">
                    <p className="text-xs text-sky-600">Cancelled</p>
                    <p className="text-lg font-semibold text-rose-600">{todayAppts.filter(a => a.status === 'cancelled').length}</p>
                </div>
            </div>
        </div>
    );
};

export default DoctorOverview;