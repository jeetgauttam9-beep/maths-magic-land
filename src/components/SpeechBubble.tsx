import React, { useState } from 'react';
import { Volume2, Sparkles, VolumeX } from 'lucide-react';
import { speakDialogue } from '../utils/audio';

interface SpeechBubbleProps {
  dialogue: string;
  subtext?: string;
  speakerName?: string;
  soundEnabled?: boolean;
  className?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  dialogue,
  subtext,
  speakerName = 'Little Hanuman ji',
  soundEnabled = true,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!soundEnabled) return;

    speakDialogue(
      dialogue,
      true,
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );
  };

  return (
    <div
      className={`relative bg-gradient-to-br from-amber-50 via-white to-orange-50 border-3 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-lg shadow-orange-500/10 transition-all duration-300 ${className}`}
    >
      {/* Cartoon Speech Tail pointing left/down towards Hanuman ji */}
      <div className="absolute -left-3 top-8 w-0 h-0 border-t-[10px] border-t-transparent border-r-[14px] border-r-amber-400 border-b-[10px] border-b-transparent" />
      <div className="absolute -left-2 top-8 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-amber-50 border-b-[8px] border-b-transparent" />

      {/* Header bar with Hanuman's name tag, hi-IN locale badge, and voice speak button */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-orange-500 animate-pulse'
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 inline" />
            {speakerName}
          </span>
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-200/80 text-amber-900 border border-amber-300/80">
            hi-IN Voice
          </span>
        </div>

        <button
          onClick={handleSpeak}
          title="Listen to Hanuman ji in natural Hindi/Hinglish (hi-IN)"
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
            isPlaying
              ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300 animate-pulse'
              : soundEnabled
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 shadow-2xs'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
          aria-label="Listen to voice"
        >
          {isPlaying ? (
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
          ) : soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-amber-800" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{isPlaying ? 'Bolo Hanuman!' : 'Listen Voice'}</span>
        </button>
      </div>

      {/* Main Hinglish Dialogue in English script */}
      <p className="text-base sm:text-lg font-black text-amber-950 leading-snug tracking-tight">
        "{dialogue}"
      </p>

      {/* Subtext in English if applicable */}
      {subtext && (
        <p className="mt-1 text-xs sm:text-sm text-amber-800/80 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
};
