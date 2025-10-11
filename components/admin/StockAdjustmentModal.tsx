import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

interface StockAdjustmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({ isOpen, onClose, product }) => {
    const { updateStock } = useAppContext();
    const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setQuantity('');
            setReason('');
            setAdjustmentType('add');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numQuantity = parseInt(quantity, 10);
        if (isNaN(numQuantity) || numQuantity <= 0) {
            setError('Please enter a valid positive quantity.');
            return;
        }
        if (!reason.trim()) {
            setError('A reason for the adjustment is required.');
            return;
        }

        const quantityChange = adjustmentType === 'add' ? numQuantity : -numQuantity;
        const logType = adjustmentType === 'add' ? 'adjustment-add' : 'adjustment-remove';

        const success = updateStock(product.id, quantityChange, logType, reason);
        if (success) {
            onClose();
        } else {
            setError(`Cannot remove ${numQuantity}. Only ${product.stock} items are in stock.`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-brand-primary mb-2">Adjust Stock</h2>
                <p className="text-brand-light mb-4">For: <span className="font-semibold">{product.name}</span> (Current: {product.stock})</p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center mb-4 bg-brand-dark rounded-lg p-1">
                        <button type="button" onClick={() => setAdjustmentType('add')} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${adjustmentType === 'add' ? 'bg-green-500 text-white' : 'text-gray-300'}`}>Add Stock</button>
                        <button type="button" onClick={() => setAdjustmentType('remove')} className={`w-1/2 py-2 text-sm font-bold rounded-md transition-colors ${adjustmentType === 'remove' ? 'bg-red-500 text-white' : 'text-gray-300'}`}>Remove Stock</button>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-brand-light text-sm font-bold mb-2">Quantity</label>
                        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full bg-brand-dark input-style" required min="1" />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-brand-light text-sm font-bold mb-2">Reason</label>
                        <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-brand-dark input-style" required placeholder="e.g., New shipment, Damaged goods" />
                    </div>

                    {error && <p className="text-red-400 text-xs mb-4 text-center">{error}</p>}
                    
                    <div className="flex gap-4 mt-6">
                        <button type="button" onClick={onClose} className="w-full bg-brand-dark text-gray-300 font-bold py-3 rounded-lg hover:bg-opacity-80 transition-colors">Cancel</button>
                        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors">Confirm Adjustment</button>
                    </div>
                </form>
                <style>{`.input-style { border: 1px solid #393E46; color: #EEEEEE; placeholder-color: #9CA3AF; font-size: 0.875rem; border-radius: 0.5rem; display: block; padding: 0.625rem; transition: background-color 0.2s, border-color 0.2s; } .input-style:focus { outline: none; ring: 1px; ring-color: #00ADB5; border-color: #00ADB5; }`}</style>
            </div>
        </div>
    );
};

export default StockAdjustmentModal;
