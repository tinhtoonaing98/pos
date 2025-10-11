
import React from 'react';
import type { CartItem as CartItemType } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { NoteIcon } from './icons/NoteIcon';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onEditNotes: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onEditNotes }) => {
    const { product, quantity, notes } = item;

    return (
        <div className="flex items-center justify-between bg-brand-dark p-3 rounded-lg">
            <div className="flex items-center space-x-3 flex-1">
                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                <div className="flex-1">
                    <p className="font-semibold text-sm text-brand-light">{product.name}</p>
                    <p className="text-xs text-gray-400">${product.price.toFixed(2)}</p>
                    {notes && <p className="text-xs text-brand-primary truncate mt-1">Note: {notes}</p>}
                </div>
            </div>
            <div className="flex items-center space-x-3">
                 <button 
                    onClick={onEditNotes} 
                    className={`p-1.5 rounded-full transition-colors ${notes ? 'text-brand-primary bg-brand-secondary' : 'text-gray-400 hover:bg-brand-secondary'}`}
                    aria-label="Add or edit note"
                >
                    <NoteIcon className="w-4 h-4" />
                 </button>
                 <div className="flex items-center bg-brand-secondary rounded-full">
                    <button onClick={() => onUpdateQuantity(product.id, quantity - 1)} className="p-1.5 text-gray-300 hover:text-white transition-colors">
                        <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-2 text-sm font-semibold w-8 text-center">{quantity}</span>
                    <button onClick={() => onUpdateQuantity(product.id, quantity + 1)} className="p-1.5 text-gray-300 hover:text-white transition-colors">
                        <PlusIcon className="w-4 h-4" />
                    </button>
                </div>
                <span className="font-bold text-brand-primary text-sm w-14 text-right">
                    ${(product.price * quantity).toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default CartItem;
