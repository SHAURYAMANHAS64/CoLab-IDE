    import { generateResponse } from "../services/ai.service.js";

export const getAIResponse = async (req, res) => {
  try {
    const {prompt} = req.query

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await generateResponse(prompt);

    res.send(result);
  } catch (error) {
    res.status(500).send({ messege: error.messege});
  }
};