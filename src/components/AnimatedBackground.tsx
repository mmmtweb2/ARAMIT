'use client';

import React from 'react';

interface AnimatedBackgroundProps {
    variant: string;
}

const variants = {
    default: 'gradient-default',
    warm: 'gradient-warm',
    cool: 'gradient-cool',
    success: 'gradient-success',
};

export const AnimatedBackground = ({ variant }: AnimatedBackgroundProps) => {
    // @ts-ignore
    const currentGradient = variants[variant] || variants.default;

    return (
        <div>
            {Object.entries(variants).map(([key, gradientClass]) => (
                <div
                    key={key}
                    className={`gradient-background ${gradientClass} ${currentGradient === gradientClass ? 'visible' : ''
                        }`}
                />
            ))}
        </div>
    );
};