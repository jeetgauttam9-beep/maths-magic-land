import React from 'react';
import { HanumanEmotion } from '../types';

interface LittleHanumanProps {
  emotion: HanumanEmotion;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const LittleHanuman: React.FC<LittleHanumanProps> = ({
  emotion,
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-32 h-36',
    md: 'w-48 h-56 sm:w-56 sm:h-64',
    lg: 'w-60 h-72 sm:w-72 sm:h-84',
  }[size];

  // Dynamic animation classes based on emotion
  const getContainerAnimation = () => {
    switch (emotion) {
      case 'gada-spin':
      case 'bounce':
      case 'happy':
      case 'victory':
        return 'animate-hanuman-jump';
      case 'encouraging':
        return 'animate-gentle-nod';
      case 'idle':
      default:
        return 'animate-float-slow';
    }
  };

  const isGadaSpinning = emotion === 'gada-spin' || emotion === 'bounce' || emotion === 'victory';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses} ${className}`}
      title="Little Hanuman ji (Bal Hanuman)"
    >
      {/* Radiant Golden Divine Aura */}
      <div
        className={`absolute inset-0 m-auto w-4/5 h-4/5 rounded-full pointer-events-none transition-all duration-700 ${
          emotion === 'victory' || emotion === 'gada-spin'
            ? 'scale-130 bg-gradient-to-r from-amber-300/70 via-yellow-200/90 to-orange-400/70 blur-xl animate-sunburst-spin'
            : 'bg-gradient-to-r from-amber-300/40 via-yellow-200/50 to-orange-400/35 blur-lg animate-pulse-aura'
        }`}
      />

      {/* Floating Divine Sparkles and Golden Laddoos on Answer Reaction */}
      {(emotion === 'bounce' || emotion === 'victory' || emotion === 'gada-spin') && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <span className="absolute top-2 left-4 text-amber-300 text-lg animate-ping">✦</span>
          <span className="absolute top-6 right-6 text-yellow-400 text-base animate-ping delay-150">★</span>
          <span className="absolute bottom-16 left-2 text-amber-400 text-sm animate-ping delay-300">✦</span>
          <span className="absolute top-12 left-1/2 text-yellow-300 text-xs animate-ping delay-75">✨</span>
          {/* Celebratory floating golden laddoos popping up */}
          <span className="absolute -top-4 left-4 text-xl select-none animate-laddoo-pop">🟡</span>
          <span className="absolute -top-6 right-6 text-2xl select-none animate-laddoo-pop" style={{ animationDelay: '0.2s' }}>🟡</span>
          <span className="absolute top-8 -right-4 text-lg select-none animate-laddoo-pop" style={{ animationDelay: '0.4s' }}>✨</span>
        </div>
      )}

      {/* SVG Cartoon Character of Little Hanuman ji */}
      <svg
        viewBox="0 0 240 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-xl ${getContainerAnimation()}`}
      >
        <defs>
          {/* Gold Gradients */}
          <linearGradient id="goldCrown" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          <linearGradient id="goldGada" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#FACC15" />
            <stop offset="80%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>

          {/* Skin Gradients - Warm Golden Apricot/Peach */}
          <linearGradient id="hanumanSkin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBD5A5" />
            <stop offset="70%" stopColor="#ECA767" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Saffron Pitambar / Dhoti */}
          <linearGradient id="saffronDhoti" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>

          {/* Cloud Gradient */}
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Ruby Gem Gradient */}
          <linearGradient id="rubyGem" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="50%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
        </defs>

        {/* 1. Fluffy White Cloud Base */}
        <g className="opacity-95">
          <ellipse cx="120" cy="245" rx="72" ry="20" fill="url(#cloudGrad)" />
          <ellipse cx="78" cy="242" rx="36" ry="17" fill="url(#cloudGrad)" />
          <ellipse cx="162" cy="242" rx="36" ry="17" fill="url(#cloudGrad)" />
          <ellipse cx="120" cy="235" rx="46" ry="16" fill="#FFFFFF" />
          {/* Cloud highlight */}
          <path
            d="M 60 240 Q 120 226 180 240"
            stroke="#E2E8F0"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* 2. Cheerful Curled Monkey Tail */}
        <path
          d="M 85 200 C 50 200 20 180 30 140 C 36 112 60 115 62 125 C 64 135 48 140 45 152 C 42 166 60 184 88 185"
          stroke="#ECA767"
          strokeWidth="11"
          strokeLinecap="round"
          className="transition-transform duration-500 origin-bottom-right"
          style={{
            transform: emotion === 'bounce' ? 'rotate(-6deg)' : 'rotate(0deg)',
          }}
        />

        {/* 3. Little Hanuman's Body & Saffron Pitambar (Dhoti) */}
        <g id="body">
          {/* Torso */}
          <ellipse cx="120" cy="180" rx="34" ry="32" fill="url(#hanumanSkin)" />

          {/* Saffron Dhoti */}
          <path
            d="M 90 185 Q 120 178 150 185 L 148 220 Q 120 228 92 220 Z"
            fill="url(#saffronDhoti)"
          />

          {/* Golden Waistband / Belt (Kamarbandh) */}
          <path
            d="M 88 184 Q 120 180 152 184"
            stroke="url(#goldCrown)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Golden belt buckle gem */}
          <circle cx="120" cy="183" r="4.5" fill="url(#rubyGem)" stroke="#FDE047" strokeWidth="1" />

          {/* Small cute feet resting on cloud */}
          <ellipse cx="102" cy="226" rx="11" ry="8" fill="url(#hanumanSkin)" />
          <ellipse cx="138" cy="226" rx="11" ry="8" fill="url(#hanumanSkin)" />
        </g>

        {/* 4. Golden Necklace (Haar) */}
        <path
          d="M 103 162 Q 120 174 137 162"
          stroke="url(#goldCrown)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="120" cy="170" r="3.5" fill="url(#rubyGem)" />

        {/* 5. Cute Face & Head */}
        <g id="head">
          {/* Ears with Golden Kundal (earrings) */}
          <g id="ears">
            {/* Left Ear */}
            <circle cx="76" cy="126" r="14" fill="url(#hanumanSkin)" />
            <circle cx="76" cy="126" r="8" fill="#F87171" opacity="0.4" />
            {/* Left Golden Kundal */}
            <circle cx="72" cy="138" r="5" fill="url(#goldCrown)" stroke="#CA8A04" strokeWidth="1" />
            <circle cx="72" cy="144" r="2.5" fill="url(#rubyGem)" />

            {/* Right Ear */}
            <circle cx="164" cy="126" r="14" fill="url(#hanumanSkin)" />
            <circle cx="164" cy="126" r="8" fill="#F87171" opacity="0.4" />
            {/* Right Golden Kundal */}
            <circle cx="168" cy="138" r="5" fill="url(#goldCrown)" stroke="#CA8A04" strokeWidth="1" />
            <circle cx="168" cy="144" r="2.5" fill="url(#rubyGem)" />
          </g>

          {/* Main Face Shape */}
          <circle cx="120" cy="124" r="46" fill="url(#hanumanSkin)" />

          {/* Chubby Rosy Cheek Monkey Snout */}
          <ellipse cx="120" cy="138" rx="28" ry="20" fill="#FDE68A" opacity="0.9" />

          {/* Rosy Cheeks */}
          <circle cx="95" cy="134" r="8" fill="#FB7185" opacity="0.55" />
          <circle cx="145" cy="134" r="8" fill="#FB7185" opacity="0.55" />

          {/* Sacred Tilak on Forehead */}
          <path
            d="M 115 86 C 115 106 120 114 120 114 C 120 114 125 106 125 86"
            stroke="#DC2626"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Yellow Chandan line */}
          <path
            d="M 113 86 C 113 108 120 116 120 116 C 120 116 127 108 127 86"
            stroke="#FBBF24"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Central Sacred Red Bindi */}
          <circle cx="120" cy="100" r="2.5" fill="#DC2626" />

          {/* Expressive Eyes */}
          {emotion === 'happy' || emotion === 'bounce' || emotion === 'victory' ? (
            // Joyful crinkled smile eyes
            <g>
              <path
                d="M 97 116 Q 106 106 114 116"
                stroke="#451A03"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 126 116 Q 134 106 143 116"
                stroke="#451A03"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : emotion === 'encouraging' ? (
            // Reassuring gentle eyes
            <g>
              <ellipse cx="106" cy="116" rx="6.5" ry="7.5" fill="#451A03" />
              <circle cx="108" cy="114" r="2.5" fill="#FFFFFF" />
              <ellipse cx="134" cy="116" rx="6.5" ry="7.5" fill="#451A03" />
              <circle cx="136" cy="114" r="2.5" fill="#FFFFFF" />
              {/* Gentle caring eyebrows */}
              <path d="M 98 106 Q 106 102 114 107" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 126 107 Q 134 102 142 106" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            // Big bright cheerful cartoon eyes
            <g>
              <ellipse cx="106" cy="116" rx="7" ry="8" fill="#451A03" />
              <circle cx="104" cy="114" r="3" fill="#FFFFFF" />
              <circle cx="108" cy="119" r="1.5" fill="#FFFFFF" />

              <ellipse cx="134" cy="116" rx="7" ry="8" fill="#451A03" />
              <circle cx="132" cy="114" r="3" fill="#FFFFFF" />
              <circle cx="136" cy="119" r="1.5" fill="#FFFFFF" />

              {/* Eyebrows */}
              <path d="M 98 105 Q 106 101 113 105" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M 127 105 Q 134 101 142 105" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Cute Little Nose */}
          <path
            d="M 117 127 Q 120 125 123 127"
            stroke="#92400E"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheerful Mouth */}
          {emotion === 'happy' || emotion === 'bounce' || emotion === 'victory' ? (
            // Big open happy smile showing joy
            <g>
              <path
                d="M 108 136 Q 120 152 132 136 Z"
                fill="#DC2626"
                stroke="#991B1B"
                strokeWidth="1.5"
              />
              <path
                d="M 112 142 Q 120 148 128 142"
                fill="#FDA4AF"
              />
            </g>
          ) : (
            // Cute wide friendly smile
            <path
              d="M 110 137 Q 120 147 130 137"
              stroke="#78350F"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>

        {/* 6. Divine Golden Mukut (Crown) */}
        <g id="crown">
          {/* Main Crown Base */}
          <path
            d="M 85 88 Q 120 80 155 88 L 158 72 L 140 76 L 120 48 L 100 76 L 82 72 Z"
            fill="url(#goldCrown)"
            stroke="#B45309"
            strokeWidth="1.5"
          />
          {/* Crown Filigree & Jewel */}
          <circle cx="120" cy="68" r="6" fill="url(#rubyGem)" stroke="#FEF08A" strokeWidth="1.5" />
          <circle cx="98" cy="76" r="3.5" fill="url(#rubyGem)" />
          <circle cx="142" cy="76" r="3.5" fill="url(#rubyGem)" />
          {/* Crown Top Crest / Peacock feather touch */}
          <path
            d="M 120 48 Q 120 34 125 28 Q 130 35 120 48"
            fill="#059669"
            stroke="#FDE047"
            strokeWidth="1"
          />
          <circle cx="123" cy="35" r="2.5" fill="#3B82F6" />
        </g>

        {/* 7. Golden Gada (Mace) */}
        <g
          id="gada"
          className={
            isGadaSpinning
              ? 'animate-gada-spin-fast origin-[185px_155px]'
              : 'transition-transform duration-300'
          }
          style={{
            transform: emotion === 'victory' ? 'rotate(-15deg) translate(0px, -10px)' : undefined,
          }}
        >
          {/* Gada Handle */}
          <line
            x1="165"
            y1="210"
            x2="195"
            y2="125"
            stroke="url(#goldCrown)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Gada Base Ring */}
          <circle cx="163" cy="214" r="5" fill="url(#goldGada)" stroke="#92400E" strokeWidth="1" />

          {/* Gada Spherical Head */}
          <circle
            cx="195"
            cy="125"
            r="19"
            fill="url(#goldGada)"
            stroke="#92400E"
            strokeWidth="1.5"
          />
          {/* Gada Decorative Ridges */}
          <ellipse cx="195" cy="125" rx="19" ry="7" fill="none" stroke="#CA8A04" strokeWidth="2" />
          <ellipse cx="195" cy="125" rx="8" ry="19" fill="none" stroke="#CA8A04" strokeWidth="2" />
          {/* Top Spike & Ruby of Gada */}
          <path d="M 191 106 L 195 96 L 199 106 Z" fill="url(#goldCrown)" stroke="#92400E" strokeWidth="1" />
          <circle cx="195" cy="125" r="5" fill="url(#rubyGem)" stroke="#FEF08A" strokeWidth="1" />
        </g>

        {/* 8. Little Hanuman's Right Hand holding Gada */}
        <ellipse cx="172" cy="180" rx="9" ry="8" fill="url(#hanumanSkin)" />
        {/* Left hand making welcoming / victory gesture */}
        {emotion === 'victory' ? (
          <ellipse cx="70" cy="140" rx="8" ry="9" fill="url(#hanumanSkin)" />
        ) : (
          <ellipse cx="72" cy="175" rx="9" ry="8" fill="url(#hanumanSkin)" />
        )}
      </svg>
    </div>
  );
};
