import { Grade, Question } from '../types';

const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 20) return ONES[num];
  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return ones === 0 ? TENS[tens] : `${TENS[tens]}-${ONES[ones]}`;
  }
  if (num < 1000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    if (remainder === 0) return `${ONES[hundreds]} Hundred`;
    return `${ONES[hundreds]} Hundred and ${numberToWords(remainder)}`;
  }
  return num.toString();
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateNumericDistractors(correctVal: number, minBound = 0, count = 3): number[] {
  const distractors = new Set<number>();
  const offsets = [1, -1, 10, -10, 2, -2, 5, -5, 20, -20];
  const shuffledOffsets = shuffle(offsets);

  for (const off of shuffledOffsets) {
    const candidate = correctVal + off;
    if (candidate !== correctVal && candidate >= minBound) {
      distractors.add(candidate);
      if (distractors.size === count) break;
    }
  }

  // Fallback random if needed
  while (distractors.size < count) {
    const candidate = Math.max(minBound, correctVal + randomInt(-15, 15));
    if (candidate !== correctVal) {
      distractors.add(candidate);
    }
  }

  return Array.from(distractors);
}

// -------------------------------------------------------------
// CLASS 1 GENERATORS
// 1 or 2-digit numbers strictly under 100.
// Number Names questions.
// -------------------------------------------------------------

function generateClass1Addition(): Question {
  // Operands and result strictly under 100
  const a = randomInt(3, 45);
  const maxB = 99 - a;
  const b = randomInt(2, Math.min(45, maxB));
  const sum = a + b;

  const distractors = generateNumericDistractors(sum, 1, 3);
  const options = shuffle([sum, ...distractors]);

  return {
    id: `c1-add-${Date.now()}-${randomInt(100, 999)}`,
    grade: 1,
    type: 'addition',
    prompt: `Add: ${a} + ${b} = ?`,
    subPrompt: 'Count carefully to find the total sum!',
    operand1: a,
    operand2: b,
    operator: '+',
    correctAnswer: sum,
    options,
    explanation: `When we add ${a} and ${b}, we get ${sum}.`,
    visualData: {
      type: 'laddoos',
      num1: a,
      num2: b,
      operator: '+',
    },
  };
}

function generateClass1Subtraction(): Question {
  // Operands and result strictly under 100
  const a = randomInt(10, 80);
  const b = randomInt(2, a - 1);
  const diff = a - b;

  const distractors = generateNumericDistractors(diff, 1, 3);
  const options = shuffle([diff, ...distractors]);

  return {
    id: `c1-sub-${Date.now()}-${randomInt(100, 999)}`,
    grade: 1,
    type: 'subtraction',
    prompt: `Subtract: ${a} - ${b} = ?`,
    subPrompt: 'Take away the smaller number to find what remains!',
    operand1: a,
    operand2: b,
    operator: '-',
    correctAnswer: diff,
    options,
    explanation: `Taking ${b} away from ${a} leaves ${diff}.`,
    visualData: {
      type: 'laddoos',
      num1: a,
      num2: b,
      operator: '-',
    },
  };
}

function generateClass1NumberName(): Question {
  const isNameToDigits = Math.random() > 0.5;
  const num = randomInt(12, 95);
  const word = numberToWords(num);

  if (isNameToDigits) {
    // Prompt: Write number in digits
    const distractors = generateNumericDistractors(num, 1, 3);
    const options = shuffle([num, ...distractors]);
    return {
      id: `c1-name-d-${Date.now()}-${randomInt(100, 999)}`,
      grade: 1,
      type: 'number-name',
      prompt: `Write "${word}" in digits:`,
      subPrompt: 'Choose the correct numeral for this word name.',
      correctAnswer: num,
      options,
      explanation: `"${word}" is written as ${num}.`,
    };
  } else {
    // Prompt: What is the number name of num?
    const distractorNums = generateNumericDistractors(num, 1, 3);
    const distractorWords = distractorNums.map((n) => numberToWords(n));
    const options = shuffle([word, ...distractorWords]);

    return {
      id: `c1-name-w-${Date.now()}-${randomInt(100, 999)}`,
      grade: 1,
      type: 'number-name',
      prompt: `What is the number name of ${num}?`,
      subPrompt: 'Spell out the digits in English words.',
      correctAnswer: word,
      options,
      explanation: `The number name of ${num} is "${word}".`,
    };
  }
}

