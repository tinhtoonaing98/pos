import React from 'react';
import type { Sale } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface SaleTabsProps {
    sales: Sale[];
    activeSaleId: number;
    onNewSale: () => void;
    onSwitchSale: (id: number) => void;
    onDeleteSale: (id: number) => void;
}

const SaleTabs: React.FC<SaleTabsProps> = ({ sales, activeSaleId, onNewSale, onSwitchSale, onDeleteSale }) => {
    return (
        <div className="flex items-center border-b border-brand-dark pb-3 mb-3">
            <div className="flex-grow flex items-center gap-2 overflow-x-auto">
                {sales.map(sale => (
                     <div
                        key={sale.id}
                        onClick={() => onSwitchSale(sale.id)}
                        className={`pl-3 pr-2 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ease-in-out whitespace-nowrap flex items-center justify-between cursor-pointer ${
                            activeSaleId === sale.id
                                ? 'bg-brand-primary text-white'
                                : 'bg-brand-dark text-brand-light hover:bg-opacity-80'
                        }`}
                        role="button"
                        aria-pressed={activeSaleId === sale.id}
                        tabIndex={0}
                    >
                        <span>{sale.name}</span>
                        {sales.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteSale(sale.id); }}
                                className={`ml-2 rounded-full p-0.5 ${
                                    activeSaleId === sale.id ? 'hover:bg-white/20' : 'hover:bg-brand-secondary'
                                }`}
                                aria-label={`Delete ${sale.name}`}
                            >
                                <XCircleIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <button
                onClick={onNewSale}
                className="ml-4 p-2 bg-brand-dark rounded-full text-brand-light hover:bg-brand-primary transition-colors flex-shrink-0"
                aria-label="New Sale"
            >
                <PlusIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default SaleTabs;
