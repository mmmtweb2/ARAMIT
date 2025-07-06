'use client';

import React, { useState } from 'react';
import { Button } from './Button';

// בעתיד, נשתמש ב-Context כדי לנהל את מצב המשתמש
interface LoginScreenProps {
    onLoginSuccess: (userData: any) => void;
}

export const LoginScreen = ({ onLoginSuccess }: LoginScreenProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5001/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`ברוך הבא, ${result.user.username}!`);
                onLoginSuccess(result.user);
            } else {
                setError(result || 'שגיאה לא ידועה');
            }
        } catch (err) {
            setError('שגיאת רשת. ודא שהשרת פועל.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">כניסה</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input type="text" placeholder="שם משתמש" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full p-3 rounded bg-gray-700 text-white text-right" />
                </div>
                <div className="mb-6">
                    <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 rounded bg-gray-700 text-white text-right" />
                </div>
                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
                <Button type="submit" disabled={isLoading}>{isLoading ? 'מתחבר...' : 'התחבר'}</Button>
            </form>
        </div>
    );
};