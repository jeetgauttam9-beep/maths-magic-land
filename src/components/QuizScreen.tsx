import React, { useState, useEffect } from 'react';
import { Grade, Question, HanumanEmotion, QuestionAttempt } from '../types';
import { LittleHanuman } from './LittleHanuman';
import { SpeechBubble } from './SpeechBubble';
import { MathVisualAid } from './MathVisualAid';
import { GeminiHintModal } from './GeminiHintModal';
import { playSound, speakDialogue } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Home,
  Star,
  Sparkles,
  Lightbulb,
  Wand2,
  Trophy,
  Heart,
  Download,
  Music,
  Sliders,
} from 'lucide-react';
import { DownloadAppModal } from './DownloadAppModal';
import { SoundSettingsModal } from './SoundSettingsModal';

interface QuizScreenProps {
  grade: Grade;
  questions: Question[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
  onHomeClick: () => void;
  onFinishQuiz: (attempts: QuestionAttempt[]) => void;
  onInsertAiQuestion?: (newQuestion: Question) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  grade,
  questions,
  soundEnabled,
  onToggleSound,
  musicEnabled,
  onToggleMusic,
  onHomeClick,
  onFinishQuiz,
  onInsertAiQuestion,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [emotion, setEmotion] = useState<HanumanEmotion>('idle');
  const [dialogue, setDialogue] = useState<string>(
    'Socho socho! Dhyan se number dekho aur sahi option chun lo!'
  );
  const [score, setScore] = useState(0);
  const [shakeCard, setShakeCard] = useState(false);

  // Gemini AI Hint state
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintData, setHintData] = useState<{ dialogue: string; tip: string } | null>(null);

  // Gemini AI Magic Question state
  const [isGeneratingAiQuestion, setIsGeneratingAiQuestion] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  const correctDialogues = [
    'Shabaash! Bilkul sahi jawaab! Jai Bajrangbali!',
    'Waah! Kya kamaal kiya hai! Bahut badhiya!',
    'Mera pyara dost! Tumhara dimag to bijli jaisa tez hai!',
    'Jai Jai Bajrangbali! Agle sawaal ke liye tayyar raho!',
  ];

  const wrongDialogues = [
    'Koi baat nahi, ek baar aur koshish karo! Tum kar sakte ho!',
    'Galti se hi to hum seekhte hain! Himmat bilkul mat haarna!',
    'Fikr mat karo dost! Thoda sa aur dhyan do, tum jeetoge!',
  ];

  const optionButtonStyles = [
    {
      base: 'btn-3d-amber bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 border-amber-300',
      labelBg: 'bg-amber-600 text-white',
    },
    {
      base: 'btn-3d-sky bg-gradient-to-b from-sky-400 to-sky-600 text-white border-sky-300',
      labelBg: 'bg-sky-700 text-white',
    },
    {
      base: 'btn-3d-rose bg-gradient-to-b from-rose-400 to-rose-600 text-white border-rose-300',
      labelBg: 'bg-rose-700 text-white',
    },
    {
      base: 'btn-3d-emerald bg-gradient-to-b from-emerald-400 to-emerald-600 text-white border-emerald-300',
      labelBg: 'bg-emerald-700 text-white',
    },
  ];

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setEmotion('idle');
    setShakeCard(false);
    setHintData(null);

