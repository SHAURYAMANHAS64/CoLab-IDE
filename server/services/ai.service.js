import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // 🔥 important
});

export const generateResponse = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // latest fast model
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) { 
    console.error("Gemini Error:", error);
    throw error;
  }
};