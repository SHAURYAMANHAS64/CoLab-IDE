import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const DEV_MODE = true;

const cache = new Map();

let lastCallTime = 0;
const COOLDOWN = 5000;

export const generateResponse = async (prompt) => {
  try {
    if (DEV_MODE) {
      return `🤖 Mock response: ${prompt}`;
    }

    if (Date.now() - lastCallTime < COOLDOWN) {
      return "⏳ Please wait before calling AI again";
    }
    lastCallTime = Date.now();

    const cleanPrompt = prompt.trim().slice(0, 300);

    if (!cleanPrompt) {
      return "⚠️ Empty prompt";
    }

    if (cache.has(cleanPrompt)) {
      return cache.get(cleanPrompt);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a senior MERN developer. Give short, clear answers with code.\n\n${cleanPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 150,
      },
    });

    const text = response.text || "⚠️ No response";

    cache.set(cleanPrompt, text);

    return text;
  } catch (error) {
    console.error("Gemini Error:", error.message);

    if (error.status === 429) {
      return "⚠️ AI quota exceeded. Try later.";
    }

    return "⚠️ AI temporarily unavailable";
  }
};
