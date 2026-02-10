import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const getApiUrl = (path = '') => {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        if (!path) return cleanBase;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${cleanBase}${cleanPath}`;
    };

    useEffect(() => {
        axios.defaults.baseURL = getApiUrl();

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }

        setLoading(false);
    }, [token, user]);

    const login = async (email, password, role) => {
        try {
            console.log('Attempting login to:', getApiUrl('/api/auth/login'));
            const res = await axios.post('/api/auth/login', { email, password, role });
            setToken(res.data.token);
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            console.error('Login Error:', err);
            const message = err.response?.data?.message || (err.request ? 'Server not responding (Network Error)' : 'Login failed');
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        try {
            await axios.post('/api/auth/register', userData);
            return { success: true };
        } catch (err) {
            console.error('Registration Error:', err);
            const message = err.response?.data?.message || (err.request ? 'Server not responding (Network Error)' : 'Registration failed');
            return { success: false, message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/'; // Force a full clean redirect
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, getApiUrl }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
