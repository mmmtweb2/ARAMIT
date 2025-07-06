import React from 'react';
import type { Metadata } from 'next';
import { Heebo } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
});

export const metadata: Metadata = {
  title: 'ארמית - משחק טריוויה',
  description: 'אפליקציה ללימוד ארמית בכיף',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      {/* הסרנו את bg-background והשארנו רק את הפונט ואת צבע הטקסט הדיפולטיבי */}
      <body className={`${heebo.variable} font-heebo text-text-primary`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}