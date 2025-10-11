import React from 'react';
import type { CartItem } from '../types';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    subtotal: number;
    discountAmount: number;
    tax: number;
    total: number;
    cartItems: CartItem[];
    onConfirmPayment: (paymentMethod: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, subtotal, discountAmount, tax, total, cartItems, onConfirmPayment }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-brand-primary mb-4 text-center">Confirm Payment</h2>
                
                {/* Receipt */}
                <div className="bg-brand-dark p-4 rounded-lg mb-6 text-brand-light max-h-60 overflow-y-auto">
                    <h3 className="text-lg font-semibold border-b border-brand-secondary pb-2 mb-2">Order Summary</h3>
                    <div className="space-y-1 text-sm">
                        {cartItems.map(item => (
                            <div key={item.product.id} className="flex justify-between">
                                <span>{item.quantity} x {item.product.name}</span>
                                <span>${(item.quantity * item.product.price).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-brand-secondary mt-3 pt-3 space-y-2 text-sm">
                         <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-green-400">
                                <span>Discount</span>
                                <span>-${discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Tax (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t border-brand-secondary pt-2 mt-2">
                            <span>Total Due</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>


                <h3 className="text-lg font-semibold text-brand-light mb-4 text-center">Select Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => onConfirmPayment('Card')} className="bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors">
                        Card
                    </button>
                    <button onClick={() => onConfirmPayment('Cash')} className="bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors">
                        Cash
                    </button>
                     <button onClick={() => onConfirmPayment('QR Pay')} className="bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition-colors">
                        QR Pay
                    </button>
                     <button onClick={() => onConfirmPayment('NFC')} className="bg-purple-500 text-white font-bold py-3 rounded-lg hover:bg-purple-600 transition-colors">
                        NFC
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 text-gray-400 hover:text-white transition-colors w-full py-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CheckoutModal;
