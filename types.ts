export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  lowStockThreshold: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Sale {
  id: number;
  name: string;
  items: CartItem[];
  discountType: 'none' | 'percentage' | 'fixed';
  discountValue: number;
}

export type UserRole = 'admin' | 'manager' | 'cashier' | 'staff';

export interface User {
  id: number;
  username: string;
  password: string; // In a real app, this would be a hash
  role: UserRole;
  branchId: number;
}

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    notes?: string;
}

export interface Order {
    id: string;
    items: OrderItem[];
    subtotal: number;
    discountAmount: number;
    tax: number;
    total: number;
    createdAt: Date;
    paymentMethod: string;
    cashier: string;
    branchId: number;
}

export type StockLogType = 'initial' | 'sale' | 'adjustment-add' | 'adjustment-remove' | 'import';

export interface StockLog {
    id: string;
    productId: number;
    productName: string;
    type: StockLogType;
    quantityChange: number;
    newStock: number;
    reason: string;
    createdAt: Date;
    user: string;
}

export interface Branch {
  id: number;
  name: string;
  location: string;
}