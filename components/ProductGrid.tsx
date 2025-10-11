import React from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';

interface ProductGridProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
    onSmartDescription: (product: Product) => void;
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
    products, 
    onAddToCart, 
    onSmartDescription, 
    categories, 
    selectedCategory, 
    onSelectCategory,
    searchQuery,
    onSearchChange
}) => {
    const noProductsMessage = searchQuery.trim() !== ''
        ? 'No products match your search.'
        : 'No products found in this category.';
        
    return (
        <div className="bg-brand-secondary p-4 rounded-lg shadow-inner">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
              <h2 className="text-xl font-semibold text-brand-light whitespace-nowrap">Products</h2>
              <div className="w-full">
                <SearchBar query={searchQuery} onQueryChange={onSearchChange} />
              </div>
            </div>
            
            <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAddToCart={onAddToCart}
                            onSmartDescription={onSmartDescription}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-400 py-10">
                        {noProductsMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;