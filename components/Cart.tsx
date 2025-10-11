import React from 'react';
import type { Sale } from '../types';
import CartItem from './CartItem';
import SaleTabs from './SaleTabs';
import { TagIcon } from './icons/TagIcon';
import { XCircleIcon } from './icons/XCircleIcon';


interface CartProps {
    sales: Sale[];
    activeSale: Sale;
    onUpdateQuantity: (productId: number, quantity: number) => void;
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
    onEditItemNotes,
}) => {
    const items = activeSale.items;

    return (
        <div className="bg-brand-secondary rounded-lg shadow-inner p-4 flex flex-col h-full max-h-[calc(100vh-10rem)]">
            <SaleTabs
                sales={sales}
                activeSaleId={activeSale.id}
                onNewSale={onNewSale}
                onSwitchSale={onSwitchSale}
                onDeleteSale={onDeleteSale}
            />
            
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {items.length === 0 ? (
                    <p className="text-gray-400 text-center py-10">Your cart is empty.</p>
                ) : (
                    <div className="space-y-3">
                        {items.map(item => (
                            <CartItem 
                                key={item.product.id} 
                                item={item} 
                                onUpdateQuantity={onUpdateQuantity} 
                                onRemoveItem={onRemoveItem}
                                onEditNotes={() => onEditItemNotes(item.product.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {items.length > 0 && (
                 <div className="mt-auto border-t border-brand-dark pt-4">
                    <div className="mb-4">
                        {discountAmount > 0 ? (
                            <div className="flex justify-between items-center bg-brand-dark p-2 rounded-lg">
                                <p className="text-sm font-semibold text-green-400">Discount Applied!</p>
                                <button 
                                    onClick={onRemoveDiscount} 
                                    aria-label="Remove discount" 
                                    className="text-gray-400 hover:text-white p-1"
                                >
                                    <XCircleIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={onOpenDiscountModal}
                                className="w-full flex items-center justify-center bg-brand-dark text-brand-primary font-bold py-2 rounded-lg hover:bg-opacity-80 transition-colors text-sm"
                            >
                                <TagIcon className="w-4 h-4 mr-2" />
                                Add Order Discount
                            </button>
                        )}
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
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
                        <div className="flex justify-between font-bold text-lg text-brand-light border-t border-brand-dark pt-2 mt-2">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={onCheckout}
                        className="w-full bg-brand-primary text-white font-bold py-3 mt-4 rounded-lg hover:bg-opacity-90 transition-colors text-lg"
                        disabled={total <= 0 && discountAmount >= subtotal}
                    >
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;
