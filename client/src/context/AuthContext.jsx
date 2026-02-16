import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('marutham_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('marutham_token');
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('marutham_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('marutham_user');
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('marutham_token', token);
        } else {
            localStorage.removeItem('marutham_token');
        }
    }, [token]);

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    const isAdmin = user && user.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
