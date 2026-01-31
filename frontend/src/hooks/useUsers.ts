import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { User } from '../types/user.types';
import { useAuth } from '../context/AuthContext';

export const useUsers = () => {
    const { hasPermission } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        // Skip if user doesn't have permission (prevent 403)
        if (!hasPermission('USER_READ')) {
            setUsers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get('/auth/users');
            setUsers(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasPermission('USER_READ')) {
            fetchUsers();
        } else {
            setLoading(false);
        }
    }, [hasPermission]);

    const deactivateUser = async (userId: string) => {
        try {
            await api.post(`/auth/users/${userId}/deactivate`);
            // Optimistic update or refetch
            setUsers(current => current.map(u => 
                u.id === userId ? { ...u, status: 'Inactive' } : u
            ));
            return true;
        } catch (err: any) {
            console.error(err);
            throw err;
        }
    };

    const activateUser = async (userId: string) => {
        try {
            await api.post(`/auth/users/${userId}/activate`);
            setUsers(current => current.map(u => 
                u.id === userId ? { ...u, status: 'Active' } : u
            ));
            return true;
        } catch (err: any) {
            console.error(err);
            throw err;
        }
    };

    const updateUser = async (userId: string, data: { name?: string; email?: string; role?: string }) => {
        try {
            const response = await api.post(`/auth/users/${userId}`, data);
            setUsers(current => current.map(u => 
                u.id === userId ? { ...u, ...data, role: { name: data.role || u.role.name } } : u
            ));
            return response.data;
        } catch (err: any) {
            console.error(err);
            throw err;
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            await api.delete(`/auth/users/${userId}`);
            // Optimistic update or refetch
            setUsers(current => current.filter(u => u.id !== userId));
            return true;
        } catch (err: any) {
            console.error(err);
            throw err;
        }
    };

    return { users, loading, error, refetch: fetchUsers, deactivateUser, activateUser, updateUser, deleteUser };
};
