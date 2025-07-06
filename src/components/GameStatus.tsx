import React from 'react';
import { FaHeart, FaStar } from 'react-icons/fa'; // הוספנו אייקון כוכב

interface GameStatusProps {
    lives: number;
    score: number; // הרכיב מקבל את הניקוד
    timeLeft: number;
    totalTime: number; // אנחנו עדיין לא משתמשים בזה, אבל נשמור להמשך
}

export const GameStatus = ({ lives, score, timeLeft }: GameStatusProps) => {
    const lifeIcons = Array.from({ length: lives }, (_, i) => (
        <FaHeart key={i} className="text-red-500" />
    ));

    return (
        <div className="w-full max-w-2xl mx-auto mb-4 px-2 grid grid-cols-3 gap-4 items-center">
            {/* מונה חיים */}
            <div className="flex items-center gap-2 p-2 justify-start">
                <div className="text-2xl flex gap-1">{lifeIcons}</div>
            </div>

            {/* מונה ניקוד - החלק החדש */}
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
                <FaStar className="text-yellow-400" />
                <span>{score}</span>
            </div>

            {/* טיימר */}
            <div className="flex items-center justify-end">
                <div className="flex items-center justify-center bg-timer text-background font-bold text-2xl rounded-full w-12 h-12">
                    {timeLeft}
                </div>
            </div>
        </div>
    );
};