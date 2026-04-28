import axios from "axios";

const API_KEY = process.env.NVIDIA_API_KEY;

// 🔥 toggle
const DEV_MODE = false;

// cache
const cache = new Map();

// cooldown
let lastCallTime = 0;
const COOLDOWN = 5000;

export const generateResponse = async (prompt) => {
  try {
    // ✅ DEV MODE
    if (DEV_MODE) {
      return `🤖 Mock response: ${prompt}`;
    }

    // ✅ cooldown
    if (Date.now() - lastCallTime < COOLDOWN) {
      return "⏳ Please wait before calling AI again";
    }
    lastCallTime = Date.now();

    // ✅ clean prompt
    const cleanPrompt = prompt.trim().slice(0, 300);

    if (!cleanPrompt) {
      return "⚠️ Empty prompt";
    }

    // ✅ cache
    if (cache.has(cleanPrompt)) {
      return cache.get(cleanPrompt);
    }

    // ✅ NVIDIA API call
    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model: "google/gemma-3n-e4b-it",
        messages: [
          {
            role: "user",
            content: `You are a senior MERN developer. Give short, clear answers with code.\n\n${cleanPrompt}`,
          },
        ],
        max_tokens: 150,
        temperature: 0.2,
        top_p: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response.data?.choices?.[0]?.message?.content || "⚠️ No response";

    // ✅ cache store
    cache.set(cleanPrompt, text);

    return text;
  } catch (error) {
    console.error("NVIDIA Error:", error.message);

    if (error.response?.status === 429) {
      return "⚠️ Rate limit hit. Try later.";
    }

    return "⚠️ AI temporarily unavailable";
  }
};