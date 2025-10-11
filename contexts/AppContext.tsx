import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import type { User, Product, Order, StockLog, StockLogType, Branch, UserRole } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, USERS as INITIAL_USERS, BRANCHES } from '../constants';

type AdminView = 'pos' | 'admin';

interface AppContextType {
    currentUser: User | null;
    login: (username: string, password: string) => boolean;
    logout: () => void;
    
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: number) => void;
    
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'branchId'>) => Order;

    users: User[];
    addUser: (userData: Omit<User, 'id'>) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: number) => void;

    branches: Branch[];

    categories: string[];
    adminView: AdminView;
    setAdminView: (view: AdminView) => void;
    
    stockLogs: StockLog[];
    updateStock: (productId: number, quantityChange: number, type: StockLogType, reason: string) => boolean;
    bulkUpdateProducts: (updatedProducts: Product[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [branches] = useState<Branch[]>(BRANCHES);
    const [adminView, setAdminView] = useState<AdminView>('pos');
    const [stockLogs, setStockLogs] = useState<StockLog[]>([]);

    useEffect(() => {
        const initialLogs: StockLog[] = INITIAL_PRODUCTS.map(p => ({
            id: `initial-${p.id}`,
            productId: p.id,
            productName: p.name,
            type: 'initial',
            quantityChange: p.stock,
            newStock: p.stock,
            reason: 'Initial stock load',
            createdAt: new Date(),
            user: 'System',
        }));
        setStockLogs(initialLogs);
    }, []);


    const login = (username: string, password: string): boolean => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            if (user.role !== 'admin' && user.role !== 'manager') {
                setAdminView('pos');
            }
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
    };
    
    // User Management
    const addUser = (userData: Omit<User, 'id'>) => {
        setUsers(prev => {
            const newId = Math.max(0, ...prev.map(u => u.id)) + 1;
            const newUser: User = { ...userData, id: newId };
            return [...prev, newUser];
        });
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const deleteUser = (userId: number) => {
        // Prevent deleting the last admin
        const userToDelete = users.find(u => u.id === userId);
        const adminCount = users.filter(u => u.role === 'admin').length;
        if (userToDelete?.role === 'admin' && adminCount <= 1) {
            alert("Cannot delete the last administrator.");
            return;
        }
        setUsers(prev => prev.filter(u => u.id !== userId));
    };


    const updateStock = (productId: number, quantityChange: number, type: StockLogType, reason: string): boolean => {
        let success = false;
        setProducts(prevProducts => {
            const productIndex = prevProducts.findIndex(p => p.id === productId);
            if (productIndex === -1) return prevProducts;

            const product = prevProducts[productIndex];
            const newStock = product.stock + quantityChange;
            if (newStock < 0) {
                 console.warn(`Attempted to adjust stock for ${product.name} to a negative value.`);
                 return prevProducts;
            }
            
            const updatedProduct = { ...product, stock: newStock };
            const newProducts = [...prevProducts];
            newProducts[productIndex] = updatedProduct;

            const newLog: StockLog = {
                id: new Date().toISOString(),
                productId,
                productName: product.name,
                type,
                quantityChange,
                newStock,
                reason,
                createdAt: new Date(),
                user: currentUser?.username ?? 'System',
            };
            setStockLogs(prev => [newLog, ...prev]);
            success = true;
            return newProducts;
        });
        return success;
    };


    const addProduct = (productData: Omit<Product, 'id'>) => {
        setProducts(prev => {
            const newId = Math.max(0, ...prev.map(p => p.id)) + 1;
            const newProduct: Product = { ...productData, id: newId };
            return [...prev, newProduct];
        });
    };
    
    const updateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (productId: number) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'branchId'>): Order => {
        if (!currentUser) throw new Error("No user logged in to create an order.");
        const newOrder: Order = {
            ...orderData,
            id: new Date().toISOString(),
            createdAt: new Date(),
            branchId: currentUser.branchId,
        };
        setOrders(prev => [newOrder, ...prev]);

        newOrder.items.forEach(item => {
            updateStock(item.productId, -item.quantity, 'sale', `Order #${newOrder.id.substring(0, 8)}`);
        });

        return newOrder;
    };

    const bulkUpdateProducts = (updatedProducts: Product[]) => {
        const productMap = new Map(products.map(p => [p.id, p]));
        const logs: StockLog[] = [];
        
        updatedProducts.forEach(p => {
            const existingProduct = productMap.get(p.id);
            if (existingProduct && existingProduct.stock !== p.stock) {
                 logs.push({
                    id: `${new Date().toISOString()}-${p.id}`,
                    productId: p.id,
                    productName: p.name,
                    type: 'import',
                    quantityChange: p.stock - existingProduct.stock,
                    newStock: p.stock,
                    reason: 'CSV bulk import',
                    createdAt: new Date(),
                    user: currentUser?.username ?? 'System',
                });
            }
        });
        
        setProducts(updatedProducts);
        if (logs.length > 0) {
            setStockLogs(prev => [...logs.reverse(), ...prev]);
        }
    };

    const categories = useMemo(() => {
        const allCategories = products.map(p => p.category);
        return ['All', ...Array.from(new Set(allCategories))];
    }, [products]);


    const value = {
        currentUser,
        login,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        addOrder,
        users,
        addUser,
        updateUser,
        deleteUser,
        branches,
        categories,
        adminView,
        setAdminView,
        stockLogs,
        updateStock,
        bulkUpdateProducts,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};