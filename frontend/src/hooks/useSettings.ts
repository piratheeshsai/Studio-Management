import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api/apiClient';

interface StudioSettings {
  id: string;
  enableCrewAssignment: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/settings');
      setSettings(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (data: Partial<StudioSettings>) => {
    try {
      const response = await apiClient.put('/settings', data);
      setSettings(response.data);
      return response.data;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update settings');
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
  };
};
