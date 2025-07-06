'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';

// המבנה של רשומת שיא שמגיעה מהשרת
interface ScoreEntry {
    username: string;
    score: number;
    title?: string; // הוספנו שדה אופציונלי לתואר
}

interface LeaderboardProps {
    onBackToMenu: () => void;
}

export const Leaderboard = ({ onBackToMenu }: LeaderboardProps) => {
    // State מקומי להחזקת השיאים ומצב הטעינה
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect שירוץ פעם אחת כשהרכיב עולה למסך
    useEffect(() => {
        const fetchScores = async () => {
            setIsLoading(true);
            try {
                // קריאת API לשרת שלנו כדי לקבל את השיאים
                const response = await fetch('http://localhost:5001/scores');
                const data = await response.json();
                setScores(data);
            } catch (error) {
                console.error("Failed to fetch scores", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScores();
    }, []); // המערך הריק מבטיח שהקריאה תתבצע רק פעם אחת

    return (
        <div className="flex flex-col items-center justify-center bg-primary bg-opacity-40 p-8 rounded-3xl w-full max-w-md mx-auto shadow-2xl text-center">
            <h2 className="text-5xl font-bold text-white mb-8">לוח השיאים</h2>
            <div className="w-full flex flex-col gap-3 mb-8 min-h-[200px]">
                {isLoading ? (
                    <p>טוען נתונים...</p>
                ) : scores.length === 0 ? (
                    <p>עדיין אין שיאים. שחק כדי להיות הראשון!</p>
                ) : (
                    scores.map((entry, index) => (
                        <div key={index} className="bg-primary p-3 rounded-lg text-lg text-right">
                            <div className="flex justify-between items-center">
                                <span className="font-bold">{index + 1}. {entry.username}</span>
                                <span className="font-bold text-timer">{entry.score}</span>
                            </div>
                            {/* הצגת התואר אם הוא קיים */}
                            {entry.title && (
                                <p className="text-sm text-text-secondary mt-1">{entry.title}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
            <Button onClick={onBackToMenu}>חזור לתפריט</Button>
        </div>
    );
};