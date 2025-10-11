import type { Product, User, Branch, Currency, Settings } from './types';

export const BRANCHES: Branch[] = [
    { id: 1, name: 'Main Street Cafe', location: '123 Main St' },
    { id: 2, name: 'Downtown Brews', location: '456 Center Ave' },
];

export const USERS: User[] = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', branchId: 1 },
    { id: 2, username: 'manager', password: 'manager123', role: 'manager', branchId: 1 },
    { id: 3, username: 'user', password: 'user123', role: 'cashier', branchId: 1 },
    { id: 4, username: 'staff', password: 'staff123', role: 'staff', branchId: 2 },
];

export const PRODUCTS: Product[] = [
    { id: 1, name: 'Espresso', category: 'Coffee', price: 2.50, stock: 100, imageUrl: 'https://picsum.photos/seed/espresso/400', lowStockThreshold: 10 },
    { id: 2, name: 'Latte', category: 'Coffee', price: 3.50, stock: 80, imageUrl: 'https://picsum.photos/seed/latte/400', lowStockThreshold: 15 },
    { id: 3, name: 'Cappuccino', category: 'Coffee', price: 3.50, stock: 75, imageUrl: 'https://picsum.photos/seed/cappuccino/400', lowStockThreshold: 15 },
    { id: 4, name: 'Iced Coffee', category: 'Coffee', price: 3.00, stock: 90, imageUrl: 'https://picsum.photos/seed/icedcoffee/400', lowStockThreshold: 20 },
    { id: 5, name: 'Croissant', category: 'Pastries', price: 2.75, stock: 50, imageUrl: 'https://picsum.photos/seed/croissant/400', lowStockThreshold: 10 },
    { id: 6, name: 'Muffin', category: 'Pastries', price: 2.25, stock: 60, imageUrl: 'https://picsum.photos/seed/muffin/400', lowStockThreshold: 10 },
    { id: 7, name: 'Bagel with Cream Cheese', category: 'Pastries', price: 3.25, stock: 40, imageUrl: 'https://picsum.photos/seed/bagel/400', lowStockThreshold: 5 },
    { id: 8, name: 'Avocado Toast', category: 'Food', price: 7.50, stock: 30, imageUrl: 'https://picsum.photos/seed/avocadotoast/400', lowStockThreshold: 8 },
    { id: 9, name: 'Breakfast Burrito', category: 'Food', price: 8.00, stock: 25, imageUrl: 'https://picsum.photos/seed/burrito/400', lowStockThreshold: 5 },
    { id: 10, name: 'Green Tea', category: 'Tea', price: 2.25, stock: 120, imageUrl: 'https://picsum.photos/seed/greentea/400', lowStockThreshold: 20 },
    { id: 11, name: 'Chai Latte', category: 'Tea', price: 4.00, stock: 70, imageUrl: 'https://picsum.photos/seed/chai/400', lowStockThreshold: 15 },
    { id: 12, name: 'Orange Juice', category: 'Drinks', price: 3.00, stock: 80, imageUrl: 'https://picsum.photos/seed/oj/400', lowStockThreshold: 10 },
];

export const CURRENCIES: Currency[] = [
    { code: 'USD', symbol: '$', name: 'United States Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound Sterling' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export const DEFAULT_SETTINGS: Settings = {
    currencyCode: 'USD',
};
