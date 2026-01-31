import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthResponse, AuthState } from '../types/auth.types';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    const decodeAndSetUser = useCallback((token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            const user: User = {
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name || '',
                role: decoded.role,
                permissions: decoded.permissions || [],
                mustChangePassword: decoded.mustChangePassword,
            };
            setState({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
            });
            localStorage.setItem('access_token', token);
        } catch (error) {
            console.error('Failed to decode token:', error);
            logout();
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await api.post<AuthResponse>('/auth/login', { email, password });
        decodeAndSetUser(response.data.access_token);
    };

    const register = async (data: any) => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        decodeAndSetUser(response.data.access_token);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    const hasPermission = (permission: string): boolean => {
        if (!state.user) return false;
        // Check for Super Admin (handle both casing conventions)
        if (['SUPER_ADMIN', 'Super Admin'].includes(state.user.role)) return true;

        if (!state.user.permissions) return false;
        return state.user.permissions.includes(permission);
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            decodeAndSetUser(token);
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [decodeAndSetUser]);

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
