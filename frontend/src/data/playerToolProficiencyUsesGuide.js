/**
 * playerToolProficiencyUsesGuide.js
 * Player Mode: Tool proficiency uses — what each tool can actually do
 * Pure JS — no React dependencies.
 */

export const TOOL_PROFICIENCY_BASICS = {
  note: 'Xanathar\'s Guide to Everything expanded tool proficiencies with specific activities for each tool. Tool proficiency adds your proficiency bonus to ability checks using the tool. Some tools have special actions.',
};

export const ARTISAN_TOOLS = [
  { tool: 'Alchemist\'s Supplies', ability: 'INT', uses: ['Create acid, alchemist\'s fire, antitoxin', 'Identify potions', 'Identify substances'], note: 'Create consumable items during downtime. Identify unknown substances. Useful for crafting campaigns.' },
  { tool: 'Brewer\'s Supplies', ability: 'INT/WIS', uses: ['Brew beer/ale', 'Purify water', 'Identify poisons in drinks'], note: 'Purify water is the best use. Identify poisoned beverages. Mostly flavor.' },
  { tool: 'Calligrapher\'s Supplies', ability: 'DEX/INT', uses: ['Create beautiful writing', 'Identify handwriting', 'Forge documents'], note: 'Forge documents is the key use. Identify who wrote something.' },
  { tool: 'Carpenter\'s Tools', ability: 'STR/INT', uses: ['Build structures/furniture', 'Seal/open doors', 'Build temporary shelters', 'Identify structural weaknesses'], note: 'Build barricades, identify weak walls, create makeshift bridges. Utility in dungeons.' },
  { tool: 'Cartographer\'s Tools', ability: 'WIS/INT', uses: ['Create accurate maps', 'Determine position', 'Identify terrain'], note: 'Never get lost. Create maps of dungeons. Useful for exploration campaigns.' },
  { tool: 'Cobbler\'s Tools', ability: 'DEX/INT', uses: ['Create/repair footwear', 'Create hidden compartments in shoes'], note: 'Hide small items in shoes. Very niche. Mostly flavor.' },
  { tool: 'Cook\'s Utensils', ability: 'WIS/CON', uses: ['Prepare meals', 'Improve food quality', 'Detect poison in food'], note: 'Chef feat makes this great. Detect poisoned food. Short rest: extra HP recovery.' },
  { tool: 'Glassblower\'s Tools', ability: 'DEX/INT', uses: ['Create glass objects', 'Identify glass quality', 'Create lenses'], note: 'Create vials, bottles, lenses. Very niche.' },
  { tool: 'Jeweler\'s Tools', ability: 'DEX/INT', uses: ['Identify gems', 'Determine value of jewelry', 'Create rings/necklaces'], note: 'Identify gem value (don\'t get cheated). Create spell component gems.' },
  { tool: 'Leatherworker\'s Tools', ability: 'DEX/INT', uses: ['Create/repair leather goods', 'Identify leather types', 'Create light armor'], note: 'Repair leather armor. Create water skins, bags. Useful in survival campaigns.' },
  { tool: 'Mason\'s Tools', ability: 'STR/INT', uses: ['Build stone structures', 'Identify stone types', 'Find secret doors in stonework'], note: 'Find secret doors is the best use. Identify weak walls for breaking through. Dungeon specialist.' },
  { tool: 'Painter\'s Supplies', ability: 'DEX/WIS', uses: ['Create paintings', 'Forge visual documents', 'Create maps/diagrams'], note: 'Forge paintings, create wanted posters, visual documentation. Niche but creative.' },
  { tool: 'Potter\'s Tools', ability: 'DEX/WIS', uses: ['Create pottery', 'Identify ceramic origins', 'Create containers'], note: 'Very niche. Create containers for alchemical storage.' },
  { tool: 'Smith\'s Tools', ability: 'STR/INT', uses: ['Repair metal objects', 'Create metal items', 'Identify metal quality', 'Repair armor/weapons'], note: 'Best artisan tool. Repair weapons/armor in the field. Create metal objects. Essential for adventurers.' },
  { tool: 'Tinker\'s Tools', ability: 'DEX/INT', uses: ['Create small mechanical devices', 'Repair objects', 'Create clockwork toys'], note: 'Artificer flavor. Create simple mechanisms. Repair broken items. Versatile.' },
  { tool: 'Weaver\'s Tools', ability: 'DEX/INT', uses: ['Create/repair clothing', 'Create rope', 'Identify fabric'], note: 'Create rope, repair clothing, disguise quality assessment. Mostly flavor.' },
  { tool: 'Woodcarver\'s Tools', ability: 'DEX/INT', uses: ['Create wooden objects', 'Carve arrows', 'Create/repair wooden weapons'], note: 'Carve arrows for free ammunition. Create clubs, staves. Survival utility.' },
];

