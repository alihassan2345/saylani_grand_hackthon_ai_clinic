import React, { useState, useEffect } from 'react';
import { getAdminUsers, createStaffAPI, updateUserAPI, toggleUserStatusAPI, deleteUserAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { UserPlus, Trash2, ToggleLeft, ToggleRight, Search, Pencil, X, Stethoscope, Phone, Mail, Award, Clock } from 'lucide-react';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'doctor', specialization: '', qualification: '', experience: '', consultationFee: '', phone: '' });
    const [editDoc, setEditDoc] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchDoctors = () => {
        getAdminUsers('doctor').then(res => setDoctors(res.data.data)).finally(() => setLoading(false));
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            await createStaffAPI(fd);
            toast.success('Doctor created!');
            setShowForm(false);
            fetchDoctors();
            setForm({ name: '', email: '', password: '', role: 'doctor', specialization: '', qualification: '', experience: '', consultationFee: '', phone: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    const handleToggle = async (id) => {
        try {
            await toggleUserStatusAPI(id);
            toast.success('Status updated');
            fetchDoctors();
        } catch { toast.error('Failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this doctor?')) return;
        try {
            await deleteUserAPI(id);
            toast.success('Deleted');
            fetchDoctors();
        } catch { toast.error('Failed'); }
    };

    const openEdit = (doc) => {
        setEditDoc(doc);
        setEditForm({
            name: doc.name || '',
            phone: doc.phone || '',
            specialization: doc.specialization || '',
            qualification: doc.qualification || '',
            experience: doc.experience || '',
            consultationFee: doc.consultationFee || '',
        });
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
            await updateUserAPI(editDoc._id, fd);
            toast.success('Doctor updated');
            setEditDoc(null);
            fetchDoctors();
        } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    };

    const filtered = doctors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-5">
            {/* Edit Modal */}
            {editDoc && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative border border-sky-100">
                        <button onClick={() => setEditDoc(null)} className="absolute top-4 right-4 text-sky-400 hover:text-sky-700 transition-colors">
                            <X size={18} />
                        </button>
                        <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                            Edit Doctor — {editDoc.name}
                        </h3>
                        <form onSubmit={handleEdit} className="grid grid-cols-2 gap-4">
                            {[
                                ['name', 'Full Name', 'text'],
                                ['phone', 'Phone', 'tel'],
                                ['specialization', 'Specialization', 'text'],
                                ['qualification', 'Qualification', 'text'],
                                ['experience', 'Experience (years)', 'number'],
                                ['consultationFee', 'Fee (PKR)', 'number'],
                            ].map(([key, label, type]) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-sky-700 mb-1">{label}</label>
                                    <input 
                                        type={type} 
                                        value={editForm[key]}
                                        onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                                        className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    />
                                </div>
                            ))}
                            <div className="col-span-2 flex gap-3 justify-end pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setEditDoc(null)} 
                                    className="border border-sky-200 px-5 py-2 rounded-lg text-sm text-sky-600 hover:bg-sky-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div>
                    <h2 className="font-semibold text-sky-900 flex items-center gap-2">
                        <span className="w-1 h-6 bg-sky-500 rounded-full"></span>
                        Manage Doctors
                    </h2>
                    <p className="text-sm text-sky-600 mt-0.5">Add, edit and manage doctor profiles</p>
                </div>
                
                {/* Search Bar */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" />
                        <input
                            placeholder="Search doctors..."
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent w-64"
                        />
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
                    >
                        <UserPlus size={16} /> Add Doctor
                    </button>
                </div>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm">
                    <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Add New Doctor
                    </h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                        {[
                            ['name', 'Full Name', 'text', true],
                            ['email', 'Email', 'email', true],
                            ['password', 'Password', 'password', true],
                            ['phone', 'Phone', 'tel', false],
                            ['specialization', 'Specialization', 'text', false],
                            ['qualification', 'Qualification', 'text', false],
                            ['experience', 'Experience (years)', 'number', false],
                            ['consultationFee', 'Fee (PKR)', 'number', false],
                        ].map(([key, label, type, req]) => (
                            <div key={key}>
                                <label className="block text-xs font-medium text-sky-700 mb-1">{label}</label>
                                <input 
                                    type={type} 
                                    required={req} 
                                    value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                />
                            </div>
                        ))}
                        <div className="col-span-2 flex gap-3 pt-2">
                            <button 
                                type="submit" 
                                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                            >
                                Create Doctor
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowForm(false)} 
                                className="border border-sky-200 px-6 py-2 rounded-lg text-sm text-sky-600 hover:bg-sky-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Doctors Table */}
            <div className="bg-white rounded-xl border border-sky-100 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-sky-50 border-b border-sky-100">
                        <tr>
                            {['Doctor', 'Specialization', 'Experience', 'Fee (PKR)', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-sky-700 uppercase tracking-wide">{h}</th>
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
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-12">
                                    <Stethoscope size={32} className="mx-auto text-sky-300 mb-2" />
                                    <p className="text-sm text-sky-400">No doctors found</p>
                                </td>
                            </tr>
                        ) : filtered.map(doc => (
                            <tr key={doc._id} className="border-b border-sky-50 last:border-0 hover:bg-sky-50/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                                            <span className="text-sky-600 text-xs font-bold">{doc.name[0]}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sky-900">{doc.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-sky-500">
                                                <Mail size={10} />
                                                <span>{doc.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-sky-700">
                                        <Award size={14} className="text-sky-400" />
                                        <span>{doc.specialization || '-'}</span>
                                    </div>
                                    <p className="text-xs text-sky-400 mt-0.5">{doc.qualification || ''}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-sky-700">
                                        <Clock size={14} className="text-sky-400" />
                                        <span>{doc.experience ? `${doc.experience} yrs` : '-'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-medium text-sky-900">
                                        {doc.consultationFee ? `PKR ${doc.consultationFee.toLocaleString()}` : '-'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        doc.isActive 
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                                    }`}>
                                        {doc.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => openEdit(doc)} 
                                            className="p-1.5 text-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        <button 
                                            onClick={() => handleToggle(doc._id)} 
                                            className="p-1.5 text-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                            title="Toggle Status"
                                        >
                                            {doc.isActive ? (
                                                <ToggleRight size={18} className="text-emerald-500" />
                                            ) : (
                                                <ToggleLeft size={18} />
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(doc._id)} 
                                            className="p-1.5 text-sky-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Stats */}
            <div className="bg-sky-50 rounded-lg p-3 flex items-center justify-between text-sm">
                <span className="text-sky-700">
                    Total Doctors: <span className="font-semibold text-sky-900">{doctors.length}</span>
                </span>
                <span className="text-sky-700">
                    Active: <span className="font-semibold text-emerald-600">{doctors.filter(d => d.isActive).length}</span>
                </span>
                <span className="text-sky-700">
                    Inactive: <span className="font-semibold text-rose-500">{doctors.filter(d => !d.isActive).length}</span>
                </span>
            </div>
        </div>
    );
};

export default ManageDoctors;