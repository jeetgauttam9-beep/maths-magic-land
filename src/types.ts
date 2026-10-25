export type Grade = 1 | 2 | 3;

export type GameState = 'WELCOME' | 'PLAYING' | 'SUMMARY';

export type QuestionType =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'number-name'
  | 'before-after'
  | 'word-problem';

export type HanumanEmotion =
  | 'idle'
  | 'happy'
  | 'bounce'
  | 'gada-spin'
  | 'encouraging'
  | 'victory';

export interface Question {
  id: string;
  grade: Grade;
  type: QuestionType;
  prompt: string; // In English as required
  subPrompt?: string;
  operand1?: number;
  operand2?: number;
  operator?: string;
  correctAnswer: string | number;
  options: (string | number)[];
  explanation: string; // In English
  visualData?: {
    type: 'laddoos' | 'place-value' | 'groups';
    num1?: number;
    num2?: number;
    operator?: string;
    hasBorrow?: boolean;
    hasCarry?: boolean;
    groupCount?: number;
    itemsPerGroup?: number;
  };
}

export interface QuestionAttempt {
  question: Question;
  selectedAnswer: string | number | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
}
