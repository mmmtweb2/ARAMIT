'use client';

import React from 'react';
import { Button } from './Button';
import { FaVolumeUp } from 'react-icons/fa';

// עדכון מבנה השאלה כך שיכיר בכל השדות מהשרת
export interface Answer {
    _id?: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    _id: string; // ה-ID מגיע ממסד הנתונים
    word: string;
    answers: Answer[];
    audioUrl?: string; // שדה השמע הוא אופציונלי
}

interface QuestionCardProps {
    question: Question;
    selectedAnswer: Answer | null;
    onAnswerClick: (answer: Answer) => void;
}

export const QuestionCard = ({ question, selectedAnswer, onAnswerClick }: QuestionCardProps) => {

    const playAudio = () => {
        if (question.audioUrl) {
            const audio = new Audio(`http://localhost:5001${question.audioUrl}`);
            audio.play().catch(error => console.error("Error playing audio:", error));
        }
    };

    return (
        <div className="bg-primary bg-opacity-40 p-8 rounded-3xl w-full max-w-2xl mx-auto shadow-2xl">
            <div className="text-center mb-8">
                <p className="text-text-secondary mb-2">מהי המילה?</p>
                <div className="flex items-center justify-center gap-4">
                    {/* התנאי להצגת הכפתור */}
                    {question.audioUrl && (
                        <button
                            onClick={playAudio}
                            className="text-3xl text-text-secondary hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                            aria-label="נגן שמע"
                        >
                            <FaVolumeUp />
                        </button>
                    )}
                    <h2 className="text-5xl font-bold text-text-primary">{question.word}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.answers.map((answer, index) => {
                    let variant: 'default' | 'correct' | 'incorrect' = 'default';
                    if (selectedAnswer) {
                        if (answer.isCorrect) {
                            variant = 'correct';
                        } else if (answer.text === selectedAnswer.text) {
                            variant = 'incorrect';
                        }
                    }
                    return (
                        <Button
                            key={answer._id || index}
                            onClick={() => onAnswerClick(answer)}
                            variant={variant}
                            disabled={!!selectedAnswer}
                        >
                            {answer.text}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
};