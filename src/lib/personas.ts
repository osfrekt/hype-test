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
