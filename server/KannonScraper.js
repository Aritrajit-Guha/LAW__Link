const axios = require("axios");
const cheerio = require("cheerio");

// Simple extraction using regex (IPC, CrPC, Article, etc.)
function extractLawKeywords(text) {
  const matches = [];

  const ipcMatches = text.match(/(?:section|sec\.?)\s*(\d+)\s*(?:of\s+IPC|IPC)?/gi);
  if (ipcMatches) matches.push(...ipcMatches.map(m => m.trim()));

  const crpcMatches = text.match(/(?:section|sec\.?)\s*(\d+)\s*(?:of\s+CrPC|CrPC)/gi);
  if (crpcMatches) matches.push(...crpcMatches.map(m => m.trim()));

  const articleMatches = text.match(/article\s*(\d+)/gi);
  if (articleMatches) matches.push(...articleMatches.map(m => m.trim()));

  return matches.length > 0 ? matches : [text]; // Always return array
}

async function scrapeKanoon(query) {
  try {
    const lawKeywords = extractLawKeywords(query); // always an array
    const searchTerm = lawKeywords.join(" ");

    const kanoonSearchURL = `https://www.indiankanoon.org/search/?formInput=${encodeURIComponent(searchTerm)}`;

    const { data } = await axios.get(kanoonSearchURL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const $ = cheerio.load(data);
    const firstLink = $("a").filter((i, el) => {
      const href = $(el).attr("href");
      return href && href.startsWith("/doc");
    }).first();

    if (!firstLink.length) return "❌ No Kanoon.org content found.";

    const docLink = "https://www.indiankanoon.org" + firstLink.attr("href");

    const { data: docData } = await axios.get(docLink, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const $$ = cheerio.load(docData);
    const content = $$("#docContent").text().trim();

    const snippet = content.length > 1500 ? content.slice(0, 1500) + "..." : content;

    return `📚 Here's something from Kanoon.org related to your query:\n\n${snippet}\n\n🔗 Source: ${docLink}`;
  } catch (err) {
    console.error("Kanoon scrape error:", err.message);
    return "⚠️ Unable to fetch Kanoon.org results at the moment.";
  }
}

module.exports = scrapeKanoon;
