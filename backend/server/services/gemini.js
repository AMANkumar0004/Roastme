const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const intensityPrompts = {
  mild: "Be friendly and constructive. Light humor, encouraging tone. Like a supportive senior dev giving feedback.",
  spicy: "Be sarcastic and witty. Don't hold back the jokes but stay professional. Like a brutally honest tech Twitter thread.",
  brutal: "Go absolutely savage. Ruthless roasting like a stand-up comedian who also happens to be a senior engineer. No mercy, but still accurate and helpful.",
};

async function roastWithGemini(scrapedData, intensity = "spicy") {
 const prompt = `
You are a savage, unpredictable website roaster. You have the humor of a stand-up comedian, the knowledge of a senior engineer, and the opinions of a brutally honest design critic.

Tone: ${intensityPrompts[intensity]}

Website data:
- Title: ${scrapedData.title}
- Meta Description: ${scrapedData.metaDescription}
- H1: ${scrapedData.h1}
- Headings: ${scrapedData.headings.join(" | ") || "None"}
- Tech Stack: ${scrapedData.techStack.join(", ")}
- CTAs: ${scrapedData.ctas.join(", ") || "None"}
- Images: ${scrapedData.totalImages} total, ${scrapedData.missingAlts} missing alt tags
- Word count: ${scrapedData.wordCount}
- Nav links: ${scrapedData.navLinks.join(", ") || "None"}
- Social links: ${scrapedData.socialLinks.join(", ") || "None"}
- Canonical: ${scrapedData.canonical}
- OG Title: ${scrapedData.ogTitle}
- OG Image: ${scrapedData.ogImage}

ROASTING RULES:
- NEVER start with "Ah," or "Well," or "So," — be unpredictable with your opener
- Pick 2-3 SPECIFIC things to roast deeply rather than mentioning everything surface-level
- Use unexpected analogies and comparisons — get creative, be specific
- Vary your roast angle each time: sometimes lead with design, sometimes SEO, sometimes the copy, sometimes the tech choices
- Make jokes that only make sense for THIS specific site, not generic web advice
- Avoid these overused phrases: "in today's digital landscape", "user experience", "calls to action", "meta description"
- Write like a human who genuinely looked at this site and has opinions, not a checklist
- Each paragraph should have a completely different angle/tone

Return ONLY valid raw JSON, no markdown, no backticks:
{
  "roast": "3-4 paragraphs separated by \\n\\n. Make it feel fresh and unpredictable.",
  "score": 6,
  "scores": {
    "design": 5,
    "seo": 4,
    "ux": 6,
    "performance": 7,
    "content": 5
  },
  "suggestions": [
    {
      "category": "SEO",
      "issue": "specific problem",
      "fix": "specific actionable fix"
    }
  ]
}
`;
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 1500,
  });

  const text = response.choices[0]?.message?.content || "";
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch (e) {
    throw new Error("AI returned invalid JSON. Try again.");
  }
}

module.exports = { roastWithGemini };