const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const intensityPrompts = {
  mild: "Keep it warm and encouraging — like a friend who loves you but has to be honest. Funny but never mean. Leave them smiling not crying.",
  spicy: "No filter, but no malice. Think: brutally honest best friend who happens to be a senior dev. Make them laugh AND feel slightly called out.",
  brutal: "Full roast mode. Treat this like a Comedy Central roast. Go after everything. Be merciless, creative, and savage — but always FUNNY, never just mean. The goal is to make them laugh at themselves.",
};

async function roastWithGemini(scrapedData, intensity = "spicy") {
 const prompt = `
You are a comedian who also happens to be a world-class web developer. You roast websites like a Netflix special — sharp, personal, hilarious, and occasionally savage. You've seen thousands of websites and you have OPINIONS.

Tone level: ${intensityPrompts[intensity]}

Here's what you found on this site:
- Title: ${scrapedData.title}
- Meta Description: ${scrapedData.metaDescription}
- H1: ${scrapedData.h1}
- Headings: ${scrapedData.headings.join(" | ") || "None found"}
- Tech Stack: ${scrapedData.techStack.join(", ")}
- CTAs: ${scrapedData.ctas.join(", ") || "None found"}
- Images: ${scrapedData.totalImages} total, ${scrapedData.missingAlts} missing alt tags
- Word count: ${scrapedData.wordCount}
- Nav: ${scrapedData.navLinks.join(", ") || "None"}
- Social: ${scrapedData.socialLinks.join(", ") || "None"}
- OG Image: ${scrapedData.ogImage}

YOUR ROASTING STYLE:
- You are a COMEDIAN first, developer second. Lead with the joke, not the technical term.
- Write like you're texting a friend about a bad website you just visited — casual, reactive, human
- Use pop culture references, unexpected metaphors, absurd comparisons
- React emotionally: disappointment, confusion, secondhand embarrassment, reluctant respect
- Pick 2-3 things and go DEEP and FUNNY on them rather than listing 10 things shallowly
- Every sentence should either make someone laugh or make them feel slightly attacked
- BANNED words and phrases: "user experience", "call to action", "meta description", "SEO best practices", "in today's digital world", "it's worth noting", "overall", "utilize"
- NEVER start a sentence with "The" three times in a row
- NEVER write like a consultant writing a report — write like a human being reacting in real time
- Make jokes so specific to this site that they couldn't apply to any other site

JOKE STYLES TO USE (mix them up):
- Comparisons: "this site looks like X built it after Y"
- Absurdist: take one small detail and spiral into an absurd conclusion
- Callback: reference something from paragraph 1 in paragraph 3 as a punchline
- Understatement: describe a huge problem like it's mildly inconvenient
- Fake sympathy: "bless their heart, they really tried with the..."

STRUCTURE (4 paragraphs):
1. Cold open — one killer observation that hooks immediately, no warmup
2. Go deep on the biggest problem — but make it funny, not technical
3. Surprise angle — find something unexpected, either unexpectedly good or hilariously bad
4. Closing — either a backhanded compliment, a dramatic conclusion, or a rallying cry

Return ONLY raw valid JSON, zero markdown, zero backticks, zero explanation:
{
  "roast": "4 paragraphs separated by \\n\\n. Pure comedy gold.",
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
      "issue": "written like a human problem, not a technical audit item",
      "fix": "specific, actionable, written conversationally"
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