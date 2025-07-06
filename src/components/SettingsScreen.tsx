import React from 'react';
import { Button } from './Button';
import { FaCog } from 'react-icons/fa'; // ייבוא אייקון גלגל שיניים

export type Difficulty = 'easy' | 'advanced';

interface SettingsScreenProps {
    currentDifficulty: Difficulty;
    onSetDifficulty: (difficulty: Difficulty) => void;
    onBackToMenu: () => void;
}

export const SettingsScreen = ({ currentDifficulty, onSetDifficulty, onBackToMenu }: SettingsScreenProps) => {
    return (
        <div className="flex flex-col items-center justify-center bg-primary bg-opacity-40 p-8 rounded-3xl w-full max-w-md mx-auto shadow-2xl text-center">
            <h2 className="text-5xl font-bold text-white mb-8">הגדרות</h2>

            <div className="w-full mb-8">
                <h3 className="text-2xl text-text-secondary mb-4">רמת קושי</h3>
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => onSetDifficulty('easy')}
                        className={currentDifficulty === 'easy' ? 'ring-4 ring-timer' : ''}
                    >
                        קל (10 שניות)
                    </Button>
                    <Button
                        onClick={() => onSetDifficulty('advanced')}
                        className={currentDifficulty === 'advanced' ? 'ring-4 ring-timer' : ''}
                    >
                        מתקדם (5 שניות)
                    </Button>
                </div>
            </div>

            <Button onClick={onBackToMenu}>שמור וחזור לתפריט</Button>
        </div>
    );
};