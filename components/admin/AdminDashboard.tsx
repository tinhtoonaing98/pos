import React, { useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import StatCard from './StatCard';
import { PackageIcon } from '../icons/AdminIcons';
import { TagIcon } from '../icons/TagIcon';

const AdminDashboard: React.FC = () => {
    const { orders, products } = useAppContext();

    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
        const totalOrders = orders.length;

        const productSales = orders
            .flatMap(order => order.items)
            .reduce((acc, item) => {
                acc[item.productId] = (acc[item.productId] || 0) + item.quantity;
                return acc;
            }, {} as Record<number, number>);
        
        const topSellingProducts = Object.entries(productSales)
            .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
            .slice(0, 3)
            .map(([productId, quantity]) => {
                const product = products.find(p => p.id === Number(productId));
                return {
                    name: product?.name || 'Unknown Product',
                    quantity,
                };
            });

        return {
            totalRevenue,
            totalOrders,
            topSellingProducts,
        };

    }, [orders, products]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-light mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={TagIcon} />
                <StatCard title="Total Orders" value={stats.totalOrders.toString()} icon={PackageIcon} />
            </div>

            <div className="mt-8 bg-brand-secondary p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-brand-light mb-4">Top Selling Products</h3>
                {stats.topSellingProducts.length > 0 ? (
                    <ul className="space-y-3">
                        {stats.topSellingProducts.map((p, index) => (
                            <li key={index} className="flex justify-between items-center bg-brand-dark p-3 rounded-md">
                                <span className="font-semibold text-brand-light">{index + 1}. {p.name}</span>
                                <span className="text-brand-primary font-bold">{p.quantity} sold</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 text-center py-4">No sales data yet.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
