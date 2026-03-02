import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
    LayoutDashboard, Users, Calendar, FileText, Brain,
    BarChart2, LogOut, Menu, X, UserPlus, Stethoscope, ClipboardList, User,
    CreditCard, Activity, HeartPulse, Shield
} from 'lucide-react';

const roleMenus = {
    admin: [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
        { to: '/admin/receptionists', icon: Users, label: 'Receptionists' },
        { to: '/admin/patients', icon: User, label: 'Patients' },
        { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
        { to: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
        { to: '/admin/system', icon: Activity, label: 'System Usage' },
    ],
    doctor: [
        { to: '/doctor', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
        { to: '/doctor/prescriptions', icon: FileText, label: 'Prescriptions' },
        { to: '/doctor/ai-assist', icon: Brain, label: 'AI Diagnosis' },
        { to: '/doctor/analytics', icon: BarChart2, label: 'My Analytics' },
    ],
    receptionist: [
        { to: '/receptionist', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/receptionist/register-patient', icon: UserPlus, label: 'Register Patient' },
        { to: '/receptionist/book-appointment', icon: Calendar, label: 'Book Appointment' },
        { to: '/receptionist/schedule', icon: ClipboardList, label: 'Daily Schedule' },
        { to: '/receptionist/patients', icon: Users, label: 'Patients' },
    ],
    patient: [
        { to: '/patient', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/patient/appointments', icon: Calendar, label: 'Appointments' },
        { to: '/patient/prescriptions', icon: FileText, label: 'Prescriptions' },
        { to: '/patient/profile', icon: User, label: 'Profile' },
    ],
};

const roleBadgeColors = {
    admin: 'bg-purple-50 text-purple-700 border border-purple-200',
    doctor: 'bg-sky-50 text-sky-700 border border-sky-200',
    receptionist: 'bg-teal-50 text-teal-700 border border-teal-200',
    patient: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const menu = roleMenus[user?.role] || [];

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <>
            {/* Mobile toggle */}
            <button
                className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-md text-sky-600 hover:bg-sky-50 transition-colors border border-sky-100"
                onClick={() => setOpen(!open)}
            >
                {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Overlay */}
            {open && (
                <div 
                    className="fixed inset-0 bg-sky-900/20 backdrop-blur-sm z-30 lg:hidden" 
                    onClick={() => setOpen(false)} 
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300
                ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col border-r border-sky-100`}>

                {/* Logo */}
                <div className="p-5 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-400 rounded-xl flex items-center justify-center shadow-md">
                            <HeartPulse size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sky-900 text-base leading-tight">AI Clinic</p>
                            <p className="text-xs text-sky-500">Management System</p>
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-sky-100 bg-white">
                    <div className="flex items-center gap-3">
                        {user?.profileImageUrl ? (
                            <img 
                                src={user.profileImageUrl} 
                                alt={user?.name} 
                                className="w-11 h-11 rounded-full object-cover ring-2 ring-sky-100"
                            />
                        ) : (
                            <div className="w-11 h-11 bg-gradient-to-br from-sky-500 to-sky-400 rounded-full flex items-center justify-center shadow-sm ring-2 ring-sky-100">
                                <span className="text-white font-bold text-lg">
                                    {user?.name?.[0]?.toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sky-900 text-sm truncate">{user?.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <Shield size={10} className="text-sky-400" />
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleBadgeColors[user?.role]}`}>
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto bg-white">
                    <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-3 px-3">Menu</p>
                    {menu.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === `/${user?.role}`}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all duration-200
                                ${isActive 
                                    ? 'bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-md' 
                                    : 'text-sky-600 hover:bg-sky-50 hover:text-sky-700'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={18} className={isActive ? 'text-white' : 'text-sky-400'} />
                                    {label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-sky-100 bg-gradient-to-r from-sky-50 to-white">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 border border-transparent hover:border-rose-100"
                    >
                        <LogOut size={18} className="text-rose-500" />
                        Logout
                    </button>
                    
                    {/* App Version */}
                    <p className="text-center text-xs text-sky-400 mt-3">v2.0.0 • Medical Suite</p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;