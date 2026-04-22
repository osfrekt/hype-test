export type PriceTier = "££" | "£££" | "££££" | "£££££";

export type Neighborhood =
  | "Mayfair"
  | "Soho"
  | "Marylebone"
  | "Chelsea"
  | "Knightsbridge"
  | "Fitzrovia"
  | "Clerkenwell"
  | "Kensington"
  | "White City"
  | "St James's"
  | "City";

export type SushiRestaurant = {
  slug: string;
  name: string;
  neighborhood: Neighborhood;
  address: string;
  price: PriceTier;
  priceLevel: number;
  avgPerPerson: number;
  style: "Omakase" | "Edomae" | "Modern Japanese" | "Izakaya" | "Kaiseki";
  specialty: string;
  description: string;
  scores: {
    fish: number;
    value: number;
    atmosphere: number;
    service: number;
    authenticity: number;
  };
  standout: string;
  reservation: "Essential" | "Recommended" | "Walk-in OK";
  michelinStars: 0 | 1 | 2 | 3;
};

export const RESTAURANTS: SushiRestaurant[] = [
  {
    slug: "the-araki",
    name: "The Araki",
    neighborhood: "Mayfair",
    address: "12 New Burlington St, W1S 3BF",
    price: "£££££",
    priceLevel: 5,
    avgPerPerson: 410,
    style: "Edomae",
    specialty: "Edomae omakase, aged fish",
    description:
      "Nine-seat counter serving a single, set edomae omakase. Famously strict, famously precise — consistently held as London's most serious sushi experience.",
    scores: { fish: 10, value: 5, atmosphere: 8, service: 10, authenticity: 10 },
    standout: "Tuna flown from Toyosu, aged in-house",
    reservation: "Essential",
    michelinStars: 2,
  },
  {
    slug: "endo-at-the-rotunda",
    name: "Endo at The Rotunda",
    neighborhood: "White City",
    address: "The Rotunda, 8th Floor, W12 7GF",
    price: "£££££",
    priceLevel: 5,
    avgPerPerson: 285,
    style: "Omakase",
    specialty: "16-course omakase with British seafood",
    description:
      "Endo Kazutoshi's counter on top of the old BBC Television Centre. Technically brilliant, theatrical, and the closest thing to Tokyo in West London.",
    scores: { fish: 10, value: 7, atmosphere: 10, service: 10, authenticity: 9 },
    standout: "Cornish crab rice, toro taco",
    reservation: "Essential",
    michelinStars: 2,
  },
  {
    slug: "sushi-kanesaka",
    name: "Sushi Kanesaka",
    neighborhood: "Mayfair",
    address: "45 Park Lane, W1K 1PN",
    price: "£££££",
    priceLevel: 5,
    avgPerPerson: 350,
    style: "Edomae",
    specialty: "Ginza-style edomae",
    description:
      "The London outpost of Shinji Kanesaka's Ginza institution. Pure edomae, no fusion, served inside 45 Park Lane.",
    scores: { fish: 10, value: 6, atmosphere: 9, service: 10, authenticity: 10 },
    standout: "Shari seasoned with red vinegar",
    reservation: "Essential",
    michelinStars: 1,
  },
  {
    slug: "taka-marylebone",
    name: "Taka Marylebone",
    neighborhood: "Marylebone",
    address: "18 Moxon St, W1U 4EW",
    price: "££££",
    priceLevel: 4,
    avgPerPerson: 150,
    style: "Omakase",
    specialty: "Counter omakase, exceptional tuna",
    description:
      "Quietly one of the best-value serious omakase seats in London. The tuna cuts rival places twice the price.",
    scores: { fish: 9, value: 8, atmosphere: 8, service: 9, authenticity: 9 },
    standout: "Chūtoro and otoro flight",
    reservation: "Recommended",
    michelinStars: 0,
  },
  {
    slug: "dinings-sw3",
    name: "Dinings SW3",
    neighborhood: "Chelsea",
    address: "Walton House, Walton St, SW3 2JH",
    price: "££££",
    priceLevel: 4,
    avgPerPerson: 130,
    style: "Modern Japanese",
    specialty: "Tar-tar chips, modern sushi",
    description:
      "Chef Tomonari Chiba's modern Japanese with a playful edge. Strong sushi, famous small plates, buzzy Chelsea garden.",
    scores: { fish: 8, value: 7, atmosphere: 9, service: 8, authenticity: 7 },
    standout: "Tuna tar-tar on crispy rice",
    reservation: "Recommended",
    michelinStars: 0,
  },
  {
    slug: "sushi-tetsu",
    name: "Sushi Tetsu",
    neighborhood: "Clerkenwell",
    address: "12 Jerusalem Passage, EC1V 4JP",
    price: "££££",
    priceLevel: 4,
    avgPerPerson: 140,
    style: "Edomae",
    specialty: "Tiny seven-seat omakase counter",
    description:
      "Toru Takahashi's seven-seat counter, famously hard to book. Immaculate edomae, no photos, no phones — just sushi.",
    scores: { fish: 9, value: 8, atmosphere: 8, service: 10, authenticity: 10 },
    standout: "Nightly ikura hand-cured in soy",
    reservation: "Essential",
    michelinStars: 0,
  },
  {
    slug: "yashin-ocean-house",
    name: "Yashin Ocean House",
    neighborhood: "Kensington",
    address: "117-119 Old Brompton Rd, SW7 3RN",
    price: "££££",
    priceLevel: 4,
    avgPerPerson: 120,
    style: "Modern Japanese",
    specialty: "Head-to-tail sushi",
    description:
      "Whole-fish sushi philosophy — uses every part of the catch. Flamboyant plates, reliably excellent cuts.",
    scores: { fish: 9, value: 7, atmosphere: 8, service: 8, authenticity: 8 },
    standout: "15-piece omakase head-to-tail",
    reservation: "Recommended",
    michelinStars: 0,
  },
  {
    slug: "ikeda",
    name: "Ikeda",
    neighborhood: "Mayfair",
    address: "30 Brook St, W1K 5DJ",
    price: "££££",
    priceLevel: 4,
    avgPerPerson: 110,
    style: "Edomae",
    specialty: "Old-school Mayfair sushi counter",
    description:
      "A Mayfair secret since 1983. Traditional, unshowy, beloved by Japanese expats who know what they're looking for.",
    scores: { fish: 9, value: 8, atmosphere: 7, service: 9, authenticity: 10 },
    standout: "Seasonal chirashi",
    reservation: "Recommended",
    michelinStars: 0,
  },
  {
    slug: "sushi-atelier",
    name: "Sushi Atelier",
    neighborhood: "Fitzrovia",
    address: "114 Great Portland St, W1W 6PH",
    price: "£££",
    priceLevel: 3,
    avgPerPerson: 75,
    style: "Modern Japanese",
    specialty: "À la carte sushi and maki",
    description:
      "All-day sushi from the Yashin team. Fair prices, creative rolls, a solid omakase at the counter.",
    scores: { fish: 8, value: 9, atmosphere: 7, service: 8, authenticity: 7 },
    standout: "Aburi salmon rolls",
    reservation: "Recommended",
    michelinStars: 0,
  },
  {
    slug: "jugemu",
    name: "Jugemu",
    neighborhood: "Soho",
    address: "3 Winnett St, W1D 6JY",
    price: "£££",
    priceLevel: 3,
    avgPerPerson: 70,
    style: "Izakaya",
    specialty: "Chef's counter izakaya",
    description:
      "Tucked down a Soho side street. Tight counter, Japanese crowd, sashimi cut to order and real izakaya energy.",
    scores: { fish: 8, value: 9, atmosphere: 8, service: 8, authenticity: 10 },
    standout: "Saba shime and nightly specials",
    reservation: "Essential",
    michelinStars: 0,
  },
  {
    slug: "taro-soho",
    name: "Taro Soho",
    neighborhood: "Soho",
    address: "10 Old Compton St, W1D 4TF",
    price: "££",
    priceLevel: 2,
    avgPerPerson: 35,
    style: "Modern Japanese",
    specialty: "Weekday lunch sushi sets",
    description:
      "The reliable, fairly-priced Soho standby. Not destination sushi — but consistent, quick, and honest.",
    scores: { fish: 6, value: 10, atmosphere: 6, service: 7, authenticity: 7 },
    standout: "£15 sushi lunch set",
    reservation: "Walk-in OK",
    michelinStars: 0,
  },
  {
    slug: "roka-charlotte-street",
    name: "Roka Charlotte Street",
    neighborhood: "Fitzrovia",
    address: "37 Charlotte St, W1T 1RR",
    price: "££££",
    priceLevel: 4,
    avgPerPerson: 110,
    style: "Modern Japanese",
    specialty: "Robata and sushi",
    description:
      "Loud, fun, expense-account contemporary Japanese. Sushi is solid but the robata grill is the reason to book.",
    scores: { fish: 7, value: 6, atmosphere: 9, service: 8, authenticity: 6 },
    standout: "Black cod and sushi platter",
    reservation: "Recommended",
    michelinStars: 0,
  },
  {
    slug: "zuma-knightsbridge",
    name: "Zuma",
    neighborhood: "Knightsbridge",
    address: "5 Raphael St, SW7 1DL",
    price: "£££££",
    priceLevel: 5,
    avgPerPerson: 160,
    style: "Modern Japanese",
    specialty: "Contemporary Japanese, scene dining",
    description:
      "The original scene restaurant. Sushi is genuinely good — it just happens inside a room that's louder than it is purist.",
    scores: { fish: 8, value: 5, atmosphere: 10, service: 8, authenticity: 6 },
    standout: "Seabass usuzukuri",
    reservation: "Essential",
    michelinStars: 0,
  },
  {
    slug: "nobu-park-lane",
    name: "Nobu Park Lane",
    neighborhood: "Mayfair",
    address: "22 Park Lane, W1K 1BE",
    price: "£££££",
    priceLevel: 5,
    avgPerPerson: 180,
    style: "Modern Japanese",
    specialty: "Peruvian-Japanese fusion",
    description:
      "Still the original glamour sushi room in London. The fusion isn't purist but the craft is real and the miso cod is iconic for a reason.",
    scores: { fish: 8, value: 5, atmosphere: 9, service: 9, authenticity: 5 },
    standout: "Yellowtail sashimi with jalapeño",
    reservation: "Essential",
    michelinStars: 0,
  },
  {
    slug: "sushisamba",
    name: "Sushisamba Heron Tower",
    neighborhood: "City",
    address: "110 Bishopsgate, EC2N 4AY",
    price: "££££",
    priceLevel: 4,
    avgPerPerson: 100,
    style: "Modern Japanese",
    specialty: "38th-floor Japanese-Brazilian",
    description:
      "The view is the starter. Sushi is fine, not serious — come for the skyline, not for edomae precision.",
    scores: { fish: 6, value: 5, atmosphere: 10, service: 7, authenticity: 4 },
    standout: "Rooftop sunset omakase",
    reservation: "Recommended",
    michelinStars: 0,
  },
  {
    slug: "sake-no-hana",
    name: "Sake no Hana",
    neighborhood: "St James's",
    address: "23 St James's St, SW1A 1HA",
    price: "££££",
    priceLevel: 4,
    avgPerPerson: 130,
    style: "Kaiseki",
    specialty: "Modern kaiseki and sushi",
    description:
      "A grown-up room in St James's. Traditional kaiseki rhythm with a strong sushi counter tucked at the back.",
    scores: { fish: 8, value: 7, atmosphere: 9, service: 9, authenticity: 8 },
    standout: "Seasonal 8-course kaiseki",
    reservation: "Recommended",
    michelinStars: 0,
  },
];

