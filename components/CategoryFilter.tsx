import React from 'react';

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ease-in-out ${
                        selectedCategory === category
                            ? 'bg-brand-primary text-white shadow-md'
                            : 'bg-brand-dark text-brand-light hover:bg-opacity-80'
                    }`}
                    aria-pressed={selectedCategory === category}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;