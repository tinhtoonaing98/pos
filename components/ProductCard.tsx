import React from 'react';
import type { Product } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useCurrency } from '../hooks/useCurrency';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onSmartDescription: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onSmartDescription }) => {
    const isOutOfStock = product.stock <= 0;
    const { formatCurrency } = useCurrency();

    return (
        <div className={`relative bg-brand-dark rounded-lg shadow-lg overflow-hidden flex flex-col justify-between ${isOutOfStock ? 'opacity-50' : ''}`}>
            <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
            
            <div className="p-3 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-md text-brand-light truncate">{product.name}</h3>
                    <p className="text-sm text-gray-400">{formatCurrency(product.price)}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {product.stock} in stock
                </div>
            </div>

            <div className="p-2 flex gap-2">
                <button
                    onClick={() => onSmartDescription(product)}
                    className="flex-shrink-0 bg-brand-secondary text-brand-primary p-2 rounded-md hover:bg-brand-primary hover:text-white transition-colors"
                    aria-label="Get smart description"
                >
                    <SparklesIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onAddToCart(product)}
                    disabled={isOutOfStock}
                    className="flex-grow flex items-center justify-center gap-2 bg-brand-primary text-white font-bold p-2 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add</span>
                </button>
            </div>
             {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Out of Stock</span>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
