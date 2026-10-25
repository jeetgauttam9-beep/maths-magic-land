/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Grade, GameState, Question, QuestionAttempt } from './types';
import { generateQuiz } from './utils/mathGenerator';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { SummaryScreen } from './components/SummaryScreen';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('WELCOME');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bal_hanuman_bg_music');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  // Start new quiz for selected grade
  const handleSelectGrade = (grade: Grade) => {
    setSelectedGrade(grade);
    const quizQuestions = generateQuiz(grade, 5);
    setQuestions(quizQuestions);
    setAttempts([]);
    setGameState('PLAYING');
  };

  const handleFinishQuiz = (quizAttempts: QuestionAttempt[]) => {
    setAttempts(quizAttempts);
    setGameState('SUMMARY');
  };

  const handlePlayAgain = () => {
    const freshQuestions = generateQuiz(selectedGrade, 5);
    setQuestions(freshQuestions);
    setAttempts([]);
    setGameState('PLAYING');
  };

  const handleChangeGrade = () => {
    setGameState('WELCOME');
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleToggleMusic = () => {
    setMusicEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('bal_hanuman_bg_music', String(next));
      }
      return next;
    });
  };

  const handleInsertAiQuestion = (newQuestion: Question) => {
    setQuestions((prev) => [...prev, newQuestion]);
  };

  return (
    <div className="w-full min-h-screen font-sans antialiased text-slate-800">
      {gameState === 'WELCOME' && (
        <WelcomeScreen
          onSelectGrade={handleSelectGrade}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          musicEnabled={musicEnabled}
          onToggleMusic={handleToggleMusic}
        />
      )}

      {gameState === 'PLAYING' && (
        <QuizScreen
          grade={selectedGrade}
          questions={questions}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          musicEnabled={musicEnabled}
          onToggleMusic={handleToggleMusic}
          onHomeClick={handleChangeGrade}
          onFinishQuiz={handleFinishQuiz}
          onInsertAiQuestion={handleInsertAiQuestion}
        />
      )}

      {gameState === 'SUMMARY' && (
        <SummaryScreen
          grade={selectedGrade}
          attempts={attempts}
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleMusic={handleToggleMusic}
          onPlayAgain={handlePlayAgain}
          onChangeGrade={handleChangeGrade}
        />
      )}
    </div>
  );
}
