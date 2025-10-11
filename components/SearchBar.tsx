import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange }) => {
    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-brand-dark border border-brand-secondary text-brand-light placeholder-gray-400 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block pl-10 p-2.5 transition-colors"
                aria-label="Search products"
            />
        </div>
    );
};

export default SearchBar;
