import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'default' | 'correct' | 'incorrect';
}

export const Button = ({ children, className = '', variant = 'default', ...props }: ButtonProps) => {
    // השינוי הוא כאן: מ-text-left ל-text-right
    const baseClasses = 'w-full text-right p-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg';

    const variantClasses = {
        default: 'bg-primary text-text-primary hover:bg-opacity-80 active:scale-95',
        correct: 'bg-green-500 text-white scale-105',
        incorrect: 'bg-red-500 text-white',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};