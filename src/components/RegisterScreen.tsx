import React, { useState } from 'react';
import { Button } from './Button';

interface RegisterScreenProps {
    onRegisterSuccess: () => void;
    onBackToMenu: () => void;
}

export const RegisterScreen = ({ onRegisterSuccess, onBackToMenu }: RegisterScreenProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5001/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('ההרשמה הצליחה! כעת תוכל להתחבר.');
                onRegisterSuccess(); // נודיע לדף הראשי שההרשמה הצליחה
            } else {
                // הצגת הודעת שגיאה שהגיעה מהשרת
                setError(result || 'שגיאה לא ידועה אירעה');
            }
        } catch (err) {
            setError('שגיאת רשת. ודא שהשרת פועל.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-primary bg-opacity-40 p-8 rounded-3xl w-full max-w-md mx-auto shadow-2xl text-center">
            <h2 className="text-5xl font-bold text-white mb-8">הרשמה</h2>
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="שם משתמש"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full p-3 rounded bg-gray-700 text-white text-right"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="סיסמה (לפחות 6 תווים)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 rounded bg-gray-700 text-white text-right"
                    />
                </div>
                {error && <p className="text-red-400 mb-4">{error}</p>}
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'רושם...' : 'הירשם'}
                </Button>
            </form>
            <button onClick={onBackToMenu} className="text-text-secondary mt-6 hover:underline">
                חזור לתפריט
            </button>
        </div>
    );
};