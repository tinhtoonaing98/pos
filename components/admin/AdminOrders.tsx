import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { Order } from '../../types';
import { SearchIcon } from '../icons/SearchIcon';

interface AdminOrdersProps {
    onViewOrder: (order: Order) => void;
}

const AdminOrders: React.FC<AdminOrdersProps> = ({ onViewOrder }) => {
    const { orders } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [sort, setSort] = useState<{key: 'createdAt' | 'total', direction: 'asc' | 'desc'}>({ key: 'createdAt', direction: 'desc' });
    
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = orders;

        if (searchQuery.trim()) {
            filtered = orders.filter(order => order.id.toLowerCase().includes(searchQuery.trim().toLowerCase()));
        }
        
        return filtered.sort((a, b) => {
            if (sort.key === 'createdAt') {
                const valA = new Date(a.createdAt).getTime();
                const valB = new Date(b.createdAt).getTime();
                return sort.direction === 'asc' ? valA - valB : valB - valA;
            } else { // sort by total
                return sort.direction === 'asc' ? a.total - b.total : b.total - a.total;
            }
        });
    }, [orders, searchQuery, sort]);

    const handleSort = (key: 'createdAt' | 'total') => {
        setSort(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    }

    const SortIndicator = ({ columnKey }: { columnKey: 'createdAt' | 'total' }) => {
        if (sort.key !== columnKey) return null;
        return sort.direction === 'desc' ? ' ↓' : ' ↑';
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-light">Order History</h2>
                <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Order ID..."
                        className="w-full bg-brand-dark border border-brand-secondary text-brand-light placeholder-gray-400 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block pl-10 p-2.5 transition-colors"
                        aria-label="Search orders"
                    />
                </div>
            </div>

             <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-brand-light uppercase bg-brand-dark">
                            <tr>
                                <th scope="col" className="px-6 py-3">Order ID</th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('createdAt')}>
                                    Date <SortIndicator columnKey="createdAt" />
                                </th>
                                <th scope="col" className="px-6 py-3">Items</th>
                                <th scope="col" className="px-6 py-3">Cashier</th>
                                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('total')}>
                                    Total <SortIndicator columnKey="total" />
                                </th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedOrders.map(order => (
                                <tr key={order.id} className="border-b border-brand-dark hover:bg-brand-dark/50">
                                    <td className="px-6 py-4 font-mono text-xs">{order.id.substring(0, 13)}...</td>
                                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4">{order.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                                    <td className="px-6 py-4">{order.cashier}</td>
                                    <td className="px-6 py-4 font-semibold">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => onViewOrder(order)} className="font-medium text-brand-primary hover:underline">View Receipt</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredAndSortedOrders.length === 0 && (
                        <p className="text-center text-gray-400 py-8">No orders found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