export type Weights = {
  fish: number;
  value: number;
  atmosphere: number;
  service: number;
  authenticity: number;
};

export const DEFAULT_WEIGHTS: Weights = {
  fish: 35,
  value: 15,
  atmosphere: 15,
  service: 15,
  authenticity: 20,
};

export const WEIGHT_LABELS: Record<
  keyof Weights,
  { label: string; hint: string; emoji: string }
> = {
  fish: { label: "Fish quality", hint: "Sourcing, freshness, cuts", emoji: "🐟" },
  value: { label: "Value", hint: "What you get per pound", emoji: "💷" },
  atmosphere: { label: "Atmosphere", hint: "Room, vibe, view", emoji: "🏮" },
  service: { label: "Service", hint: "Counter craft, hospitality", emoji: "🤝" },
  authenticity: {
    label: "Authenticity",
    hint: "Tradition vs. fusion",
    emoji: "🎌",
  },
};

export function scoreRestaurant(r: SushiRestaurant, w: Weights): number {
  const totalWeight = w.fish + w.value + w.atmosphere + w.service + w.authenticity;
  if (totalWeight === 0) return 0;
  const weighted =
    r.scores.fish * w.fish +
    r.scores.value * w.value +
    r.scores.atmosphere * w.atmosphere +
    r.scores.service * w.service +
    r.scores.authenticity * w.authenticity;
  return (weighted / totalWeight) * 10;
}

export function rankRestaurants(
  restaurants: SushiRestaurant[],
  w: Weights,
): Array<SushiRestaurant & { score: number }> {
  return restaurants
    .map((r) => ({ ...r, score: scoreRestaurant(r, w) }))
    .sort((a, b) => b.score - a.score);
}
