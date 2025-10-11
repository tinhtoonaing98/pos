import React from 'react';
import type { Sale } from '../types';
import CartItem from './CartItem';
import SaleTabs from './SaleTabs';
import { TrashIcon } from './icons/TrashIcon';
import { TagIcon } from './icons/TagIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { useCurrency } from '../hooks/useCurrency';

interface CartProps {
    sales: Sale[];
    activeSale: Sale;
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onCheckout: () => void;
    onNewSale: () => void;
    onSwitchSale: (id: number) => void;
    onDeleteSale: (id: number) => void;
    subtotal: number;
    discountAmount: number;
    tax: number;
    total: number;
    onOpenDiscountModal: () => void;
    onRemoveDiscount: () => void;
    onEditItemNotes: (productId: number) => void;
}

const Cart: React.FC<CartProps> = ({
    sales,
    activeSale,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
    onNewSale,
    onSwitchSale,
    onDeleteSale,
    subtotal,
    discountAmount,
    tax,
    total,
    onOpenDiscountModal,
    onRemoveDiscount,
    onEditItemNotes
}) => {
    const { formatCurrency } = useCurrency();
    const cartItems = activeSale?.items ?? [];

    return (
        <div className="bg-brand-secondary rounded-lg shadow-lg p-4 flex flex-col h-[calc(100vh-100px)]">
            <SaleTabs
                sales={sales}
                activeSaleId={activeSale.id}
                onNewSale={onNewSale}
                onSwitchSale={onSwitchSale}
                onDeleteSale={onDeleteSale}
            />

            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {cartItems.length === 0 ? (
                    <div className="text-center text-gray-400 pt-20">
                        <p>Your cart is empty.</p>
                        <p className="text-sm">Add products from the left panel.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {cartItems.map(item => (
                            <CartItem
                                key={item.product.id}
                                item={item}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemove={onRemoveItem}
                                onEditNotes={onEditItemNotes}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 border-t border-brand-dark pt-4">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300 items-center">
                        <span>Discount</span>
                        <div className="flex items-center gap-2">
                             {discountAmount > 0 && (
                                <button onClick={onRemoveDiscount} aria-label="Remove discount">
                                    <XCircleIcon className="w-4 h-4 text-red-400" />
                                </button>
                            )}
                            <span className={discountAmount > 0 ? 'text-green-400' : ''}>
                                -{formatCurrency(discountAmount)}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between text-gray-300">
                        <span>Tax (8%)</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-brand-light font-bold text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                     <button
                        onClick={onOpenDiscountModal}
                        disabled={cartItems.length === 0}
                        className="w-1/3 bg-brand-dark text-brand-light font-bold py-3 rounded-lg hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <TagIcon className="w-5 h-5" />
                        Discount
                    </button>
                    <button
                        onClick={onCheckout}
                        disabled={cartItems.length === 0}
                        className="w-2/3 bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
