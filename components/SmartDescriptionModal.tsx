
import React from 'react';
import type { Product } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface SmartDescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    description: string;
    isLoading: boolean;
}

const SmartDescriptionModal: React.FC<SmartDescriptionModalProps> = ({ isOpen, onClose, product, description, isLoading }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-sm text-center transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-center items-center gap-2 mb-2">
                    <SparklesIcon className="w-6 h-6 text-brand-primary" />
                    <h2 className="text-xl font-bold text-brand-primary">Smart Description</h2>
                </div>
                <h3 className="text-lg font-semibold text-brand-light mb-4">{product.name}</h3>

                <div className="bg-brand-dark min-h-[100px] flex items-center justify-center p-4 rounded-lg mb-6">
                    {isLoading ? (
                        <div className="animate-pulse flex space-x-2">
                            <div className="w-3 h-3 bg-brand-primary rounded-full"></div>
                            <div className="w-3 h-3 bg-brand-primary rounded-full animation-delay-200"></div>
                            <div className="w-3 h-3 bg-brand-primary rounded-full animation-delay-400"></div>
                        </div>
                    ) : (
                        <p className="text-brand-light italic">"{description}"</p>
                    )}
                </div>
                
                <button
                    onClick={onClose}
                    className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SmartDescriptionModal;
   