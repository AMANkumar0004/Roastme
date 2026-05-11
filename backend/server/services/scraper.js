const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeWebsite(url) {
  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(html);

    const title = $("title").text().trim() || "No title found";
    const metaDescription =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "No meta description found";

    const h1 = $("h1").first().text().trim() || "No H1 found";
    const headings = [];
    $("h2, h3").each((_, el) => {
      const text = $(el).text().trim();
      if (text) headings.push(text);
    });

    const techStack = [];
    const scriptSrcs = [];
    $("script[src]").each((_, el) => scriptSrcs.push($(el).attr("src") || ""));
    if (scriptSrcs.some((s) => s.includes("react"))) techStack.push("React");
    if (scriptSrcs.some((s) => s.includes("vue"))) techStack.push("Vue");
    if (scriptSrcs.some((s) => s.includes("angular"))) techStack.push("Angular");
    if (scriptSrcs.some((s) => s.includes("next"))) techStack.push("Next.js");
    if (scriptSrcs.some((s) => s.includes("jquery"))) techStack.push("jQuery");
    if (scriptSrcs.some((s) => s.includes("bootstrap"))) techStack.push("Bootstrap");
    if (scriptSrcs.some((s) => s.includes("tailwind"))) techStack.push("Tailwind");
    if ($('meta[name="generator"]').attr("content"))
      techStack.push($('meta[name="generator"]').attr("content"));
    if (techStack.length === 0) techStack.push("Unknown / Custom");

    const ctas = [];
    $("button, a.btn, a.button, [class*='cta'], [class*='btn']").each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 60) ctas.push(text);
    });

    const totalImages = $("img").length;
    let missingAlts = 0;
    $("img").each((_, el) => {
      if (!$(el).attr("alt") || $(el).attr("alt").trim() === "") missingAlts++;
    });

    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = bodyText.split(" ").filter(Boolean).length;

    const navLinks = [];
    $("nav a, header a").each((_, el) => {
      const text = $(el).text().trim();
      if (text) navLinks.push(text);
    });

    const socialLinks = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (href.includes("twitter") || href.includes("x.com")) socialLinks.push("Twitter/X");
      if (href.includes("linkedin")) socialLinks.push("LinkedIn");
      if (href.includes("github")) socialLinks.push("GitHub");
      if (href.includes("instagram")) socialLinks.push("Instagram");
    });

    const canonical = $('link[rel="canonical"]').attr("href") || "Not set";
    const robots = $('meta[name="robots"]').attr("content") || "Not set";
    const ogTitle = $('meta[property="og:title"]').attr("content") || "Not set";
    const ogImage = $('meta[property="og:image"]').attr("content") || "Not set";

    return {
      title,
      metaDescription,
      h1,
      headings: headings.slice(0, 10),
      techStack: [...new Set(techStack)],
      ctas: [...new Set(ctas)].slice(0, 8),
      totalImages,
      missingAlts,
      wordCount,
      navLinks: [...new Set(navLinks)].slice(0, 10),
      socialLinks: [...new Set(socialLinks)],
      canonical,
      robots,
      ogTitle,
      ogImage,
    };
  }  catch (error) {
    if (error.response?.status === 403 || error.response?.status === 401) {
      throw new Error("This site blocks scrapers. Try a different URL.");
    }
    if (error.response?.status === 404) {
      throw new Error("Page not found. Check the URL and try again.");
    }
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      throw new Error("Could not reach this site. Is the URL correct?");
    }
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      throw new Error("Site took too long to respond. Try again.");
    }
    if (error.response?.status === 429) {
      throw new Error("This site is rate limiting us. Try again in a moment.");
    }
    throw new Error("Could not scrape this site. It may be blocking automated access.");
}
}

module.exports = { scrapeWebsite };