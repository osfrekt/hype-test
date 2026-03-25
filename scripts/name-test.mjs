/**
 * A/B Name Test using HypeTest's exact methodology
 *
 * Runs 50 simulated consumer personas through structured survey
 * comparing "LaunchTest" vs "HypeTest" as names for an AI-powered
 * consumer research platform.
 *
 * Same approach: temperature=1.0, conjoint-style elicitation,
 * demographically diverse panel, structured JSON responses.
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";

// Load .env.local manually (dotenv not reliably available)
try {
  const envContent = readFileSync(".env.local", "utf8");
  for (const line of envContent.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {}

const anthropic = new Anthropic();

const PANEL_SIZE = 50;
const BATCH_SIZE = 10;

// ── Persona generation (identical to personas.ts) ──────────────────

const AGES = [22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58, 62, 67];
const GENDERS = ["male", "female", "non-binary"];
const GENDER_WEIGHTS = [0.48, 0.48, 0.04];
const INCOME_BRACKETS = [25000, 35000, 45000, 55000, 65000, 75000, 85000, 100000, 125000, 150000, 200000];

const LOCATIONS = [
  "a suburban area in the Midwest",
  "a major city on the East Coast",
  "a small town in the South",
  "the San Francisco Bay Area",
  "a suburb of Los Angeles",
  "a mid-size city in Texas",
  "a rural area in the Pacific Northwest",
  "a suburb of Chicago",
  "an urban area in the Southeast",
  "a college town in New England",
  "a suburb of Denver",
  "an urban area in the Mid-Atlantic",
];

const LIFESTYLES = [
  "You are budget-conscious and compare prices before buying.",
  "You tend to buy premium products and value quality over price.",
  "You are an early adopter who enjoys trying new products.",
  "You are pragmatic and only buy what you need.",
  "You research products extensively before purchasing.",
  "You are brand-loyal and stick to what you know.",
  "You are influenced by reviews and recommendations from friends.",
  "You prioritise convenience and time-saving over cost.",
  "You care about sustainability and ethical sourcing.",
  "You enjoy discovering new brands and products online.",
];

const CATEGORY_CONTEXTS = [
  "You occasionally use market research or product testing tools.",
  "You frequently work with consumer insights and consider yourself knowledgeable about research platforms.",
  "You have limited experience with market research tools but are open to trying them.",
  "You have been looking for a better way to validate product ideas recently.",
  "You currently use a competitor product for consumer research.",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function weightedRandom(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) { r -= weights[i]; if (r <= 0) return items[i]; }
  return items[items.length - 1];
}

function generatePanel(size) {
  const personas = [];
  for (let i = 0; i < size; i++) {
    personas.push({
      id: i,
      age: pick(AGES),
      gender: weightedRandom(GENDERS, GENDER_WEIGHTS),
      income: pick(INCOME_BRACKETS),
      location: pick(LOCATIONS),
      lifestyle: pick(LIFESTYLES),
      categoryContext: pick(CATEGORY_CONTEXTS),
    });
  }
  return personas;
}

// ── Product description (same for both names) ──────────────────

const PRODUCT_DESCRIPTION = `An AI-powered consumer research platform that simulates realistic consumer panels to evaluate products quickly and affordably. Instead of traditional market research (which costs $20-50k and takes weeks), this platform generates a panel of 50 diverse simulated consumer personas and runs structured survey methodology through them to produce research-grade insights in under 2 minutes. It provides purchase intent scoring, willingness-to-pay estimation, feature importance ranking, consumer concerns analysis, and realistic consumer verbatims — all grounded in peer-reviewed academic methodology.`;

const FEATURES = [
  "AI-simulated consumer panels",
  "Results in under 2 minutes",
  "Research-grade methodology",
  "Affordable alternative to traditional research",
  "Purchase intent and pricing insights",
];

const PRICE_RANGE = { min: 29, max: 149 };

// ── Query each persona (identical methodology) ──────────────────

async function queryPersona(persona, productName) {
  const midPrice = Math.round((PRICE_RANGE.min + PRICE_RANGE.max) / 2);
  const lowPrice = PRICE_RANGE.min;
  const highPrice = PRICE_RANGE.max;

  const prompt = `You are a ${persona.age}-year-old ${persona.gender} living in ${persona.location} with an annual household income of approximately $${persona.income.toLocaleString()}. ${persona.lifestyle} ${persona.categoryContext}

You are participating in a consumer research study about a product called "${productName}".

Product description: ${PRODUCT_DESCRIPTION}

Key features: ${FEATURES.join(", ")}

Please answer the following questions as this consumer would. Be realistic — not everyone likes every product. Consider your income, lifestyle, and actual needs.

1. PURCHASE INTENT: On a scale of 1-5, how likely would you be to purchase this product?
   1 = Definitely would not buy
   2 = Probably would not buy
   3 = Might or might not buy
   4 = Probably would buy
   5 = Definitely would buy

2. PRICE SENSITIVITY: Which of these would you choose?
   A) Buy at $${lowPrice} (basic version)
   B) Buy at $${midPrice} (standard version with all features)
   C) Buy at $${highPrice} (premium version with extras)
   D) Would not purchase at any of these prices

3. FEATURE IMPORTANCE: Rank these features from most to least important (1 = most important):
${FEATURES.map((f, i) => `   ${String.fromCharCode(65 + i)}) ${f}`).join("\n")}

4. TOP CONCERN: What is your single biggest concern or hesitation about this product? (One sentence)

5. TOP POSITIVE: What is the single most appealing thing about this product? (One sentence)

6. NAME REACTION: How does the name "${productName}" make you feel about the product? Does it sound trustworthy, exciting, confusing, or something else? (One sentence)

Respond in this exact JSON format:
{
  "purchaseIntent": <number 1-5>,
  "priceChoice": "<A, B, C, or D>",
  "featureRanking": [<list of feature letters from most to least important>],
  "topConcern": "<one sentence>",
  "topPositive": "<one sentence>",
  "nameReaction": "<one sentence>"
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      temperature: 1.0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    const priceMap = { A: "low", B: "mid", C: "high", D: "none" };

    const featureRankings = (parsed.featureRanking || []).map((letter, index) => {
      const fi = typeof letter === "string" ? letter.charCodeAt(0) - 65 : Number(letter);
      const safeIdx = Math.min(Math.max(fi, 0), FEATURES.length - 1);
      return { feature: FEATURES[safeIdx] || FEATURES[0], importance: FEATURES.length - index };
    });

    return {
      personaId: persona.id,
      personaLabel: `${persona.age}yo ${persona.gender}, $${(persona.income / 1000).toFixed(0)}k`,
      purchaseIntent: Math.min(5, Math.max(1, Number(parsed.purchaseIntent))),
      wtpChoice: priceMap[parsed.priceChoice] || "none",
      featureRankings,
      topConcern: parsed.topConcern || "No specific concern",
      topPositive: parsed.topPositive || "Interesting concept",
      nameReaction: parsed.nameReaction || "No strong reaction",
    };
  } catch (e) {
    return {
      personaId: persona.id,
      personaLabel: `${persona.age}yo ${persona.gender}`,
      purchaseIntent: 3,
      wtpChoice: "mid",
      featureRankings: FEATURES.map((f, i) => ({ feature: f, importance: FEATURES.length - i })),
      topConcern: "Need more information before deciding",
      topPositive: "The concept is interesting",
      nameReaction: "Neutral",
    };
  }
}

// ── Aggregation (identical to research-engine.ts) ──────────────────

function aggregate(responses) {
  const n = responses.length;
  const midPrice = Math.round((PRICE_RANGE.min + PRICE_RANGE.max) / 2);

  // Purchase intent
  const intentCounts = [0, 0, 0, 0, 0];
  responses.forEach(r => intentCounts[r.purchaseIntent - 1]++);
  const intentLabels = ["Definitely not", "Probably not", "Maybe", "Probably yes", "Definitely yes"];
  const purchaseIntentScore = Math.round((responses.reduce((sum, r) => sum + r.purchaseIntent, 0) / n / 5) * 100);

  // WTP
  const wtpCounts = { low: 0, mid: 0, high: 0, none: 0 };
  responses.forEach(r => wtpCounts[r.wtpChoice]++);
  const buyers = wtpCounts.low + wtpCounts.mid + wtpCounts.high;
  const avgWtp = buyers > 0
    ? (wtpCounts.low * PRICE_RANGE.min + wtpCounts.mid * midPrice + wtpCounts.high * PRICE_RANGE.max) / buyers
    : 0;

  // Feature importance
  const featureScores = {};
  FEATURES.forEach(f => featureScores[f] = 0);
  responses.forEach(r => r.featureRankings.forEach(fr => {
    if (featureScores[fr.feature] !== undefined) featureScores[fr.feature] += fr.importance;
  }));
  const maxFS = Math.max(...Object.values(featureScores), 1);
  const featureImportance = Object.entries(featureScores)
    .map(([feature, score]) => ({ feature, score: Math.round((score / maxFS) * 100) }))
    .sort((a, b) => b.score - a.score);

  // Top concerns & positives
  const concerns = [...new Set(responses.map(r => r.topConcern))].slice(0, 5);
  const positives = [...new Set(responses.map(r => r.topPositive))].slice(0, 5);
  const nameReactions = responses.map(r => r.nameReaction);

  return {
    purchaseIntentScore,
    intentDistribution: intentLabels.map((label, i) => ({ label, count: intentCounts[i], pct: Math.round(intentCounts[i] / n * 100) })),
    wtpAvg: Math.round(avgWtp),
    wtpDistribution: wtpCounts,
    buyerRate: Math.round(buyers / n * 100),
    featureImportance,
    topConcerns: concerns,
    topPositives: positives,
    nameReactions,
  };
}

// ── Run the test ──────────────────────────────────────────────────

async function runNameTest(name, panel) {
  console.log(`\n🔬 Testing "${name}" with ${panel.length} personas...`);
  const allResponses = [];

  for (let i = 0; i < panel.length; i += BATCH_SIZE) {
    const batch = panel.slice(i, i + BATCH_SIZE);
    const batchResponses = await Promise.all(batch.map(p => queryPersona(p, name)));
    allResponses.push(...batchResponses);
    console.log(`   Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(panel.length / BATCH_SIZE)} complete`);
  }

  return { name, responses: allResponses, results: aggregate(allResponses) };
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  HYPETEST A/B NAME TEST");
  console.log("  LaunchTest vs HypeTest");
  console.log("  Panel: 50 personas × 2 names = 100 queries");
  console.log("  Methodology: temperature=1.0, conjoint-style");
  console.log("═══════════════════════════════════════════════════");

  // Generate ONE panel, used for both names (fair comparison)
  const panel = generatePanel(PANEL_SIZE);

  const [resultA, resultB] = await Promise.all([
    runNameTest("LaunchTest", panel),
    runNameTest("HypeTest", panel),
  ]);

  // ── Print results ──

  console.log("\n\n═══════════════════════════════════════════════════");
  console.log("  RESULTS");
  console.log("═══════════════════════════════════════════════════");

  for (const r of [resultA, resultB]) {
    const res = r.results;
    const color = res.purchaseIntentScore > 60 ? "🟢" : res.purchaseIntentScore >= 40 ? "🟡" : "🔴";

    console.log(`\n─── ${r.name} ───`);
    console.log(`\n  Purchase Intent: ${color} ${res.purchaseIntentScore}%`);
    console.log(`  Distribution:`);
    res.intentDistribution.forEach(d => console.log(`    ${d.label}: ${d.count} (${d.pct}%)`));

    console.log(`\n  Willingness to Pay: $${res.wtpAvg} avg`);
    console.log(`  Buyer Rate: ${res.buyerRate}% would purchase`);
    console.log(`  WTP breakdown: Low($${PRICE_RANGE.min}): ${res.wtpDistribution.low} | Mid($${Math.round((PRICE_RANGE.min + PRICE_RANGE.max) / 2)}): ${res.wtpDistribution.mid} | High($${PRICE_RANGE.max}): ${res.wtpDistribution.high} | None: ${res.wtpDistribution.none}`);

    console.log(`\n  Feature Importance:`);
    res.featureImportance.forEach(f => console.log(`    ${f.feature}: ${f.score}/100`));

    console.log(`\n  Top Concerns:`);
    res.topConcerns.forEach(c => console.log(`    • ${c}`));

    console.log(`\n  Top Positives:`);
    res.topPositives.forEach(p => console.log(`    • ${p}`));

    console.log(`\n  Name Reactions (sample):`);
    // Show 8 diverse reactions
    const sampledReactions = res.nameReactions.sort(() => Math.random() - 0.5).slice(0, 8);
    sampledReactions.forEach(nr => console.log(`    • "${nr}"`));
  }

  // ── Head-to-head comparison ──

  const a = resultA.results;
  const b = resultB.results;
  const intentDiff = a.purchaseIntentScore - b.purchaseIntentScore;
  const wtpDiff = a.wtpAvg - b.wtpAvg;
  const buyerDiff = a.buyerRate - b.buyerRate;

  console.log("\n\n═══════════════════════════════════════════════════");
  console.log("  HEAD-TO-HEAD COMPARISON");
  console.log("═══════════════════════════════════════════════════");
  console.log(`\n  Purchase Intent:  LaunchTest ${a.purchaseIntentScore}%  vs  HypeTest ${b.purchaseIntentScore}%  (${intentDiff > 0 ? "+" : ""}${intentDiff})`);
  console.log(`  Avg WTP:          LaunchTest $${a.wtpAvg}  vs  HypeTest $${b.wtpAvg}  (${wtpDiff > 0 ? "+$" : "-$"}${Math.abs(wtpDiff)})`);
  console.log(`  Buyer Rate:       LaunchTest ${a.buyerRate}%  vs  HypeTest ${b.buyerRate}%  (${buyerDiff > 0 ? "+" : ""}${buyerDiff}pp)`);

  const winner = (intentDiff + buyerDiff) > 0 ? "LaunchTest" : (intentDiff + buyerDiff) < 0 ? "HypeTest" : "TIE";
  console.log(`\n  ⭐ Overall signal: ${winner === "TIE" ? "Too close to call" : `${winner} edges ahead`}`);

  console.log("\n  ⚠️  Confidence note: Results based on LLM-simulated consumer panel.");
  console.log("     Best used for directional insights. Not a replacement for real user testing.");
  console.log("═══════════════════════════════════════════════════\n");
}

main().catch(console.error);
