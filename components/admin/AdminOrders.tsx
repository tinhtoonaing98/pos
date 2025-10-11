import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useCurrency } from '../../hooks/useCurrency';
import type { Order } from '../../types';

const AdminOrders: React.FC = () => {
    const { orders } = useAppContext();
    const { formatCurrency } = useCurrency();
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const toggleOrderDetails = (orderId: number) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-light mb-6">Order History</h2>

            <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-brand-light uppercase bg-brand-dark">
                            <tr>
                                <th scope="col" className="px-6 py-3">Order ID</th>
                                <th scope="col" className="px-6 py-3 min-w-[150px]">Date</th>
                                <th scope="col" className="px-6 py-3">Cashier</th>

                                <th scope="col" className="px-6 py-3">Total</th>
                                <th scope="col" className="px-6 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <React.Fragment key={order.id}>
                                    <tr className="border-b border-brand-dark hover:bg-brand-dark/50">
                                        <td className="px-6 py-4 font-medium text-white">#{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-4">{order.cashier}</td>
                                        <td className="px-6 py-4 font-bold">{formatCurrency(order.total)}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleOrderDetails(order.id)} className="font-medium text-brand-primary hover:underline whitespace-nowrap">
                                                {expandedOrderId === order.id ? 'Hide' : 'Show'}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedOrderId === order.id && (
                                        <tr className="bg-brand-dark">
                                            <td colSpan={6} className="p-4">
                                                <div className="p-4 bg-brand-secondary rounded-md">
                                                    <h4 className="font-bold mb-2">Order #{order.id} Details ({order.items.length} items)</h4>
                                                    <ul>
                                                        {order.items.map(item => (
                                                            <li key={item.productId} className="flex justify-between text-xs py-1 border-b border-brand-dark/50">
                                                                <span>{item.quantity} x {item.productName}</span>
                                                                <span>{formatCurrency(item.price * item.quantity)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="mt-2 pt-2 border-t border-brand-dark/50 text-xs space-y-1">
                                                        <p className="flex justify-between"><span>Subtotal:</span> <span>{formatCurrency(order.subtotal)}</span></p>
                                                        {order.discountAmount > 0 && <p className="flex justify-between"><span>Discount:</span> <span>-{formatCurrency(order.discountAmount)}</span></p>}
                                                         <p className="flex justify-between"><span>Tax:</span> <span>{formatCurrency(order.tax)}</span></p>
                                                        <p className="flex justify-between font-bold text-sm"><span>Total:</span> <span>{formatCurrency(order.total)}</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                     {orders.length === 0 && <p className="text-center text-gray-400 py-8">No orders have been placed yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
