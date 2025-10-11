import React, { useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import StatCard from './StatCard';
import { useCurrency } from '../../hooks/useCurrency';
import { ChartBarIcon, ShoppingBagIcon, ArchiveBoxIcon, CurrencyDollarIcon } from '../../components/icons/AdminIcons';

const AdminDashboard: React.FC = () => {
    const { orders, products, stockLogs } = useAppContext();
    const { formatCurrency } = useCurrency();

    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold).length;
        
        const today = new Date().toDateString();
        const todaysRevenue = orders
            .filter(o => new Date(o.createdAt).toDateString() === today)
            .reduce((sum, order) => sum + order.total, 0);

        return { totalRevenue, totalOrders, lowStockItems, todaysRevenue };
    }, [orders, products]);
    
    const recentActivity = useMemo(() => {
        const recentOrders = orders.slice(0, 3).map(o => ({...o, type: 'order' as const}));
        const recentAdjustments = stockLogs.filter(l => l.type !== 'sale').slice(0, 3).map(l => ({...l, type: 'stock' as const}));
        return [...recentOrders, ...recentAdjustments]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [orders, stockLogs]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-light mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Today's Revenue" value={formatCurrency(stats.todaysRevenue)} icon={CurrencyDollarIcon} />
                <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={ChartBarIcon} />
                <StatCard title="Total Orders" value={String(stats.totalOrders)} icon={ShoppingBagIcon} />
                <StatCard title="Low Stock Items" value={String(stats.lowStockItems)} icon={ArchiveBoxIcon} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-brand-light mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? recentActivity.map(item => (
                             <div key={item.id} className="flex items-center gap-4 text-sm">
                                <div className={`p-2 rounded-full ${item.type === 'order' ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}>
                                    {item.type === 'order' ? <ShoppingBagIcon className="w-5 h-5 text-blue-400" /> : <ArchiveBoxIcon className="w-5 h-5 text-yellow-400" />}
                                </div>
                                <div className="flex-grow">
                                    {item.type === 'order' ? (
                                        <p>New Order #{item.id} placed for <span className="font-bold">{formatCurrency(item.total)}</span>.</p>
                                    ) : (
                                        <p>Stock adjustment for <span className="font-bold">{item.productName}</span> ({item.quantityChange > 0 ? '+' : ''}{item.quantityChange}).</p>
                                    )}
                                     <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        )) : <p className="text-gray-400">No recent activity.</p>}
                    </div>
                </div>

                <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-brand-light mb-4">Top Selling Products</h3>
                     <div className="space-y-2">
                        {/* This is a placeholder. A real implementation would calculate top sellers. */}
                        {products.slice(0, 5).map(p => (
                            <div key={p.id} className="flex justify-between items-center bg-brand-dark p-2 rounded-md">
                                <span className="text-sm font-medium">{p.name}</span>
                                <span className="text-xs text-gray-400">{p.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;