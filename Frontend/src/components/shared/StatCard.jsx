import React from 'react';

const StatCard = ({ icon: Icon, label, value, color = 'sky', trend, subtext }) => {
    const colors = {
        sky: 'bg-sky-50 text-sky-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
        teal: 'bg-teal-50 text-teal-600',
    };

    const trendColors = {
        positive: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        negative: 'bg-rose-50 text-rose-700 border border-rose-100',
    };

    return (
        <div className="bg-white rounded-xl p-5 border border-sky-100 hover:border-sky-200 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-center justify-between mb-3">
                {/* Icon with gradient effect on hover */}
                <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform duration-200`}>
                    {Icon && <Icon size={22} className="group-hover:rotate-3 transition-transform" />}
                </div>
                
                {/* Trend indicator */}
                {trend !== undefined && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        trend >= 0 ? trendColors.positive : trendColors.negative
                    }`}>
                        {trend >= 0 ? (
                            <span className="flex items-center gap-0.5">
                                <span>↑</span> {trend}%
                            </span>
                        ) : (
                            <span className="flex items-center gap-0.5">
                                <span>↓</span> {Math.abs(trend)}%
                            </span>
                        )}
                    </span>
                )}
            </div>

            {/* Value with medical styling */}
            <p className="text-2xl font-bold text-sky-900 group-hover:text-sky-800 transition-colors">
                {value}
            </p>
            
            {/* Label */}
            <p className="text-sm text-sky-600 mt-1 font-medium">
                {label}
            </p>

            {/* Optional subtext */}
            {subtext && (
                <p className="text-xs text-sky-400 mt-2 border-t border-sky-50 pt-2">
                    {subtext}
                </p>
            )}
        </div>
    );
};

export default StatCard;