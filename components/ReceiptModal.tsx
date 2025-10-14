import React from 'react';
import type { Order } from '../types';
import { useCurrency } from '../hooks/useCurrency';
import { useAppContext } from '../contexts/AppContext';

interface ReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, order }) => {
    const { branches } = useAppContext();
    const { formatCurrency } = useCurrency();
    
    if (!isOpen || !order) return null;

    const currentBranch = branches.find(b => b.id === order.branchId) ?? branches[0];

    const subtotalAfterDiscount = order.subtotal - order.discountAmount;
    const taxRate = subtotalAfterDiscount > 0 ? (order.tax / subtotalAfterDiscount) * 100 : 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm text-gray-800 font-mono">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-bold">{currentBranch.name}</h2>
                    <p className="text-xs">{currentBranch.location}</p>
                    <p className="text-xs">Date: {new Date(order.createdAt).toLocaleString()}</p>
                    <p className="text-xs">Order #: {order.id}</p>
                    <p className="text-xs">Cashier: {order.cashier}</p>
                </div>

                <div className="border-t border-b border-dashed border-gray-400 py-2">
                    {order.items.map(item => (
                         <div key={item.productId} className="flex justify-between text-sm mb-1">
                            <div>
                                <p>{item.productName}</p>
                                <p className="text-xs pl-2">{item.quantity} @ {formatCurrency(item.price)}</p>
                            </div>
                            <span>{formatCurrency(item.quantity * item.price)}</span>
                        </div>
                    ))}
                </div>

                <div className="py-2 text-sm space-y-1">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                    {order.discountAmount > 0 && <div className="flex justify-between"><span>Discount</span><span>-{formatCurrency(order.discountAmount)}</span></div>}
                    <div className="flex justify-between"><span>Tax ({taxRate.toFixed(2)}%)</span><span>{formatCurrency(order.tax)}</span></div>
                </div>

                <div className="border-t border-dashed border-gray-400 pt-2 text-lg font-bold flex justify-between">
                    <span>TOTAL</span>
                    <span>{formatCurrency(order.total)}</span>
                </div>
                <p className="text-sm text-center mt-1">Paid with: {order.paymentMethod}</p>

                <p className="text-center text-sm mt-4">Thank you for your visit!</p>
                
                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                        Close
                    </button>
                     <button onClick={() => window.print()} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Print
                    </button>
                </div>
                 <style>{`@media print { body * { visibility: hidden; } .receipt-modal, .receipt-modal * { visibility: visible; } .receipt-modal { position: absolute; left: 0; top: 0; } .no-print { display: none; } }`}</style>
            </div>
        </div>
    );
};

export default ReceiptModal;