import type { Product, User, Branch } from './types';

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Espresso', price: 2.50, category: 'Coffee', imageUrl: 'https://picsum.photos/seed/espresso/400', stock: 100, lowStockThreshold: 20 },
  { id: 2, name: 'Latte', price: 3.50, category: 'Coffee', imageUrl: 'https://picsum.photos/seed/latte/400', stock: 80, lowStockThreshold: 20 },
  { id: 3, name: 'Cappuccino', price: 3.50, category: 'Coffee', imageUrl: 'https://picsum.photos/seed/cappuccino/400', stock: 75, lowStockThreshold: 20 },
  { id: 4, name: 'Americano', price: 3.00, category: 'Coffee', imageUrl: 'https://picsum.photos/seed/americano/400', stock: 90, lowStockThreshold: 20 },
  { id: 5, name: 'Mocha', price: 4.00, category: 'Coffee', imageUrl: 'https://picsum.photos/seed/mocha/400', stock: 60, lowStockThreshold: 15 },
  { id: 6, name: 'Iced Coffee', price: 3.25, category: 'Coffee', imageUrl: 'https://picsum.photos/seed/icedcoffee/400', stock: 50, lowStockThreshold: 15 },
  { id: 7, name: 'Croissant', price: 2.75, category: 'Pastry', imageUrl: 'https://picsum.photos/seed/croissant/400', stock: 40, lowStockThreshold: 10 },
  { id: 8, name: 'Muffin', price: 2.50, category: 'Pastry', imageUrl: 'https://picsum.photos/seed/muffin/400', stock: 45, lowStockThreshold: 10 },
  { id: 9, name: 'Scone', price: 2.60, category: 'Pastry', imageUrl: 'https://picsum.photos/seed/scone/400', stock: 30, lowStockThreshold: 10 },
  { id: 10, name: 'Bagel', price: 3.00, category: 'Pastry', imageUrl: 'https://picsum.photos/seed/bagel/400', stock: 25, lowStockThreshold: 10 },
  { id: 11, name: 'Herbal Tea', price: 2.25, category: 'Tea', imageUrl: 'https://picsum.photos/seed/herbaltea/400', stock: 60, lowStockThreshold: 15 },
  { id: 12, name: 'Green Tea', price: 2.25, category: 'Tea', imageUrl: 'https://picsum.photos/seed/greentea/400', stock: 60, lowStockThreshold: 15 },
  { id: 13, name: 'Orange Juice', price: 3.75, category: 'Beverage', imageUrl: 'https://picsum.photos/seed/orangejuice/400', stock: 70, lowStockThreshold: 20 },
  { id: 14, name: 'Sandwich', price: 6.50, category: 'Food', imageUrl: 'https://picsum.photos/seed/sandwich/400', stock: 25, lowStockThreshold: 5 },
  { id: 15, name: 'Salad', price: 7.00, category: 'Food', imageUrl: 'https://picsum.photos/seed/salad/400', stock: 20, lowStockThreshold: 5 },
];

export const BRANCHES: Branch[] = [
    { id: 1, name: 'Main St. Cafe', location: 'Downtown' },
    { id: 2, name: 'Parkside Eatery', location: 'Uptown' },
];

export const USERS: User[] = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', branchId: 1 },
  { id: 2, username: 'manager', password: 'manager123', role: 'manager', branchId: 2 },
  { id: 3, username: 'cashier1', password: 'cashier123', role: 'cashier', branchId: 1 },
  { id: 4, username: 'cashier2', password: 'cashier123', role: 'cashier', branchId: 2 },
  { id: 5, username: 'staff', password: 'staff123', role: 'staff', branchId: 1 },
];