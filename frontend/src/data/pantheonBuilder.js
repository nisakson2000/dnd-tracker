/**
 * Pantheon Builder — Deities with domains, alignment, symbols, and worship practices.
 */

export const DEFAULT_PANTHEON = [
  {
    name: 'Solarius',
    title: 'The Radiant One',
    alignment: 'Lawful Good',
    domains: ['Light', 'Life'],
    symbol: 'A golden sun with an eye at its center',
    worshipPractices: 'Dawn prayers, offerings of gold coins, lighting candles for the dead.',
    holyDay: 'Summer Solstice — Festival of Radiance',
    temples: 'Grand cathedrals with stained glass windows that catch the morning sun.',
    clergy: 'Wear white and gold robes. Take vows of honesty.',
    favored: 'Paladins, clerics, farmers',
    personality: 'Benevolent but demanding. Expects devotion and action against darkness.',
  },
  {
    name: 'Noctharion',
    title: 'The Shadow Weaver',
    alignment: 'Chaotic Neutral',
    domains: ['Trickery', 'Knowledge'],
    symbol: 'A crescent moon wrapped in spider silk',
    worshipPractices: 'Moonlit rituals, whispered secrets left at crossroads, sleight of hand performances.',
    holyDay: 'New Moon — Night of Masks',
    temples: 'Hidden shrines in alleyways and underground. No two look alike.',
    clergy: 'Wear dark clothes with silver accents. Masters of disguise.',
    favored: 'Rogues, spies, scholars of forbidden knowledge',
    personality: 'Playful and unpredictable. Rewards cleverness over strength.',
  },
  {
    name: 'Terrath',
    title: 'The Stone Father',
    alignment: 'Lawful Neutral',
    domains: ['Forge', 'War'],
    symbol: 'A hammer striking an anvil, sparks forming a crown',
    worshipPractices: 'Crafting offerings, oath-swearing on iron, annual weapon blessing ceremonies.',
    holyDay: 'First day of autumn — Day of the Forge',
    temples: 'Built into mountainsides. Forges are altars.',
    clergy: 'Wear leather aprons over chain mail. All can smith.',
    favored: 'Dwarves, smiths, warriors, miners',
    personality: 'Stern and fair. Values hard work, honesty, and craftsmanship above all.',
  },
  {
    name: 'Verdania',
    title: 'The Green Mother',
    alignment: 'Neutral Good',
    domains: ['Nature', 'Life'],
    symbol: 'An oak tree with roots that form a human face',
    worshipPractices: 'Planting trees, animal sanctuaries, seasonal fruit offerings at sacred groves.',
    holyDay: 'Spring Equinox — Bloom Festival',
    temples: 'Living temples grown from ancient trees. No worked stone.',
    clergy: 'Wear undyed linen. Bare feet. Animal companions.',
    favored: 'Druids, rangers, farmers, herbalists',
    personality: 'Patient and nurturing, but terrifyingly wrathful against those who despoil nature.',
  },
  {
    name: 'Mortessa',
    title: 'The Pale Lady',
    alignment: 'True Neutral',
    domains: ['Death', 'Grave'],
    symbol: 'A white lily growing from a skull',
    worshipPractices: 'Tending graves, last rites for the dead, bone divination.',
    holyDay: 'Feast of the Moon — Remembrance of the Dead',
    temples: 'Quiet mausoleums and catacombs. Always cool inside.',
    clergy: 'Wear grey robes with white trim. Speak softly.',
    favored: 'Grave clerics, undertakers, those who have lost loved ones',
    personality: 'Compassionate but absolute. Death is natural and should not be feared or cheated.',
  },
  {
    name: 'Tempestus',
    title: 'The Storm Lord',
    alignment: 'Chaotic Good',
    domains: ['Tempest', 'War'],
    symbol: 'A lightning bolt clutched in a fist',
    worshipPractices: 'Shouting prayers into storms, competitive athletics, acts of bravery.',
    holyDay: 'First thunderstorm of spring — Thunder\'s Call',
    temples: 'Open-air arenas and clifftop shrines. No roofs.',
    clergy: 'Wear blue and white. Scarred from lightning marks (badges of honor).',
    favored: 'Sailors, warriors, adventurers, revolutionaries',
    personality: 'Passionate and wild. Hates tyranny. Loves courage and dramatic gestures.',
  },
  {
    name: 'Vexxora',
    title: 'The Whispering Flame',
    alignment: 'Neutral Evil',
    domains: ['Arcana', 'Knowledge'],
    symbol: 'An open book with pages made of purple flame',
    worshipPractices: 'Secret research, sacrificing lesser magic items, forbidden knowledge exchanges.',
    holyDay: 'Eclipse — The Unveiling',
    temples: 'Hidden libraries and laboratories. Protected by magical traps.',
    clergy: 'Wear deep purple. Cover their faces. Speak in riddles.',
    favored: 'Power-hungry wizards, artificers seeking forbidden magic, knowledge seekers',
    personality: 'Seductive and dangerous. Offers knowledge freely — but the price is always higher than expected.',
  },
  {
    name: 'Brawlheim',
    title: 'The Laughing Champion',
    alignment: 'Chaotic Neutral',
    domains: ['War', 'Trickery'],
    symbol: 'A broken sword through a tankard of ale',
    worshipPractices: 'Bar fights, competitions, toasts before battle, refusing to back down.',
    holyDay: 'Midsummer — The Great Brawl',
    temples: 'The finest tavern in any town. Seriously.',
    clergy: 'No formal clergy. Anyone who buys a round speaks for Brawlheim.',
    favored: 'Barbarians, fighters, anyone who\'d rather fight than talk',
    personality: 'Loud, boisterous, and surprisingly wise. Believes the best truths come out in a fight.',
  },
];

export const DIVINE_DOMAINS = [
  'Arcana', 'Death', 'Forge', 'Grave', 'Knowledge', 'Life', 'Light',
  'Nature', 'Order', 'Peace', 'Tempest', 'Trickery', 'Twilight', 'War',
];

export const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function getDeity(name) {
  return DEFAULT_PANTHEON.find(d => d.name === name) || null;
}

export function getDeityByDomain(domain) {
  return DEFAULT_PANTHEON.filter(d => d.domains.includes(domain));
}

export function generateRandomDeity() {
  return pick(DEFAULT_PANTHEON);
}

export function getAllDeities() {
  return [...DEFAULT_PANTHEON];
}
