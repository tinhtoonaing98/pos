import React, { useState, useMemo, useRef } from 'react';
import type { Product, StockLog } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import StockAdjustmentModal from './StockAdjustmentModal';
import { SearchIcon } from '../icons/SearchIcon';

type InventoryView = 'levels' | 'logs';

const AdminInventory: React.FC = () => {
    const { products, stockLogs, bulkUpdateProducts } = useAppContext();
    const [activeView, setActiveView] = useState<InventoryView>('levels');
    const [isModalOpen, setModalOpen] = useState(false);
    const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
    const [logSearchQuery, setLogSearchQuery] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAdjustStock = (product: Product) => {
        setAdjustingProduct(product);
        setModalOpen(true);
    };

    const filteredLogs = useMemo(() => {
        if (!logSearchQuery.trim()) return stockLogs;
        const query = logSearchQuery.toLowerCase();
        return stockLogs.filter(log => 
            log.productName.toLowerCase().includes(query) || 
            log.reason.toLowerCase().includes(query) ||
            log.user.toLowerCase().includes(query) ||
            log.type.toLowerCase().includes(query)
        );
    }, [stockLogs, logSearchQuery]);

    const handleExportCSV = () => {
        const headers = ["id", "name", "price", "category", "imageUrl", "stock", "lowStockThreshold"];
        const csvRows = [
            headers.join(','),
            ...products.map(p => 
                headers.map(header => {
                    const value = p[header as keyof Product];
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            )
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\r\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "products.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text !== 'string') return;

            try {
                const rows = text.split(/\r\n|\n/).filter(Boolean);
                const headers = rows.shift()?.split(',').map(h => h.trim().replace(/"/g, '')) ?? [];
                
                const productMap = new Map(products.map(p => [p.id, p]));
                
                const newOrUpdatedProducts = rows.map(row => {
                    const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/"/g, '')) ?? [];
                    const entry = headers.reduce((obj, header, index) => {
                        obj[header] = values[index];
                        return obj;
                    }, {} as any);

                    return {
                        id: parseInt(entry.id, 10),
                        name: entry.name,
                        price: parseFloat(entry.price),
                        category: entry.category,
                        imageUrl: entry.imageUrl,
                        stock: parseInt(entry.stock, 10),
                        lowStockThreshold: parseInt(entry.lowStockThreshold, 10),
                    };
                });
                
                newOrUpdatedProducts.forEach(p => {
                    if (!isNaN(p.id)) {
                        productMap.set(p.id, p);
                    }
                });

                bulkUpdateProducts(Array.from(productMap.values()));
                alert('Products imported successfully!');
            } catch (error) {
                console.error("Error parsing CSV:", error);
                alert('Failed to import CSV. Please check the file format and console for errors.');
            } finally {
                 if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-light">Inventory Management</h2>
                <div>
                     <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImportCSV} className="hidden" />
                     <button onClick={() => fileInputRef.current?.click()} className="bg-brand-dark text-brand-light font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors mr-2">Import CSV</button>
                    <button onClick={handleExportCSV} className="bg-brand-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">Export CSV</button>
                </div>
            </div>

            <div className="flex border-b border-brand-secondary mb-4">
                <button onClick={() => setActiveView('levels')} className={`px-4 py-2 font-semibold ${activeView === 'levels' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-400'}`}>Stock Levels</button>
                <button onClick={() => setActiveView('logs')} className={`px-4 py-2 font-semibold ${activeView === 'logs' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-400'}`}>Adjustment Log</button>
            </div>

            {activeView === 'levels' ? (
                <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-brand-light uppercase bg-brand-dark">
                            <tr>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3">Threshold</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => {
                                const isLowStock = p.stock <= p.lowStockThreshold;
                                return (
                                <tr key={p.id} className="border-b border-brand-dark hover:bg-brand-dark/50">
                                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                                    <td className="px-6 py-4">{p.category}</td>
                                    <td className={`px-6 py-4 font-bold ${isLowStock ? 'text-red-400' : 'text-white'}`}>{p.stock}</td>
                                    <td className="px-6 py-4">{p.lowStockThreshold}</td>
                                    <td className="px-6 py-4">
                                        {isLowStock ? <span className="text-xs font-bold bg-red-500/80 text-white px-2 py-1 rounded-full">Low Stock</span> : <span className="text-xs text-gray-400">OK</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleAdjustStock(p)} className="font-medium text-brand-primary hover:underline">Adjust Stock</button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                     <div className="relative w-full max-w-sm mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-gray-400" /></div>
                        <input type="text" value={logSearchQuery} onChange={(e) => setLogSearchQuery(e.target.value)} placeholder="Search logs..." className="w-full bg-brand-dark border border-brand-secondary text-brand-light placeholder-gray-400 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block pl-10 p-2.5 transition-colors" />
                    </div>
                    <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden max-h-[60vh] overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-300">
                             <thead className="text-xs text-brand-light uppercase bg-brand-dark sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Product</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Change</th>
                                    <th className="px-6 py-3">New Stock</th>
                                    <th className="px-6 py-3">Reason</th>
                                    <th className="px-6 py-3">User</th>
                                </tr>
                            </thead>
                             <tbody>
                                {filteredLogs.map(log => (
                                    <tr key={log.id} className="border-b border-brand-dark hover:bg-brand-dark/50">
                                        <td className="px-6 py-4 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium text-white">{log.productName}</td>
                                        <td className="px-6 py-4"><span className="text-xs font-semibold capitalize bg-brand-dark px-2 py-1 rounded-full">{log.type.replace('adjustment-', '')}</span></td>
                                        <td className={`px-6 py-4 font-bold ${log.quantityChange > 0 ? 'text-green-400' : 'text-red-400'}`}>{log.quantityChange > 0 ? '+' : ''}{log.quantityChange}</td>
                                        <td className="px-6 py-4">{log.newStock}</td>
                                        <td className="px-6 py-4 italic text-gray-400">{log.reason}</td>
                                        <td className="px-6 py-4">{log.user}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {filteredLogs.length === 0 && <p className="text-center text-gray-400 py-8">No logs found.</p>}
                    </div>
                </div>
            )}

            <StockAdjustmentModal 
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                product={adjustingProduct}
            />
        </div>
    );
};

export default AdminInventory;
