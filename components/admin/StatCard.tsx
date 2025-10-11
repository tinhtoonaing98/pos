import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
    return (
        <div className="bg-brand-secondary p-6 rounded-lg shadow-lg flex items-center gap-4">
            <div className="bg-brand-primary/20 p-3 rounded-full">
                <Icon className="w-8 h-8 text-brand-primary" />
            </div>
            <div>
                <p className="text-sm text-gray-400 font-medium">{title}</p>
                <p className="text-3xl font-bold text-brand-light">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
