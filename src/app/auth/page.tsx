'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginScreen } from '@/components/LoginScreen';
import { RegisterScreen } from '@/components/RegisterScreen';
import { useAuth } from '@/context/AuthContext'; // ייבוא הוק האימות

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const router = useRouter();
    const { login } = useAuth(); // שימוש בפונקציית הכניסה הגלובלית

    const handleAuthSuccess = (userData: any) => {
        login(userData); // עדכון המצב הגלובלי עם פרטי המשתמש
        router.push('/'); // החזרה לדף הבית
    };

    return (
        <main className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-primary bg-opacity-40 p-8 rounded-3xl w-full max-w-md mx-auto shadow-2xl">
                {isLoginView ? (
                    <LoginScreen onLoginSuccess={handleAuthSuccess} />
                ) : (
                    <RegisterScreen onRegisterSuccess={() => setIsLoginView(true)} onBackToMenu={() => setIsLoginView(true)} />
                )}

                <div className="text-center mt-6 border-t border-white/20 pt-6">
                    <p className="mb-2 text-text-secondary">
                        {isLoginView ? 'אין לך חשבון?' : 'כבר יש לך חשבון?'}
                    </p>
                    <button onClick={() => setIsLoginView(!isLoginView)} className="font-bold text-white hover:underline">
                        {isLoginView ? 'צור חשבון חדש' : 'התחבר לחשבון קיים'}
                    </button>
                </div>
            </div>
        </main>
    );

}