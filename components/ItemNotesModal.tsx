import React, { useState, useEffect } from 'react';

interface ItemNotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (notes: string) => void;
    initialNotes: string;
    productName: string;
}

const ItemNotesModal: React.FC<ItemNotesModalProps> = ({ isOpen, onClose, onSave, initialNotes, productName }) => {
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        if (isOpen) {
            setNotes(initialNotes);
        }
    }, [isOpen, initialNotes]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(notes);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-brand-primary mb-2">Add Note</h2>
                <p className="text-brand-light mb-4">For: <span className="font-semibold">{productName}</span></p>
                
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-brand-dark border border-brand-secondary text-brand-light placeholder-gray-400 text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5 transition-colors h-28"
                    placeholder="e.g., extra hot, no onions..."
                    aria-label="Item notes"
                    autoFocus
                />

                <div className="flex gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full bg-brand-dark text-gray-300 font-bold py-3 rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                        Save Note
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemNotesModal;
