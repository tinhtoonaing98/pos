import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useCurrency } from '../../hooks/useCurrency';
import type { Order } from '../../types';
import { DownloadIcon } from '../icons/AdminIcons';

type DateFilter = 'all' | 'today' | 'week' | 'month';

const AdminReports: React.FC = () => {
    const { orders, branches } = useAppContext();
    const { formatCurrency } = useCurrency();
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
    const [branchFilter, setBranchFilter] = useState<number | 'all'>('all');

    const filteredOrders = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            
            const branchMatch = branchFilter === 'all' || order.branchId === branchFilter;
            if (!branchMatch) return false;

            switch (dateFilter) {
                case 'today':
                    return orderDate >= today;
                case 'week':
                    return orderDate >= startOfWeek;
                case 'month':
                    return orderDate >= startOfMonth;
                case 'all':
                default:
                    return true;
            }
        });
    }, [orders, dateFilter, branchFilter]);

    const stats = useMemo(() => {
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        return { totalRevenue, totalOrders, averageOrderValue };
    }, [filteredOrders]);

    const getBranchName = (branchId: number) => branches.find(b => b.id === branchId)?.name || 'N/A';
    
    const handleExportCSV = () => {
        const headers = ["Order ID", "Date", "Cashier", "Branch", "Payment Method", "Subtotal", "Discount", "Tax", "Total"];
        const csvRows = [
            headers.join(','),
            ...filteredOrders.map(order => [
                `"${order.id}"`,
                `"${new Date(order.createdAt).toLocaleString()}"`,
                `"${order.cashier}"`,
                `"${getBranchName(order.branchId)}"`,
                `"${order.paymentMethod}"`,
                order.subtotal.toFixed(2),
                order.discountAmount.toFixed(2),
                order.tax.toFixed(2),
                order.total.toFixed(2),
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

    const FilterButton: React.FC<{filter: DateFilter, label: string}> = ({filter, label}) => (
        <button 
            onClick={() => setDateFilter(filter)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                dateFilter === filter ? 'bg-brand-primary text-white' : 'bg-brand-dark text-gray-300 hover:bg-opacity-80'
            }`}
        >{label}</button>
    );

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold text-brand-light">Sales Reports</h2>
                 <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Export to CSV
                </button>
            </div>
            
            <div className="bg-brand-secondary p-4 rounded-lg shadow-lg mb-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-300">Date:</label>
                    <FilterButton filter="today" label="Today" />
                    <FilterButton filter="week" label="This Week" />
                    <FilterButton filter="month" label="This Month" />
                    <FilterButton filter="all" label="All Time" />
                </div>
                <div className="flex items-center gap-2">
                     <label htmlFor="branch-filter" className="text-sm font-medium text-gray-300">Branch:</label>
                     <select 
                        id="branch-filter"
                        value={branchFilter} 
                        onChange={e => setBranchFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        className="bg-brand-dark border border-brand-dark text-brand-light text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-1.5"
                    >
                        <option value="all">All Branches</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
                    <p className="text-sm text-gray-400 font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-brand-light">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
                    <p className="text-sm text-gray-400 font-medium">Total Orders</p>
                    <p className="text-3xl font-bold text-brand-light">{stats.totalOrders}</p>
                </div>
                 <div className="bg-brand-secondary p-6 rounded-lg shadow-lg">
                    <p className="text-sm text-gray-400 font-medium">Average Order Value</p>
                    <p className="text-3xl font-bold text-brand-light">{formatCurrency(stats.averageOrderValue)}</p>
                </div>
            </div>

            <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-brand-light uppercase bg-brand-dark">
                            <tr>
                                <th scope="col" className="px-6 py-3">Order ID</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Branch</th>
                                <th scope="col" className="px-6 py-3">Items</th>
                                <th scope="col" className="px-6 py-3">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="border-b border-brand-dark hover:bg-brand-dark/50">
                                    <td className="px-6 py-4 font-medium text-white">#{order.id}</td>
                                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4">{getBranchName(order.branchId)}</td>
                                    <td className="px-6 py-4">{order.items.length}</td>
                                    <td className="px-6 py-4 font-bold">{formatCurrency(order.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredOrders.length === 0 && <p className="text-center text-gray-400 py-8">No orders found for the selected filters.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
