import React, { useState, useEffect } from 'react';
import type { Product } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, product }) => {
    const { addProduct, updateProduct, categories } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        imageUrl: '',
        lowStockThreshold: '',
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                price: String(product.price),
                stock: String(product.stock),
                imageUrl: product.imageUrl,
                lowStockThreshold: String(product.lowStockThreshold),
            });
        } else {
            setFormData({ name: '', category: '', price: '', stock: '', imageUrl: '', lowStockThreshold: '10' });
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10),
            imageUrl: formData.imageUrl || 'https://picsum.photos/seed/newitem/400',
            lowStockThreshold: parseInt(formData.lowStockThreshold, 10),
        };

        if (product) {
            updateProduct({ ...product, ...productData });
        } else {
            addProduct(productData);
        }
        onClose();
    };
    
    const uniqueCategories = categories.filter(c => c !== 'All');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-brand-primary mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-brand-light text-sm font-bold mb-2">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-brand-dark input-style" required />
                        </div>
                        <div>
                            <label className="block text-brand-light text-sm font-bold mb-2">Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full bg-brand-dark input-style" required list="category-suggestions"/>
                            <datalist id="category-suggestions">
                                {uniqueCategories.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-brand-light text-sm font-bold mb-2">Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-brand-dark input-style" required min="0" step="0.01" />
                        </div>
                        <div>
                            <label className="block text-brand-light text-sm font-bold mb-2">Stock</label>
                            <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-brand-dark input-style" required min="0" />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-brand-light text-sm font-bold mb-2">Image URL</label>
                            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full bg-brand-dark input-style" placeholder="https://picsum.photos/seed/..." />
                        </div>
                         <div className="md:col-span-2">
                             <label className="block text-brand-light text-sm font-bold mb-2">Low Stock Threshold</label>
                            <input type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} className="w-full bg-brand-dark input-style" required min="0" />
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button type="button" onClick={onClose} className="w-full bg-brand-dark text-gray-300 font-bold py-3 rounded-lg hover:bg-opacity-80 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            {product ? 'Save Changes' : 'Add Product'}
                        </button>
                    </div>
                </form>
                 <style>{`.input-style { border: 1px solid #393E46; color: #EEEEEE; placeholder-color: #9CA3AF; font-size: 0.875rem; border-radius: 0.5rem; display: block; padding: 0.625rem; transition: background-color 0.2s, border-color 0.2s; } .input-style:focus { outline: none; ring: 1px; ring-color: #00ADB5; border-color: #00ADB5; }`}</style>
            </div>
        </div>
    );
};

export default ProductFormModal;
