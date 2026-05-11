const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const intensityPrompts = {
  mild: "Keep it warm and encouraging — like a friend who loves you but has to be honest. Funny but never mean. Leave them smiling not crying.",
  spicy: "No filter, but no malice. Think: brutally honest best friend who happens to be a senior dev. Make them laugh AND feel slightly called out.",
  brutal: "Full roast mode. Treat this like a Comedy Central roast. Go after everything. Be merciless, creative, and savage — but always FUNNY, never just mean. The goal is to make them laugh at themselves.",
};

async function roastWithGemini(scrapedData, intensity = "spicy") {
  const prompt = `
You are a comedian who also happens to be a world-class web developer. You roast websites like a Netflix special — sharp, personal, hilarious, and occasionally savage.

Tone: ${intensityPrompts[intensity]}

Website data:
Title: ${scrapedData.title}
Meta Description: ${scrapedData.metaDescription}
H1: ${scrapedData.h1}
Headings: ${scrapedData.headings.join(" | ") || "None"}
Tech Stack: ${scrapedData.techStack.join(", ")}
CTAs: ${scrapedData.ctas.join(", ") || "None"}
Images: ${scrapedData.totalImages} total, ${scrapedData.missingAlts} missing alt tags
Word count: ${scrapedData.wordCount}
Nav links: ${scrapedData.navLinks.join(", ") || "None"}
Social links: ${scrapedData.socialLinks.join(", ") || "None"}

ROASTING RULES:
1. Write EXACTLY 4 paragraphs, each 3-5 sentences long
2. Pick 2-3 specific details from the data above and roast them hard
3. Be a comedian first — lead with jokes not technical terms
4. Each paragraph must have a different angle
5. Make it specific to THIS site, not generic web advice
6. BANNED phrases: "user experience" "call to action" "meta description" "SEO best practices"

PARAGRAPH STRUCTURE:
Paragraph 1: Cold open — one killer hook, no warmup
Paragraph 2: Deep dive on the biggest problem, make it funny
Paragraph 3: Surprise angle — something unexpected good or bad
Paragraph 4: Killer closing line or backhanded compliment

SUGGESTIONS RULES:
- Write EXACTLY 6 suggestions
- Each must have a different category from: SEO, UX, Design, Performance, Content, Accessibility
- Write like a human, not a consultant

SCORES RULES:
- Score each category honestly based on the actual data
- Do NOT use placeholder numbers — analyze the real data

You must respond with ONLY a JSON object. No text before or after. No markdown. No backticks.
The JSON must have exactly these fields:
roast (string with 4 paragraphs joined by \\n\\n)
score (number 1-10)
scores (object with design, seo, ux, performance, content each as number 1-10)
suggestions (array of exactly 6 objects each with category, issue, fix as strings)
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are a JSON API. You only respond with valid JSON objects. Never include markdown, backticks, or any text outside the JSON object.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.85,
    max_tokens: 2000,
  });

  const text = response.choices[0]?.message?.content || "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("No JSON found:", text);
    throw new Error("AI returned invalid JSON. Try again.");
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Parse failed:", jsonMatch[0]);
    throw new Error("AI returned invalid JSON. Try again.");
  }
}

module.exports = { roastWithGemini };