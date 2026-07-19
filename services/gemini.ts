// Gemini API Service - Reusable AI helper
import axios from 'axios';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

/**
 * Send a prompt to Gemini API and get a text response
 */
export async function askGemini(prompt: string, systemInstruction?: string): Promise<string> {
  try {
    const requestBody: Record<string, unknown> = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');
    return text.trim();
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Gemini API Error:', error.response?.data || error.message);
    } else {
      console.error('Gemini API Error:', error);
    }
    throw new Error('Failed to get response from Gemini AI');
  }
}

/**
 * Send a prompt expecting JSON response from Gemini
 */
export async function askGeminiJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
  const response = await askGemini(
    prompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no extra text.',
    systemInstruction
  );

  // Strip markdown code blocks if present
  let cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    console.error('Failed to parse Gemini JSON response:', cleaned);
    throw new Error('Invalid JSON response from Gemini');
  }
}
