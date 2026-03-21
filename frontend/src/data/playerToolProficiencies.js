/**
 * playerToolProficiencies.js
 * Player Mode: Tool proficiency reference and checks
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// ARTISAN'S TOOLS
// ---------------------------------------------------------------------------

export const ARTISAN_TOOLS = [
  { name: "Alchemist's Supplies", ability: 'INT', examples: ['Create acid, alchemist\'s fire, antitoxin', 'Identify potions', 'Brew potions (with Herbalism Kit)'] },
  { name: "Brewer's Supplies", ability: 'INT', examples: ['Brew beer, ale, mead', 'Detect poisoned drink', 'Purify water'] },
  { name: "Calligrapher's Supplies", ability: 'DEX', examples: ['Create documents', 'Identify handwriting', 'Detect forgeries'] },
  { name: "Carpenter's Tools", ability: 'STR', examples: ['Build structures', 'Repair wooden objects', 'Assess building integrity'] },
  { name: "Cartographer's Tools", ability: 'WIS', examples: ['Create maps', 'Navigate terrain', 'Estimate distances'] },
  { name: "Cobbler's Tools", ability: 'DEX', examples: ['Craft/repair footwear', 'Create hidden compartments in shoes', 'Assess foot traffic'] },
  { name: "Cook's Utensils", ability: 'WIS', examples: ['Prepare meals', 'Short rest: +1 HP per hit die spent', 'Detect spoiled/poisoned food'] },
  { name: "Glassblower's Tools", ability: 'INT', examples: ['Create glass objects', 'Assess glass quality', 'Create lenses'] },
  { name: "Jeweler's Tools", ability: 'INT', examples: ['Assess gem value', 'Craft jewelry', 'Identify gemstones'] },
  { name: "Leatherworker's Tools", ability: 'DEX', examples: ['Craft leather goods', 'Repair leather armor', 'Assess leather quality'] },
  { name: "Mason's Tools", ability: 'STR', examples: ['Build stone structures', 'Find secret doors in masonry', 'Assess structural integrity'] },
  { name: "Painter's Supplies", ability: 'DEX', examples: ['Create paintings', 'Forge documents (with forger\'s kit)', 'Create coded messages'] },
  { name: "Potter's Tools", ability: 'DEX', examples: ['Create pottery', 'Assess ceramic quality', 'Identify clay sources'] },
  { name: "Smith's Tools", ability: 'STR', examples: ['Forge metal objects', 'Repair metal equipment', 'Craft weapons/armor'] },
  { name: "Tinker's Tools", ability: 'INT', examples: ['Repair broken objects', 'Create small clockwork devices', 'Jury-rig solutions'] },
  { name: "Weaver's Tools", ability: 'DEX', examples: ['Create cloth goods', 'Repair fabric', 'Create rope'] },
  { name: "Woodcarver's Tools", ability: 'DEX', examples: ['Carve wood objects', 'Create arrows', 'Craft wooden shields'] },
];

// ---------------------------------------------------------------------------
// OTHER TOOLS
// ---------------------------------------------------------------------------

export const OTHER_TOOLS = [
  { name: 'Disguise Kit', ability: 'CHA', examples: ['Create disguises', 'Alter appearance', 'Impersonate someone'] },
  { name: "Forgery Kit", ability: 'DEX', examples: ['Create forged documents', 'Copy handwriting', 'Duplicate seals'] },
  { name: 'Herbalism Kit', ability: 'WIS', examples: ['Identify plants', 'Create potions of healing', 'Create antitoxin'] },
  { name: "Navigator's Tools", ability: 'WIS', examples: ['Plot courses', 'Determine position', 'Predict weather'] },
  { name: "Poisoner's Kit", ability: 'INT', examples: ['Create poisons', 'Identify poisons', 'Apply poison to weapons'] },
  { name: "Thieves' Tools", ability: 'DEX', examples: ['Pick locks', 'Disarm traps', 'Assess mechanical devices'] },
];

// ---------------------------------------------------------------------------
// GAMING SETS
// ---------------------------------------------------------------------------

export const GAMING_SETS = [
  { name: 'Dice Set', ability: 'WIS', examples: ['Gambling', 'Reading opponents', 'Risk assessment'] },
  { name: 'Dragonchess Set', ability: 'INT', examples: ['Strategic thinking', 'Pattern recognition', 'Patience'] },
  { name: 'Playing Card Set', ability: 'WIS', examples: ['Card games', 'Bluffing', 'Reading tells'] },
  { name: "Three-Dragon Ante Set", ability: 'WIS', examples: ['Gambling', 'Social interaction', 'Information gathering'] },
];

// ---------------------------------------------------------------------------
// MUSICAL INSTRUMENTS
// ---------------------------------------------------------------------------

export const MUSICAL_INSTRUMENTS = [
  'Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Lute',
  'Lyre', 'Horn', 'Pan Flute', 'Shawm', 'Viol',
];

export const ALL_TOOLS = [...ARTISAN_TOOLS, ...OTHER_TOOLS, ...GAMING_SETS];
