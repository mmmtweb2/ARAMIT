import React from 'react';
import { Button } from './Button';
import { getTitleForScore } from '@/utils/titles'; // ייבוא הפונקציה לחישוב התואר

interface GameOverScreenProps {
    score: number;
    onPlayAgain: () => void;
    onBackToMenu: () => void;
}

export const GameOverScreen = ({ score, onPlayAgain, onBackToMenu }: GameOverScreenProps) => {
    // חישוב התואר על סמך הניקוד הסופי
    const title = getTitleForScore(score);

    return (
        <div className="absolute inset-0 bg-background bg-opacity-90 flex flex-col items-center justify-center z-10">
            <div className="text-center p-8 rounded-3xl bg-primary shadow-2xl">
                <h2 className="text-5xl font-bold text-white mb-4">המשחק נגמר</h2>
                <p className="text-text-secondary text-2xl mb-2">
                    הניקוד שלך: <span className="text-timer font-bold">{score}</span>
                </p>

                {/* הצגת התואר אם הושג כזה (ניקוד של 20 ומעלה) */}
                {title && (
                    <p className="text-xl text-white mb-8">
                        הגעת לדרגת: <span className="font-bold">{title}</span>
                    </p>
                )}

                <div className="w-full flex flex-col gap-4">
                    <Button onClick={onPlayAgain} variant="default">שחק שוב</Button>
                    <Button onClick={onBackToMenu} variant="default" className="bg-opacity-50 hover:bg-opacity-70">חזור לתפריט</Button>
                </div>
            </div>
        </div>
    );
};