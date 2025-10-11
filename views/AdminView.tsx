import React, { useState } from 'react';
import Header from '../components/Header';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminInventory from '../components/admin/AdminInventory';
import AdminUsers from '../components/admin/AdminUsers';
import AdminReports from '../components/admin/AdminReports';
import ReceiptModal from '../components/ReceiptModal';
import { DashboardIcon, PackageIcon, ReceiptIcon, InventoryIcon, UsersIcon, ReportsIcon } from '../components/icons/AdminIcons';
import type { Order } from '../types';


type AdminPage = 'dashboard' | 'products' | 'orders' | 'inventory' | 'users' | 'reports';

const AdminView: React.FC = () => {
    const [activePage, setActivePage] = useState<AdminPage>('dashboard');
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);


    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'reports', label: 'Reports', icon: ReportsIcon },
        { id: 'orders', label: 'Orders', icon: ReceiptIcon },
        { id: 'products', label: 'Products', icon: PackageIcon },
        { id: 'inventory', label: 'Inventory', icon: InventoryIcon },
        { id: 'users', label: 'Users', icon: UsersIcon },
    ];

    return (
        <div className="min-h-screen bg-brand-dark text-brand-light font-sans flex">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-secondary p-4 flex flex-col">
                <h1 className="text-2xl font-bold text-brand-primary tracking-wider mb-8">Admin Panel</h1>
                <nav className="flex flex-col gap-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActivePage(item.id as AdminPage)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                activePage === item.id 
                                ? 'bg-brand-primary text-white' 
                                : 'text-brand-light hover:bg-brand-dark'
                            }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-semibold">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto">
                    {activePage === 'dashboard' && <AdminDashboard />}
                    {activePage === 'products' && <AdminProducts />}
                    {activePage === 'orders' && <AdminOrders onViewOrder={setViewingOrder} />}
                    {activePage === 'inventory' && <AdminInventory />}
                    {activePage === 'users' && <AdminUsers />}
                    {activePage === 'reports' && <AdminReports />}
                </main>
            </div>

            <ReceiptModal
                isOpen={!!viewingOrder}
                onClose={() => setViewingOrder(null)}
                order={viewingOrder}
                isReprint
            />
        </div>
    );
};

export default AdminView;