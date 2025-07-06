'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
    const [word, setWord] = useState('');
    const [answers, setAnswers] = useState([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
    ]);
    const [audioFile, setAudioFile] = useState<File | null>(null); // State חדש לקובץ השמע
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAnswerChange = (index: number, text: string) => {
        const newAnswers = [...answers];
        newAnswers[index].text = text;
        setAnswers(newAnswers);
    };

    const handleCorrectAnswerChange = (index: number) => {
        const newAnswers = answers.map((answer, i) => ({
            ...answer,
            isCorrect: i === index,
        }));
        setAnswers(newAnswers);
    };

    // פונקציה שתטפל בבחירת קובץ
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAudioFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback('שולח נתונים...');
        setIsLoading(true);

        // שימוש ב-FormData לשליחת קובץ וטקסט יחד
        const formData = new FormData();
        formData.append('word', word);
        // המרת מערך התשובות לטקסט JSON לפני השליחה
        formData.append('answers', JSON.stringify(answers));

        if (audioFile) {
            // 'audioFile' חייב להיות זהה לשם שהגדרנו ב-multer בשרת
            formData.append('audioFile', audioFile);
        }

        try {
            // אין צורך ב-headers כשאנחנו משתמשים ב-FormData, הדפדפן מוסיף אותם לבד
            const response = await fetch('http://localhost:5001/questions/add', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setFeedback(`השאלה "${word}" נוספה בהצלחה!`);
                // איפוס הטופס
                setWord('');
                setAnswers([
                    { text: '', isCorrect: true }, { text: '', isCorrect: false },
                    { text: '', isCorrect: false }, { text: '', isCorrect: false },
                ]);
                setAudioFile(null);
                // איפוס שדה הקובץ
                const fileInput = document.getElementById('audioFile') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                setFeedback(`שגיאה: ${result}`);
            }
        } catch (error) {
            setFeedback('שגיאת רשת. ודא ששרת ה-API פועל.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="mb-8">
                <Link href="/admin/edit">
                    <span className="text-blue-400 hover:underline text-lg">
                        &larr; עבור לרשימת השאלות לעריכה
                    </span>
                </Link>
            </div>
            <h1 className="text-4xl font-bold mb-8">ממשק ניהול - הוספת שאלה</h1>
            <h1 className="text-4xl font-bold mb-8">ממשק ניהול - הוספת שאלה</h1>
            <form onSubmit={handleSubmit} className="max-w-xl bg-gray-800 p-6 rounded-lg shadow-lg">
                {/* ... שדות המילה והתשובות נשארים ללא שינוי ... */}
                <div className="mb-6">
                    <label htmlFor="word" className="block mb-2 text-lg font-medium">המילה בארמית:</label>
                    <input type="text" id="word" value={word} onChange={(e) => setWord(e.target.value)} required className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
                </div>

                <h3 className="text-lg mb-3 font-medium">תשובות (סמן את הנכונה):</h3>
                {answers.map((answer, index) => (
                    <div key={index} className="flex items-center gap-4 mb-3">
                        <input type="radio" name="correctAnswer" checked={answer.isCorrect} onChange={() => handleCorrectAnswerChange(index)} className="w-6 h-6 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500" />
                        <input type="text" placeholder={`תשובה ${index + 1}`} value={answer.text} onChange={(e) => handleAnswerChange(index, e.target.value)} required className="flex-grow p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
                    </div>
                ))}

                {/* --- שדה חדש להעלאת קובץ שמע --- */}
                <div className="mt-6 mb-4">
                    <label htmlFor="audioFile" className="block mb-2 text-lg font-medium">קובץ שמע (אופציונלי):</label>
                    <input
                        type="file"
                        id="audioFile"
                        name="audioFile"
                        onChange={handleFileChange}
                        accept="audio/*" // מאפשר בחירה של כל סוגי קבצי השמע
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                {/* ------------------------------------ */}

                <button type="submit" disabled={isLoading} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold text-xl transition-colors disabled:bg-gray-500">
                    {isLoading ? 'מוסיף...' : 'הוסף שאלה למאגר'}
                </button>
            </form>
            {feedback && <p className="mt-4 text-lg p-4 bg-gray-800 rounded-lg">{feedback}</p>}
        </div>
    );
}