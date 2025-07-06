'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// הגדרת מבנה השאלה כפי שהוא מגיע מהשרת
interface Question {
    _id: string; // מסד הנתונים מוסיף אוטומטית את השדה _id
    word: string;
    answers: { text: string; isCorrect: boolean }[];
    audioUrl?: string;
}

export default function EditListPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:5001/questions');
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error("Failed to fetch questions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    if (isLoading) {
        return <div className="min-h-screen bg-gray-900 text-white p-8">טוען שאלות...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8">ניהול ועריכת שאלות</h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <table className="w-full text-right">
                    <thead className="border-b border-gray-600">
                        <tr>
                            <th className="p-3">המילה בארמית</th>
                            <th className="p-3">שמע קיים?</th>
                            <th className="p-3">פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question) => (
                            <tr key={question._id} className="border-b border-gray-700 hover:bg-gray-700">
                                <td className="p-3 font-bold">{question.word}</td>
                                <td className="p-3">{question.audioUrl ? 'כן' : 'לא'}</td>
                                <td className="p-3">
                                    <Link href={`/admin/edit/${question._id}`}>
                                        <span className="text-blue-400 hover:text-blue-300 font-semibold">
                                            ערוך
                                        </span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}