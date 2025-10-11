import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { Order } from '../../types';
import StatCard from './StatCard';
// Fix: Import TagIcon from its dedicated file, not from AdminIcons.
import { ReceiptIcon } from '../icons/AdminIcons';
import { TagIcon } from '../icons/TagIcon';

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'all';

const AdminReports: React.FC = () => {
    const { orders, branches } = useAppContext();
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
    const [selectedBranch, setSelectedBranch] = useState<number | 'all'>('all');

    const filteredOrders = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfWeek.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            
            const branchMatch = selectedBranch === 'all' || order.branchId === selectedBranch;
            if (!branchMatch) return false;

            switch (timePeriod) {
                case 'daily': return orderDate >= startOfDay;
                case 'weekly': return orderDate >= startOfWeek;
                case 'monthly': return orderDate >= startOfMonth;
                case 'all':
                default: return true;
            }
        });
    }, [orders, timePeriod, selectedBranch]);

    const stats = useMemo(() => {
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;
        // Assuming profit is 40% of revenue for this example
        const estimatedProfit = totalRevenue * 0.40;
        return { totalRevenue, totalOrders, estimatedProfit };
    }, [filteredOrders]);
    
    const handleExportCSV = () => {
        const headers = ["orderId", "date", "cashier", "branchName", "itemsCount", "subtotal", "discount", "tax", "total"];
        const branchMap = new Map(branches.map(b => [b.id, b.name]));

        const csvRows = [
            headers.join(','),
            ...filteredOrders.map(o => [
                o.id,
                o.createdAt.toISOString(),
                o.cashier,
                branchMap.get(o.branchId) || 'N/A',
                o.items.reduce((sum, i) => sum + i.quantity, 0),
                o.subtotal.toFixed(2),
                o.discountAmount.toFixed(2),
                o.tax.toFixed(2),
                o.total.toFixed(2),
            ].join(','))
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\r\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-light">Sales Reports</h2>
                <button onClick={handleExportCSV} className="bg-brand-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">Export CSV</button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-brand-secondary rounded-lg">
                <div className="flex items-center gap-2">
                    <label className="font-semibold text-gray-300">Period:</label>
                    <select value={timePeriod} onChange={e => setTimePeriod(e.target.value as TimePeriod)} className="bg-brand-dark input-style">
                        <option value="all">All Time</option>
                        <option value="daily">Today</option>
                        <option value="weekly">This Week</option>
                        <option value="monthly">This Month</option>
                    </select>
                </div>
                 <div className="flex items-center gap-2">
                    <label className="font-semibold text-gray-300">Branch:</label>
                    <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value === 'all' ? 'all' : parseInt(e.target.value))} className="bg-brand-dark input-style">
                        <option value="all">All Branches</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={TagIcon} />
                <StatCard title="Total Orders" value={stats.totalOrders.toString()} icon={ReceiptIcon} />
                <StatCard title="Estimated Profit" value={`$${stats.estimatedProfit.toFixed(2)}`} icon={TagIcon} />
            </div>

            <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-brand-light uppercase bg-brand-dark">
                        <tr>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Branch</th>
                            <th className="px-6 py-3">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="border-b border-brand-dark hover:bg-brand-dark/50">
                                <td className="px-6 py-4 font-mono text-xs">{order.id.substring(0, 13)}...</td>
                                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleString()}</td>
                                <td className="px-6 py-4">{branches.find(b => b.id === order.branchId)?.name}</td>
                                <td className="px-6 py-4 font-semibold">${order.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredOrders.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No orders found for the selected filters.</p>
                )}
            </div>
             <style>{`.input-style { border: 1px solid #393E46; color: #EEEEEE; font-size: 0.875rem; border-radius: 0.5rem; display: block; padding: 0.5rem; transition: background-color 0.2s, border-color 0.2s; } .input-style:focus { outline: none; ring: 1px; ring-color: #00ADB5; border-color: #00ADB5; }`}</style>
        </div>
    );
};

export default AdminReports;