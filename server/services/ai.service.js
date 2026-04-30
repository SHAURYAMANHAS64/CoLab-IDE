import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  generationConfig: {
    responseMimeType:"application/json",
  }, 
  systemInstruction: `
You are an expert in MERN and Development with 10+ years of experience.

- Write modular, scalable, and maintainable code
- Follow best practices
- Add clear and understandable comments
- Handle edge cases properly
- Ensure error handling and robustness
- Maintain compatibility with existing code

Example:
<example>
user: Create an express application
response:{
"text": "this is your fileTree structure of the express server"
"fileTree": {
"app.js":{
content:"
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Express server is running');
});

app.listen(port, () => {
    console.log("Server listening on port 3000");
});
"
}
"package.json":{
content:"
{
  {
    "name": "server",
    "version": "1.0.0",
    "description": "",
    "license": "ISC",
    "author": "",
    "type": "commonjs",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "dependencies": {
      "express": "^5.2.1"
    }
  }

}
",



},
"buildCommand" :{
mainItem:"npm",
commands:["install"]
},
"startCommand" :{
mainItem:"node",
commands:["app.js"]
}
}
}
</example>

<example>
user: hello
response:{
"text": "Hello! How can I assist you today?"

}
</example>

`,
});

// Dev mode toggle
const DEV_MODE = false;

// Cache for repeated prompts
const cache = new Map();

// Cooldown control
let lastCallTime = 0;
const COOLDOWN = 5000;

export const generateResponse = async (prompt) => {
  try {
    // Dev mock
    if (DEV_MODE) {
      return `🤖 Mock response: ${prompt}`;
    }

    // Cooldown check
    if (Date.now() - lastCallTime < COOLDOWN) {
      return "⏳ Please wait before calling AI again";
    }
    lastCallTime = Date.now();

    // Clean prompt
    const cleanPrompt = prompt.trim().slice(0, 300);
    if (!cleanPrompt) {
      return "⚠️ Empty prompt";
    }

    // Cache check
    if (cache.has(cleanPrompt)) {
      return cache.get(cleanPrompt);
    }

    // Generate response
    const result = await model.generateContent(cleanPrompt);

    const text = result.response.text() || "⚠️ No response";

    // Store in cache
    cache.set(cleanPrompt, text);

    return text;

  } catch (error) {
    console.error("Gemini Error:", error.message);

    if (error?.status === 429) {
      return "⚠️ AI quota exceeded. Try later.";
    }

    return "⚠️ AI temporarily unavailable";
  }
};