function generateClass1BeforeAfter(): Question {
  const isAfter = Math.random() > 0.5;
  const num = randomInt(15, 88);
  const ans = isAfter ? num + 1 : num - 1;
  const distractors = generateNumericDistractors(ans, 1, 3);
  const options = shuffle([ans, ...distractors]);

  return {
    id: `c1-ba-${Date.now()}-${randomInt(100, 999)}`,
    grade: 1,
    type: 'before-after',
    prompt: isAfter
      ? `Which number comes immediately AFTER ${num}?`
      : `Which number comes immediately BEFORE ${num}?`,
    subPrompt: isAfter ? 'Count one step forward!' : 'Count one step backward!',
    correctAnswer: ans,
    options,
    explanation: isAfter
      ? `${ans} comes immediately after ${num}.`
      : `${ans} comes immediately before ${num}.`,
  };
}

// -------------------------------------------------------------
// CLASS 2 GENERATORS
// Numbers ranging from 50 to 500.
// MUST require borrowing (subtraction) and carry-forward (addition).
// -------------------------------------------------------------

function generateClass2CarryAddition(): Question {
  // Generate a & b between 50 and 500 ensuring carry forward in ones digit (sum of ones >= 10)
  // or tens digit.
  let a = 0;
  let b = 0;
  let attempts = 0;

  while (attempts < 100) {
    a = randomInt(55, 450);
    b = randomInt(55, 500 - (a % 100)); // Keep sum reasonable

    const onesA = a % 10;
    const onesB = b % 10;
    const tensA = Math.floor(a / 10) % 10;
    const tensB = Math.floor(b / 10) % 10;

    // Must require carry in ones or tens column
    const hasOnesCarry = onesA + onesB >= 10;
    const hasTensCarry = tensA + tensB + (hasOnesCarry ? 1 : 0) >= 10;

    if (hasOnesCarry || hasTensCarry) {
      break;
    }
    attempts++;
  }

  // Fallback guaranteed carry
  if (a < 50 || b < 50) {
    a = 187;
    b = 168;
  }

  const sum = a + b;
  const distractors = generateNumericDistractors(sum, 100, 3);
  const options = shuffle([sum, ...distractors]);

  return {
    id: `c2-carry-${Date.now()}-${randomInt(100, 999)}`,
    grade: 2,
    type: 'addition',
    prompt: `Add: ${a} + ${b} = ?`,
    subPrompt: 'Remember to carry forward when the column total is 10 or more!',
    operand1: a,
    operand2: b,
    operator: '+',
    correctAnswer: sum,
    options,
    explanation: `Add ones column first: (${a % 10} + ${b % 10}), carry forward the ten, then add the tens and hundreds to get ${sum}.`,
    visualData: {
      type: 'place-value',
      num1: a,
      num2: b,
      operator: '+',
      hasCarry: true,
    },
  };
}

function generateClass2BorrowSubtraction(): Question {
  // Generate a & b between 50 and 500 ensuring borrowing in ones digit (onesA < onesB)
  let a = 0;
  let b = 0;
  let attempts = 0;

  while (attempts < 100) {
    a = randomInt(120, 500);
    b = randomInt(50, a - 25);

    const onesA = a % 10;
    const onesB = b % 10;
    const tensA = Math.floor(a / 10) % 10;
    const tensB = Math.floor(b / 10) % 10;

    // Must require borrowing: either ones column needs borrowing or tens column does
    if (onesA < onesB || (tensA < tensB && a >= 100)) {
      break;
    }
    attempts++;
  }

  // Fallback guaranteed borrow
  if (a <= b) {
    a = 342;
    b = 178;
  }

  const diff = a - b;
  const distractors = generateNumericDistractors(diff, 10, 3);
  const options = shuffle([diff, ...distractors]);

  return {
    id: `c2-borrow-${Date.now()}-${randomInt(100, 999)}`,
    grade: 2,
    type: 'subtraction',
    prompt: `Subtract: ${a} - ${b} = ?`,
    subPrompt: 'Borrow 1 from the next place value when top digit is smaller!',
    operand1: a,
    operand2: b,
    operator: '-',
    correctAnswer: diff,
    options,
    explanation: `Since ${a % 10} is smaller than ${b % 10}, borrow 1 ten from the tens column, then subtract each place value to get ${diff}.`,
    visualData: {
      type: 'place-value',
      num1: a,
      num2: b,
      operator: '-',
      hasBorrow: true,
    },
  };
}

