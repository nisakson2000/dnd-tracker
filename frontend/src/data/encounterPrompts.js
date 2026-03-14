const ENCOUNTER_PROMPTS = [
  // ── Combat ──────────────────────────────────────────────
  {
    id: 'combat-01',
    category: 'combat',
    title: 'Bandit Ambush',
    prompt: 'Bandits ambush the party on the road.',
  },
  {
    id: 'combat-02',
    category: 'combat',
    title: 'Wolf Pack at Dusk',
    prompt: 'A pack of wolves stalks the party from the treeline and attacks at dusk.',
  },
  {
    id: 'combat-03',
    category: 'combat',
    title: 'Dying Soldier Warning',
    prompt: 'A wounded soldier staggers into camp and dies — his killers are close behind.',
  },
  {
    id: 'combat-04',
    category: 'combat',
    title: 'Mercenary Roadblock',
    prompt: 'Mercenaries hired by a rival faction block the road and demand the party turn back.',
  },
  {
    id: 'combat-05',
    category: 'combat',
    title: 'Targeted Bounty Hunter',
    prompt: 'A bounty hunter is hunting one of the player characters specifically and confronts them in town.',
  },
  {
    id: 'combat-06',
    category: 'combat',
    title: 'Bridge Troll Toll',
    prompt: 'A troll lurking beneath a stone bridge demands a toll of flesh or gold — refusal means a fight.',
  },
  {
    id: 'combat-07',
    category: 'combat',
    title: 'Undead Rising',
    prompt: 'The ground in an old battlefield churns as skeletal warriors claw their way to the surface.',
  },

  // ── Social & Intrigue ───────────────────────────────────
  {
    id: 'social-01',
    category: 'social',
    title: 'Hooded Informant',
    prompt: 'A hooded figure approaches and offers critical information in exchange for an unspecified future favour.',
  },
  {
    id: 'social-02',
    category: 'social',
    title: 'Guard Inspection',
    prompt: 'Town guards demand to inspect the party\'s cargo and papers before allowing entry.',
  },
  {
    id: 'social-03',
    category: 'social',
    title: 'Sealed Letter Delivery',
    prompt: 'A noble\'s servant delivers a sealed letter addressed to one character by name.',
  },
  {
    id: 'social-04',
    category: 'social',
    title: 'Faction Crossfire',
    prompt: 'Two rival factions are in a heated public argument and pull the party into the middle.',
  },
  {
    id: 'social-05',
    category: 'social',
    title: 'Tavern Duel Challenge',
    prompt: 'A boisterous knight challenges a party member to a public duel of honour over a perceived slight.',
  },
  {
    id: 'social-06',
    category: 'social',
    title: 'Undercover Noble',
    prompt: 'A beggar the party helped earlier reveals themselves as a disguised noble and offers patronage.',
  },
  {
    id: 'social-07',
    category: 'social',
    title: 'Festival Invitation',
    prompt: 'The local lord personally invites the party to a grand feast — but the guest list includes their enemies.',
  },

  // ── Theft & Crime ───────────────────────────────────────
  {
    id: 'theft-01',
    category: 'theft',
    title: 'Pickpocket Strike',
    prompt: 'A pickpocket attempts to lift something from a distracted character in a crowded market.',
  },
  {
    id: 'theft-02',
    category: 'theft',
    title: 'Camp Looted Overnight',
    prompt: 'The party\'s camp is looted overnight — important items are missing when they wake.',
  },
  {
    id: 'theft-03',
    category: 'theft',
    title: 'Gang Road Toll',
    prompt: 'A local gang demands a road toll and threatens violence if the party refuses to pay.',
  },
  {
    id: 'theft-04',
    category: 'theft',
    title: 'False Accusation',
    prompt: 'A merchant publicly accuses a player character of theft and demands the guards intervene.',
  },
  {
    id: 'theft-05',
    category: 'theft',
    title: 'Stolen Mount',
    prompt: 'The party wakes to find their horses or mounts have been stolen in the night, with tracks leading into the wilderness.',
  },
  {
    id: 'theft-06',
    category: 'theft',
    title: 'Blackmail Note',
    prompt: 'A character finds a blackmail note in their belongings threatening to expose a secret unless they leave a payment.',
  },

  // ── Exploration ─────────────────────────────────────────
  {
    id: 'exploration-01',
    category: 'exploration',
    title: 'Waterfall Cave Entrance',
    prompt: 'A hidden cave entrance concealed behind a waterfall is spotted by the most perceptive character.',
  },
  {
    id: 'exploration-02',
    category: 'exploration',
    title: 'Abandoned Campsite',
    prompt: 'An abandoned campsite with signs of a violent struggle — blood, torn fabric, and scattered supplies.',
  },
  {
    id: 'exploration-03',
    category: 'exploration',
    title: 'Glowing Tree Symbol',
    prompt: 'A strange symbol carved into a tree pulses with magical light when a character draws near.',
  },
  {
    id: 'exploration-04',
    category: 'exploration',
    title: 'Ground Collapse',
    prompt: 'The ground gives way beneath one character, dropping them into a dark underground space.',
  },
  {
    id: 'exploration-05',
    category: 'exploration',
    title: 'Overgrown Ruins',
    prompt: 'Crumbling ruins overtaken by thick vines are partially visible through the forest canopy ahead.',
  },
  {
    id: 'exploration-06',
    category: 'exploration',
    title: 'Ancient Stone Marker',
    prompt: 'A weathered stone marker at a crossroads bears inscriptions in a language only one character can read.',
  },
  {
    id: 'exploration-07',
    category: 'exploration',
    title: 'Echoing Mine Shaft',
    prompt: 'An abandoned mine shaft emits a low hum and a faint breeze that smells of sulfur.',
  },

  // ── Environmental ───────────────────────────────────────
  {
    id: 'environmental-01',
    category: 'environmental',
    title: 'Sudden Storm',
    prompt: 'A sudden storm forces the party to find shelter immediately or risk lightning and flooding.',
  },
  {
    id: 'environmental-02',
    category: 'environmental',
    title: 'Destroyed Bridge',
    prompt: 'A flooding river has destroyed the only bridge — the party must find another way across.',
  },
  {
    id: 'environmental-03',
    category: 'environmental',
    title: 'Bitter Cold Sets In',
    prompt: 'Extreme cold sets in rapidly — Constitution saves or the party suffers exhaustion.',
  },
  {
    id: 'environmental-04',
    category: 'environmental',
    title: 'Lost the Trail',
    prompt: 'The party loses the trail as fog rolls in thick across the landscape.',
  },
  {
    id: 'environmental-05',
    category: 'environmental',
    title: 'Rockslide Ahead',
    prompt: 'A rockslide blocks the mountain pass, and the unstable ground threatens further collapse.',
  },
  {
    id: 'environmental-06',
    category: 'environmental',
    title: 'Sinking Marshland',
    prompt: 'The path leads through treacherous marshland — one wrong step and a character begins to sink.',
  },

  // ── Moral Dilemma ───────────────────────────────────────
  {
    id: 'moral-01',
    category: 'moral_dilemma',
    title: 'Starving Refugees',
    prompt: 'A family of refugees begs for food and the party is already running low on supplies.',
  },
  {
    id: 'moral-02',
    category: 'moral_dilemma',
    title: 'Captured Enemy',
    prompt: 'A captured enemy soldier is brought unconscious to the party — what do they do with him?',
  },
  {
    id: 'moral-03',
    category: 'moral_dilemma',
    title: 'Child Pickpocket',
    prompt: 'A child pickpocket is caught and tearfully explains her gang will punish her if she returns empty-handed.',
  },
  {
    id: 'moral-04',
    category: 'moral_dilemma',
    title: 'Monster Guarding Eggs',
    prompt: 'A badly wounded monster guards a nest of eggs and will not attack unless provoked.',
  },
  {
    id: 'moral-05',
    category: 'moral_dilemma',
    title: 'Plague Village',
    prompt: 'A village afflicted by plague begs for healing but warns the disease is highly contagious.',
  },
  {
    id: 'moral-06',
    category: 'moral_dilemma',
    title: 'Betrayer\'s Reward',
    prompt: 'An ally offers to betray their own faction to help the party — but only in exchange for asylum.',
  },
  {
    id: 'moral-07',
    category: 'moral_dilemma',
    title: 'Sacrificial Ritual',
    prompt: 'A village performs a willing sacrifice ritual they believe keeps them safe — the party stumbles upon it.',
  },

  // ── Mystery ─────────────────────────────────────────────
  {
    id: 'mystery-01',
    category: 'mystery',
    title: 'Ghostly Figure',
    prompt: 'A ghostly figure at the edge of firelight vanishes when approached but leaves footprints.',
  },
  {
    id: 'mystery-02',
    category: 'mystery',
    title: 'Mysterious Map',
    prompt: 'One character wakes to find an unfamiliar map tucked into their pack with a location circled.',
  },
  {
    id: 'mystery-03',
    category: 'mystery',
    title: 'Animal Exodus',
    prompt: 'Every animal in the area is fleeing in the same direction — something is coming.',
  },
  {
    id: 'mystery-04',
    category: 'mystery',
    title: 'Cursed Merchandise',
    prompt: 'A merchant sells an item that is later revealed to be cursed or sentient.',
  },
  {
    id: 'mystery-05',
    category: 'mystery',
    title: 'Identical Stranger',
    prompt: 'A stranger in town looks exactly like one of the player characters and denies any connection.',
  },
  {
    id: 'mystery-06',
    category: 'mystery',
    title: 'Silent Village',
    prompt: 'The party enters a village where every resident has gone completely silent and will not explain why.',
  },

  // ── Commerce ────────────────────────────────────────────
  {
    id: 'commerce-01',
    category: 'commerce',
    title: 'Suspicious Travelling Merchant',
    prompt: 'A travelling merchant with suspiciously rare wares offers deals that seem too good to be true.',
  },
  {
    id: 'commerce-02',
    category: 'commerce',
    title: 'Legendary Item Auction',
    prompt: 'A town auction for a legendary item draws shady bidders and tense competition.',
  },
  {
    id: 'commerce-03',
    category: 'commerce',
    title: 'Outstanding Debt',
    prompt: 'Someone recognizes a character and loudly claims they owe a significant debt.',
  },
  {
    id: 'commerce-04',
    category: 'commerce',
    title: 'Counterfeit Currency',
    prompt: 'A shopkeeper refuses the party\'s gold, claiming the coins are counterfeit.',
  },
  {
    id: 'commerce-05',
    category: 'commerce',
    title: 'Rare Ingredient Trade',
    prompt: 'An alchemist offers a powerful potion but needs a dangerous ingredient harvested in return.',
  },
  {
    id: 'commerce-06',
    category: 'commerce',
    title: 'Smuggler\'s Offer',
    prompt: 'A dockside smuggler offers to move the party\'s goods past a blockade — for a steep cut of the profits.',
  },
];

export const ENCOUNTER_CATEGORIES = [
  { id: 'combat', label: 'Combat', color: '#ef4444' },
  { id: 'social', label: 'Social & Intrigue', color: '#a78bfa' },
  { id: 'theft', label: 'Theft & Crime', color: '#f97316' },
  { id: 'exploration', label: 'Exploration', color: '#4ade80' },
  { id: 'environmental', label: 'Environmental', color: '#60a5fa' },
  { id: 'moral_dilemma', label: 'Moral Dilemma', color: '#fbbf24' },
  { id: 'mystery', label: 'Mystery', color: '#c084fc' },
  { id: 'commerce', label: 'Commerce', color: '#f59e0b' },
];

export default ENCOUNTER_PROMPTS;
