import Anthropic from "@anthropic-ai/sdk";
import type { ConsumerPersona } from "@/types/research";

const AGES = [22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58, 62, 67];
const GENDERS: ConsumerPersona["gender"][] = ["male", "female", "non-binary"];
const GENDER_WEIGHTS = [0.48, 0.48, 0.04];

const INCOME_BRACKETS = [
  25000, 35000, 45000, 55000, 65000, 75000, 85000, 100000, 125000, 150000,
  200000,
];

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

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInRange(min: number, max: number, options: number[]): number {
  const filtered = options.filter((v) => v >= min && v <= max);
  return filtered.length > 0 ? pick(filtered) : pick(options);
}

export function generatePanel(
  size: number,
  category: string
): ConsumerPersona[] {
  const personas: ConsumerPersona[] = [];

  for (let i = 0; i < size; i++) {
    personas.push({
      id: i,
      age: pick(AGES),
      gender: weightedRandom(GENDERS, GENDER_WEIGHTS),
      income: pick(INCOME_BRACKETS),
      location: pick(LOCATIONS),
      lifestyle: pick(LIFESTYLES),
      categoryContext: getCategoryContext(category),
    });
  }

  return personas;
}

interface DemographicSkew {
  ageRange: [number, number];
  genderSkew: { male: number; female: number; "non-binary": number };
  incomeRange: [number, number];
  locationSkew: string[];
  lifestyleSkew: string[];
}

export async function generateTargetedPanel(
  size: number,
  category: string,
  targetDescription: string
): Promise<ConsumerPersona[]> {
  let skew: DemographicSkew;

  try {
    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Given this target consumer description, suggest demographic skews for a consumer research panel. Return ONLY a JSON object.

Target: ${targetDescription}

Return this exact format:
{
  "ageRange": [minAge, maxAge],
  "genderSkew": { "male": 0.0-1.0, "female": 0.0-1.0, "non-binary": 0.0-1.0 },
  "incomeRange": [minIncome, maxIncome],
  "locationSkew": ["location description 1", "location description 2"],
  "lifestyleSkew": ["lifestyle trait 1", "lifestyle trait 2"]
}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON");
    skew = JSON.parse(match[0]);
  } catch {
    return generatePanel(size, category);
  }

  const personas: ConsumerPersona[] = [];
  const targetCount = Math.round(size * 0.8);
  const generalCount = size - targetCount;

  // 80% targeted personas
  for (let i = 0; i < targetCount; i++) {
    const genderWeights = [
      skew.genderSkew?.male ?? 0.48,
      skew.genderSkew?.female ?? 0.48,
      skew.genderSkew?.["non-binary"] ?? 0.04,
    ];

    const ageMin = skew.ageRange?.[0] ?? 22;
    const ageMax = skew.ageRange?.[1] ?? 67;
    const incomeMin = skew.incomeRange?.[0] ?? 25000;
    const incomeMax = skew.incomeRange?.[1] ?? 200000;

    const locationPool =
      skew.locationSkew?.length > 0 ? skew.locationSkew : LOCATIONS;
    const lifestylePool =
      skew.lifestyleSkew?.length > 0
        ? skew.lifestyleSkew.map(
            (trait) => `You ${trait.charAt(0).toLowerCase()}${trait.slice(1)}.`
          )
        : LIFESTYLES;

    personas.push({
      id: i,
      age: randomInRange(ageMin, ageMax, AGES),
      gender: weightedRandom(GENDERS, genderWeights),
      income: randomInRange(incomeMin, incomeMax, INCOME_BRACKETS),
      location: pick(locationPool),
      lifestyle: pick(lifestylePool),
      categoryContext: getCategoryContext(category),
    });
  }

  // 20% general population for contrast
  for (let i = 0; i < generalCount; i++) {
    personas.push({
      id: targetCount + i,
      age: pick(AGES),
      gender: weightedRandom(GENDERS, GENDER_WEIGHTS),
      income: pick(INCOME_BRACKETS),
      location: pick(LOCATIONS),
      lifestyle: pick(LIFESTYLES),
      categoryContext: getCategoryContext(category),
    });
  }

  return personas;
}

function getCategoryContext(category: string): string {
  const contexts = [
    `You occasionally purchase products in the ${category} category.`,
    `You frequently shop for ${category} products and consider yourself knowledgeable.`,
    `You have limited experience with ${category} products but are open to trying them.`,
    `You have been looking for a better ${category} solution recently.`,
    `You currently use a competitor product in the ${category} space.`,
  ];
  return pick(contexts);
}