// -------------------------------------------------------------
// CLASS 3 GENERATORS
// Math operations (Addition, Subtraction, simple Multiplication/Division)
// up to 1000.
// -------------------------------------------------------------

function generateClass3Addition(): Question {
  const a = randomInt(150, 550);
  const b = randomInt(120, 999 - a);
  const sum = a + b;
  const distractors = generateNumericDistractors(sum, 200, 3);
  const options = shuffle([sum, ...distractors]);

  return {
    id: `c3-add-${Date.now()}-${randomInt(100, 999)}`,
    grade: 3,
    type: 'addition',
    prompt: `Solve: ${a} + ${b} = ?`,
    subPrompt: 'Add hundreds, tens, and ones carefully.',
    operand1: a,
    operand2: b,
    operator: '+',
    correctAnswer: sum,
    options,
    explanation: `${a} plus ${b} equals ${sum}.`,
    visualData: {
      type: 'place-value',
      num1: a,
      num2: b,
      operator: '+',
    },
  };
}

function generateClass3Subtraction(): Question {
  const a = randomInt(350, 980);
  const b = randomInt(110, a - 50);
  const diff = a - b;
  const distractors = generateNumericDistractors(diff, 50, 3);
  const options = shuffle([diff, ...distractors]);

  return {
    id: `c3-sub-${Date.now()}-${randomInt(100, 999)}`,
    grade: 3,
    type: 'subtraction',
    prompt: `Solve: ${a} - ${b} = ?`,
    subPrompt: 'Subtract step by step across columns.',
    operand1: a,
    operand2: b,
    operator: '-',
    correctAnswer: diff,
    options,
    explanation: `${a} minus ${b} equals ${diff}.`,
    visualData: {
      type: 'place-value',
      num1: a,
      num2: b,
      operator: '-',
    },
  };
}

function generateClass3Multiplication(): Question {
  // Simple multiplication suitable for Grade 3
  const pairs = [
    [12, 6],
    [14, 5],
    [15, 4],
    [16, 3],
    [20, 8],
    [25, 6],
    [30, 7],
    [18, 5],
    [12, 8],
    [15, 7],
    [24, 4],
    [35, 3],
    [40, 5],
    [50, 6],
    [13, 7],
  ];
  const [a, b] = pairs[randomInt(0, pairs.length - 1)];
  const product = a * b;
  const distractors = generateNumericDistractors(product, 20, 3);
  const options = shuffle([product, ...distractors]);

  return {
    id: `c3-mul-${Date.now()}-${randomInt(100, 999)}`,
    grade: 3,
    type: 'multiplication',
    prompt: `Multiply: ${a} × ${b} = ?`,
    subPrompt: `Think of ${b} equal groups of ${a}!`,
    operand1: a,
    operand2: b,
    operator: '×',
    correctAnswer: product,
    options,
    explanation: `${a} multiplied by ${b} equals ${product}.`,
    visualData: {
      type: 'groups',
      groupCount: b,
      itemsPerGroup: a,
    },
  };
}

function generateClass3Division(): Question {
  // Simple division up to 1000 with exact whole quotients
  const divisibles = [
    { dividend: 96, divisor: 8, quotient: 12 },
    { dividend: 144, divisor: 12, quotient: 12 },
    { dividend: 120, divisor: 6, quotient: 20 },
    { dividend: 150, divisor: 5, quotient: 30 },
    { dividend: 240, divisor: 8, quotient: 30 },
    { dividend: 360, divisor: 6, quotient: 60 },
    { dividend: 450, divisor: 9, quotient: 50 },
    { dividend: 180, divisor: 9, quotient: 20 },
    { dividend: 84, divisor: 4, quotient: 21 },
    { dividend: 200, divisor: 4, quotient: 50 },
    { dividend: 320, divisor: 8, quotient: 40 },
    { dividend: 500, divisor: 5, quotient: 100 },
  ];
  const item = divisibles[randomInt(0, divisibles.length - 1)];
  const distractors = generateNumericDistractors(item.quotient, 2, 3);
  const options = shuffle([item.quotient, ...distractors]);

  return {
    id: `c3-div-${Date.now()}-${randomInt(100, 999)}`,
    grade: 3,
    type: 'division',
    prompt: `Divide: ${item.dividend} ÷ ${item.divisor} = ?`,
    subPrompt: `How many times does ${item.divisor} fit into ${item.dividend}?`,
    operand1: item.dividend,
    operand2: item.divisor,
    operator: '÷',
    correctAnswer: item.quotient,
    options,
    explanation: `${item.dividend} divided equally by ${item.divisor} is ${item.quotient}.`,
  };
}

