import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title }) => {
    const { user } = useAuth();
    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-sky-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            {/* Title with accent */}
            <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-sky-400 rounded-full"></div>
                <h1 className="text-xl font-semibold text-sky-900">{title}</h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <button className="p-2 hover:bg-sky-50 rounded-lg text-sky-500 transition-colors relative group">
                    <Bell size={20} className="group-hover:text-sky-600 transition-colors" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-sky-100">
                    {user?.profileImageUrl ? (
                        <img 
                            src={user.profileImageUrl} 
                            alt={user?.name} 
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-100"
                        />
                    ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-400 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">
                                {user?.name?.[0]?.toUpperCase()}
                            </span>
                        </div>
                    )}
                    
                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-sky-900">{user?.name}</p>
                        <p className="text-xs text-sky-500">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;