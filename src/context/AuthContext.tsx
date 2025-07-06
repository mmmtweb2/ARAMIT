'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    correctAnswersCount?: number;
    currentTitle?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean; // הוספנו את המשתנה הזה
    login: (userData: User) => void;
    logout: () => void;
    updateCorrectAnswersCount: (count: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // מתחילים בטעינה

    // כאן בעתיד נוסיף useEffect שיבדוק אם יש טוקן ב-localStorage
    // כרגע, פשוט נסיים את הטעינה
    useEffect(() => {
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const updateCorrectAnswersCount = (count: number) => {
        setUser(prev => prev ? { ...prev, correctAnswersCount: count } : prev);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateCorrectAnswersCount }}>
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