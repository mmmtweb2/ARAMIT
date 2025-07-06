'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// המבנה של שאלה כפי שאנו עובדים איתו
interface Answer {
    text: string;
    isCorrect: boolean;
    _id?: string; // ID שמגיע ממסד הנתונים
}

interface Question {
    _id: string;
    word: string;
    answers: Answer[];
    audioUrl?: string;
}

export default function EditQuestionPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params; // שליפת ה-ID של השאלה מהכתובת

    const [question, setQuestion] = useState<Question | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null); // State לקובץ החדש
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState('');

    // useEffect שירוץ פעם אחת כדי לשלוף את נתוני השאלה מהשרת
    useEffect(() => {
        if (id) {
            const fetchQuestion = async () => {
                try {
                    const response = await fetch(`http://localhost:5001/questions/${id}`);
                    const data = await response.json();
                    setQuestion(data);
                } catch (error) {
                    console.error("Failed to fetch question:", error);
                    setFeedback('שגיאה בטעינת נתוני השאלה.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchQuestion();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'word' | `answer-${number}`) => {
        if (!question) return;
        const newQuestionData = { ...question };
        if (field === 'word') {
            newQuestionData.word = e.target.value;
        } else {
            const answerIndex = parseInt(field.split('-')[1]);
            newQuestionData.answers[answerIndex].text = e.target.value;
        }
        setQuestion(newQuestionData);
    };

    const handleCorrectAnswerChange = (index: number) => {
        if (!question) return;
        const newAnswers = question.answers.map((answer, i) => ({
            ...answer,
            isCorrect: i === index,
        }));
        setQuestion({ ...question, answers: newAnswers });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAudioFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question) return;
        setIsLoading(true);
        setFeedback('מעדכן שאלה...');

        const formData = new FormData();
        formData.append('word', question.word);
        formData.append('answers', JSON.stringify(question.answers));

        if (audioFile) {
            formData.append('audioFile', audioFile);
        }

        try {
            await fetch(`http://localhost:5001/questions/update/${id}`, {
                method: 'POST',
                body: formData,
            });
            setFeedback('השאלה עודכנה בהצלחה!');
            setTimeout(() => router.push('/admin/edit'), 1500);
        } catch (error) {
            console.error("Failed to update question:", error);
            setFeedback('שגיאה בעדכון השאלה.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-gray-900 text-white p-8">טוען נתוני שאלה...</div>;
    if (!question) return <div className="min-h-screen bg-gray-900 text-white p-8">לא נמצאה שאלה.</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8">עריכת שאלה: {question.word}</h1>
            <form onSubmit={handleSubmit} className="max-w-xl bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                    <label className="block mb-2 text-lg font-medium">המילה בארמית:</label>
                    <input
                        type="text"
                        value={question.word}
                        onChange={(e) => handleInputChange(e, 'word')}
                        className="w-full p-3 rounded bg-gray-700 border border-gray-600"
                    />
                </div>

                <h3 className="text-lg mb-3 font-medium">תשובות (סמן את הנכונה):</h3>
                {question.answers.map((answer, index) => (
                    <div key={answer._id || index} className="flex items-center gap-4 mb-3">
                        <input
                            type="radio"
                            name="correctAnswer"
                            checked={answer.isCorrect}
                            onChange={() => handleCorrectAnswerChange(index)}
                            className="w-6 h-6"
                        />
                        <input
                            type="text"
                            value={answer.text}
                            onChange={(e) => handleInputChange(e, `answer-${index}`)}
                            className="flex-grow p-3 rounded bg-gray-700 border border-gray-600"
                        />
                    </div>
                ))}

                <div className="mt-6 mb-4">
                    <label className="block mb-2 text-lg font-medium">קובץ שמע:</label>
                    {question.audioUrl && <p className="text-sm text-gray-400 mb-2">קובץ קיים: {question.audioUrl}</p>}
                    <input
                        type="file"
                        name="audioFile"
                        onChange={handleFileChange}
                        accept="audio/*"
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">בחר קובץ חדש רק אם ברצונך להחליף את הקיים.</p>
                </div>

                <button type="submit" disabled={isLoading} className="mt-6 w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-bold text-xl">
                    {isLoading ? 'מעדכן...' : 'שמור שינויים'}
                </button>
            </form>
            {feedback && <p className="mt-4 text-lg p-4 bg-gray-800 rounded-lg">{feedback}</p>}
        </div>
    );
}