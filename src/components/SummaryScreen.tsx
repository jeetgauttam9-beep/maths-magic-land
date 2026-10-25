import React, { useEffect, useState } from 'react';
import { Grade, QuestionAttempt } from '../types';
import { LittleHanuman } from './LittleHanuman';
import { SpeechBubble } from './SpeechBubble';
import { ConfettiCanvas } from './ConfettiCanvas';
import { playSound, speakDialogue } from '../utils/audio';
import {
  RotateCcw,
  Home,
  Star,
  Trophy,
  CheckCircle2,
  XCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Music,
} from 'lucide-react';

interface SummaryScreenProps {
  grade: Grade;
  attempts: QuestionAttempt[];
  soundEnabled: boolean;
  musicEnabled?: boolean;
  onToggleMusic?: () => void;
  onPlayAgain: () => void;
  onChangeGrade: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  grade,
  attempts,
  soundEnabled,
  musicEnabled,
  onToggleMusic,
  onPlayAgain,
  onChangeGrade,
}) => {
  const [showReview, setShowReview] = useState(false);
  const [revealedStars, setRevealedStars] = useState(0);

  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const totalCount = attempts.length;

  // Calculate 1 to 3 stars:
  // 5/5 = 3 stars
  // 3-4/5 = 2 stars
  // 1-2/5 = 1 star
  // 0/5 = 1 star of encouragement!
  const starsEarned = correctCount >= 5 ? 3 : correctCount >= 3 ? 2 : 1;

  // Stagger star sounds and reveal
  useEffect(() => {
    if (soundEnabled) {
      playSound.victory();
    }

    const timer1 = setTimeout(() => {
      setRevealedStars(1);
      if (soundEnabled) playSound.star(0);
    }, 500);

    let timer2: NodeJS.Timeout;
    if (starsEarned >= 2) {
      timer2 = setTimeout(() => {
        setRevealedStars(2);
        if (soundEnabled) playSound.star(1);
      }, 1000);
    }

    let timer3: NodeJS.Timeout;
    if (starsEarned >= 3) {
      timer3 = setTimeout(() => {
        setRevealedStars(3);
        if (soundEnabled) playSound.star(2);
      }, 1500);
    }

    const finalDialogue =
      correctCount === 5
        ? 'Waah! Tumne bohot achha khela! Tum to poore 3 Star Champion ho! Jai Bajrangbali!'
        : correctCount >= 3
        ? 'Waah! Tumne bohot achha khela! Shabash mere sher, aise hi aage badhte raho!'
        : 'Waah! Tumne bohot achha khela! Agli baar tum aur bhi zyada stars jeetoge!';

    if (soundEnabled) {
      setTimeout(() => {
        speakDialogue(finalDialogue, soundEnabled);
      }, 800);
    }

    return () => {
      clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
      if (timer3) clearTimeout(timer3);
    };
  }, [correctCount, soundEnabled, starsEarned]);

  const finalDialogue =
    correctCount === 5
      ? 'Waah! Tumne bohot achha khela! Tum to poore 3 Star Champion ho! Jai Bajrangbali!'
      : correctCount >= 3
      ? 'Waah! Tumne bohot achha khela! Shabash mere sher, aise hi aage badhte raho!'
      : 'Waah! Tumne bohot achha khela! Agli baar tum aur bhi zyada stars jeetoge!';

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-amber-100 to-orange-200 flex flex-col justify-between relative overflow-hidden px-4 py-6 sm:px-8">
      {/* Confetti Explosion Shower */}
      <ConfettiCanvas active={true} duration={6000} />

      {/* Decorative Cloud Accents */}
      <div className="absolute top-10 left-6 w-48 h-16 bg-white/70 rounded-full blur-sm pointer-events-none" />
      <div className="absolute top-20 right-8 w-60 h-20 bg-white/60 rounded-full blur-sm pointer-events-none" />

      {/* Main Container */}
      <main className="relative z-10 max-w-3xl mx-auto w-full my-auto py-4">
        {/* Victory Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl text-center relative">
          {/* Top Row Controls */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-600" />
              Class {grade} Adventure Complete!
            </div>

            {onToggleMusic && (
              <button
                onClick={onToggleMusic}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black shadow-sm border transition-all cursor-pointer ${
                  musicEnabled
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-300'
                    : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                }`}
                title={musicEnabled ? 'Forest Melody is ON (Click to Pause)' : 'Forest Melody is OFF (Click to Play)'}
              >
                <Music className={`w-3.5 h-3.5 ${musicEnabled ? 'text-emerald-600 animate-bounce' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{musicEnabled ? 'Melody ON' : 'Melody OFF'}</span>
              </button>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Mission Accomplished!
          </h1>

          {/* Little Hanuman in Victory Pose */}
          <div className="flex flex-col items-center justify-center my-1">
            <LittleHanuman
              emotion="victory"
              size="lg"
            />
          </div>

          {/* Speech Bubble with Hinglish dialogue */}
          <div className="max-w-xl mx-auto my-3">
            <SpeechBubble
              speakerName="Little Hanuman ji"
              dialogue={finalDialogue}
              subtext="Bal Hanuman is so proud of your hard work and bright mind!"
              soundEnabled={soundEnabled}
            />
          </div>

          {/* 1 to 3 Animated Golden Stars Awarded by Hanuman ji */}
          <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-100 to-orange-50 border-2 border-amber-300 max-w-md mx-auto">
            <div className="text-xs font-black uppercase tracking-wider text-amber-900 mb-2">
              Stars Awarded by Little Hanuman:
            </div>

            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((starIdx) => {
                const isEarned = starIdx <= starsEarned;
                const isRevealed = starIdx <= revealedStars;

                return (
                  <div
                    key={starIdx}
                    className={`transition-all duration-500 transform ${
                      isRevealed && isEarned
                        ? 'scale-110 rotate-0 text-amber-400'
                        : 'scale-90 text-slate-300'
                    }`}
                  >
                    <Star
                      className={`w-14 h-14 sm:w-16 sm:h-16 ${
                        isRevealed && isEarned
                          ? 'fill-amber-400 text-amber-500 drop-shadow-md animate-bounce'
                          : 'fill-slate-200 text-slate-300'
                      }`}
                      style={{
                        animationDuration: '1.5s',
                        animationDelay: `${starIdx * 0.2}s`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="text-sm font-black text-amber-950 mt-3">
              {starsEarned === 3 && '★★★ Super Bajrangbali Champion! (5 / 5 Correct)'}
              {starsEarned === 2 && '★★☆ Great Job Math Explorer! (Good Effort)'}
              {starsEarned === 1 && '★☆☆ Good Try! Practice makes you a Champion!'}
            </div>
          </div>

          {/* Score Stats Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto my-4 text-left">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-base shrink-0">
                ✓
              </div>
              <div>
                <div className="text-[11px] font-bold text-emerald-800 uppercase">Correct Answers</div>
                <div className="text-lg font-black text-emerald-950">
                  {correctCount} / {totalCount}
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-base shrink-0">
                ★
              </div>
              <div>
                <div className="text-[11px] font-bold text-amber-800 uppercase">Total Score</div>
                <div className="text-lg font-black text-amber-950">
                  {correctCount * 100} pts
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mt-6">
            <button
              onClick={onPlayAgain}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-black text-base uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 shadow-lg cursor-pointer btn-3d btn-3d-orange flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </button>

            <button
              onClick={onChangeGrade}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-black text-base uppercase tracking-wider text-slate-800 bg-white hover:bg-slate-50 border-2 border-slate-300 shadow-md cursor-pointer btn-3d flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5 text-amber-600" />
              <span>Change Class</span>
            </button>
          </div>

          {/* Question Review Accordion */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-left">
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full flex items-center justify-between py-2 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <span>Review All 5 Questions & Solutions</span>
              {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showReview && (
              <div className="space-y-3 mt-3 animate-in fade-in duration-200">
                {attempts.map((att, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border-2 text-xs font-semibold ${
                      att.isCorrect
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/70 border-rose-300 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-800">
                        Q{idx + 1}: {att.question.prompt}
                      </span>
                      {att.isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-700 font-bold">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-600 mt-1">
                      <span>Your Answer: </span>
                      <strong className={att.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                        {att.selectedAnswer ?? 'None'}
                      </strong>
                      {!att.isCorrect && (
                        <span>
                          {' · '}Correct Answer:{' '}
                          <strong className="text-emerald-700">
                            {att.question.correctAnswer}
                          </strong>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 italic">
                      Solution: {att.question.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-2 text-xs font-bold text-amber-950/60">
        Math Magic Land with Little Hanuman ji · Ram Ram!
      </footer>
    </div>
  );
};
