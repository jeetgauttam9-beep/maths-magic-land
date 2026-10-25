import React from 'react';
import { Sparkles, X, Volume2, Lightbulb, Loader2 } from 'lucide-react';
import { speakDialogue } from '../utils/audio';

interface GeminiHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  hintData: {
    dialogue: string;
    tip: string;
  } | null;
  soundEnabled: boolean;
}

export const GeminiHintModal: React.FC<GeminiHintModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  hintData,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const handleSpeak = () => {
    if (hintData?.dialogue) {
      speakDialogue(hintData.dialogue, true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 via-white to-orange-50 border-4 border-amber-400 rounded-3xl p-6 sm:p-7 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer"
          title="Close Hint"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
              <span>Gemini AI Math Buddy</span>
            </div>
            <h3 className="text-xl font-black text-amber-950">
              Little Hanuman's Clue
            </h3>
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <p className="text-sm font-bold text-amber-900">
              Little Hanuman is thinking of a fun clue for you...
            </p>
            <p className="text-xs text-amber-700/80">
              "Ruko dost, main abhi samjhata hoon!"
            </p>
          </div>
        ) : hintData ? (
          <div className="space-y-4">
            {/* Spoken Hinglish Dialogue Bubble */}
            <div className="bg-amber-100/70 border-2 border-amber-300 rounded-2xl p-4 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
                  Bal Hanuman says:
                </span>
                <button
                  onClick={handleSpeak}
                  className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-white/80 hover:bg-white px-2 py-0.5 rounded-full border border-amber-200 cursor-pointer shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                  <span>Listen Voice</span>
                </button>
              </div>
              <p className="text-base sm:text-lg font-bold text-amber-950 leading-relaxed">
                "{hintData.dialogue}"
              </p>
            </div>

            {/* Step Clue */}
            {hintData.tip && (
              <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs">
                <div className="text-xs font-extrabold uppercase tracking-wide text-amber-800 mb-1">
                  💡 How to Solve:
                </div>
                <p className="text-sm text-slate-700 font-semibold leading-relaxed">
                  {hintData.tip}
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md cursor-pointer btn-3d btn-3d-orange"
            >
              Samajh Gaya! (I Got It!)
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
