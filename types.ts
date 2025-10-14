export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    imageUrl: string;
    lowStockThreshold: number;
}

export type ProductCreateDTO = Omit<Product, 'id'>;

export interface CartItem {
    product: Product;
    quantity: number;
    notes: string;
}

export interface Sale {
    id: number;
    name: string;
    items: CartItem[];
    discountType: 'none' | 'percentage' | 'fixed';
    discountValue: number;
}

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    notes: string;
}

export interface Order {
    id: number;
    createdAt: string;
    items: OrderItem[];
    subtotal: number;
    discountAmount: number;
    tax: number;
    total: number;
    paymentMethod: string;
    cashier: string;
    branchId: number;
}

export type OrderCreateDTO = Omit<Order, 'id' | 'createdAt'>;

export type UserRole = 'admin' | 'manager' | 'cashier' | 'staff';

export interface User {
    id: number;
    username: string;
    password?: string;
    role: UserRole;
    branchId: number;
}

export type UserCreateDTO = Omit<User, 'id'>;


export interface Branch {
    id: number;
    name: string;
    location: string;
}

export interface StockLog {
    id: number;
    productId: number;
    productName: string;
    quantityChange: number;
    newStock: number;
    reason: string;
    type: 'sale' | 'adjustment-add' | 'adjustment-remove' | 'initial';
    user: string;
    createdAt: string;
}

export interface Currency {
    code: string; // e.g., 'USD'
    symbol: string; // e.g., '$'
    name: string; // e.g., 'United States Dollar'
}

export interface Settings {
    currencyCode: string; // e.g., 'USD'
    taxRate: number; // e.g., 8 for 8%
}