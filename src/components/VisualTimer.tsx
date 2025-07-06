'use client';

interface VisualTimerProps {
    timeLeft: number;
    totalTime: number;
}

export const VisualTimer = ({ timeLeft, totalTime }: VisualTimerProps) => {
    const percentage = (timeLeft / totalTime) * 100;

    return (
        <div className="w-full bg-primary bg-opacity-40 rounded-full h-4 shadow-inner">
            <div
                className="bg-timer h-4 rounded-full transition-all duration-300 ease-linear"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};