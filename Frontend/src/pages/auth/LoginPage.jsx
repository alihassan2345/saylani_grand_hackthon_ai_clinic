import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { HeartPulse, Mail, Lock, Eye, EyeOff, Shield, Activity, FileText, Users, Brain, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginAPI(form);
            login(res.data.user, res.data.token);
            toast.success(`Welcome back, ${res.data.user.name}!`);
            navigate(`/${res.data.user.role}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: Brain, title: 'Smart Diagnosis', desc: 'AI-powered symptom analysis', color: 'sky' },
        { icon: FileText, title: 'Digital Prescriptions', desc: 'Paperless prescription system', color: 'emerald' },
        { icon: Activity, title: 'Analytics', desc: 'Real-time clinic insights', color: 'amber' },
        { icon: Users, title: '4 Role System', desc: 'Admin, Doctor, Receptionist, Patient', color: 'purple' },
    ];

    const featureColors = {
        sky: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel - Medical Theme */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-sky-600 via-sky-700 to-sky-900 flex-col justify-center items-center p-12 text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-xl mx-auto">
                        <HeartPulse size={48} className="text-white" />
                    </div>
                    
                    <h1 className="text-5xl font-bold mb-4 text-center leading-tight">
                        AI Clinic
                        <span className="block text-sky-200 text-2xl mt-2 font-light">Management System</span>
                    </h1>
                    
                    <p className="text-sky-100 text-lg text-center max-w-sm leading-relaxed bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                        Digitizing healthcare workflows with intelligent AI assistance for doctors and patients.
                    </p>
                    
                    <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
                        {features.map(({ icon: Icon, title, desc, color }) => (
                            <div 
                                key={title} 
                                className={`${featureColors[color]} backdrop-blur-sm rounded-xl p-4 border hover:scale-105 transition-transform duration-200 cursor-default`}
                            >
                                <Icon size={20} className="mb-2" />
                                <p className="font-semibold text-sm mb-1">{title}</p>
                                <p className="text-white/60 text-xs">{desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-8 flex items-center justify-center gap-2 text-sky-200 text-sm">
                        <Shield size={16} />
                        <span>HIPAA Compliant • Secure • Encrypted</span>
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-sky-50 via-white to-sky-50">
                <div className="w-full max-w-md">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 p-8">
                        {/* Mobile Logo */}
                        <div className="flex items-center gap-3 mb-6 lg:hidden">
                            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-400 rounded-lg flex items-center justify-center shadow-md">
                                <HeartPulse size={20} className="text-white" />
                            </div>
                            <span className="font-bold text-sky-900 text-lg">AI Clinic</span>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-sky-400 rounded-full"></div>
                                <h2 className="text-2xl font-bold text-sky-900">Welcome Back</h2>
                            </div>
                            <p className="text-sky-600 mt-1 text-sm">Enter your credentials to access your dashboard</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-sky-700 mb-1.5 flex items-center gap-1">
                                    <Mail size={14} className="text-sky-400" />
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="doctor@clinic.com"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-sky-700 mb-1.5 flex items-center gap-1">
                                    <Lock size={14} className="text-sky-400" />
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        className="w-full pl-10 pr-10 py-3 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPw(!showPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600 transition-colors"
                                    >
                                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            <div className="text-right">
                                <button 
                                    type="button"
                                    className="text-xs text-sky-500 hover:text-sky-700 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:from-sky-300 disabled:to-sky-400 text-white font-semibold py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> 
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <p className="text-center text-sm text-sky-600 mt-4">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-sky-700 font-semibold hover:text-sky-800 hover:underline inline-flex items-center gap-1">
                                Create one
                                <ArrowRight size={12} />
                            </Link>
                        </p>

                        {/* Demo Accounts */}
                        <div className="mt-6 pt-6 border-t border-sky-100">
                            <p className="text-xs text-sky-500 text-center mb-3 font-medium flex items-center justify-center gap-2">
                                <Shield size={12} />
                                Demo Accounts - Click to auto-fill
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {[
                                    { role: 'Admin', email: 'admin@clinic.com', color: 'purple' },
                                    { role: 'Doctor', email: 'doctor@clinic.com', color: 'sky' },
                                    { role: 'Receptionist', email: 'receptionist@clinic.com', color: 'teal' },
                                    { role: 'Patient', email: 'patient@clinic.com', color: 'emerald' },
                                ].map(({ role, email, color }) => {
                                    const colorClasses = {
                                        purple: 'hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700',
                                        sky: 'hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700',
                                        teal: 'hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700',
                                        emerald: 'hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700',
                                    };
                                    return (
                                        <button 
                                            key={role} 
                                            type="button"
                                            onClick={() => setForm({ email, password: 'Admin12345!' })}
                                            className={`bg-sky-50/50 border border-sky-100 rounded-lg p-2 text-left transition-all duration-200 ${colorClasses[color]} cursor-pointer group`}
                                        >
                                            <span className="font-semibold block text-sky-800 group-hover:text-inherit">{role}</span>
                                            <span className="text-sky-400 text-[10px] group-hover:text-inherit">{email}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-sky-400 flex items-center justify-center gap-1">
                                <Shield size={12} />
                                Your information is secure and encrypted
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;