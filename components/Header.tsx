import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { LogoutIcon } from './icons/LogoutIcon';
import { AdminViewIcon, PosViewIcon } from './icons/AdminIcons';
import { MenuIcon } from './icons/MenuIcon';

interface HeaderProps {
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { currentUser, logout, adminView, setAdminView, branches } = useAppContext();
    const isPrivilegedUser = currentUser?.role === 'admin' || currentUser?.role === 'manager';
    const currentBranchName = branches.find(b => b.id === currentUser?.branchId)?.name || 'Unknown Branch';

    return (
        <header className="bg-brand-secondary shadow-lg sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                     {adminView === 'admin' && onMenuClick && (
                         <button onClick={onMenuClick} className="lg:hidden text-brand-light p-1">
                            <MenuIcon className="w-6 h-6" />
                         </button>
                     )}
                     {adminView === 'pos' && (
                        <h1 className="text-2xl font-bold text-brand-primary tracking-wider">POS System</h1>
                     )}
                </div>
                
                {currentUser && (
                    <div className="flex items-center gap-2 md:gap-4">
                        {isPrivilegedUser && (
                             <button 
                                onClick={() => setAdminView(adminView === 'pos' ? 'admin' : 'pos')}
                                className="flex items-center gap-2 bg-brand-dark text-brand-light px-3 py-1.5 rounded-lg hover:bg-brand-primary hover:text-white transition-colors"
                                aria-label={`Switch to ${adminView === 'pos' ? 'Admin View' : 'POS View'}`}
                            >
                               {adminView === 'pos' ? <AdminViewIcon className="w-5 h-5" /> : <PosViewIcon className="w-5 h-5" />}
                               <span className="hidden md:inline">{adminView === 'pos' ? 'Admin' : 'POS'}</span>
                            </button>
                        )}
                        <div className="text-right">
                          <span className="text-brand-light">Welcome, <span className="font-bold">{currentUser.username}</span></span>
                          <p className="text-xs text-gray-400 hidden sm:block">{currentBranchName}</p>
                        </div>
                        <button 
                            onClick={logout}
                            className="flex items-center gap-2 bg-brand-dark text-brand-light p-2 md:px-3 md:py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            aria-label="Logout"
                        >
                           <LogoutIcon className="w-5 h-5" />
                           <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
