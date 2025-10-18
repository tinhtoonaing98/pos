import React, { useState, useMemo } from 'react';
import type { Sale } from '../types';
import { useCurrency } from '../hooks/useCurrency';
import { useAppContext } from '../contexts/AppContext';

interface DiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyDiscount: (type: Sale['discountType'], value: number) => void;
    currentSubtotal: number;
    taxRate: number;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ isOpen, onClose, onApplyDiscount, currentSubtotal, taxRate }) => {
    const [type, setType] = useState<Sale['discountType']>('percentage');
    const [value, setValue] = useState('');
    const { formatCurrency } = useCurrency();
    const { settings, currencies } = useAppContext();

    const currentSymbol = useMemo(() => {
        return currencies.find(c => c.code === settings.currencyCode)?.symbol || '$';
    }, [settings.currencyCode, currencies]);

    if (!isOpen) return null;

    const discountAmount = useMemo(() => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) return 0;

        if (type === 'percentage') {
            return currentSubtotal * (numValue / 100);
        }
        return numValue;
    }, [type, value, currentSubtotal]);

    const effectiveDiscountAmount = useMemo(() => {
        return Math.min(discountAmount, currentSubtotal);
    }, [discountAmount, currentSubtotal]);

    const taxAmount = useMemo(() => {
        return currentSubtotal * (taxRate / 100);
    }, [currentSubtotal, taxRate]);

    const newTotal = useMemo(() => {
        return Math.max(0, currentSubtotal + taxAmount - effectiveDiscountAmount);
    }, [currentSubtotal, taxAmount, effectiveDiscountAmount]);

    const handleApply = () => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) return;
        onApplyDiscount(type, numValue);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-brand-primary mb-4 text-center">Apply Discount</h2>

                <div className="flex justify-center mb-4 bg-brand-dark rounded-lg p-1">
                    <button onClick={() => setType('percentage')} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${type === 'percentage' ? 'bg-brand-primary text-white' : 'text-gray-300'}`}>Percentage (%)</button>
                    <button onClick={() => setType('fixed')} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${type === 'fixed' ? 'bg-brand-primary text-white' : 'text-gray-300'}`}>Fixed ({currentSymbol})</button>
                </div>
                
                <div>
                    <label className="block text-brand-light text-sm font-bold mb-2 text-center">Discount Value</label>
                    <input
                        type="number"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-secondary text-brand-light placeholder-gray-400 text-lg rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5 text-center"
                        placeholder={type === 'percentage' ? 'e.g., 10' : 'e.g., 5.00'}
                        min="0"
                        step={type === 'percentage' ? '1' : '0.01'}
                        autoFocus
                    />
                </div>

                <div className="mt-4 text-center text-sm text-gray-400">
                    <p>Subtotal: {formatCurrency(currentSubtotal)}</p>
                    <p>Tax ({taxRate}%): +{formatCurrency(taxAmount)}</p>
                    <p className="text-green-400">Discount: -{formatCurrency(effectiveDiscountAmount)}</p>
                    <p className="font-bold text-brand-light">New Total: {formatCurrency(newTotal)}</p>
                </div>

                <div className="flex gap-4 mt-6">
                    <button onClick={onClose} className="w-1/2 bg-brand-dark text-gray-300 font-bold py-3 rounded-lg hover:bg-opacity-80 transition-colors">Cancel</button>
                    <button onClick={handleApply} className="w-1/2 bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors">Apply</button>
                </div>
            </div>
        </div>
    );
};

export default DiscountModal;