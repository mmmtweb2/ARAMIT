'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { QuestionCard, Question, Answer } from '@/components/QuestionCard';
import { GameStatus } from '@/components/GameStatus';
import { GameOverScreen } from '@/components/GameOverScreen';
import { MainMenu } from '@/components/MainMenu';
import { Leaderboard } from '@/components/Leaderboard';
import { SettingsScreen, Difficulty } from '@/components/SettingsScreen';
import { getTitleForScore } from '@/utils/titles';

const DURATION_MAPPING: Record<Difficulty, number> = {
  easy: 10,
  advanced: 5,
};

type View = 'menu' | 'game' | 'leaderboard' | 'settings';

export default function HomePage() {
  const { user, isLoading: isAuthLoading, updateCorrectAnswersCount } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<View>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('advanced');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);

  const [gameState, setGameState] = useState({
    currentQuestionIndex: 0,
    lives: 3,
    score: 0,
    isGameOver: false,
  });
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [timeLeft, setTimeLeft] = useState(DURATION_MAPPING[difficulty]);
  const [showTitleUpgrade, setShowTitleUpgrade] = useState(false);
  const [newTitle, setNewTitle] = useState<string | null>(null);

  const currentQuestion = questions[gameState.currentQuestionIndex];

  // הוספנו את הקוד הזה כדי להדפיס את נתוני השאלה הנוכחית לקונסולה
  useEffect(() => {
    if (currentQuestion) {
      console.log("בדיקה ודאית: נתוני השאלה בקליינט:", currentQuestion);
    }
  }, [currentQuestion]);


  // useEffect לבדיקת אימות והפניה
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/auth');
    }
  }, [user, isAuthLoading, router]);

  // useEffect לשליפת שאלות מהשרת
  useEffect(() => {
    if (user) {
      const fetchQuestions = async () => {
        setIsQuestionsLoading(true);
        try {
          const response = await fetch('http://localhost:5001/questions');
          const data = await response.json();
          setQuestions(data);
        } catch (error) {
          console.error("Failed to fetch questions:", error);
        } finally {
          setIsQuestionsLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [user]);

  // useEffect לניהול הטיימר
  useEffect(() => {
    if (view !== 'game' || selectedAnswer || gameState.isGameOver || isQuestionsLoading) return;
    if (timeLeft === 0) {
      handleAnswerClick({ text: 'Time is up', isCorrect: false });
      return;
    }
    const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, selectedAnswer, gameState.isGameOver, view, isQuestionsLoading]);

  const moveToNextQuestion = () => {
    const nextQuestionIndex = gameState.currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setGameState(prev => ({ ...prev, currentQuestionIndex: nextQuestionIndex }));
      setSelectedAnswer(null);
      setTimeLeft(DURATION_MAPPING[difficulty]);
    } else {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
  };

  const handleAnswerClick = (answer: Answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    let currentScore = gameState.score;
    let currentLives = gameState.lives;
    if (answer.isCorrect) {
      currentScore += 1;
    } else {
      currentLives -= 1;
    }
    setGameState(prev => ({ ...prev, score: currentScore, lives: currentLives }));
    if (currentLives === 0) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
      return;
    }
    setTimeout(moveToNextQuestion, 1500);
  };

  const startGame = () => {
    if (isQuestionsLoading || questions.length === 0) {
      alert("עדיין טוען שאלות מהשרת, נסה שוב בעוד רגע");
      return;
    }
    setGameState({ currentQuestionIndex: 0, lives: 3, score: 0, isGameOver: false });
    setSelectedAnswer(null);
    setTimeLeft(DURATION_MAPPING[difficulty]);
    setView('game');
  };

  // useEffect לשליחת הניקוד בסוף המשחק
  useEffect(() => {
    if (gameState.isGameOver && user && gameState.score > 0) {
      const submitScore = async () => {
        try {
          await fetch('http://localhost:5001/scores/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              username: user.username,
              score: gameState.score
            })
          });
          // עדכון כמות התשובות הנכונות במצטבר
          const res = await fetch('http://localhost:5001/users/increment-correct-answers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              correctAnswersIncrement: gameState.score
            })
          });
          const data = await res.json();
          if (data && typeof data.correctAnswersCount === 'number') {
            if (user.correctAnswersCount !== undefined) {
              const prevTitle = getTitleForScore(user.correctAnswersCount);
              const nextTitle = getTitleForScore(data.correctAnswersCount);
              if (prevTitle !== nextTitle && nextTitle) {
                setShowTitleUpgrade(true);
                setNewTitle(nextTitle);
              }
            }
            updateCorrectAnswersCount(data.correctAnswersCount);
          }
        } catch (error) {
          console.error("Failed to submit score or update correct answers:", error);
        }
      };
      submitScore();
    }
  }, [gameState.isGameOver, user, gameState.score]);

  const resetAndGoToMenu = () => {
    setGameState({ currentQuestionIndex: 0, lives: 3, score: 0, isGameOver: false });
    setSelectedAnswer(null);
    setTimeLeft(DURATION_MAPPING[difficulty]);
    setView('menu');
  };

  if (isAuthLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-white bg-background">טוען...</div>;
  }

  const renderView = () => {
    if (isQuestionsLoading && view === 'game') {
      return <div className="text-white text-2xl">טוען שאלות מהשרת...</div>;
    }
    switch (view) {
      case 'menu':
        return <MainMenu onStartGame={startGame} onShowLeaderboard={() => setView('leaderboard')} onShowSettings={() => setView('settings')} />;
      case 'leaderboard':
        return <Leaderboard onBackToMenu={() => setView('menu')} />;
      case 'settings':
        return <SettingsScreen currentDifficulty={difficulty} onSetDifficulty={setDifficulty} onBackToMenu={() => setView('menu')} />;
      case 'game':
        if (gameState.isGameOver) {
          return <GameOverScreen score={gameState.score} onPlayAgain={startGame} onBackToMenu={resetAndGoToMenu} />;
        }
        return (
          <div className="relative w-full flex flex-col items-center">
            <GameStatus lives={gameState.lives} score={gameState.score} timeLeft={timeLeft} totalTime={DURATION_MAPPING[difficulty]} />
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswerClick={handleAnswerClick}
              />
            )}
          </div>
        );
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      {showTitleUpgrade && newTitle && (
        <div className="fixed top-10 right-1/2 translate-x-1/2 bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-2xl font-bold">
          מזל טוב! עלית לתואר: {newTitle}
        </div>
      )}
      {renderView()}
    </main>
  );
}