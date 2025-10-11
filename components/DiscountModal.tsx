import React, { useState, useEffect } from 'react';
import type { Sale } from '../types';

interface DiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyDiscount: (type: Sale['discountType'], value: number) => void;
    currentSubtotal: number;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ isOpen, onClose, onApplyDiscount, currentSubtotal }) => {
    const [type, setType] = useState<Sale['discountType']>('percentage');
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setValue('');
            setError('');
            setType('percentage');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleApply = () => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue <= 0) {
            setError('Please enter a valid positive number.');
            return;
        }

        if (type === 'percentage' && numericValue > 100) {
            setError('Percentage discount cannot exceed 100%.');
            return;
        }

        if (type === 'fixed' && numericValue > currentSubtotal) {
            setError('Fixed discount cannot exceed the subtotal.');
            return;
        }

        onApplyDiscount(type, numericValue);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-brand-primary mb-4">Apply Discount</h2>
                
                <div className="flex justify-center mb-4 bg-brand-dark rounded-lg p-1">
                    <button 
                        onClick={() => setType('percentage')} 
                        className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${type === 'percentage' ? 'bg-brand-primary text-white' : 'text-gray-300'}`}
                    >
                        Percentage (%)
                    </button>
                    <button 
                        onClick={() => setType('fixed')} 
                        className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${type === 'fixed' ? 'bg-brand-primary text-white' : 'text-gray-300'}`}
                    >
                        Fixed ($)
                    </button>
                </div>

                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        {type === 'percentage' ? '%' : '$'}
                    </span>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setError('');
                        }}
                        placeholder="e.g., 10"
                        className="w-full bg-brand-dark border border-brand-secondary text-brand-light placeholder-gray-400 text-lg rounded-lg focus:ring-brand-primary focus:border-brand-primary block pl-8 p-3 transition-colors text-center"
                        aria-label="Discount value"
                        autoFocus
                    />
                </div>

                {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-brand-dark text-gray-300 font-bold py-3 rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiscountModal;
