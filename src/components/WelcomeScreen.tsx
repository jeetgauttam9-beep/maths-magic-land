import React, { useState, useEffect } from 'react';
import { Grade } from '../types';
import { LittleHanuman } from './LittleHanuman';
import { SpeechBubble } from './SpeechBubble';
import { DownloadAppModal } from './DownloadAppModal';
import { SoundSettingsModal } from './SoundSettingsModal';
import { forestMusic } from '../utils/forestMusic';
import { playSound, speakDialogue } from '../utils/audio';
import { Sparkles, Trophy, Star, Volume2, VolumeX, ShieldCheck, ArrowRight, Download, Music, Sliders } from 'lucide-react';

interface WelcomeScreenProps {
  onSelectGrade: (grade: Grade) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectGrade,
  soundEnabled,
  onToggleSound,
  musicEnabled,
  onToggleMusic,
}) => {
  const [hoveredGrade, setHoveredGrade] = useState<Grade | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Initialize or synchronize background music on mount and state changes
  useEffect(() => {
    if (musicEnabled) {
      forestMusic.start();
    } else {
      forestMusic.stop();
    }
  }, [musicEnabled]);

  const handleGradePick = (grade: Grade) => {
    if (soundEnabled) playSound.click();
    if (musicEnabled && !forestMusic.isPlaying()) {
      forestMusic.start();
    }
    onSelectGrade(grade);
  };

  const gradeCards: {
    grade: Grade;
    title: string;
    subtitle: string;
    badge: string;
    topics: string[];
    colorClass: string;
    btnClass: string;
  }[] = [
    {
      grade: 1,
      title: 'Class 1',
      subtitle: 'Little Explorers',
      badge: 'Up to 100',
      topics: ['Numbers up to 100', 'Addition & Subtraction', 'Number Names in Words'],
      colorClass: 'from-amber-400 to-orange-400 border-amber-300',
      btnClass: 'btn-3d-amber bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950',
    },
    {
      grade: 2,
      title: 'Class 2',
      subtitle: 'Mighty Thinkers',
      badge: '50 to 500',
      topics: ['Carry-Forward Addition', 'Borrowing Subtraction', 'Place Value (H-T-O)'],
      colorClass: 'from-sky-400 to-blue-500 border-sky-300',
      btnClass: 'btn-3d-sky bg-gradient-to-b from-sky-400 to-blue-600 text-white',
    },
    {
      grade: 3,
      title: 'Class 3',
      subtitle: 'Math Champions',
      badge: 'Up to 1000',
      topics: ['All 4 Operations', 'Multiplication & Division', 'Fun Story Problems'],
      colorClass: 'from-emerald-400 to-teal-500 border-emerald-300',
      btnClass: 'btn-3d-emerald bg-gradient-to-b from-emerald-400 to-teal-600 text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-amber-100 flex flex-col justify-between relative overflow-hidden px-4 py-6 sm:px-8">
      {/* Decorative Cloud Backgrounds */}
      <div className="absolute top-8 left-4 sm:left-16 w-44 sm:w-64 h-20 bg-white/70 rounded-full blur-sm animate-cloud-drift pointer-events-none" />
      <div className="absolute top-36 right-4 sm:right-20 w-52 sm:w-80 h-24 bg-white/60 rounded-full blur-sm animate-cloud-drift pointer-events-none" style={{ animationDelay: '4s' }} />
      <div className="absolute -bottom-12 left-1/3 w-96 h-36 bg-amber-200/40 rounded-full blur-xl pointer-events-none" />

      {/* Top Bar with Brand & Sound Controls */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-amber-300 shadow-md flex items-center justify-center text-amber-950 font-black text-xl">
            ॐ
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-950 flex items-center gap-1.5">
              Math Magic Land
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            </h1>
            <p className="text-xs text-amber-900/80 font-semibold">
              With Little Hanuman ji (Classes 1 - 3)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-amber-950 text-xs font-black shadow-sm border border-amber-300 transition-all cursor-pointer btn-3d"
            title="Download or Install Bal Hanuman Math Game to your device"
          >
            <Download className="w-3.5 h-3.5 text-amber-950" />
            <span>Download App</span>
          </button>

          {/* Quick Forest Melody Toggle */}
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black shadow-sm border transition-all cursor-pointer ${
              musicEnabled
                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-emerald-300'
                : 'bg-white/80 hover:bg-white text-slate-500 border-slate-200'
            }`}
            title={musicEnabled ? 'Forest Melody is ON (Click to Pause)' : 'Forest Melody is OFF (Click to Play)'}
          >
            <Music className={`w-3.5 h-3.5 ${musicEnabled ? 'text-emerald-600 animate-bounce' : 'text-slate-400'}`} />
            <span className="hidden md:inline">{musicEnabled ? 'Forest Melody' : 'Melody Off'}</span>
          </button>

          {/* Quick Sound Effects Toggle */}
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-amber-950 text-xs font-bold shadow-sm border border-amber-200 transition-all cursor-pointer"
            title="Toggle Sound Effects & Voice"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Audio Settings Modal Button */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-amber-950 border border-amber-200 transition-all cursor-pointer shadow-2xs"
            title="Sound & Music Settings"
          >
            <Sliders className="w-4 h-4 text-amber-800" />
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

      {/* Center Hero: Little Hanuman + Hinglish Welcome Speech */}
      <main className="relative z-10 max-w-4xl mx-auto w-full my-auto py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Animated Bal Hanuman Mascot */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div
              className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              onClick={() => {
                if (soundEnabled) {
                  speakDialogue('Ram Ram bacche! Chalo mere sath Math Magic Land ki yatra par!', true);
                }
              }}
              title="Tap to hear Little Hanuman speak in Hindi/Hinglish"
            >
              <LittleHanuman
                emotion={hoveredGrade ? 'bounce' : 'idle'}
                size="lg"
              />
            </div>
            <button
              onClick={() => {
                if (soundEnabled) {
                  speakDialogue('Ram Ram bacche! Chalo mere sath Math Magic Land ki yatra par!', true);
                }
              }}
              className="mt-2 flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1 rounded-full shadow-2xs cursor-pointer transition-all"
            >
              <Volume2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Tap Hanuman: Hear 'hi-IN' Voice</span>
            </button>
          </div>

          {/* Speech Bubble & Welcome Callout */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <SpeechBubble
              speakerName="Little Hanuman ji"
              dialogue="Ram Ram bacche! Chalo mere sath Math Magic Land ki yatra par!"
              subtext="Choose your class below to begin our magical 5-question math adventure!"
              soundEnabled={soundEnabled}
            />

            <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border-2 border-amber-200/80 shadow-md">
              <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Play & Learn Rules:</span>
              </div>
              <ul className="text-xs sm:text-sm text-amber-950/80 space-y-1 font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  5 fun multiple-choice math challenges per session
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Earn up to 3 Golden Stars and see Hanuman ji spin his Gada!
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Helpful visual aids for counting, borrowing, and carrying
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Grade Selection Dashboard */}
        <section className="mt-8">
          <div className="text-center mb-5">
            <span className="inline-block px-4 py-1 rounded-full bg-amber-200/80 text-amber-900 font-black text-xs uppercase tracking-wider mb-1">
              Step 1: Choose Your Class
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
              Select Your Grade to Play
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {gradeCards.map((card) => (
              <div
                key={card.grade}
                onMouseEnter={() => setHoveredGrade(card.grade)}
                onMouseLeave={() => setHoveredGrade(null)}
                className={`bg-white rounded-3xl p-5 sm:p-6 border-3 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between text-left group hover:-translate-y-1 ${
                  card.grade === 1
                    ? 'border-amber-400 hover:border-amber-500'
                    : card.grade === 2
                    ? 'border-sky-400 hover:border-sky-500'
                    : 'border-emerald-400 hover:border-emerald-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        card.grade === 1
                          ? 'bg-amber-100 text-amber-800'
                          : card.grade === 2
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {card.badge}
                    </span>
                    <span className="text-lg">
                      {card.grade === 1 ? '🌟' : card.grade === 2 ? '⚡' : '🏆'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 mb-4">
                    {card.subtitle}
                  </p>

                  <div className="space-y-2 mb-6">
                    {card.topics.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleGradePick(card.grade)}
                  className={`w-full py-3 px-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer btn-3d ${card.btnClass}`}
                >
                  <span>Start {card.title}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer reassurance */}
      <footer className="relative z-10 text-center py-2 text-xs font-semibold text-amber-900/70">
        Jai Bajrangbali · Safe, joyful, and curriculum-aligned mathematics for young learners
      </footer>
    </div>
  );
};
