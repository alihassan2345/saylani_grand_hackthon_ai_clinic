import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HeartPulse, Mail, Lock, User, Phone, UserCircle, Droplet, ArrowRight, Shield } from 'lucide-react';

const RegisterPage = () => {
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'patient',
        phone: '', gender: 'male', bloodGroup: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([k, v]) => formData.append(k, v));
            await registerAPI(formData);
            toast.success('Registered successfully! Please log in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-50 p-4">
            {/* Decorative background elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="w-full max-w-lg relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-400 rounded-2xl mb-3 shadow-lg">
                        <HeartPulse size={32} className="text-white" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-1 h-5 bg-sky-500 rounded-full"></div>
                        <h1 className="text-2xl font-bold text-sky-900">Create Account</h1>
                    </div>
                    <p className="text-sky-600 text-sm">Join AI Clinic Management System</p>
                </div>

                {/* Registration Form Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-sky-700 mb-1 flex items-center gap-1">
                                    <User size={14} className="text-sky-400" />
                                    Full Name *
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text" 
                                        required 
                                        placeholder="John Doe"
                                        value={form.name} 
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full pl-3 pr-4 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-sky-700 mb-1 flex items-center gap-1">
                                    <Mail size={14} className="text-sky-400" />
                                    Email *
                                </label>
                                <div className="relative group">
                                    <input
                                        type="email" 
                                        required 
                                        placeholder="john@example.com"
                                        value={form.email} 
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full pl-3 pr-4 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-sky-700 mb-1 flex items-center gap-1">
                                    <Lock size={14} className="text-sky-400" />
                                    Password *
                                </label>
                                <div className="relative group">
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        required 
                                        placeholder="Min 8 characters"
                                        value={form.password} 
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        className="w-full pl-3 pr-10 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 transition-colors"
                                    >
                                        {showPw ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-sky-700 mb-1 flex items-center gap-1">
                                    <Phone size={14} className="text-sky-400" />
                                    Phone
                                </label>
                                <input
                                    type="tel" 
                                    placeholder="+923001234567"
                                    value={form.phone} 
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-sky-700 mb-1 flex items-center gap-1">
                                    <UserCircle size={14} className="text-sky-400" />
                                    Role
                                </label>
                                <select
                                    value={form.role} 
                                    onChange={e => setForm({ ...form, role: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
                                >
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="receptionist">Receptionist</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-sky-700 mb-1 flex items-center gap-1">
                                    <UserCircle size={14} className="text-sky-400" />
                                    Gender
                                </label>
                                <select
                                    value={form.gender} 
                                    onChange={e => setForm({ ...form, gender: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Blood Group (for patients) */}
                            {form.role === 'patient' && (
                                <div>
                                    <label className="block text-sm font-medium text-sky-700 mb-1 flex items-center gap-1">
                                        <Droplet size={14} className="text-sky-400" />
                                        Blood Group
                                    </label>
                                    <select
                                        value={form.bloodGroup} 
                                        onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Select</option>
                                        {bloodGroups.map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-sky-300 disabled:to-sky-400 text-white font-semibold py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg mt-4"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                        {/* Login Link */}
                        <p className="text-center text-sm text-sky-600 mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-sky-700 font-semibold hover:text-sky-800 hover:underline inline-flex items-center gap-1">
                                Sign in
                                <ArrowRight size={12} />
                            </Link>
                        </p>

                        {/* Security Note */}
                        <div className="mt-4 pt-4 border-t border-sky-100">
                            <p className="text-xs text-sky-400 flex items-center justify-center gap-1">
                                <Shield size={12} />
                                Your information is secure and encrypted
                            </p>
                        </div>
                    </form>
                </div>

                {/* Quick Tips */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-sky-500">
                        By registering, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;