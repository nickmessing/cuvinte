import express from "express";
import cors from "cors";
import * as Dexonline from "dexonline-scraper";

const app = express();
const PORT = process.env.PORT != null ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

interface ValidateWordRequest {
  word: string;
}

interface WordDefinition {
  word: string;
  definition: string;
  exists: boolean;
}

app.post("/api/validate-word", async (req, res) => {
  try {
    const { word } = req.body as ValidateWordRequest;

    if (!word || typeof word !== "string") {
      return res.status(400).json({ error: "Cuvântul este necesar" });
    }

    // Normalize the word (lowercase, trim)
    const normalizedWord = word.trim().toLowerCase();

    if (normalizedWord.length === 0) {
      return res.status(400).json({ error: "Cuvântul nu poate fi gol" });
    }

    // Check word in dexonline
    const result = await Dexonline.get(normalizedWord);
    const definition = result?.synthesis.at(0)?.definitions.at(0)?.value;

    if (definition != null) {
      return res.json({
        exists: true,
        word: normalizedWord,
        definition: definition,
      } as WordDefinition);
    } else {
      // Word doesn't exist
      return res.json({
        exists: false,
        word: normalizedWord,
        definition: "",
      } as WordDefinition);
    }
  } catch (error) {
    console.error("Error validating word:", error);
    return res.status(500).json({
      error: "Eroare la verificarea cuvântului",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
});
