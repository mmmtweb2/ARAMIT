'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { FaCog } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface MainMenuProps {
    onStartGame: () => void;
    onShowLeaderboard: () => void;
    onShowSettings: () => void;
}

export const MainMenu = ({ onStartGame, onShowLeaderboard, onShowSettings }: MainMenuProps) => {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center text-center p-4 relative">
            {user && (
                <div className="mb-4">
                    <h2 className="text-2xl text-text-secondary">
                        ברוך הבא, {user.username}!
                    </h2>
                    {/* הצגת התואר אם הוא קיים */}
                    {user.currentTitle && (
                        <p className="text-lg text-timer font-bold">{user.currentTitle}</p>
                    )}
                </div>
            )}
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">ארמית למתחילים</h1>
            <p className="text-text-secondary text-xl md:text-2xl mb-12">מוכן לבחון את הידע שלך בארמית?</p>

            <div className="w-full max-w-sm flex flex-col gap-4">
                <Button onClick={onStartGame}>התחל משחק חדש</Button>
                <Button onClick={onShowLeaderboard}>צפייה בלוח השיאים</Button>

                {user ? (
                    <Button onClick={logout} variant="default" className="bg-red-600/80">
                        התנתק
                    </Button>
                ) : (
                    <Link href="/auth">
                        <Button>כניסה / הרשמה</Button>
                    </Link>
                )}

                <Button onClick={onShowSettings} className="flex items-center justify-center text-2xl w-20 mx-auto bg-primary bg-opacity-40 hover:bg-opacity-60">
                    <FaCog />
                </Button>
            </div>

            <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2">
                <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                    ממשק ניהול
                </Link>
            </div>
        </div>
    );
};