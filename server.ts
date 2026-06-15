import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy-initialized Gemini client
  let aiInstance: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!aiInstance) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set.");
      }
      aiInstance = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiInstance;
  }

  // API Route for Astronomy AI Assistant
  app.post("/api/ask-gemini", async (req, res) => {
    try {
      const { message, contextQuestion, contextExplanation } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }

      let client;
      try {
        client = getGeminiClient();
      } catch (err: any) {
        console.warn("Gemini Client initialization failed:", err.message);
        return res.status(403).json({
          error: "Asisten AI belum terhubung dengan kunci API. Silakan tambahkan GEMINI_API_KEY di pengaturan rahasia (Secrets) AI Studio.",
          isDemoMode: true
        });
      }

      let prompt = message;
      if (contextQuestion) {
        prompt = `Konteks Pertanyaan Kuis: "${contextQuestion}"
Penjelasan Kuis: "${contextExplanation || ''}"

Pertanyaan pengguna tentang konteks ini: ${message}`;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Anda adalah Asisten Astronomi Kosmis (Asisten AI) yang interaktif, cerdas, dan menyenangkan untuk kuis 'Mengenal Lubang Hitam'. Pengembang Anda adalah Ihwal Athayas’san dari program Teknologi Pendidikan. Tugas Anda adalah memberikan jawaban/pemaparan edukatif, akurat secara fisika/astronomi, dan menginspirasi dalam bahasa Indonesia. Gunakan format Markdown yang indah, sertakan analogi sehari-hari jika menjelaskan konsep rumit seperti dilatasi waktu gravitasi atau cakrawala peristiwa, serta berikan sentuhan antusiasme kosmis!",
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error communicating with Gemini API:", error);
      res.status(500).json({
        error: "Gagal berkomunikasi dengan asisten antariksa. Silakan coba lagi.",
        details: error.message,
      });
    }
  });

  // Vite Integration
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Cosmic Server] Terbuka pada port ${PORT} (http://localhost:${PORT})`);
  });
}

startServer();
