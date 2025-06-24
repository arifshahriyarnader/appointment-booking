dotenv.config();
import dotenv from "dotenv";
import express from "express";
import axios from "axios";

const router = express.Router();

const GROQ_API_URL = process.env.GROQ_API_URL;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

router.post("/generate", async (req, res) => {
  const { userPrompt } = req.body;
  try {
    const groqResponse = await axios.post(
      GROQ_API_URL,
      {
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant. Write a short agenda format \nAgenda ...",
          },
          {
            role: "user",
            content: `Generate a short agenda description for the following prompt: ${userPrompt}`,
           
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );
    const generatedText = groqResponse.data.choices[0].message.content;
    res.status(200).json({ generatedText });
  } catch (error) {
    res.status(500).json({ error: "AI generation failed",
         details: error.response?.data || error.message,
     });
    
  }
});

export default router;
