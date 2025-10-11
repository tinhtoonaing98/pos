import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback, useEffect } from 'react';
import type { Product, User, Order, OrderCreateDTO, ProductCreateDTO, UserCreateDTO, Branch, StockLog, Settings, Currency } from '../types';
import { PRODUCTS, USERS, BRANCHES, CURRENCIES, DEFAULT_SETTINGS } from '../constants';

// Helper to get initial state from localStorage or use a default
const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
    }
    return defaultValue;
};


interface AppContextType {
    // State
    currentUser: User | null;
    adminView: 'pos' | 'admin';
    products: Product[];
    categories: string[];
    orders: Order[];
    users: User[];
    branches: Branch[];
    stockLogs: StockLog[];
    settings: Settings;
    currencies: Currency[];

    // Actions
    login: (username: string, password: string) => boolean;
    logout: () => void;
    setAdminView: (view: 'pos' | 'admin') => void;
    
    addProduct: (productData: ProductCreateDTO) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (productId: number) => void;
    bulkUpdateProducts: (products: Product[]) => void;
    
    addOrder: (orderData: Omit<OrderCreateDTO, 'branchId'>) => Order;

    updateStock: (productId: number, quantityChange: number, type: StockLog['type'], reason: string) => boolean;
    
    addUser: (userData: UserCreateDTO) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: number) => void;
    
    updateSettings: (newSettings: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialState('currentUser', null));
    const [adminView, setAdminView] = useState<'pos' | 'admin'>('pos');
    
    const [products, setProducts] = useState<Product[]>(() => getInitialState('products', PRODUCTS));
    const [users, setUsers] = useState<User[]>(() => getInitialState('users', USERS));
    const [orders, setOrders] = useState<Order[]>(() => getInitialState('orders', []));
    const [stockLogs, setStockLogs] = useState<StockLog[]>(() => getInitialState('stockLogs', []));
    const [settings, setSettings] = useState<Settings>(() => getInitialState('settings', DEFAULT_SETTINGS));

    // Effects to save state to localStorage on change
    useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [currentUser]);
    useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
    useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
    useEffect(() => { localStorage.setItem('stockLogs', JSON.stringify(stockLogs)); }, [stockLogs]);
    useEffect(() => { localStorage.setItem('settings', JSON.stringify(settings)); }, [settings]);


    const login = useCallback((username: string, password: string): boolean => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            setAdminView('pos');
            return true;
        }
        return false;
    }, [users]);

    const logout = () => {
        setCurrentUser(null);
    };

    const categories = useMemo(() => {
        const allCategories = products.map(p => p.category);
        return ['All', ...Array.from(new Set(allCategories))];
    }, [products]);

    const addProduct = (productData: ProductCreateDTO) => {
        setProducts(prev => [
            ...prev,
            { ...productData, id: Date.now() }
        ]);
    };

    const updateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };
    
    const deleteProduct = (productId: number) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    const bulkUpdateProducts = (updatedProducts: Product[]) => {
        setProducts(updatedProducts);
    }
    
    const updateStock = useCallback((productId: number, quantityChange: number, type: StockLog['type'], reason: string): boolean => {
        const product = products.find(p => p.id === productId);
        if (!product) return false;
        
        const newStock = product.stock + quantityChange;
        if (newStock < 0) return false;

        const newLog: StockLog = {
            id: Date.now(),
            productId,
            productName: product.name,
            quantityChange,
            newStock,
            reason,
            type,
            user: currentUser?.username ?? 'System',
            createdAt: new Date().toISOString()
        };
        
        setStockLogs(prev => [newLog, ...prev]);
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
        return true;
    }, [products, currentUser]);
    
    const addOrder = (orderData: Omit<OrderCreateDTO, 'branchId'>): Order => {
        const newOrder: Order = {
            ...orderData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            branchId: currentUser?.branchId ?? 0
        };
        setOrders(prev => [newOrder, ...prev]);
        
        orderData.items.forEach(item => {
            updateStock(item.productId, -item.quantity, 'sale', `Sale #${newOrder.id}`);
        });
        
        return newOrder;
    };

    const addUser = (userData: UserCreateDTO) => {
        setUsers(prev => [...prev, { ...userData, id: Date.now() }]);
    };
    
    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    };

    const deleteUser = (userId: number) => {
        const userToDelete = users.find(u => u.id === userId);
        const isAdmin = userToDelete?.role === 'admin';
        const lastAdmin = users.filter(u => u.role === 'admin').length === 1;

        if (isAdmin && lastAdmin) {
            alert("Cannot delete the last administrator.");
            return;
        }
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({...prev, ...newSettings}));
    };
    
    const value: AppContextType = {
        currentUser,
        adminView,
        products,
        categories,
        orders,
        users,
        branches: BRANCHES,
        stockLogs,
        settings,
        currencies: CURRENCIES,
        login,
        logout,
        setAdminView,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkUpdateProducts,
        addOrder,
        updateStock,
        addUser,
        updateUser,
        deleteUser,
        updateSettings,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
