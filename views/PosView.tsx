import React, { useState, useMemo, useCallback } from 'react';
import type { Product, CartItem as CartItemType, Sale, Order } from '../types';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import CheckoutModal from '../components/CheckoutModal';
import SmartDescriptionModal from '../components/SmartDescriptionModal';
import DiscountModal from '../components/DiscountModal';
import ReceiptModal from '../components/ReceiptModal';
import ItemNotesModal from '../components/ItemNotesModal';
import { generateProductDescription } from '../services/geminiService';
import { useAppContext } from '../contexts/AppContext';
import { ShoppingCartIcon } from '../components/icons/ShoppingCartIcon';
import { useCurrency } from '../hooks/useCurrency';

const PosView: React.FC = () => {
    const { products, categories, addOrder, currentUser } = useAppContext();
    const { formatCurrency } = useCurrency();

    const [sales, setSales] = useState<Sale[]>([{ id: 1, name: 'Order 1', items: [], discountType: 'none', discountValue: 0 }]);
    const [activeSaleId, setActiveSaleId] = useState<number>(1);
    const [nextSaleId, setNextSaleId] = useState<number>(2);
    
    const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [isSmartDescriptionModalOpen, setSmartDescriptionModalOpen] = useState(false);
    const [isDiscountModalOpen, setDiscountModalOpen] = useState(false);
    const [isNotesModalOpen, setNotesModalOpen] = useState(false);
    const [isMobileCartOpen, setMobileCartOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<number | null>(null);

    const [selectedProductForDescription, setSelectedProductForDescription] = useState<Product | null>(null);
    const [aiDescription, setAiDescription] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

    const activeSale = useMemo(() => {
        return sales.find(s => s.id === activeSaleId) ?? sales[0];
    }, [sales, activeSaleId]);
    
    const cartItems = activeSale?.items ?? [];

    const filteredProducts = useMemo(() => {
        let prods = products;
        if (selectedCategory !== 'All') {
            prods = prods.filter(p => p.category === selectedCategory);
        }
        if (searchQuery.trim() !== '') {
            prods = prods.filter(p => 
                p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
            );
        }
        return prods;
    }, [products, selectedCategory, searchQuery]);

    const handleAddToCart = useCallback((product: Product) => {
        setSales(prevSales =>
            prevSales.map(sale => {
                if (sale.id !== activeSaleId) return sale;

                const existingItem = sale.items.find(item => item.product.id === product.id);
                let newItems: CartItemType[];

                if (existingItem) {
                    if (existingItem.quantity >= product.stock) return sale; // Do not add more than stock
                    newItems = sale.items.map(item =>
                        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                } else {
                    if (product.stock <= 0) return sale; // Do not add if out of stock
                    newItems = [...sale.items, { product, quantity: 1, notes: '' }];
                }
                return { ...sale, items: newItems };
            })
        );
    }, [activeSaleId]);

    const handleUpdateQuantity = useCallback((productId: number, newQuantity: number) => {
        setSales(prevSales =>
            prevSales.map(sale => {
                if (sale.id !== activeSaleId) return sale;

                if (newQuantity <= 0) {
                    return { ...sale, items: sale.items.filter(item => item.product.id !== productId) };
                }
                
                const itemToUpdate = sale.items.find(item => item.product.id === productId);
                if (itemToUpdate && newQuantity > itemToUpdate.product.stock) {
                    return sale; // Prevent updating quantity beyond stock
                }

                return {
                    ...sale,
                    items: sale.items.map(item =>
                        item.product.id === productId ? { ...item, quantity: newQuantity } : item
                    ),
                };
            })
        );
    }, [activeSaleId]);
    
    const handleRemoveFromCart = useCallback((productId: number) => {
         setSales(prevSales =>
            prevSales.map(sale => {
                if (sale.id !== activeSaleId) return sale;
                return { ...sale, items: sale.items.filter(item => item.product.id !== productId) };
            })
        );
    }, [activeSaleId]);

    const handleClearCart = useCallback(() => {
        setSales(prevSales =>
            prevSales.map(sale =>
                sale.id === activeSaleId ? { ...sale, items: [], discountType: 'none', discountValue: 0 } : sale
            )
        );
    }, [activeSaleId]);

    const handleNewSale = useCallback(() => {
        const newSale: Sale = { id: nextSaleId, name: `Order ${nextSaleId}`, items: [], discountType: 'none', discountValue: 0 };
        setSales(prev => [...prev, newSale]);
        setActiveSaleId(nextSaleId);
        setNextSaleId(prev => prev + 1);
    }, [nextSaleId]);

    const handleSwitchSale = useCallback((saleId: number) => {
        setActiveSaleId(saleId);
    }, []);

    const handleDeleteSale = useCallback((saleIdToDelete: number) => {
        setSales(prevSales => {
            if (prevSales.length <= 1) { // If it's the last sale, just clear it.
                handleClearCart();
                return prevSales;
            }

            const newSales = prevSales.filter(s => s.id !== saleIdToDelete);
            if (activeSaleId === saleIdToDelete) {
                setActiveSaleId(newSales[0].id);
            }
            return newSales;
        });
    }, [activeSaleId, handleClearCart]);

    const handleOpenSmartDescription = useCallback(async (product: Product) => {
        setSelectedProductForDescription(product);
        setSmartDescriptionModalOpen(true);
        setIsAiLoading(true);
        setAiDescription('');
        try {
            const description = await generateProductDescription(product.name);
            setAiDescription(description);
        } catch (error) {
            console.error("Error generating description:", error);
            setAiDescription('Sorry, we couldn\'t generate a description at this time.');
        } finally {
            setIsAiLoading(false);
        }
    }, []);

    const { subtotal, discountAmount, tax, total } = useMemo(() => {
        const currentItems = activeSale?.items ?? [];
        const sub = currentItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        let discAmount = 0;
        if (activeSale?.discountType === 'percentage') {
            discAmount = sub * (activeSale.discountValue / 100);
        } else if (activeSale?.discountType === 'fixed') {
            discAmount = activeSale.discountValue;
        }
        
        discAmount = Math.max(0, Math.min(sub, discAmount));
        const subtotalAfterDiscount = sub - discAmount;
        const taxAmount = subtotalAfterDiscount * 0.08;
        
        return { 
            subtotal: sub, 
            discountAmount: discAmount,
            tax: taxAmount, 
            total: subtotalAfterDiscount + taxAmount 
        };
    }, [activeSale]);

    const handleApplyDiscount = useCallback((type: Sale['discountType'], value: number) => {
        setSales(prevSales =>
            prevSales.map(sale =>
                sale.id === activeSaleId ? { ...sale, discountType: type, discountValue: value } : sale
            )
        );
        setDiscountModalOpen(false);
    }, [activeSaleId]);

    const handleRemoveDiscount = useCallback(() => {
        setSales(prevSales =>
            prevSales.map(sale =>
                sale.id === activeSaleId ? { ...sale, discountType: 'none', discountValue: 0 } : sale
            )
        );
    }, [activeSaleId]);

    const handleConfirmPayment = (paymentMethod: string) => {
        const newOrder = addOrder({
            items: cartItems.map(item => ({
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                notes: item.notes,
            })),
            subtotal,
            discountAmount,
            tax,
            total,
            paymentMethod,
            cashier: currentUser?.username ?? 'N/A',
        });

        setCheckoutModalOpen(false);
        setMobileCartOpen(false);
        setCompletedOrder(newOrder);
    };

    const handleCloseReceipt = () => {
        setCompletedOrder(null);
        if (sales.length > 1) {
            handleDeleteSale(activeSaleId);
        } else {
            setSales([{ id: 1, name: 'Order 1', items: [], discountType: 'none', discountValue: 0 }]);
            setActiveSaleId(1);
            setNextSaleId(2);
        }
    };

    const handleOpenNotesModal = (productId: number) => {
        setEditingItemId(productId);
        setNotesModalOpen(true);
    };

    const handleSaveNotes = (notes: string) => {
        setSales(prevSales =>
            prevSales.map(sale =>
                sale.id === activeSaleId
                    ? {
                          ...sale,
                          items: sale.items.map(item =>
                              item.product.id === editingItemId ? { ...item, notes } : item
                          ),
                      }
                    : sale
            )
        );
        setNotesModalOpen(false);
        setEditingItemId(null);
    };

    const editingItem = cartItems.find(item => item.product.id === editingItemId);
    const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-brand-dark text-brand-light font-sans">
            <Header />
            <main className="container mx-auto p-2 md:p-4">
                <div className="flex flex-col lg:flex-row lg:space-x-4">
                    <div className="lg:w-3/5 xl:w-2/3">
                        <ProductGrid
                            products={filteredProducts}
                            onAddToCart={handleAddToCart}
                            onSmartDescription={handleOpenSmartDescription}
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    </div>
                    {/* Tablet & Desktop Cart */}
                    <div className="hidden lg:block lg:w-2/5 xl:w-1/3 mt-4 lg:mt-0">
                        <Cart
                            sales={sales}
                            activeSale={activeSale}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveFromCart}
                            onCheckout={() => setCheckoutModalOpen(true)}
                            onNewSale={handleNewSale}
                            onSwitchSale={handleSwitchSale}
                            onDeleteSale={handleDeleteSale}
                            subtotal={subtotal}
                            discountAmount={discountAmount}
                            tax={tax}
                            total={total}
                            onOpenDiscountModal={() => setDiscountModalOpen(true)}
                            onRemoveDiscount={handleRemoveDiscount}
                            onEditItemNotes={handleOpenNotesModal}
                        />
                    </div>
                </div>
            </main>

            {/* Mobile Cart (as a modal) */}
            {isMobileCartOpen && (
                 <div className="lg:hidden fixed inset-0 bg-brand-dark z-40">
                    <Cart
                        isMobileView={true}
                        onMobileClose={() => setMobileCartOpen(false)}
                        sales={sales}
                        activeSale={activeSale}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveFromCart}
                        onCheckout={() => setCheckoutModalOpen(true)}
                        onNewSale={handleNewSale}
                        onSwitchSale={handleSwitchSale}
                        onDeleteSale={handleDeleteSale}
                        subtotal={subtotal}
                        discountAmount={discountAmount}
                        tax={tax}
                        total={total}
                        onOpenDiscountModal={() => setDiscountModalOpen(true)}
                        onRemoveDiscount={handleRemoveDiscount}
                        onEditItemNotes={handleOpenNotesModal}
                    />
                </div>
            )}
            
            {/* Mobile "View Cart" Button */}
            {totalItemsInCart > 0 && (
                <div className="lg:hidden fixed bottom-4 right-4 z-30">
                     <button
                        onClick={() => setMobileCartOpen(true)}
                        className="flex items-center gap-3 bg-brand-primary text-white font-bold px-5 py-3 rounded-full shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105"
                    >
                        <ShoppingCartIcon className="w-6 h-6" />
                        <div>
                            <span>{totalItemsInCart} Item{totalItemsInCart > 1 ? 's' : ''}</span>
                            <span className="ml-2 font-semibold">{formatCurrency(total)}</span>
                        </div>
                    </button>
                </div>
            )}
            
            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setCheckoutModalOpen(false)}
                subtotal={subtotal}
                discountAmount={discountAmount}
                tax={tax}
                total={total}
                cartItems={cartItems}
                onConfirmPayment={handleConfirmPayment}
            />

            <SmartDescriptionModal
                isOpen={isSmartDescriptionModalOpen}
                onClose={() => setSmartDescriptionModalOpen(false)}
                product={selectedProductForDescription}
                description={aiDescription}
                isLoading={isAiLoading}
            />
            
            <DiscountModal
                isOpen={isDiscountModalOpen}
                onClose={() => setDiscountModalOpen(false)}
                onApplyDiscount={handleApplyDiscount}
                currentSubtotal={subtotal}
            />

            <ReceiptModal
                isOpen={!!completedOrder}
                onClose={handleCloseReceipt}
                order={completedOrder}
            />

            <ItemNotesModal
                isOpen={isNotesModalOpen}
                onClose={() => setNotesModalOpen(false)}
                onSave={handleSaveNotes}
                initialNotes={editingItem?.notes ?? ''}
                productName={editingItem?.product.name ?? ''}
            />
        </div>
    );
};

export default PosView;
