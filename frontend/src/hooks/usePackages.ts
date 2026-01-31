
import { useState, useCallback } from 'react';
import api from '../services/api/apiClient';
import { toast } from 'sonner';

import type { Package } from '../types/package.types';

export const usePackages = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchPackages = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/packages');
            setPackages(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err);
            toast.error('Failed to fetch packages');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        packages,
        loading,
        error,
        fetchPackages
    };
};
