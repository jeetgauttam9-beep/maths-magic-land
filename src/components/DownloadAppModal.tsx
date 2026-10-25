import React, { useState } from 'react';
import {
  Download,
  X,
  Smartphone,
  Laptop,
  Code2,
  CheckCircle2,
  Share,
  PlusSquare,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { playSound, speakDialogue } from '../utils/audio';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop' | 'source'>('mobile');

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (soundEnabled) playSound.click();
    const success = await install();
    if (success) {
      speakDialogue('Waah! Bal Hanuman Math App download ho gaya! Jai Bajrangbali!', soundEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-amber-50 via-white to-orange-50 border-4 border-amber-400 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer z-10"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md text-2xl font-black shrink-0">
            📲
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
              <span>Free App Download · Offline Ready</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-amber-950">
              Download Bal Hanuman Math Game
            </h3>
          </div>
        </div>

        {/* Hanuman Voice Tip */}
        <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-3 mb-4 flex items-center gap-2.5">
          <span className="text-2xl select-none">🐒</span>
          <p className="text-xs sm:text-sm font-bold text-amber-950 leading-snug">
            "Ise apne phone ya computer par download kar lo! Phir bina browser khole, ek tap me direct khel sakte ho!"
          </p>
        </div>

        {/* Quick One-Tap Install Action if browser supports it */}
        {isInstallable && !isInstalled && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md text-center">
            <h4 className="text-base font-black mb-1">
              ✨ One-Click Install Available on This Device!
            </h4>
            <p className="text-xs text-emerald-100 font-semibold mb-3">
              Tap the button below to add Bal Hanuman directly to your home screen or desktop.
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-6 rounded-xl font-black text-sm uppercase tracking-wider bg-white text-emerald-950 hover:bg-emerald-50 shadow-md cursor-pointer transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Install to My Device Now</span>
            </button>
          </div>
        )}

        {isInstalled && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>App is already installed and ready on your home screen or desktop!</span>
          </div>
        )}

        {/* Device Guide Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-amber-100/80 rounded-2xl mb-4">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'mobile'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile (Phone/Tablet)</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'desktop'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>PC / Mac / Laptop</span>
          </button>

          <button
            onClick={() => setActiveTab('source')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'source'
                ? 'bg-white text-amber-950 shadow-xs'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Source Code (ZIP)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-3 text-xs sm:text-sm text-slate-700">
          {activeTab === 'mobile' && (
            <div className="space-y-3">
              {/* Android Instructions */}
              <div className="p-3.5 rounded-2xl bg-white border border-amber-200">
                <div className="font-black text-amber-950 mb-1 flex items-center gap-1.5">
                  <span>📱 For Android (Chrome / Samsung Internet):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 font-semibold text-slate-600">
                  <li>Tap the <strong>three dots menu (⋮)</strong> at the top right of Chrome.</li>
                  <li>Select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>Install</strong> to add the Bal Hanuman icon to your apps!</li>
                </ol>
              </div>

              {/* iPhone / iPad Instructions */}
              <div className="p-3.5 rounded-2xl bg-white border border-amber-200">
                <div className="font-black text-amber-950 mb-1 flex items-center gap-1.5">
                  <span>🍎 For iPhone / iPad (Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 font-semibold text-slate-600">
                  <li className="flex items-center gap-1">
                    <span>1. Tap the</span>
                    <Share className="w-3.5 h-3.5 text-blue-600 inline" />
                    <span><strong>Share</strong> button at the bottom toolbar.</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span>2. Scroll down and tap</span>
                    <PlusSquare className="w-3.5 h-3.5 text-slate-800 inline" />
                    <span><strong>"Add to Home Screen"</strong>.</span>
                  </li>
                  <li>3. Tap <strong>Add</strong> in the top right corner!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'desktop' && (
            <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-2">
              <div className="font-black text-amber-950 text-sm">
                💻 For Google Chrome / Microsoft Edge on PC, Mac, or Chromebook:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 font-semibold text-slate-600">
                <li>
                  Look at the <strong>address bar (URL bar)</strong> at the top right of your browser.
                </li>
                <li>
                  Click the <strong>computer/install icon</strong> (or click the three dots ⋮ → <em>"Save and share"</em> → <em>"Install Bal Hanuman Math Magic Land"</em>).
                </li>
                <li>
                  Click <strong>Install</strong>. The game will launch in a dedicated clean window with a desktop shortcut!
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'source' && (
            <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-2.5">
              <div className="font-black text-amber-950 text-sm">
                📦 How to Download Full Source Code from Google AI Studio:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 font-semibold text-slate-600">
                <li>
                  In the top-right toolbar of the AI Studio window, click the <strong>Export / Code</strong> button (or GitHub icon).
                </li>
                <li>
                  Click <strong>"Download ZIP"</strong> to save all project files to your computer.
                </li>
                <li>
                  Extract the ZIP file and run:
                  <div className="bg-slate-900 text-amber-300 font-mono text-xs p-2.5 rounded-xl my-1.5">
                    npm install<br />
                    npm run dev
                  </div>
                </li>
                <li>Open <strong>http://localhost:3000</strong> in your browser to run it locally!</li>
              </ol>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-amber-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider text-amber-950 bg-amber-200 hover:bg-amber-300 transition-colors cursor-pointer"
          >
            Got it (Samajh Gaya!)
          </button>
        </div>
      </div>
    </div>
  );
};
