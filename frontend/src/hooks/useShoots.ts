
import { useState, useCallback } from 'react';
import api from '../services/api/apiClient'; // Assuming this exists based on project structure
import { toast } from 'sonner';

import { ShootStatus, type Shoot, type CreateShootPayload } from '../types/shoot.types';

export const useShoots = () => {
    const [shoots, setShoots] = useState<Shoot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchShoots = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/shoots');
            setShoots(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err);
            toast.error('Failed to fetch shoots');
        } finally {
            setLoading(false);
        }
    }, []);

    const createShoot = async (shootData: CreateShootPayload) => {
        try {
            const { data } = await api.post('/shoots', shootData);
            setShoots((prev) => [data, ...prev]);
            toast.success('Shoot created successfully');
            return data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to create shoot');
            throw err;
        }
    };

    const getShoot = async (id: string): Promise<Shoot> => {
        try {
            const { data } = await api.get(`/shoots/${id}`);
            return data;
        } catch (err: any) {
            toast.error('Failed to fetch shoot details');
            throw err;
        }
    };

    const updateShootItem = async (itemId: string, data: any) => {
        try {
            const { data: updated } = await api.patch(`/shoots/items/${itemId}`, data);
            toast.success('Item updated');
            return updated;
        } catch (err: any) {
            toast.error('Failed to update item');
            throw err;
        }
    };

    const addPayment = async (shootId: string, data: any) => {
        try {
            const { data: payment } = await api.post(`/shoots/${shootId}/payments`, data);
            toast.success('Payment recorded');
            return payment;
        } catch (err: any) {
            toast.error('Failed to add payment');
            throw err;
        }
    };

    return {
        shoots,
        loading,
        error,
        fetchShoots,
        createShoot,
        getShoot,
        updateShootItem,
        addPayment
    };
};
