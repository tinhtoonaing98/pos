import React from 'react';
import type { CartItem as CartItemType } from '../types';
import { MinusIcon } from './icons/MinusIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { NoteIcon } from './icons/NoteIcon';
import { useCurrency } from '../hooks/useCurrency';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemove: (productId: number) => void;
    onEditNotes: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove, onEditNotes }) => {
    const { product, quantity } = item;
    const { formatCurrency } = useCurrency();

    return (
        <div className="flex items-center gap-3 bg-brand-dark p-2 rounded-lg">
            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-md object-cover" />
            <div className="flex-grow">
                <p className="font-semibold text-sm text-brand-light truncate">{product.name}</p>
                <p className="text-xs text-gray-400">{formatCurrency(product.price)}</p>
                {item.notes && <p className="text-xs text-brand-primary italic truncate mt-1">Note: {item.notes}</p>}
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                    className="p-1 bg-brand-secondary rounded-full hover:bg-red-500 transition-colors"
                >
                    <MinusIcon className="w-4 h-4 text-white" />
                </button>
                <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-1 bg-brand-secondary rounded-full hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <PlusIcon className="w-4 h-4 text-white" />
                </button>
            </div>
             <div className="flex flex-col gap-1.5">
                <button onClick={() => onEditNotes(product.id)} className="text-gray-400 hover:text-brand-primary transition-colors">
                    <NoteIcon className="w-5 h-5" />
                </button>
                 <button onClick={() => onRemove(product.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
