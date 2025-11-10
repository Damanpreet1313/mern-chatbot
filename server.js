import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors()); // ✅ works for Vercel + local

app.post("/chat", async (req, res) => {   // ✅ changed route
  try {
    const { message } = req.body;

    const aiRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: message }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    res.json({
      reply: aiRes.data.choices[0].message.content
    });

  } catch (err) {
    console.log("AI Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "AI request failed",
      details: err.response?.data
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`);
});


