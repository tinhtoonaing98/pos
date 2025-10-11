import React from 'react';
import type { Order } from '../types';

interface ReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    isReprint?: boolean;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, order, isReprint = false }) => {
    if (!isOpen || !order) return null;
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 print:bg-white print:text-black">
            <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-sm print:shadow-none print:rounded-none print:p-0 print:bg-white">
                <div id="receipt-content">
                    <h2 className="text-2xl font-bold text-brand-primary mb-2 text-center print:text-black">
                        {isReprint ? 'Order Receipt' : 'Payment Successful!'}
                    </h2>
                    <p className="text-center text-gray-400 mb-4 print:text-gray-600">Thank you for your order.</p>

                    <div className="bg-brand-dark p-4 rounded-lg text-brand-light print:bg-gray-100 print:text-black print:rounded-none">
                        <div className="text-xs text-gray-400 print:text-gray-600 mb-2">
                            <p>Order ID: {order.id}</p>
                            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                            <p>Cashier: {order.cashier}</p>
                            <p>Payment: {order.paymentMethod}</p>
                        </div>

                        <div className="border-t border-b border-brand-secondary my-2 py-2 space-y-2 text-sm">
                            {order.items.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between">
                                        <span>{item.quantity} x {item.productName}</span>
                                        <span>${(item.quantity * item.price).toFixed(2)}</span>
                                    </div>
                                    {item.notes && (
                                        <p className="text-xs text-gray-400 pl-4 print:text-gray-500"> - Note: {item.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="space-y-1 text-sm mt-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-green-400 print:text-green-600">
                                    <span>Discount</span>
                                    <span>-${order.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Tax (8%)</span>
                                <span>${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t border-brand-secondary pt-2 mt-2">
                                <span>Total Paid</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-6 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="w-full bg-brand-dark text-gray-300 font-bold py-3 rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                        Print
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        {isReprint ? 'Close' : 'New Order'}
                    </button>
                </div>
                <style>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .fixed.inset-0, .fixed.inset-0 > div {
                            position: static !important;
                        }
                        #receipt-content, #receipt-content * {
                            visibility: visible;
                        }
                        #receipt-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ReceiptModal;
