import React, { useState } from 'react';
import type { CartItem } from '../types';
import { useCurrency } from '../hooks/useCurrency';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    subtotal: number;
    discountAmount: number;
    tax: number;
    total: number;
    onConfirmPayment: (paymentMethod: string) => void;
}

const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'Mobile Payment'];

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, subtotal, discountAmount, tax, total, onConfirmPayment }) => {
    const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
    const { formatCurrency } = useCurrency();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-brand-primary mb-4 text-center">Confirm Order</h2>
                
                <div className="bg-brand-dark rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                    {cartItems.map(item => (
                        <div key={item.product.id} className="flex justify-between text-sm mb-1">
                            <span className="text-brand-light">{item.quantity} x {item.product.name}</span>
                            <span className="text-gray-300">{formatCurrency(item.product.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 text-md border-t border-b border-brand-dark py-3 mb-4">
                    <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                    {discountAmount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-{formatCurrency(discountAmount)}</span></div>}
                    <div className="flex justify-between text-gray-300"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
                    <div className="flex justify-between text-brand-light font-bold text-xl"><span>Total</span><span>{formatCurrency(total)}</span></div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-brand-light mb-3 text-center">Select Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {PAYMENT_METHODS.map(method => (
                            <button
                                key={method}
                                onClick={() => setSelectedMethod(method)}
                                className={`p-3 text-sm font-semibold rounded-lg transition-colors ${
                                    selectedMethod === method
                                        ? 'bg-brand-primary text-white ring-2 ring-brand-primary ring-offset-2 ring-offset-brand-secondary'
                                        : 'bg-brand-dark text-brand-light hover:bg-opacity-80'
                                }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-1/2 bg-brand-dark text-gray-300 font-bold py-3 rounded-lg hover:bg-opacity-80 transition-colors">
                        Cancel
                    </button>
                    <button onClick={() => onConfirmPayment(selectedMethod)} className="w-1/2 bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