export const GAMING_SETS = [
  { tool: 'Dice Set', uses: ['Gambling', 'Reading opponents (Insight)'], note: 'Proficiency bonus to gambling. Read opponents during games.' },
  { tool: 'Dragonchess Set', uses: ['Strategic thinking', 'Socializing with nobles'], note: 'Noble social circles. Strategy contests.' },
  { tool: 'Playing Card Set', uses: ['Gambling', 'Cheating detection'], note: 'Same as dice but with cards. Detect cheaters.' },
  { tool: 'Three-Dragon Ante', uses: ['D&D\'s in-game card game', 'Gambling', 'Social'], note: 'The D&D universe\'s poker equivalent.' },
];

export const SPECIAL_TOOLS = [
  { tool: 'Thieves\' Tools', ability: 'DEX', uses: ['Pick locks', 'Disarm traps', 'Set traps'], note: 'Essential for dungeon crawling. DEX check + proficiency. Without proficiency: can\'t add PB to lock/trap checks.' },
  { tool: 'Herbalism Kit', ability: 'WIS/INT', uses: ['Identify plants', 'Create antitoxin', 'Create healing potions (downtime)', 'Find medicinal herbs'], note: 'Create Potions of Healing during downtime. Identify poisonous plants. Good for wilderness campaigns.' },
  { tool: 'Navigator\'s Tools', ability: 'WIS/INT', uses: ['Plot courses', 'Determine position (stars)', 'Avoid getting lost at sea'], note: 'Essential for naval campaigns. Use with Survival to navigate.' },
  { tool: 'Poisoner\'s Kit', ability: 'INT/WIS', uses: ['Create poisons', 'Identify poisons', 'Apply poison to weapons'], note: 'Create basic poison (100gp, 1d4 damage). Identify and handle poisons safely. DC to resist = 8+INT+PB.' },
  { tool: 'Disguise Kit', ability: 'CHA/DEX', uses: ['Create disguises', 'Impersonate others'], note: 'Physical disguise. Stacks with Disguise Self spell. CHA (Deception) to maintain.' },
  { tool: 'Forgery Kit', ability: 'DEX/INT', uses: ['Create fake documents', 'Copy handwriting', 'Create counterfeit seals'], note: 'Forge letters, writs, identification. Investigation check to detect.' },
];

export const TOOL_PROFICIENCY_RANKING = [
  { tier: 'S', tools: ['Thieves\' Tools'], reason: 'Essential for dungeon crawling. No substitute.' },
  { tier: 'A', tools: ['Smith\'s Tools', 'Herbalism Kit', 'Cook\'s Utensils (with Chef feat)'], reason: 'Field repairs, potion crafting, healing food.' },
  { tier: 'B', tools: ['Poisoner\'s Kit', 'Alchemist\'s Supplies', 'Carpenter\'s Tools', 'Disguise Kit'], reason: 'Situationally powerful. Crafting campaigns benefit.' },
  { tier: 'C', tools: ['Most others'], reason: 'Niche or campaign-dependent. Fun for roleplay.' },
];

export function toolCheckBonus(abilityMod, profBonus, hasExpertise = false) {
  return abilityMod + (hasExpertise ? profBonus * 2 : profBonus);
}
