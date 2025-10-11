import React, { useState, useEffect } from 'react';
import type { User, UserRole } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

const ALL_ROLES: UserRole[] = ['admin', 'manager', 'cashier', 'staff'];

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, user }) => {
    const { addUser, updateUser, branches } = useAppContext();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'staff' as UserRole,
        branchId: branches[0]?.id || 1,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                password: '', // Password is not shown, only set
                role: user.role,
                branchId: user.branchId,
            });
        } else {
            setFormData({
                username: '',
                password: '',
                role: 'staff',
                branchId: branches[0]?.id || 1,
            });
        }
    }, [user, isOpen, branches]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'branchId' ? parseInt(value, 10) : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (user) {
            updateUser({
                ...user,
                username: formData.username,
                role: formData.role,
                branchId: formData.branchId,
                // Only update password if a new one is entered
                ...(formData.password && { password: formData.password }),
            });
        } else {
            if (!formData.password) {
                alert("Password is required for new users.");
                return;
            }
            addUser({
                username: formData.username,
                password: formData.password,
                role: formData.role,
                branchId: formData.branchId,
            });
        }
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-lg shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-brand-primary mb-6">{user ? 'Edit User' : 'Add New User'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-brand-light text-sm font-bold mb-2">Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-brand-dark input-style" required />
                        </div>
                         <div>
                            <label className="block text-brand-light text-sm font-bold mb-2">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-brand-dark input-style" placeholder={user ? "Leave blank to keep unchanged" : ""} required={!user} />
                        </div>
                        <div>
                            <label className="block text-brand-light text-sm font-bold mb-2">Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-brand-dark input-style" required>
                                {ALL_ROLES.map(role => <option key={role} value={role} className="capitalize">{role}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-brand-light text-sm font-bold mb-2">Branch</label>
                            <select name="branchId" value={formData.branchId} onChange={handleChange} className="w-full bg-brand-dark input-style" required>
                                {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button type="button" onClick={onClose} className="w-full bg-brand-dark text-gray-300 font-bold py-3 rounded-lg hover:bg-opacity-80 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            {user ? 'Save Changes' : 'Add User'}
                        </button>
                    </div>
                </form>
                 <style>{`.input-style { border: 1px solid #393E46; color: #EEEEEE; placeholder-color: #9CA3AF; font-size: 0.875rem; border-radius: 0.5rem; display: block; padding: 0.625rem; transition: background-color 0.2s, border-color 0.2s; } .input-style:focus { outline: none; ring: 1px; ring-color: #00ADB5; border-color: #00ADB5; }`}</style>
            </div>
        </div>
    );
};

export default UserFormModal;