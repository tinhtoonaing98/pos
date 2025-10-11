import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { User } from '../../types';
import UserFormModal from './UserFormModal';
import { PlusIcon } from '../icons/PlusIcon';

const AdminUsers: React.FC = () => {
    const { users, deleteUser, branches } = useAppContext();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingUser(null);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingUser(null);
    };

    const getBranchName = (branchId: number) => {
        return branches.find(b => b.id === branchId)?.name || 'N/A';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-brand-light">Manage Users</h2>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-brand-primary text-white font-bold px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add User
                </button>
            </div>

            <div className="bg-brand-secondary rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-brand-light uppercase bg-brand-dark">
                            <tr>
                                <th scope="col" className="px-6 py-3">Username</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Branch</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-brand-dark hover:bg-brand-dark/50">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{user.username}</th>
                                    <td className="px-6 py-4 capitalize">{user.role}</td>
                                    <td className="px-6 py-4">{getBranchName(user.branchId)}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(user)} className="font-medium text-brand-primary hover:underline">Edit</button>
                                        <button onClick={() => deleteUser(user.id)} className="font-medium text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                user={editingUser}
            />
        </div>
    );
};

export default AdminUsers;