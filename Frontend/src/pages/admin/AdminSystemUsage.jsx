import React, { useState, useEffect } from 'react';
import { getSystemUsageAPI } from '../../services/api';
import { Server, Database, Activity, Users, Calendar, FileText, RefreshCw, Cpu, HardDrive, Wifi } from 'lucide-react';

const Meter = ({ label, value, max, color = 'sky' }) => {
    const pct = Math.min(Math.round((value / max) * 100), 100);
    const colors = { 
        sky: 'bg-sky-500', 
        emerald: 'bg-emerald-500', 
        amber: 'bg-amber-500', 
        rose: 'bg-rose-500',
        purple: 'bg-purple-500'
    };
    const bar = colors[color] || colors.sky;
    
    // Determine color based on percentage if not specified
    let barColor = bar;
    if (color === 'auto') {
        if (pct > 80) barColor = colors.rose;
        else if (pct > 60) barColor = colors.amber;
        else barColor = colors.sky;
    }
    
    return (
        <div>
            <div className="flex justify-between text-xs text-sky-600 mb-1">
                <span>{label}</span>
                <span className="font-medium">{pct}%</span>
            </div>
            <div className="w-full bg-sky-50 rounded-full h-2.5">
                <div className={`${barColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
            </div>
            <div className="text-xs text-sky-400 mt-1">{value} / {max} MB</div>
        </div>
    );
};

const InfoRow = ({ label, value, icon: Icon, color = 'sky' }) => (
    <div className="flex justify-between py-2.5 border-b border-sky-50 last:border-0 hover:bg-sky-50/50 px-2 rounded-lg transition-colors">
        <span className="text-sm text-sky-600 flex items-center gap-2">
            {Icon && <Icon size={14} className={`text-${color}-500`} />}
            {label}
        </span>
        <span className="text-sm font-medium text-sky-900">{value}</span>
    </div>
);

const AdminSystemUsage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false);

    const load = () => {
        setLoading(true);
        getSystemUsageAPI()
            .then(r => { setData(r.data.data); setLastRefresh(new Date()); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    // Auto refresh every 30 seconds
    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(load, 30000);
        return () => clearInterval(interval);
    }, [autoRefresh]);

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div></div>;
    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-sky-900 flex items-center gap-2">
                        <span className="w-1 h-6 bg-sky-500 rounded-full"></span>
                        System Usage
                    </h2>
                    <p className="text-sm text-sky-600 mt-0.5">Live server and database metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-sky-600">
                        <input 
                            type="checkbox" 
                            checked={autoRefresh} 
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                            className="rounded border-sky-300 text-sky-600 focus:ring-sky-500"
                        />
                        Auto-refresh (30s)
                    </label>
                    <button 
                        onClick={load} 
                        className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 border border-sky-200 px-3 py-2 rounded-lg hover:bg-sky-50 transition-colors"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
                        Refresh 
                        {lastRefresh && (
                            <span className="text-xs text-sky-400">— {lastRefresh.toLocaleTimeString()}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total Users', value: data.stats.totalUsers, icon: Users, color: 'sky' },
                    { label: 'Active Today', value: data.stats.activeUsers, icon: Activity, color: 'emerald' },
                    { label: 'Appointments', value: data.stats.totalAppointments, icon: Calendar, color: 'amber' },
                    { label: "Today's Appts", value: data.stats.todayAppointments, icon: Calendar, color: 'purple' },
                    { label: 'Prescriptions', value: data.stats.totalPrescriptions, icon: FileText, color: 'sky' },
                ].map(s => {
                    const bgMap = { 
                        sky: 'bg-sky-50', 
                        emerald: 'bg-emerald-50', 
                        amber: 'bg-amber-50', 
                        purple: 'bg-purple-50',
                        rose: 'bg-rose-50'
                    };
                    const iconMap = { 
                        sky: 'text-sky-600', 
                        emerald: 'text-emerald-600', 
                        amber: 'text-amber-600', 
                        purple: 'text-purple-600',
                        rose: 'text-rose-600'
                    };
                    return (
                        <div key={s.label} className="bg-white border border-sky-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                            <div className={`w-8 h-8 ${bgMap[s.color]} rounded-lg flex items-center justify-center mb-2`}>
                                <s.icon size={16} className={iconMap[s.color]} />
                            </div>
                            <p className="text-2xl font-bold text-sky-900">{s.value}</p>
                            <p className="text-xs text-sky-600 mt-0.5">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Server Info */}
                <div className="bg-white rounded-xl border border-sky-100 p-5 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                            <Server size={18} className="text-sky-600" />
                        </div>
                        <h3 className="font-semibold text-sky-900">Server Info</h3>
                        <span className="ml-auto flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                            Online
                        </span>
                    </div>
                    
                    <Meter 
                        label="Memory Usage" 
                        value={data.server.memoryUsedMB} 
                        max={data.server.memoryTotalMB} 
                        color="auto"
                    />
                    
                    <div className="mt-4 space-y-0">
                        <InfoRow label="Uptime" value={data.server.uptimeFormatted} icon={Cpu} />
                        <InfoRow label="Platform" value={data.server.platform} icon={Wifi} />
                        <InfoRow label="Node.js" value={data.server.nodeVersion} icon={FileText} />
                        <InfoRow label="Memory Used" value={`${data.server.memoryUsedMB} MB / ${data.server.memoryTotalMB} MB`} icon={HardDrive} />
                    </div>
                </div>

                {/* Database Info */}
                <div className="bg-white rounded-xl border border-sky-100 p-5 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Database size={18} className="text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-sky-900">Database (MongoDB)</h3>
                        <span className="ml-auto flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                            Connected
                        </span>
                    </div>
                    
                    <Meter 
                        label="Storage Used" 
                        value={data.database.storageSizeMB} 
                        max={Math.max(data.database.storageSizeMB * 5, 50)} 
                        color="purple"
                    />
                    
                    <div className="mt-4 space-y-0">
                        <InfoRow label="Collections" value={data.database.collections} icon={Database} color="purple" />
                        <InfoRow label="Total Documents" value={data.database.totalDocuments.toLocaleString()} icon={FileText} color="purple" />
                        <InfoRow label="Data Size" value={`${data.database.dataSizeMB} MB`} icon={HardDrive} color="purple" />
                        <InfoRow label="Storage Size" value={`${data.database.storageSizeMB} MB`} icon={HardDrive} color="purple" />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-sky-100 p-5 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Activity size={18} className="text-amber-600" />
                    </div>
                    <h3 className="font-semibold text-sky-900">Recent Activity</h3>
                    <span className="ml-auto text-xs text-sky-400">Last 10 activities</span>
                </div>
                
                {data.recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                        <Activity size={32} className="mx-auto text-sky-300 mb-2" />
                        <p className="text-sm text-sky-400">No recent activity</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {data.recentActivity.map(a => (
                            <div key={a._id} className="flex items-center gap-3 py-2.5 px-3 border-b border-sky-50 last:border-0 hover:bg-sky-50/50 rounded-lg transition-colors">
                                <div className={`w-2 h-2 rounded-full shrink-0 ${
                                    a.status === 'completed' ? 'bg-emerald-400' : 
                                    a.status === 'cancelled' ? 'bg-rose-400' : 'bg-amber-400'
                                }`}></div>
                                
                                <p className="text-sm text-sky-700 flex-1">
                                    <span className="font-medium text-sky-900">{a.patient?.name || 'Patient'}</span> 
                                    <span className="text-sky-400 mx-1">booked with</span> 
                                    <span className="font-medium text-sky-900">Dr. {a.doctor?.name || 'Doctor'}</span>
                                </p>
                                
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                                    a.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                                    a.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                                    'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                    {a.status}
                                </span>
                                
                                <span className="text-xs text-sky-400 shrink-0">
                                    {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSystemUsage;