import React, { useState, useEffect } from 'react';
import { getAdminAnalytics } from '../../services/api';
import StatCard from '../../components/shared/StatCard';
import { Users, UserCheck, Stethoscope, Calendar, CheckCircle, XCircle, Clock, DollarSign, Activity, TrendingUp, TrendingDown } from 'lucide-react';

const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminAnalytics()
            .then(res => setStats(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Calculate rates
    const completionRate = stats?.totalAppointments 
        ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100) 
        : 0;
    const cancellationRate = stats?.totalAppointments 
        ? Math.round((stats.cancelledAppointments / stats.totalAppointments) * 100) 
        : 0;
    const pendingRate = stats?.totalAppointments 
        ? Math.round((stats.pendingAppointments / stats.totalAppointments) * 100) 
        : 0;

    return (
        <div className="space-y-6">
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    icon={Stethoscope} 
                    label="Active Doctors" 
                    value={stats?.totalDoctors ?? 0} 
                    color="sky" 
                    trend={stats?.doctorGrowth ? { value: stats.doctorGrowth, isPositive: true } : null}
                />
                <StatCard 
                    icon={Users} 
                    label="Patients" 
                    value={stats?.totalPatients ?? 0} 
                    color="emerald" 
                    trend={stats?.patientGrowth ? { value: stats.patientGrowth, isPositive: true } : null}
                />
                <StatCard 
                    icon={UserCheck} 
                    label="Receptionists" 
                    value={stats?.totalReceptionists ?? 0} 
                    color="purple" 
                />
                <StatCard 
                    icon={DollarSign} 
                    label="Est. Revenue (PKR)" 
                    value={`${(stats?.estimatedRevenue ?? 0).toLocaleString()}`} 
                    color="amber" 
                    trend={stats?.revenueGrowth ? { value: stats.revenueGrowth, isPositive: true } : null}
                />
            </div>

            {/* Appointment Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard 
                    icon={Calendar} 
                    label="Total Appointments" 
                    value={stats?.totalAppointments ?? 0} 
                    color="sky" 
                />
                <StatCard 
                    icon={CheckCircle} 
                    label="Completed" 
                    value={stats?.completedAppointments ?? 0} 
                    color="emerald" 
                    subtext={`${completionRate}% completion rate`}
                />
                <StatCard 
                    icon={Clock} 
                    label="Pending" 
                    value={stats?.pendingAppointments ?? 0} 
                    color="amber" 
                    subtext={`${pendingRate}% pending`}
                />
            </div>

            {/* Quick Summary with Medical Theme */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Summary Cards */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <h3 className="text-base font-semibold text-sky-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Appointment Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { 
                                label: 'Completion Rate', 
                                value: `${completionRate}%`, 
                                icon: CheckCircle,
                                color: 'text-emerald-600',
                                bgColor: 'bg-emerald-50',
                                iconColor: 'text-emerald-500'
                            },
                            { 
                                label: 'Cancellation Rate', 
                                value: `${cancellationRate}%`, 
                                icon: XCircle,
                                color: 'text-rose-600',
                                bgColor: 'bg-rose-50',
                                iconColor: 'text-rose-500'
                            },
                            { 
                                label: 'Pending Rate', 
                                value: `${pendingRate}%`, 
                                icon: Clock,
                                color: 'text-amber-600',
                                bgColor: 'bg-amber-50',
                                iconColor: 'text-amber-500'
                            },
                            { 
                                label: 'Staff Members', 
                                value: (stats?.totalDoctors ?? 0) + (stats?.totalReceptionists ?? 0), 
                                icon: Users,
                                color: 'text-sky-600',
                                bgColor: 'bg-sky-50',
                                iconColor: 'text-sky-500'
                            },
                        ].map(item => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="text-center p-4 bg-slate-50 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-sky-100">
                                    <div className={`w-10 h-10 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                                    </div>
                                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                                    <p className="text-xs text-sky-600 mt-1">{item.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Today's Overview */}
                <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                    <h3 className="text-base font-semibold text-sky-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Today's Overview
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-sky-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-sky-600">Today's Appointments</p>
                                    <p className="text-lg font-semibold text-sky-900">{stats?.todayAppointments || 0}</p>
                                </div>
                            </div>
                            <span className="text-xs text-sky-600 bg-sky-100 px-2 py-1 rounded-full">
                                {stats?.todayCompleted || 0} completed
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-600">Active Patients Today</p>
                                    <p className="text-lg font-semibold text-emerald-900">{stats?.activePatientsToday || 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-emerald-600">
                                <TrendingUp className="w-3 h-3" />
                                <span>+{stats?.patientActivityGrowth || 0}%</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-amber-600">Pending Tasks</p>
                                    <p className="text-lg font-semibold text-amber-900">{stats?.pendingTasks || 0}</p>
                                </div>
                            </div>
                            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                                {stats?.urgentTasks || 0} urgent
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;