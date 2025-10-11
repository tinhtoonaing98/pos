import React from 'react';
import type { Product } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onSmartDescription: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onSmartDescription }) => {
    const isOutOfStock = product.stock <= 0;

    return (
        <div className="bg-brand-dark rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 duration-300 ease-in-out relative">
            {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <span className="text-white font-bold text-lg bg-red-500/80 px-4 py-1 rounded-md">Out of Stock</span>
                </div>
            )}
            <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
                <button 
                  onClick={() => onSmartDescription(product)}
                  className="absolute top-2 right-2 bg-brand-primary/80 hover:bg-brand-primary text-white p-1.5 rounded-full backdrop-blur-sm transition-colors z-20"
                  aria-label="Get smart description"
                >
                  <SparklesIcon className="w-4 h-4"/>
                </button>
            </div>
            <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-semibold text-sm text-brand-light truncate">{product.name}</h3>
                <div className="flex justify-between items-baseline">
                    <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                    <p className="text-xs text-gray-400 mb-2">Stock: {product.stock}</p>
                </div>
                <div className="mt-auto flex justify-between items-center">
                    <span className="font-bold text-brand-primary text-md">${product.price.toFixed(2)}</span>
                     <button
                        onClick={() => onAddToCart(product)}
                        className={`font-bold text-xs px-3 py-1.5 rounded-md transition-colors ${
                            isOutOfStock
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            : 'bg-brand-primary text-white hover:bg-opacity-80'
                        }`}
                        disabled={isOutOfStock}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
