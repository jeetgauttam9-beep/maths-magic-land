import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Sliders,
  X,
  Sparkles,
  Check,
  TreePine,
  Play,
  Square,
} from 'lucide-react';
import { forestMusic } from '../utils/forestMusic';
import { playSound, speakDialogue } from '../utils/audio';

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEffectsEnabled: boolean;
  onToggleSoundEffects: () => void;
  musicEnabled: boolean;
  onToggleMusic: () => void;
}

export const SoundSettingsModal: React.FC<SoundSettingsModalProps> = ({
  isOpen,
  onClose,
  soundEffectsEnabled,
  onToggleSoundEffects,
  musicEnabled,
  onToggleMusic,
}) => {
  const [volume, setVolume] = useState<number>(forestMusic.getVolume());
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(forestMusic.isPlaying());

  useEffect(() => {
    setIsPlayingMusic(musicEnabled);
    if (musicEnabled) {
      forestMusic.start();
    } else {
      forestMusic.stop();
    }
  }, [musicEnabled]);

  if (!isOpen) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    forestMusic.setVolume(newVol);
  };

  const handleTestVoice = () => {
    speakDialogue('Ram Ram dost! Yeh mera pyara Math Magic Land hai!', true);
  };

  const handleToggleMusicClick = () => {
    if (soundEffectsEnabled) playSound.click();
    onToggleMusic();
  };

  const handleToggleSFXClick = () => {
    playSound.click();
    onToggleSoundEffects();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-amber-50 via-white to-orange-50 border-4 border-amber-400 rounded-3xl p-6 sm:p-7 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer"
          title="Close Settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
              <span>Audio Controls</span>
            </div>
            <h3 className="text-xl font-black text-amber-950">
              Sound & Music Settings
            </h3>
          </div>
        </div>

        {/* Settings List */}
        <div className="space-y-4">
          {/* 1. Background Forest Melody Setting */}
          <div className="bg-white rounded-2xl p-4 border-2 border-emerald-300 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <TreePine className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <span>Forest Melody</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        musicEnabled
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {musicEnabled ? 'Playing' : 'Paused'}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Light, cheerful flute & kalimba background loop
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={handleToggleMusicClick}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  musicEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
                role="switch"
                aria-checked={musicEnabled}
                title="Toggle Forest Melody Loop"
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    musicEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Volume Slider */}
            {musicEnabled && (
              <div className="mt-3 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Melody Volume:</span>
                  </span>
                  <span className="text-emerald-700 font-mono">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* 2. Sound Effects (SFX) Setting */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">
                  Game Sound Effects (SFX)
                </div>
                <div className="text-[11px] font-semibold text-slate-500">
                  Gada spin, correct fanfare, star pings, and button clicks
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleSFXClick}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                soundEffectsEnabled ? 'bg-amber-500' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={soundEffectsEnabled}
              title="Toggle Sound Effects"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  soundEffectsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. Hanuman ji Voice (hi-IN) Preview */}
          <div className="bg-amber-100/70 rounded-2xl p-3.5 border border-amber-300 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span>Little Hanuman Voice (hi-IN)</span>
                <span className="bg-white/80 text-amber-900 text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
                  Natural Speech
                </span>
              </div>
              <div className="text-[11px] font-medium text-amber-900/80 mt-0.5">
                Spoken guidance & encouragement
              </div>
            </div>

            <button
              onClick={handleTestVoice}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-950 text-xs font-black border border-amber-300 shadow-2xs cursor-pointer flex items-center gap-1 shrink-0 transition-transform active:scale-95"
            >
              <Play className="w-3 h-3 text-orange-600 fill-orange-500" />
              <span>Test Voice</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-amber-200 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md cursor-pointer btn-3d btn-3d-orange"
          >
            Save & Continue (Khel Shuru!)
          </button>
        </div>
      </div>
    </div>
  );
};
