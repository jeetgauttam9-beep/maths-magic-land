import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioCache = new Map<string, string>();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini API client on the server
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // 1. Text-to-Speech Endpoint for Little Hanuman's warm, human, cartoon voice
  app.post('/api/hanuman/speak', async (req: Request, res: Response) => {
    try {
      const { text, voice = 'Puck' } = req.body;
      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Text is required for TTS' });
        return;
      }

      const cacheKey = `${voice}_${text.trim()}`;
      if (audioCache.has(cacheKey)) {
        res.json({ audioUrl: audioCache.get(cacheKey) });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });
        return;
      }

      // Generate child-friendly speech using Gemini TTS
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text,
                speechMetadata: {
                  style: 'Warm, cheerful, enthusiastic cartoon boy Bal Hanuman speaking in friendly Indian English and Hinglish tone to primary school kids',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice as 'Puck' | 'Zephyr' | 'Charon' | 'Kore' | 'Fenrir' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioUrl = `data:audio/wav;base64,${base64Audio}`;
        audioCache.set(cacheKey, audioUrl);
        res.json({ audioUrl });
      } else {
        res.status(500).json({ error: 'No audio data returned by Gemini TTS' });
      }
    } catch (err: unknown) {
      console.error('Error generating speech:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ error: errorMessage });
    }
  });

  // 2. Gemini AI Math Buddy: Get a personalized, kid-friendly explanation/hint from Hanuman ji
  app.post('/api/hanuman/hint', async (req: Request, res: Response) => {
    try {
      const { questionPrompt, grade, subPrompt } = req.body;

      if (!questionPrompt) {
        res.status(400).json({ error: 'Question prompt is required' });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fallback friendly hint if key is absent
        res.json({
          hintText: 'Dhyan se numbers ko dekho dost! Thoda sa time lo aur columns ko dhyan se check karo!',
          dialogue: 'Suno bacche! Pehle ones place ko solve karo, phir aage badho! Tum zaroor kar sakte ho!',
        });
        return;
      }

      const prompt = `You are Little Hanuman ji (Bal Hanuman), the playful, loving, wise cartoon guide for a child in Class ${grade}.
The math question is: "${questionPrompt}" ${subPrompt ? `(${subPrompt})` : ''}.

Write a super warm, sweet, encouraging hint in HINGLISH (Hindi words written in English alphabet) that helps the child solve it.
Rules:
1. Speak as cute Little Bal Hanuman (use playful phrases like "Ram Ram dost!", "Arey suno!", "Ghabrao mat!").
2. Give a visual or real-world clue (like golden laddoos, flowers, counting on fingers, or place value).
3. Do NOT just state the answer directly.
4. Keep it concise (2 to 3 short sentences max) suitable for a young child.

Return ONLY a JSON object with this exact structure:
{
  "dialogue": "Short Hinglish spoken hint from Little Hanuman",
  "tip": "English step-by-step simple clue"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);
      res.json(parsed);
    } catch (err: unknown) {
      console.error('Error generating hint:', err);
      res.json({
        dialogue: 'Koi baat nahi! Number line par aage gino ya golden laddoos ko count karo!',
        tip: 'Break the problem down step by step starting from the rightmost ones digit.',
      });
    }
  });

  // 3. Gemini AI Magic Question Generator: Generate an adventurous Bal Hanuman story problem
  app.post('/api/hanuman/magic-question', async (req: Request, res: Response) => {
    try {
      const { grade = 1 } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
        return;
      }

      const prompt = `Generate a single multiple-choice math question for a Class ${grade} student.
Theme: A delightful, fun story involving Little Hanuman (Bal Hanuman), golden laddoos, mangoes, magical clouds, or friendly forest animals.

Grade Rules:
- If Class 1: Simple addition or subtraction under 100, or number names. Numbers must be under 100.
- If Class 2: Numbers between 50 and 500. Addition must require carry-forward, or subtraction must require borrowing.
- If Class 3: Math operations up to 1000 (addition, subtraction, multiplication, or division).

Output strictly in JSON format with this structure:
{
  "prompt": "Clear English story question",
  "subPrompt": "Short English helpful clue",
  "correctAnswer": 42,
  "options": [42, 38, 52, 40],
  "explanation": "Clear explanation of how to solve it",
  "hanumanIntro": "Short Hinglish dialogue introducing this magical question"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      res.json(parsed);
    } catch (err: unknown) {
      console.error('Error generating magic question:', err);
      res.status(500).json({ error: 'Failed to generate magical question' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
});
