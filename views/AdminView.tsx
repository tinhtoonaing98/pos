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
    const [isSidebarOpen, setSidebarOpen] = useState(false);

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

    const handleNavItemClick = (page: AdminPage) => {
        setActivePage(page);
        if (isSidebarOpen) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark text-brand-light font-sans">
            <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
            <div className="flex">
                {/* Overlay for mobile */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}
                <aside 
                    className={`fixed lg:static top-0 left-0 w-64 bg-brand-secondary h-full lg:h-[calc(100vh-68px)] lg:sticky lg:top-[68px] z-30 transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
                >
                     <div className="p-4">
                        <nav className="flex flex-col gap-2">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavItemClick(item.id as AdminPage)}
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
                    </div>
                </aside>
                <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-68px)]">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default AdminView;
