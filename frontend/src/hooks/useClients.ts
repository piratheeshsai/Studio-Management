import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/apiClient';
import type { Client, CreateClientData } from '../types/client.types';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const useClients = () => {
    const { hasPermission } = useAuth();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        if (!hasPermission('CLIENT_READ')) {
            setClients([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.get('/clients');
            setClients(response.data);
            setError(null);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch clients';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [hasPermission]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const createClient = async (data: CreateClientData) => {
        try {
            const response = await apiClient.post('/clients', data);
            setClients(prev => [response.data, ...prev]);
            toast.success('Client created successfully');
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create client';
            toast.error(message);
            throw err;
        }
    };

    const updateClient = async (id: string, data: Partial<CreateClientData>) => {
        try {
            const response = await apiClient.patch(`/clients/${id}`, data);
            setClients(prev => prev.map(client => client.id === id ? response.data : client));
            toast.success('Client updated successfully');
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update client';
            toast.error(message);
            throw err;
        }
    };

    const deleteClient = async (id: string) => {
        try {
            await apiClient.delete(`/clients/${id}`);
            setClients(prev => prev.filter(client => client.id !== id));
            toast.success('Client deleted successfully');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete client';
            toast.error(message);
            throw err;
        }
    };

    return {
        clients,
        loading,
        error,
        refresh: fetchClients,
        createClient,
        updateClient,
        deleteClient
    };
};
