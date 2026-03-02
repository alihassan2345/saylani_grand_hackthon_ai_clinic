import React, { useState, useEffect } from 'react';
import { getAdminUsers, createStaffAPI, updateUserAPI, toggleUserStatusAPI, deleteUserAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { UserPlus, Trash2, ToggleLeft, ToggleRight, Search, Pencil, X, Users, Phone, Mail, UserCog } from 'lucide-react';

const ManageReceptionists = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'receptionist', phone: '' });
    const [editRec, setEditRec] = useState(null);
    const [editForm, setEditForm] = useState({});

    const loadList = () => getAdminUsers('receptionist').then(r => setList(r.data.data)).finally(() => setLoading(false));
    useEffect(() => { loadList(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            await createStaffAPI(fd);
            toast.success('Receptionist created!');
            setShowForm(false);
            setForm({ name: '', email: '', password: '', role: 'receptionist', phone: '' });
            loadList();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    };

    const openEdit = (rec) => {
        setEditRec(rec);
        setEditForm({ name: rec.name || '', phone: rec.phone || '' });
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
            await updateUserAPI(editRec._id, fd);
            toast.success('Receptionist updated');
            setEditRec(null);
            loadList();
        } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    };

    const handleToggle = async (id) => {
        try {
            await toggleUserStatusAPI(id);
            toast.success('Status updated');
            loadList();
        } catch { toast.error('Failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this receptionist?')) return;
        try {
            await deleteUserAPI(id);
            toast.success('Deleted');
            loadList();
        } catch { toast.error('Failed'); }
    };

    const filtered = list.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase()) || 
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.phone?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Edit Modal */}
            {editRec && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative border border-sky-100">
                        <button 
                            onClick={() => setEditRec(null)} 
                            className="absolute top-4 right-4 text-sky-400 hover:text-sky-700 transition-colors"
                        >
                            <X size={18} />
                        </button>
                        <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                            Edit Receptionist — {editRec.name}
                        </h3>
                        <form onSubmit={handleEdit} className="space-y-4">
                            {[
                                ['name', 'Full Name', 'text'],
                                ['phone', 'Phone', 'tel']
                            ].map(([key, label, type]) => (
                                <div key={key}>
                                    <label className="block text-xs font-medium text-sky-700 mb-1">{label}</label>
                                    <input 
                                        type={type} 
                                        value={editForm[key] || ''}
                                        onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                                        className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    />
                                </div>
                            ))}
                            <div className="flex gap-3 justify-end pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setEditRec(null)} 
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
            <div>
                <h2 className="font-semibold text-sky-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-sky-500 rounded-full"></span>
                    Manage Receptionists
                </h2>
                <p className="text-sm text-sky-600 mt-0.5">Add and manage front desk staff</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-sky-600">Total Receptionists</p>
                            <p className="text-2xl font-bold text-sky-900 mt-1">{list.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-sky-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-sky-600">Active</p>
                            <p className="text-2xl font-bold text-emerald-600 mt-1">{list.filter(r => r.isActive).length}</p>
                        </div>
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <UserCog size={20} className="text-emerald-600" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-sky-600">Inactive</p>
                            <p className="text-2xl font-bold text-rose-600 mt-1">{list.filter(r => !r.isActive).length}</p>
                        </div>
                        <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-rose-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Add Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="relative w-80">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400" />
                    <input 
                        placeholder="Search by name, email or phone..." 
                        value={search} 
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full"
                    />
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow"
                >
                    <UserPlus size={16} /> Add Receptionist
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-sky-100 p-6 shadow-sm">
                    <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                        Add New Receptionist
                    </h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                        {[
                            ['name', 'Full Name', 'text', true],
                            ['email', 'Email', 'email', true],
                            ['password', 'Password', 'password', true],
                            ['phone', 'Phone', 'tel', false]
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
                                Create Receptionist
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

            {/* Receptionists Table */}
            <div className="bg-white rounded-xl border border-sky-100 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-sky-50 border-b border-sky-100">
                        <tr>
                            {[
                                { label: 'Name', icon: Users },
                                { label: 'Email', icon: Mail },
                                { label: 'Phone', icon: Phone },
                                { label: 'Status', icon: UserCog },
                                { label: 'Actions', icon: null }
                            ].map(({ label, icon: Icon }) => (
                                <th key={label} className="text-left px-4 py-3">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 uppercase tracking-wide">
                                        {Icon && <Icon size={12} className="text-sky-400" />}
                                        {label}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12">
                                    <div className="flex justify-center">
                                        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <p className="text-sm text-sky-400 mt-2">Loading receptionists...</p>
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12">
                                    <Users size={40} className="mx-auto text-sky-300 mb-3" />
                                    <p className="text-sm text-sky-400 font-medium">No receptionists found</p>
                                    <p className="text-xs text-sky-300 mt-1">Click "Add Receptionist" to create one</p>
                                </td>
                            </tr>
                        ) : (
                            filtered.map(r => (
                                <tr key={r._id} className="border-b border-sky-50 last:border-0 hover:bg-sky-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                                                <span className="text-sky-600 text-xs font-bold">{r.name[0]}</span>
                                            </div>
                                            <span className="font-medium text-sky-900">{r.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-sky-600">
                                            <Mail size={12} className="text-sky-400" />
                                            <span className="text-sm">{r.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 text-sky-600">
                                            <Phone size={12} className="text-sky-400" />
                                            <span className="text-sm">{r.phone || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            r.isActive 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                : 'bg-rose-50 text-rose-600 border border-rose-100'
                                        }`}>
                                            {r.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => openEdit(r)} 
                                                className="p-1.5 text-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button 
                                                onClick={() => handleToggle(r._id)} 
                                                className="p-1.5 text-sky-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                                title="Toggle Status"
                                            >
                                                {r.isActive ? (
                                                    <ToggleRight size={18} className="text-emerald-500" />
                                                ) : (
                                                    <ToggleLeft size={18} />
                                                )}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(r._id)} 
                                                className="p-1.5 text-sky-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary Footer */}
            {!loading && filtered.length > 0 && (
                <div className="bg-sky-50 rounded-lg p-3 flex items-center justify-between text-sm">
                    <span className="text-sky-700">
                        Showing <span className="font-semibold text-sky-900">{filtered.length}</span> of <span className="font-semibold text-sky-900">{list.length}</span> receptionists
                    </span>
                    <span className="text-sky-700">
                        Active: <span className="font-semibold text-emerald-600">{list.filter(r => r.isActive).length}</span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default ManageReceptionists;