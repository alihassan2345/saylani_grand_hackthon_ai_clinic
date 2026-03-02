import React, { useState, useEffect } from 'react';
import { getAdminUsers } from '../../services/api';
import { Search, Users, Mail, Phone, Calendar, Droplet, User, Heart } from 'lucide-react';

const ManagePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stats, setStats] = useState({ total: 0, male: 0, female: 0, other: 0 });

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = () => {
        setLoading(true);
        getAdminUsers('patient')
            .then(r => {
                const patientsData = r.data.data;
                setPatients(patientsData);
                
                // Calculate stats
                const male = patientsData.filter(p => p.gender?.toLowerCase() === 'male').length;
                const female = patientsData.filter(p => p.gender?.toLowerCase() === 'female').length;
                const other = patientsData.filter(p => p.gender && !['male', 'female'].includes(p.gender?.toLowerCase())).length;
                
                setStats({
                    total: patientsData.length,
                    male,
                    female,
                    other
                });
            })
            .finally(() => setLoading(false));
    };

    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.phone?.toLowerCase().includes(search.toLowerCase())
    );

    // Blood group colors for visual representation
    const getBloodGroupColor = (group) => {
        const colors = {
            'A+': 'text-rose-600 bg-rose-50',
            'A-': 'text-rose-500 bg-rose-50',
            'B+': 'text-amber-600 bg-amber-50',
            'B-': 'text-amber-500 bg-amber-50',
            'AB+': 'text-purple-600 bg-purple-50',
            'AB-': 'text-purple-500 bg-purple-50',
            'O+': 'text-emerald-600 bg-emerald-50',
            'O-': 'text-emerald-500 bg-emerald-50',
        };
        return colors[group] || 'text-sky-600 bg-sky-50';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="font-semibold text-sky-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-sky-500 rounded-full"></span>
                    Manage Patients
                </h2>
                <p className="text-sm text-sky-600 mt-0.5">View and manage patient records</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-sky-600">Total Patients</p>
                            <p className="text-2xl font-bold text-sky-900 mt-1">{stats.total}</p>
                        </div>
                        <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-sky-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-sky-600">Male</p>
                            <p className="text-2xl font-bold text-sky-900 mt-1">{stats.male}</p>
                        </div>
                        <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                            <User size={20} className="text-sky-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-sky-600">Female</p>
                            <p className="text-2xl font-bold text-sky-900 mt-1">{stats.female}</p>
                        </div>
                        <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                            <Heart size={20} className="text-sky-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-sky-600">Other</p>
                            <p className="text-2xl font-bold text-sky-900 mt-1">{stats.other}</p>
                        </div>
                        <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-sky-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center justify-between">
                <div className="relative w-80">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input 
                        placeholder="Search patients by name, email or phone..." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full"
                    />
                </div>
                <span className="text-sm text-sky-600">
                    Showing <span className="font-semibold text-sky-900">{filtered.length}</span> of <span className="font-semibold text-sky-900">{patients.length}</span> patients
                </span>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-xl border border-sky-100 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-sky-50 border-b border-sky-100">
                        <tr>
                            {[
                                { label: 'Patient', icon: User },
                                { label: 'Email', icon: Mail },
                                { label: 'Phone', icon: Phone },
                                { label: 'Gender', icon: Heart },
                                { label: 'Blood Group', icon: Droplet },
                                { label: 'Joined', icon: Calendar }
                            ].map(({ label, icon: Icon }) => (
                                <th key={label} className="text-left px-4 py-3">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wide">
                                        <Icon size={12} className="text-sky-400" />
                                        {label}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12">
                                    <div className="flex justify-center">
                                        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <p className="text-sm text-sky-400 mt-2">Loading patients...</p>
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12">
                                    <Users size={40} className="mx-auto text-sky-300 mb-3" />
                                    <p className="text-sm text-sky-400 font-medium">No patients found</p>
                                    <p className="text-xs text-sky-300 mt-1">Try adjusting your search criteria</p>
                                </td>
                            </tr>
                        ) : (
                            filtered.map(p => (
                                <tr key={p._id} className="border-b border-sky-50 last:border-0 hover:bg-sky-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                                                <span className="text-sky-600 text-xs font-bold">{p.name[0]}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-sky-900">{p.name}</span>
                                                {p.age && (
                                                    <p className="text-xs text-sky-400">{p.age} years</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-sky-600">
                                            <Mail size={12} className="text-sky-400" />
                                            <span className="text-sm">{p.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-sky-600">
                                            <Phone size={12} className="text-sky-400" />
                                            <span className="text-sm">{p.phone || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="capitalize text-sky-700">
                                            {p.gender || '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {p.bloodGroup ? (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBloodGroupColor(p.bloodGroup)}`}>
                                                {p.bloodGroup}
                                            </span>
                                        ) : (
                                            <span className="text-sky-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-sky-600">
                                            <Calendar size={12} className="text-sky-400" />
                                            <span className="text-sm">
                                                {new Date(p.createdAt).toLocaleDateString('en-US', { 
                                                    year: 'numeric', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-sky-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-sky-600">A+ Blood</p>
                    <p className="text-lg font-semibold text-sky-900">
                        {patients.filter(p => p.bloodGroup === 'A+').length}
                    </p>
                </div>
                <div className="bg-sky-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-sky-600">B+ Blood</p>
                    <p className="text-lg font-semibold text-sky-900">
                        {patients.filter(p => p.bloodGroup === 'B+').length}
                    </p>
                </div>
                <div className="bg-sky-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-sky-600">O+ Blood</p>
                    <p className="text-lg font-semibold text-sky-900">
                        {patients.filter(p => p.bloodGroup === 'O+').length}
                    </p>
                </div>
                <div className="bg-sky-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-sky-600">AB+ Blood</p>
                    <p className="text-lg font-semibold text-sky-900">
                        {patients.filter(p => p.bloodGroup === 'AB+').length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ManagePatients;