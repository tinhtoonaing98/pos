import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { Product } from '../../types';
import ProductFormModal from './ProductFormModal';
import { PlusIcon } from '../icons/PlusIcon';
import { useCurrency } from '../../hooks/useCurrency';

const AdminProducts: React.FC = () => {
    const { products, deleteProduct } = useAppContext();
    const { formatCurrency } = useCurrency();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-brand-light">Manage Products</h2>
                <button
                    onClick={handleAddNew}
                    className="flex items-center justify-center gap-2 bg-brand-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-brand-light uppercase bg-brand-dark">
                            <tr>
                                <th scope="col" className="px-6 py-3 min-w-[200px]">Product</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Stock</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-b border-brand-dark hover:bg-brand-dark/50">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                                            <span>{product.name}</span>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">{formatCurrency(product.price)}</td>
                                    <td className="px-6 py-4">{product.stock}</td>
                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                        <button onClick={() => handleEdit(product)} className="font-medium text-brand-primary hover:underline">Edit</button>
                                        <button onClick={() => deleteProduct(product.id)} className="font-medium text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ProductFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={editingProduct}
            />
        </div>
    );
};

export default AdminProducts;
