
import { useState, useCallback } from 'react';
import api from '../api/axios';
import type { Role, Permission } from '../types/roles.types';
import { toast } from 'sonner';

export const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<Role[]>('/roles');
            setRoles(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch roles');
            toast.error('Failed to fetch roles');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPermissions = useCallback(async () => {
        try {
            const response = await api.get<Permission[]>('/roles/permissions');
            setPermissions(response.data);
        } catch (err: any) {
            console.error('Failed to fetch permissions', err);
            toast.error('Failed to fetch permissions');
        }
    }, []);

    const createRole = async (name: string, permissionSlugs: string[]) => {
        try {
            await api.post('/roles', { name, permissions: permissionSlugs });
            await fetchRoles(); // Refresh list
            toast.success('Role created successfully');
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to create role');
            return false;
        }
    };

    const updateRolePermissions = async (roleId: string, permissionSlugs: string[]) => {
        try {
            await api.put(`/roles/${roleId}/permissions`, { permissions: permissionSlugs });
            await fetchRoles();
            toast.success('Permissions updated successfully');
            return true;
        } catch (err: any) {
            toast.error('Failed to update permissions');
            return false;
        }
    };

    const deleteRole = async (roleId: string) => {
        try {
            await api.delete(`/roles/${roleId}`);
            await fetchRoles();
            toast.success('Role deleted successfully');
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete role');
            return false;
        }
    };

    const getRole = async (id: string) => {
        try {
            const response = await api.get<Role>(`/roles/${id}`);
            return response.data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to fetch role');
            return null;
        }
    };

    return {
        roles,
        permissions,
        loading,
        error,
        fetchRoles,
        fetchPermissions,
        createRole,
        updateRolePermissions,
        deleteRole,
        getRole
    };
};
