import React, { useState, useEffect } from 'react';
import { getSubscriptionPlansAPI, createSubscriptionPlanAPI, updateSubscriptionPlanAPI, toggleSubscriptionPlanAPI, deleteSubscriptionPlanAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Plus, Trash2, ToggleLeft, ToggleRight, Check, Star, Pencil, X, Crown, Sparkles } from 'lucide-react';

const EMPTY_FORM = { name: '', price: '', billingCycle: 'monthly', maxDoctors: '', maxPatients: '', features: '' };

const AdminSubscriptions = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [editPlan, setEditPlan] = useState(null);
    const [editForm, setEditForm] = useState({});

    const load = () => {
        setLoading(true);
        getSubscriptionPlansAPI().then(r => setPlans(r.data.data)).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await createSubscriptionPlanAPI({
                ...form,
                price: Number(form.price),
                maxDoctors: form.maxDoctors === '' ? -1 : Number(form.maxDoctors),
                maxPatients: form.maxPatients === '' ? -1 : Number(form.maxPatients),
                features: form.features.split(',').map(f => f.trim()).filter(Boolean),
            });
            toast.success('Plan created');
            setForm(EMPTY_FORM);
            setShowForm(false);
            load();
        } catch { toast.error('Failed to create plan'); }
        finally { setSaving(false); }
    };

    const handleToggle = async (id) => {
        try {
            const r = await toggleSubscriptionPlanAPI(id);
            toast.success(r.data.message);
            load();
        } catch { toast.error('Failed'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this plan?')) return;
        try {
            await deleteSubscriptionPlanAPI(id);
            toast.success('Plan deleted');
            load();
        } catch { toast.error('Failed'); }
    };

    const openEditPlan = (plan) => {
        setEditPlan(plan);
        setEditForm({
            name: plan.name,
            price: plan.price,
            billingCycle: plan.billingCycle,
            maxDoctors: plan.maxDoctors === -1 ? '' : plan.maxDoctors,
            maxPatients: plan.maxPatients === -1 ? '' : plan.maxPatients,
            features: plan.features.join(', '),
        });
    };

    const handleEditPlan = async (e) => {
        e.preventDefault();
        try {
            await updateSubscriptionPlanAPI(editPlan.id, {
                ...editForm,
                price: Number(editForm.price),
                maxDoctors: editForm.maxDoctors === '' ? -1 : Number(editForm.maxDoctors),
                maxPatients: editForm.maxPatients === '' ? -1 : Number(editForm.maxPatients),
                features: editForm.features.split(',').map(f => f.trim()).filter(Boolean),
            });
            toast.success('Plan updated');
            setEditPlan(null);
            load();
        } catch { toast.error('Update failed'); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-6">
            {/* Edit Plan Modal */}
            {editPlan && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative border border-sky-100">
                        <button onClick={() => setEditPlan(null)} className="absolute top-4 right-4 text-sky-400 hover:text-sky-700 transition-colors">
                            <X size={18} />
                        </button>
                        <h3 className="font-semibold text-sky-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                            Edit Plan — {editPlan.name}
                        </h3>
                        <form onSubmit={handleEditPlan} className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-sky-700 mb-1">Plan Name *</label>
                                <input required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-sky-700 mb-1">Price (PKR) *</label>
                                <input required type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-sky-700 mb-1">Billing Cycle</label>
                                <select value={editForm.billingCycle} onChange={e => setEditForm({ ...editForm, billingCycle: e.target.value })}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white">
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-sky-700 mb-1">Max Doctors (blank = unlimited)</label>
                                <input type="number" value={editForm.maxDoctors} onChange={e => setEditForm({ ...editForm, maxDoctors: e.target.value })} placeholder="Unlimited"
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-sky-700 mb-1">Max Patients (blank = unlimited)</label>
                                <input type="number" value={editForm.maxPatients} onChange={e => setEditForm({ ...editForm, maxPatients: e.target.value })} placeholder="Unlimited"
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-sky-700 mb-1">Features (comma-separated)</label>
                                <input value={editForm.features} onChange={e => setEditForm({ ...editForm, features: e.target.value })}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                            </div>
                            <div className="col-span-2 flex gap-3 justify-end">
                                <button type="button" onClick={() => setEditPlan(null)} className="px-4 py-2 text-sm rounded-lg border border-sky-200 text-sky-600 hover:bg-sky-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium transition-colors">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-sky-900 flex items-center gap-2">
                        <span className="w-1 h-6 bg-sky-500 rounded-full"></span>
                        Subscription Plans
                    </h2>
                    <p className="text-sm text-sky-600 mt-0.5">Manage clinic subscription tiers</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow">
                    <Plus size={16} /> New Plan
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-sm">
                    <h3 className="font-medium text-sky-900 mb-4 flex items-center gap-2">
                        <Sparkles size={16} className="text-sky-500" />
                        Create New Plan
                    </h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-sky-700 mb-1">Plan Name *</label>
                            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Starter"
                                className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sky-700 mb-1">Price (PKR) *</label>
                            <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 9999"
                                className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sky-700 mb-1">Billing Cycle</label>
                            <select value={form.billingCycle} onChange={e => setForm({ ...form, billingCycle: e.target.value })}
                                className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white">
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sky-700 mb-1">Max Doctors (blank = unlimited)</label>
                            <input type="number" value={form.maxDoctors} onChange={e => setForm({ ...form, maxDoctors: e.target.value })} placeholder="Unlimited"
                                className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-sky-700 mb-1">Max Patients (blank = unlimited)</label>
                            <input type="number" value={form.maxPatients} onChange={e => setForm({ ...form, maxPatients: e.target.value })} placeholder="Unlimited"
                                className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-sky-700 mb-1">Features (comma-separated)</label>
                            <input value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Appointments, Prescriptions, Analytics"
                                className="w-full px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                        </div>
                        <div className="col-span-2 flex gap-3 justify-end">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm rounded-lg border border-sky-200 text-sky-600 hover:bg-sky-50 transition-colors">Cancel</button>
                            <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-medium disabled:opacity-60 transition-colors">
                                {saving ? 'Creating...' : 'Create Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {plans.map(plan => (
                    <div key={plan.id} className={`bg-white rounded-xl border-2 p-5 relative transition-all duration-200 hover:shadow-lg ${
                        plan.popular ? 'border-sky-500 shadow-md' : 'border-sky-100 hover:border-sky-200'
                    } ${!plan.isActive ? 'opacity-60' : ''}`}>
                        
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-600 to-sky-400 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <Crown size={10} fill="white" /> Most Popular
                            </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                plan.popular ? 'bg-sky-100' : 'bg-sky-50'
                            }`}>
                                <CreditCard size={18} className={plan.popular ? 'text-sky-600' : 'text-sky-500'} />
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                plan.isActive 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                                {plan.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        
                        <h3 className="font-bold text-sky-900 text-lg">{plan.name}</h3>
                        <p className="text-2xl font-bold text-sky-600 mt-1">
                            PKR {plan.price.toLocaleString()}
                            <span className="text-sm font-normal text-sky-400 ml-1">/{plan.billingCycle}</span>
                        </p>
                        
                        <div className="my-3 text-xs text-sky-600 space-y-1 bg-sky-50 p-2 rounded-lg">
                            <p className="flex items-center gap-1">👨‍⚕️ Doctors: <span className="font-medium text-sky-700">{plan.maxDoctors === -1 ? 'Unlimited' : plan.maxDoctors}</span></p>
                            <p className="flex items-center gap-1">🧑‍🤝‍🧑 Patients: <span className="font-medium text-sky-700">{plan.maxPatients === -1 ? 'Unlimited' : plan.maxPatients}</span></p>
                        </div>
                        
                        <ul className="space-y-1.5 mb-4">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-sky-700">
                                    <Check size={14} className="text-emerald-500 shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>
                        
                        <div className="flex gap-2 pt-3 border-t border-sky-100">
                            <button onClick={() => openEditPlan(plan)} 
                                className="flex items-center justify-center gap-1 text-xs px-3 py-2 rounded-lg border border-sky-200 text-sky-600 hover:bg-sky-50 transition-colors">
                                <Pencil size={13} /> Edit
                            </button>
                            <button onClick={() => handleToggle(plan.id)} 
                                className="flex-1 flex items-center justify-center gap-1 text-xs px-3 py-2 rounded-lg border border-sky-200 text-sky-600 hover:bg-sky-50 transition-colors">
                                {plan.isActive ? (
                                    <ToggleRight size={14} className="text-emerald-500" />
                                ) : (
                                    <ToggleLeft size={14} className="text-sky-400" />
                                )}
                                {plan.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => handleDelete(plan.id)} 
                                className="px-3 py-2 rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Note */}
            <p className="text-xs text-sky-400 mt-2 flex items-center gap-1 p-3 bg-sky-50 rounded-lg border border-sky-100">
                <span className="text-lg">⚠</span> Subscription plans are simulated for demo purposes. Payment gateway integration can be added in production.
            </p>
        </div>
    );
};

export default AdminSubscriptions;