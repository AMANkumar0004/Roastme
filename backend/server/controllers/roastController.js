const { scrapeWebsite } = require("../services/scraper");
const { roastWithGemini } = require("../services/gemini");
const Roast = require("../models/Roast.js");

// POST /api/roast
const createRoast = async (req, res) => {
  try {
    const { url, intensity = "spicy" } = req.body;

    if (!url) return res.status(400).json({ error: "URL is required" });

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) normalizedUrl = "https://" + normalizedUrl;

    // Step 1: Scrape
    let scrapedData;
    try {
      scrapedData = await scrapeWebsite(normalizedUrl);
    } catch (err) {
      return res.status(422).json({ error: `Could not reach that URL: ${err.message}` });
    }

    // Step 2: Roast with Gemini
    let roastData;
    try {
      roastData = await roastWithGemini(scrapedData, intensity);
    } catch (err) {
      return res.status(500).json({ error: `AI roasting failed: ${err.message}` });
    }

    // Step 3: Save to MongoDB
    const saved = await Roast.create({
      url: normalizedUrl,
      title: scrapedData.title,
      intensity,
      roast: roastData.roast,
      score: roastData.score,
      scores: roastData.scores,
      suggestions: roastData.suggestions,
    });

    res.status(201).json({
      id: saved._id,
      url: normalizedUrl,
      title: scrapedData.title,
      intensity,
      roast: roastData.roast,
      score: roastData.score,
      scores: roastData.scores,
      suggestions: roastData.suggestions,
      createdAt: saved.createdAt,
    });
  } catch (err) {
    console.error("createRoast error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// GET /api/roast/history
const getHistory = async (req, res) => {
  try {
    const roasts = await Roast.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select("url title score intensity createdAt roast");
    res.json(roasts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// GET /api/roast/recent
const getRecent = async (req, res) => {
  try {
    const roasts = await Roast.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select("url title score intensity createdAt");
    res.json(roasts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent roasts" });
  }
};

// GET /api/roast/:id
const getRoastById = async (req, res) => {
  try {
    const roast = await Roast.findById(req.params.id);
    if (!roast) return res.status(404).json({ error: "Roast not found" });
    res.json(roast);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch roast" });
  }
};

module.exports = { createRoast, getHistory, getRecent, getRoastById };