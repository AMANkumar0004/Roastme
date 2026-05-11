const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const intensityPrompts = {
  mild: "Be friendly and constructive. Light humor, encouraging tone. Like a supportive senior dev giving feedback.",
  spicy: "Be sarcastic and witty. Don't hold back the jokes but stay professional. Like a brutally honest tech Twitter thread.",
  brutal: "Go absolutely savage. Ruthless roasting like a stand-up comedian who also happens to be a senior engineer. No mercy, but still accurate and helpful.",
};

async function roastWithGemini(scrapedData, intensity = "spicy") {
  const prompt = `
You are an expert website roaster who is also a senior full-stack developer and UX expert.
Tone: ${intensityPrompts[intensity]}

Here is the website data you need to roast:
- URL Title: ${scrapedData.title}
- Meta Description: ${scrapedData.metaDescription}
- H1 Heading: ${scrapedData.h1}
- Other Headings: ${scrapedData.headings.join(" | ") || "None found"}
- Detected Tech Stack: ${scrapedData.techStack.join(", ")}
- CTA Buttons/Links: ${scrapedData.ctas.join(", ") || "None found"}
- Total Images: ${scrapedData.totalImages} (${scrapedData.missingAlts} missing alt tags)
- Word Count: ${scrapedData.wordCount}
- Nav Links: ${scrapedData.navLinks.join(", ") || "None found"}
- Social Links Present: ${scrapedData.socialLinks.length > 0 ? scrapedData.socialLinks.join(", ") : "None"}
- Canonical Tag: ${scrapedData.canonical}
- OG Title: ${scrapedData.ogTitle}
- OG Image: ${scrapedData.ogImage}

Your task:
1. Write a roast of 3-4 paragraphs. Be specific and reference actual data points above. Don't be generic.
2. Give exactly 6 improvement suggestions covering different categories from: Design, SEO, UX, Performance, Content, Accessibility.
3. Give an overall score out of 10 and individual scores for: design, seo, ux, performance, content.

Return ONLY valid raw JSON with no markdown, no backticks, no explanation. Exactly this format:
{
  "roast": "full roast text here as a single string with paragraphs separated by \\n\\n",
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
      "issue": "short description of the problem",
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