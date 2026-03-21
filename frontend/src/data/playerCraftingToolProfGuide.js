/**
 * playerCraftingToolProfGuide.js
 * Player Mode: Tool proficiencies and crafting rules
 * Pure JS — no React dependencies.
 */

export const TOOL_PROFICIENCY_RULES = {
  check: 'Tool proficiency = add proficiency bonus to ability checks using that tool.',
  overlap: 'If a tool check overlaps with a skill (e.g., Thieves\' Tools + Investigation), some DMs give advantage.',
  xanathars: 'Xanathar\'s Guide expands tool uses significantly. Ask DM if those rules apply.',
  learning: 'Downtime: 250 days and 250gp to learn a new tool proficiency (PHB). Xanathar\'s: 10 workweeks and 25gp.',
};

export const TOOL_RANKINGS = [
  { tool: 'Thieves\' Tools', rating: 'S+', cost: '25 gp', uses: 'Pick locks, disarm traps, open chests.', note: 'Essential for dungeon crawling. Rogue gets free.' },
  { tool: 'Herbalism Kit', rating: 'S', cost: '5 gp', uses: 'Identify plants, create Potions of Healing (Xanathar\'s).', note: 'Craft 25gp potions during downtime. Huge gold savings.' },
  { tool: 'Smith\'s Tools', rating: 'A+', cost: '20 gp', uses: 'Repair metal objects, identify metal properties, craft weapons/armor.', note: 'Xanathar\'s: repair damaged objects, identify metal.' },
  { tool: 'Alchemist\'s Supplies', rating: 'A+', cost: '50 gp', uses: 'Identify substances, create alchemical items.', note: 'Acid, alchemist\'s fire, antitoxin during downtime.' },
  { tool: 'Cook\'s Utensils', rating: 'A', cost: '1 gp', uses: 'Prepare meals. Xanathar\'s: grant temp HP during short rest.', note: '1 temp HP per HD spent during short rest with a good meal.' },
  { tool: 'Tinker\'s Tools', rating: 'A', cost: '50 gp', uses: 'Repair mechanical devices, create clockwork toys.', note: 'Artificer essential. Creative uses for puzzles/traps.' },
  { tool: 'Carpenter\'s Tools', rating: 'B+', cost: '8 gp', uses: 'Build structures, barricade doors, create shelters.', note: 'Xanathar\'s: seal/open stuck doors, build fortifications.' },
  { tool: 'Disguise Kit', rating: 'B+', cost: '25 gp', uses: 'Create disguises. +proficiency to Deception when disguised.', note: 'Great for infiltration. Changeling doesn\'t need this.' },
  { tool: 'Forgery Kit', rating: 'B', cost: '15 gp', uses: 'Create fake documents, passes, letters.', note: 'Situational but campaign-defining when needed.' },
  { tool: 'Navigator\'s Tools', rating: 'B', cost: '25 gp', uses: 'Chart courses, determine position, navigate at sea.', note: 'Essential for nautical campaigns. Niche otherwise.' },
  { tool: 'Poisoner\'s Kit', rating: 'B+', cost: '50 gp', uses: 'Apply poison, identify poisons, craft poisons.', note: 'Assassin Rogue synergy. Create basic poison (100gp, 1d4 poison).' },
  { tool: 'Brewer\'s Supplies', rating: 'C+', cost: '20 gp', uses: 'Brew ale, identify beverages, detect poison in drinks.', note: 'Flavor tool. Xanathar\'s adds purify water.' },
  { tool: 'Calligrapher\'s Supplies', rating: 'C', cost: '10 gp', uses: 'Create beautiful writing, identify handwriting.', note: 'Very niche. Good for forging signatures.' },
  { tool: 'Cobbler\'s Tools', rating: 'C', cost: '5 gp', uses: 'Repair shoes, create hidden compartments in shoes.', note: 'Xanathar\'s: hide small objects in shoes.' },
  { tool: 'Weaver\'s Tools', rating: 'C', cost: '1 gp', uses: 'Repair cloth, create clothing, identify textiles.', note: 'Niche but cheap.' },
];

export const MUSICAL_INSTRUMENTS = [
  { instrument: 'Lute', cost: '35 gp', note: 'Classic bard instrument. Most common.' },
  { instrument: 'Flute', cost: '2 gp', note: 'Cheapest. Easy to carry.' },
  { instrument: 'Drum', cost: '6 gp', note: 'Loud. Good for signaling.' },
  { instrument: 'Horn', cost: '3 gp', note: 'Military signaling. Loud.' },
  { instrument: 'Bagpipes', cost: '30 gp', note: 'Dwarf bard energy. Very loud.' },
  { instrument: 'Lyre', cost: '30 gp', note: 'Elegant. Harp-like.' },
];

export const CRAFTING_RULES = {
  phb: {
    rate: '5 gp of progress per day.',
    requirement: 'Tool proficiency, raw materials (half item cost).',
    example: 'Plate armor (1,500gp): 300 days to craft.',
    note: 'Very slow. Most tables use Xanathar\'s or homebrew.',
  },
  xanathars: {
    rate: 'Varies by item rarity.',
    costs: [
      { rarity: 'Common', time: '1 workweek', cost: '25 gp' },
      { rarity: 'Uncommon', time: '2 workweeks', cost: '200 gp' },
      { rarity: 'Rare', time: '10 workweeks', cost: '2,000 gp' },
      { rarity: 'Very Rare', time: '25 workweeks', cost: '20,000 gp' },
      { rarity: 'Legendary', time: '50 workweeks', cost: '100,000 gp' },
    ],
    note: 'Requires formula/recipe, materials, tool proficiency, and Arcana proficiency for magic items.',
  },
};

export const CRAFTING_TOOL_TIPS = [
  'Thieves\' Tools: most universally useful tool. Every party needs one.',
  'Herbalism Kit: craft Potions of Healing during downtime. Save gold.',
  'Cook\'s Utensils: 1 temp HP per HD on short rest. Free survivability.',
  'Tool checks: proficiency bonus applies. +2 to +6 over time.',
  'Xanathar\'s tool rules are much better than PHB. Ask your DM.',
  'Learning new tools: 10 workweeks + 25gp (Xanathar\'s). Worth the investment.',
  'Smith\'s Tools: repair equipment, maintain weapons. Great for campaigns.',
  'Poisoner\'s Kit + Assassin Rogue: apply poison as bonus action.',
  'Artificer: starts with Thieves\' Tools + Tinker\'s Tools + artisan\'s tools.',
  'Background tool proficiency: free. Choose a useful one at character creation.',
];
