import React from 'react';
import Sidebar from '../shared/Sidebar';
import Header from '../shared/Header';

const DashboardLayout = ({ title, children }) => (
    <div className="flex h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
            <Header title={title} />
            <main className="flex-1 overflow-y-auto p-6">
                {/* Decorative background elements */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-20"></div>
                </div>
                
                {/* Content with relative positioning */}
                <div className="relative z-10 space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-sky-500 to-sky-400 rounded-full"></div>
                        <h1 className="text-2xl font-bold text-sky-900">{title}</h1>
                    </div>
                    
                    {/* Children components */}
                    {children}
                </div>
            </main>
        </div>
    </div>
);

export default DashboardLayout;