    const questionDialogues = [
      'Chalo naya sawaal solve karte hain! Dhyan se padho!',
      'Socho socho! Dekhte hain kaun pehle sahi jawaab deta hai!',
      'Arey waah, yeh sawaal bohot mazedaar hai!',
    ];
    const initialDlg = questionDialogues[currentIndex % questionDialogues.length];
    setDialogue(initialDlg);
    if (soundEnabled) {
      speakDialogue(initialDlg, soundEnabled);
    }
  }, [currentIndex, soundEnabled]);

  const handleSelectOption = (option: string | number) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = String(option).trim() === String(currentQ.correctAnswer).trim();

    if (isCorrect) {
      if (soundEnabled) {
        playSound.correct();
        playSound.gadaSpin();
      }
      setScore((prev) => prev + 100);
      setEmotion('gada-spin'); // Leaps with spinning Gada and floating laddoos!
      const randomDlg = correctDialogues[Math.floor(Math.random() * correctDialogues.length)];
      setDialogue(randomDlg);
      if (soundEnabled) speakDialogue(randomDlg, soundEnabled);
    } else {
      if (soundEnabled) {
        playSound.wrong();
      }
      setShakeCard(true);
      setTimeout(() => setShakeCard(false), 600);
      setEmotion('encouraging'); // Gentle nod and comforting smile
      const randomDlg = wrongDialogues[Math.floor(Math.random() * wrongDialogues.length)];
      setDialogue(randomDlg);
      if (soundEnabled) speakDialogue(randomDlg, soundEnabled);
    }

    setAttempts((prev) => [
      ...prev,
      {
        question: currentQ,
        selectedAnswer: option,
        isCorrect,
        timeSpentSeconds: 5,
      },
    ]);
  };

  const handleNext = () => {
    if (soundEnabled) playSound.click();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishQuiz(attempts);
    }
  };

  // Gemini AI Hint handler
  const handleOpenAiHint = async () => {
    if (soundEnabled) playSound.click();
    setIsHintModalOpen(true);
    if (hintData) return;

    setIsHintLoading(true);
    setEmotion('encouraging');

    try {
      const res = await fetch('/api/hanuman/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionPrompt: currentQ.prompt,
          subPrompt: currentQ.subPrompt,
          grade,
          options: currentQ.options,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHintData(data);
        if (soundEnabled && data.dialogue) {
          speakDialogue(data.dialogue, soundEnabled);
        }
      } else {
        setHintData({
          dialogue: 'Pehle ones column ko dhyan se dekho, phir aage badho dost!',
          tip: 'Start adding or subtracting from the rightmost ones place value.',
        });
      }
    } catch {
      setHintData({
        dialogue: 'Pehle ones column ko dhyan se dekho, phir aage badho dost!',
        tip: 'Start adding or subtracting from the rightmost ones place value.',
      });
    } finally {
      setIsHintLoading(false);
    }
  };

  // Gemini AI Magic Question handler
  const handleGenerateMagicQuestion = async () => {
    if (soundEnabled) playSound.click();
    setIsGeneratingAiQuestion(true);
    setEmotion('bounce');

    try {
      const res = await fetch('/api/hanuman/magic-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiQuestion: Question = {
          id: `ai-magic-${Date.now()}`,
          grade,
          type: 'word-problem',
          prompt: data.prompt || 'Solve this magical Hanuman challenge!',
          subPrompt: data.subPrompt || 'Crafted with Gemini AI',
          correctAnswer: data.correctAnswer,
          options: data.options || [data.correctAnswer, 10, 20, 30],
          explanation: data.explanation || 'Great job solving it!',
        };

        if (onInsertAiQuestion) {
          onInsertAiQuestion(aiQuestion);
        }
        if (data.hanumanIntro) {
          setDialogue(data.hanumanIntro);
          if (soundEnabled) speakDialogue(data.hanumanIntro, soundEnabled);
        }
      }
    } catch (err) {
      console.warn('Failed to load magic AI question:', err);
    } finally {
      setIsGeneratingAiQuestion(false);
    }
  };

  const isCurrentCorrect =
    selectedOption !== null &&
    String(selectedOption).trim() === String(currentQ.correctAnswer).trim();

  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-amber-50 to-orange-100 flex flex-col justify-between relative overflow-hidden px-4 py-5 sm:px-8">
      {/* Background Cloud Accents */}
      <div className="absolute top-10 left-8 w-48 h-16 bg-white/70 rounded-full blur-sm animate-cloud-drift pointer-events-none" />
      <div className="absolute top-24 right-12 w-64 h-20 bg-white/60 rounded-full blur-sm animate-cloud-drift pointer-events-none" style={{ animationDelay: '5s' }} />

      {/* Gemini AI Hint Modal */}
      <GeminiHintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        isLoading={isHintLoading}
        hintData={hintData}
        soundEnabled={soundEnabled}
      />

      {/* Top HUD Bar */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onHomeClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-bold shadow-sm border border-amber-200 transition-all cursor-pointer"
            title="Return to Grade Selection"
          >
            <Home className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Classes</span>
          </button>

          <div className="px-3 py-1 bg-amber-400 text-amber-950 font-black rounded-xl text-xs shadow-sm uppercase tracking-wide">
            Class {grade}
          </div>
        </div>

        {/* Center Progress pill */}
        <div className="flex-1 max-w-xs mx-2">
          <div className="flex items-center justify-between text-xs font-black text-amber-900 mb-1">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span className="flex items-center gap-1 text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {score} pts
            </span>
          </div>
          <div className="w-full h-3 bg-amber-200/80 rounded-full overflow-hidden p-0.5 border border-amber-300">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* AI Magic Question & Sound buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateMagicQuestion}
            disabled={isGeneratingAiQuestion || isAnswered}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 font-black text-xs shadow-sm hover:from-amber-300 hover:to-orange-300 transition-all cursor-pointer border border-amber-300"
            title="Generate a custom AI Math Story Question with Gemini"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
            <span>{isGeneratingAiQuestion ? 'Generating AI...' : 'Magic Question'}</span>
          </button>

          {/* Quick Forest Melody Toggle */}
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-2xl text-xs font-bold shadow-sm border transition-all cursor-pointer ${
              musicEnabled
                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-300'
                : 'bg-white/90 hover:bg-white text-slate-400 border-amber-200'
            }`}
            title={musicEnabled ? 'Forest Melody is ON (Click to Pause)' : 'Forest Melody is OFF (Click to Play)'}
          >
            <Music className={`w-4 h-4 ${musicEnabled ? 'text-emerald-600 animate-bounce' : 'text-slate-400'}`} />
          </button>

          {/* Quick Sound Effects Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold shadow-sm border border-amber-200 transition-all cursor-pointer"
            title="Toggle Sound Effects & Voice"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Audio Settings Modal Button */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold shadow-sm border border-amber-200 transition-all cursor-pointer"
            title="Sound & Music Settings"
          >
            <Sliders className="w-4 h-4 text-amber-800" />
          </button>

          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="p-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs font-bold shadow-sm border border-amber-200 transition-all cursor-pointer"
            title="Download or Install Bal Hanuman Math Game to your device"
          >
            <Download className="w-4 h-4 text-amber-700" />
          </button>
        </div>
      </header>

      {/* Download / Install App Modal */}
      <DownloadAppModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        soundEnabled={soundEnabled}
      />

      {/* Sound & Forest Music Settings Modal */}
      <SoundSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        soundEffectsEnabled={soundEnabled}
        onToggleSoundEffects={onToggleSound}
        musicEnabled={musicEnabled}
        onToggleMusic={onToggleMusic}
      />

      {/* Main Play Area */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left Column: Little Hanuman Mascot & Speech Bubble */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full mb-3">
              <SpeechBubble
                speakerName="Little Hanuman ji"
                dialogue={dialogue}
                subtext={
                  isAnswered
                    ? isCurrentCorrect
                      ? 'You got it right! Jai Bajrangbali!'
                      : 'Take a look at the solution below to learn!'
                    : 'Tap an English option or ask Hanuman ji for an AI clue!'
                }
                soundEnabled={soundEnabled}
              />
            </div>

            {/* Bal Hanuman Character with interactive animations */}
            <div
              className="cursor-pointer"
              onClick={() => {
                setEmotion('bounce');
                if (soundEnabled) playSound.gadaSpin();
              }}
            >
              <LittleHanuman
                emotion={emotion}
                size="md"
              />
            </div>

            {/* AI Clue Button below Hanuman */}
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={handleOpenAiHint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 text-xs font-extrabold shadow-sm border border-amber-300 transition-all cursor-pointer btn-3d"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-900" />
                <span>Ask Hanuman ji for a Clue (Gemini AI)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Question Card & 4 Options */}
          <div className="lg:col-span-7">
            <div
              className={`bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 border-3 border-amber-300 shadow-xl transition-all duration-300 ${
                shakeCard ? 'translate-x-[-8px] transition-transform animate-pulse' : ''
              }`}
            >
              {/* Question Header & Subprompt */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-extrabold text-amber-700 uppercase tracking-wider mb-1">
                  <span>Math Challenge #{currentIndex + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                      Class {grade}
                    </span>
                    {currentQ.id.startsWith('ai-magic') && (
                      <span className="bg-gradient-to-r from-purple-100 to-amber-100 text-purple-900 px-2 py-0.5 rounded-full font-extrabold border border-purple-200 flex items-center gap-1">
                        <Wand2 className="w-3 h-3 text-purple-700" /> AI Magic
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {currentQ.prompt}
                </h2>

                {currentQ.subPrompt && (
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                    {currentQ.subPrompt}
                  </p>
                )}
              </div>

              {/* Visual Aids (Place Value Columns / Laddoo Counters) */}
              <MathVisualAid question={currentQ} />

              {/* 4 Colorful 3D MCQ Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = String(option).trim() === String(currentQ.correctAnswer).trim();
                  const style = optionButtonStyles[idx % optionButtonStyles.length];

                  let buttonStateClass = style.base;
                  if (isAnswered) {
                    if (isCorrect) {
                      buttonStateClass =
                        'btn-3d-emerald bg-emerald-500 text-white border-emerald-400 ring-4 ring-emerald-300/60 scale-[1.02]';
                    } else if (isSelected && !isCorrect) {
                      buttonStateClass =
                        'btn-3d-rose bg-rose-500 text-white border-rose-400 opacity-90';
                    } else {
                      buttonStateClass =
                        'bg-slate-100 text-slate-400 border-slate-200 opacity-50 shadow-none pointer-events-none';
                    }
                  }

                  const letterLabels = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(option)}
                      className={`btn-3d p-4 rounded-2xl flex items-center gap-3 text-left font-black text-lg sm:text-xl transition-all cursor-pointer border-2 ${buttonStateClass}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isAnswered && isCorrect
                            ? 'bg-emerald-700 text-white'
                            : isAnswered && isSelected && !isCorrect
                            ? 'bg-rose-700 text-white'
                            : style.labelBg
                        }`}
                      >
                        {letterLabels[idx]}
                      </span>

                      <span className="flex-1 tracking-wide">{option}</span>

                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-white shrink-0 animate-bounce" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* DYNAMIC ANIMATED BAL HANUMAN JI ANSWER REACTION SHOWCASE */}
              {isAnswered && (
                <div className="mt-5 pt-4 border-t-3 border-amber-300/80 animate-in fade-in slide-in-from-bottom-3 duration-400">
                  {/* Reaction Banner with Animated Bal Hanuman Mascot */}
                  <div
                    className={`rounded-3xl p-4 sm:p-5 mb-4 border-3 shadow-lg flex flex-col sm:flex-row items-center gap-4 transition-all ${
                      isCurrentCorrect
                        ? 'bg-gradient-to-r from-emerald-100 via-yellow-50 to-amber-100 border-emerald-400 shadow-emerald-500/10'
                        : 'bg-gradient-to-r from-rose-100 via-amber-50 to-orange-100 border-orange-400 shadow-orange-500/10'
                    }`}
                  >
                    {/* Animated Bal Hanuman Mascot Reaction */}
                    <div className="shrink-0 relative">
                      <LittleHanuman
                        emotion={isCurrentCorrect ? 'gada-spin' : 'encouraging'}
                        size="sm"
                        className={isCurrentCorrect ? 'animate-hanuman-jump' : 'animate-gentle-nod'}
                      />
                      {/* Floating reaction badge */}
                      <div className="absolute -bottom-1 -right-1">
                        {isCurrentCorrect ? (
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white font-black text-sm shadow-md animate-bounce">
                            ✓
                          </span>
                        ) : (
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500 text-white font-black text-sm shadow-md animate-pulse">
                            💛
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reaction text and audio feedback */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1 flex-wrap">
                        {isCurrentCorrect ? (
                          <>
                            <Trophy className="w-4 h-4 text-emerald-600 inline" />
                            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                              Shabaash! Correct Answer!
                            </span>
                            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-950 border border-emerald-300">
                              +100 Points!
                            </span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-4 h-4 text-orange-600 inline" />
                            <span className="text-xs font-black text-orange-800 uppercase tracking-wider">
                              Keep Trying! Practice Makes Perfect!
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                        "{dialogue}"
                      </h3>

                      <p className="text-xs text-slate-600 font-semibold mt-1">
                        {isCurrentCorrect
                          ? 'Little Hanuman is spinning his Golden Gada in pure celebration!'
                          : 'Little Hanuman is giving you an encouraging smile! Read the solution below:'}
                      </p>
                    </div>

                    {/* Listen button for Hanuman's voice */}
                    <button
                      onClick={() => speakDialogue(dialogue, true)}
                      className="shrink-0 p-2.5 rounded-full bg-white hover:bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-sm cursor-pointer transition-all"
                      title="Hear Hanuman ji speak again"
                    >
                      <Volume2 className="w-5 h-5 text-amber-700" />
                    </button>
                  </div>

                  {/* Math Explanation Box */}
                  <div className="bg-amber-50 rounded-2xl p-3.5 mb-4 border border-amber-200 flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-amber-950 font-semibold leading-relaxed">
                      <span className="font-extrabold text-amber-800">Step-by-Step Solution: </span>
                      {currentQ.explanation}
                    </div>
                  </div>

                  {/* Next Question 3D Button */}
                  <button
                    onClick={handleNext}
                    className="w-full py-4 px-6 rounded-2xl font-black text-base uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 shadow-lg cursor-pointer btn-3d btn-3d-orange flex items-center justify-center gap-2"
                  >
                    <span>
                      {currentIndex < totalQuestions - 1 ? 'Next Question' : 'See Final Results'}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-1 text-xs font-bold text-amber-900/60">
        Math Magic Land · Powered by Animated Bal Hanuman ji & Web Speech
      </footer>
    </div>
  );
};