function generateClass3WordProblem(): Question {
  const problems = [
    {
      story:
        'Little Hanuman collected 4 golden boxes of laddoos. Each box has 15 laddoos. How many laddoos did he collect in total?',
      ans: 60,
      op1: 15,
      op2: 4,
      symbol: '×',
      expl: '4 boxes with 15 laddoos in each = 4 × 15 = 60 laddoos.',
    },
    {
      story:
        'Bal Hanuman flew 320 miles in the morning and 245 miles in the afternoon. How many miles did he fly in total?',
      ans: 565,
      op1: 320,
      op2: 245,
      symbol: '+',
      expl: '320 + 245 = 565 total miles flown.',
    },
    {
      story:
        'A magical mango tree had 480 ripe fruits. The friendly monkeys plucked 195 fruits. How many fruits are still on the tree?',
      ans: 285,
      op1: 480,
      op2: 195,
      symbol: '-',
      expl: '480 - 195 = 285 ripe fruits remaining.',
    },
    {
      story:
        'Little Hanuman shared 84 sweet berries equally among 4 friends. How many berries did each friend receive?',
      ans: 21,
      op1: 84,
      op2: 4,
      symbol: '÷',
      expl: '84 ÷ 4 = 21 sweet berries for each friend.',
    },
  ];

  const p = problems[randomInt(0, problems.length - 1)];
  const distractors = generateNumericDistractors(p.ans, 5, 3);
  const options = shuffle([p.ans, ...distractors]);

  return {
    id: `c3-word-${Date.now()}-${randomInt(100, 999)}`,
    grade: 3,
    type: 'word-problem',
    prompt: p.story,
    subPrompt: 'Read the word problem and find the correct solution.',
    operand1: p.op1,
    operand2: p.op2,
    operator: p.symbol,
    correctAnswer: p.ans,
    options,
    explanation: p.expl,
  };
}

// -------------------------------------------------------------
// PUBLIC GENERATOR: 5 RANDOM QUESTIONS FOR A SESSION
// -------------------------------------------------------------

export function generateQuiz(grade: Grade, totalQuestions = 5): Question[] {
  const questions: Question[] = [];

  if (grade === 1) {
    // Class 1: Mix of Addition (<100), Subtraction (<100), Number Names, Before/After
    const generators = [
      generateClass1Addition,
      generateClass1Subtraction,
      generateClass1NumberName,
      generateClass1Addition,
      generateClass1BeforeAfter,
    ];
    const shuffledGen = shuffle(generators);
    for (let i = 0; i < totalQuestions; i++) {
      questions.push(shuffledGen[i % shuffledGen.length]());
    }
  } else if (grade === 2) {
    // Class 2: Carry-forward addition and borrow subtraction (50 to 500)
    const generators = [
      generateClass2CarryAddition,
      generateClass2BorrowSubtraction,
      generateClass2CarryAddition,
      generateClass2BorrowSubtraction,
      generateClass2CarryAddition,
    ];
    const shuffledGen = shuffle(generators);
    for (let i = 0; i < totalQuestions; i++) {
      questions.push(shuffledGen[i % shuffledGen.length]());
    }
  } else {
    // Class 3: Operations up to 1000 (Add, Sub, Mul, Div, Word problem)
    const generators = [
      generateClass3Addition,
      generateClass3Subtraction,
      generateClass3Multiplication,
      generateClass3Division,
      generateClass3WordProblem,
    ];
    const shuffledGen = shuffle(generators);
    for (let i = 0; i < totalQuestions; i++) {
      questions.push(shuffledGen[i % shuffledGen.length]());
    }
  }

  return questions;
}
