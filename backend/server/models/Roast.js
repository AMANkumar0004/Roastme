const mongoose = require("mongoose");

const SuggestionSchema = new mongoose.Schema({
  category: String,
  issue: String,
  fix: String,
});

const RoastSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, default: "Unknown" },
  intensity: { type: String, enum: ["mild", "spicy", "brutal"], default: "spicy" },
  roast: { type: String, required: true },
  score: { type: Number, min: 1, max: 10 },
  scores: {
    design: Number,
    seo: Number,
    ux: Number,
    performance: Number,
    content: Number,
  },
  suggestions: [SuggestionSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Roast", RoastSchema);