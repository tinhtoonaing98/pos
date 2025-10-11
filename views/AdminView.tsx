import React, { useState } from 'react';
import Header from '../components/Header';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminInventory from '../components/admin/AdminInventory';
import AdminUsers from '../components/admin/AdminUsers';
import AdminReports from '../components/admin/AdminReports';
import AdminSettings from '../components/admin/AdminSettings';
import { ChartBarIcon, ShoppingBagIcon, ArchiveBoxIcon, UsersIcon, Cog6ToothIcon, ClipboardDocumentListIcon, Squares2X2Icon } from '../components/icons/AdminIcons';

type AdminPage = 'dashboard' | 'products' | 'orders' | 'inventory' | 'users' | 'reports' | 'settings';

const AdminView: React.FC = () => {
    const [activePage, setActivePage] = useState<AdminPage>('dashboard');

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard': return <AdminDashboard />;
            case 'products': return <AdminProducts />;
            case 'orders': return <AdminOrders />;
            case 'inventory': return <AdminInventory />;
            case 'users': return <AdminUsers />;
            case 'reports': return <AdminReports />;
            case 'settings': return <AdminSettings />;
            default: return <AdminDashboard />;
        }
    };
    
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
        { id: 'products', label: 'Products', icon: ShoppingBagIcon },
        { id: 'orders', label: 'Orders', icon: ClipboardDocumentListIcon },
        { id: 'inventory', label: 'Inventory', icon: ArchiveBoxIcon },
        { id: 'users', label: 'Users', icon: UsersIcon },
        { id: 'reports', label: 'Reports', icon: ChartBarIcon },
        { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
    ];

    return (
        <div className="min-h-screen bg-brand-dark text-brand-light font-sans">
            <Header />
            <div className="flex">
                <aside className="w-64 bg-brand-secondary p-4 h-[calc(100vh-68px)] sticky top-[68px]">
                    <nav className="flex flex-col gap-2">
                        {navItems.map(item => (
                             <button
                                key={item.id}
                                onClick={() => setActivePage(item.id as AdminPage)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                                    activePage === item.id 
                                        ? 'bg-brand-primary text-white' 
                                        : 'text-gray-300 hover:bg-brand-dark'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-68px)]">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default AdminView;