import React from 'react';
import { Question } from '../types';

interface MathVisualAidProps {
  question: Question;
}

export const MathVisualAid: React.FC<MathVisualAidProps> = ({ question }) => {
  const { visualData, type, operand1, operand2, operator } = question;

  if (!visualData && !operand1 && !operand2) return null;

  // 1. Place Value Grid for Class 2 & 3 (H-T-O alignment with Carry / Borrow markers)
  if (visualData?.type === 'place-value' && operand1 !== undefined && operand2 !== undefined) {
    const isAddition = operator === '+';
    const isSubtraction = operator === '-';

    // Digits
    const num1Str = operand1.toString().padStart(3, ' ');
    const num2Str = operand2.toString().padStart(3, ' ');

    return (
      <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl p-3 my-3 max-w-xs mx-auto">
        <div className="text-[11px] font-bold text-amber-900/80 uppercase tracking-wider text-center mb-1">
          Place Value Helper (Hundreds · Tens · Ones)
        </div>

        <div className="font-mono text-center inline-block w-full">
          {/* Header Row: H, T, O */}
          <div className="grid grid-cols-4 gap-1 text-xs font-black text-amber-800 border-b border-amber-300 pb-1">
            <span className="text-slate-400">Op</span>
            <span className="bg-amber-100 rounded">H</span>
            <span className="bg-amber-100 rounded">T</span>
            <span className="bg-amber-100 rounded">O</span>
          </div>

          {/* Carry / Borrow Hint Indicators */}
          <div className="grid grid-cols-4 gap-1 text-[10px] py-0.5 text-orange-600 font-bold">
            <span></span>
            <span>{visualData.hasCarry ? '↑' : visualData.hasBorrow ? '←' : ''}</span>
            <span className="bg-orange-100/80 rounded px-1">
              {visualData.hasCarry ? 'Carry 1' : visualData.hasBorrow ? 'Borrow' : ''}
            </span>
            <span></span>
          </div>

          {/* First Number */}
          <div className="grid grid-cols-4 gap-1 text-base font-bold text-slate-800 py-1">
            <span className="text-amber-600 font-extrabold">{operator}</span>
            <span>{num1Str[0] === ' ' ? '-' : num1Str[0]}</span>
            <span>{num1Str[1] === ' ' ? '-' : num1Str[1]}</span>
            <span>{num1Str[2]}</span>
          </div>

          {/* Second Number */}
          <div className="grid grid-cols-4 gap-1 text-base font-bold text-slate-800 py-1 border-b-2 border-amber-400">
            <span></span>
            <span>{num2Str[0] === ' ' ? '-' : num2Str[0]}</span>
            <span>{num2Str[1] === ' ' ? '-' : num2Str[1]}</span>
            <span>{num2Str[2]}</span>
          </div>
        </div>

        <div className="text-[11px] text-center text-amber-800 font-semibold mt-1">
          {isAddition && visualData.hasCarry && '★ Tip: Add ones first, carry over 1 to tens column!'}
          {isSubtraction && visualData.hasBorrow && '★ Tip: Borrow 1 ten from tens column to subtract ones!'}
        </div>
      </div>
    );
  }

  // 2. Cute Laddoo Counters for Class 1 (if small numbers)
  if (visualData?.type === 'laddoos' && operand1 !== undefined && operand2 !== undefined && operand1 <= 20) {
    return (
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 my-2 text-center max-w-sm mx-auto">
        <div className="text-xs font-bold text-amber-800 mb-1.5 flex items-center justify-center gap-1">
          <span>🟡 Hanuman ji's Golden Laddoos Counter:</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Group 1 */}
          <div className="flex flex-wrap items-center justify-center gap-1 max-w-[130px] p-1.5 bg-amber-100/70 rounded-xl border border-amber-200">
            {Array.from({ length: Math.min(operand1, 15) }).map((_, i) => (
              <span key={i} title="Laddoo" className="text-sm select-none">
                🟡
              </span>
            ))}
            <span className="text-[11px] font-bold text-amber-900 ml-1">({operand1})</span>
          </div>

          <span className="text-base font-black text-amber-700">{operator}</span>

          {/* Group 2 */}
          <div className="flex flex-wrap items-center justify-center gap-1 max-w-[130px] p-1.5 bg-amber-100/70 rounded-xl border border-amber-200">
            {Array.from({ length: Math.min(operand2, 15) }).map((_, i) => (
              <span key={i} title="Laddoo" className="text-sm select-none">
                🟡
              </span>
            ))}
            <span className="text-[11px] font-bold text-amber-900 ml-1">({operand2})</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Multiplication equal groups visualizer for Class 3
  if (visualData?.type === 'groups' && visualData.groupCount && visualData.itemsPerGroup) {
    const groups = Math.min(visualData.groupCount, 6);
    return (
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-2.5 my-2 text-center max-w-sm mx-auto">
        <div className="text-[11px] font-bold text-emerald-800 mb-1">
          Visual Clue: {groups} Equal Groups of {visualData.itemsPerGroup}
        </div>
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: groups }).map((_, i) => (
            <div
              key={i}
              className="px-2 py-1 bg-white border border-emerald-300 rounded-lg shadow-2xs text-xs font-bold text-emerald-900"
            >
              [{visualData.itemsPerGroup}]
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
