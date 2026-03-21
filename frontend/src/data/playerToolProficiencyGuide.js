/**
 * playerToolProficiencyGuide.js
 * Player Mode: Tool proficiencies — what they do and how to use them
 * Pure JS — no React dependencies.
 */

export const TOOL_PROFICIENCY_RULES = {
  check: 'Tool checks use ability modifier + proficiency bonus. The DM determines which ability applies.',
  doubleProf: 'If you have proficiency in both a tool and a skill relevant to the same check, you may have advantage (Xanathar\'s optional rule).',
  obtaining: 'Tools can be learned during downtime: 250 days and 250 gp (PHB), or 10 workweeks and 25 gp (Xanathar\'s).',
};

export const ARTISAN_TOOLS = [
  { tool: 'Thieves\' Tools', cost: '25 gp', weight: '1 lb', ability: 'DEX', rating: 'S+', uses: 'Pick locks, disarm traps. Essential for dungeon exploration. Every party needs one.', bestClass: 'Rogue, Artificer' },
  { tool: 'Herbalism Kit', cost: '5 gp', weight: '3 lb', ability: 'WIS/INT', rating: 'A+', uses: 'Identify plants, create antitoxin, craft healing potions. Useful in wilderness.', bestClass: 'Druid, Ranger' },
  { tool: 'Alchemist\'s Supplies', cost: '50 gp', weight: '8 lb', ability: 'INT', rating: 'A+', uses: 'Craft acid, alchemist\'s fire, potions. Identify substances. Create smoke/fire.', bestClass: 'Artificer, Wizard' },
  { tool: 'Smith\'s Tools', cost: '20 gp', weight: '8 lb', ability: 'STR/INT', rating: 'A', uses: 'Repair metal objects, craft weapons/armor. Identify metal quality.', bestClass: 'Fighter, Artificer' },
  { tool: 'Tinker\'s Tools', cost: '50 gp', weight: '10 lb', ability: 'INT/DEX', rating: 'A', uses: 'Repair objects, craft small devices. Artificer essential.', bestClass: 'Artificer, Gnome' },
  { tool: 'Cook\'s Utensils', cost: '1 gp', weight: '8 lb', ability: 'WIS/CON', rating: 'A', uses: 'Prepare meals. Short rest: 1 creature regains extra 1d8 HP (Chef feat). Morale.', bestClass: 'Any (Chef feat)' },
  { tool: 'Carpenter\'s Tools', cost: '8 gp', weight: '6 lb', ability: 'STR/INT', rating: 'B+', uses: 'Build structures, repair wooden objects, create barricades, fortify doors.', bestClass: 'Any' },
  { tool: 'Brewer\'s Supplies', cost: '20 gp', weight: '9 lb', ability: 'INT/WIS', rating: 'B', uses: 'Brew ale, purify water, detect poison in drinks. Social/downtime.', bestClass: 'Any' },
  { tool: 'Calligrapher\'s Supplies', cost: '10 gp', weight: '5 lb', ability: 'DEX/INT', rating: 'B', uses: 'Forge documents, identify handwriting, create maps. Niche utility.', bestClass: 'Rogue, Bard' },
  { tool: 'Cartographer\'s Tools', cost: '15 gp', weight: '6 lb', ability: 'WIS/INT', rating: 'B+', uses: 'Create and read maps, determine direction, estimate distances.', bestClass: 'Ranger, Explorer' },
  { tool: 'Cobbler\'s Tools', cost: '5 gp', weight: '5 lb', ability: 'DEX/INT', rating: 'C+', uses: 'Repair shoes, hide compartments in heels. Very niche.', bestClass: 'Rogue' },
  { tool: 'Glassblower\'s Tools', cost: '30 gp', weight: '5 lb', ability: 'DEX/INT', rating: 'C+', uses: 'Craft glass items, vials, spyglasses. Niche.', bestClass: 'Artificer' },
  { tool: 'Jeweler\'s Tools', cost: '25 gp', weight: '2 lb', ability: 'DEX/INT', rating: 'B', uses: 'Appraise gems, craft jewelry, identify magical gems.', bestClass: 'Rogue, Bard' },
  { tool: 'Leatherworker\'s Tools', cost: '5 gp', weight: '5 lb', ability: 'DEX/INT', rating: 'B', uses: 'Craft leather armor, repair leather items, waterproof containers.', bestClass: 'Ranger, Druid' },
  { tool: 'Mason\'s Tools', cost: '10 gp', weight: '8 lb', ability: 'STR/INT', rating: 'B', uses: 'Find secret doors in stone, identify structural weakness. Dungeon useful.', bestClass: 'Fighter, Dwarf' },
  { tool: 'Painter\'s Supplies', cost: '10 gp', weight: '5 lb', ability: 'DEX/CHA', rating: 'C+', uses: 'Create paintings, disguise surfaces. Very niche.', bestClass: 'Bard' },
  { tool: 'Potter\'s Tools', cost: '10 gp', weight: '3 lb', ability: 'DEX/WIS', rating: 'C', uses: 'Craft pottery. Reconstruct broken items from shards. Very niche.', bestClass: 'Any' },
  { tool: 'Weaver\'s Tools', cost: '1 gp', weight: '5 lb', ability: 'DEX/INT', rating: 'C', uses: 'Create cloth, repair clothing, craft rope. Niche.', bestClass: 'Any' },
  { tool: 'Woodcarver\'s Tools', cost: '1 gp', weight: '5 lb', ability: 'DEX/WIS', rating: 'B', uses: 'Craft arrows, staffs, wooden objects. Create arcane foci.', bestClass: 'Ranger, Druid' },
];

export const OTHER_TOOLS = [
  { tool: 'Disguise Kit', cost: '25 gp', weight: '3 lb', ability: 'CHA/DEX', rating: 'A', uses: 'Create disguises. Contested vs Insight. Infiltration essential.', bestClass: 'Rogue (Assassin), Bard' },
  { tool: 'Forgery Kit', cost: '15 gp', weight: '5 lb', ability: 'DEX/INT', rating: 'B+', uses: 'Forge documents, duplicate seals. Social campaign essential.', bestClass: 'Rogue, Bard' },
  { tool: 'Poisoner\'s Kit', cost: '50 gp', weight: '2 lb', ability: 'INT/WIS', rating: 'A', uses: 'Craft poisons, apply poison to weapons, identify poisons. Assassin essential.', bestClass: 'Rogue (Assassin)' },
  { tool: 'Navigator\'s Tools', cost: '25 gp', weight: '2 lb', ability: 'WIS/INT', rating: 'B+', uses: 'Navigate by stars, determine position, plot course. Sea/wilderness campaigns.', bestClass: 'Ranger' },
  { tool: 'Gaming Set (any)', cost: '1 gp', weight: '0 lb', ability: 'WIS/CHA', rating: 'B', uses: 'Win money gambling, gain social advantage, read opponents.', bestClass: 'Rogue, Bard' },
  { tool: 'Musical Instrument (any)', cost: '2-35 gp', weight: '1-6 lb', ability: 'CHA/DEX', rating: 'A (Bard)', uses: 'Perform, earn money, Bard spellcasting focus. Social utility.', bestClass: 'Bard' },
  { tool: 'Vehicles (Land)', cost: 'varies', weight: '-', ability: 'DEX/WIS', rating: 'B', uses: 'Drive carts, chariots, wagons. Chase scenes.', bestClass: 'Any' },
  { tool: 'Vehicles (Water)', cost: 'varies', weight: '-', ability: 'DEX/WIS', rating: 'B+', uses: 'Sail ships, navigate rivers. Nautical campaigns.', bestClass: 'Any' },
];

export const TOOL_PROFICIENCY_TIPS = [
  'Thieves\' Tools is the most universally useful tool. Every party needs at least one user.',
  'Xanathar\'s optional rule: tool + skill proficiency on same check = advantage. Very powerful.',
  'Herbalism Kit lets you craft healing potions during downtime (50gp, workweek).',
  'Cook\'s Utensils + Chef feat: free temp HP on short rest. Excellent support.',
  'Smith\'s Tools: repair metal equipment in the field. Save money on replacements.',
  'Disguise Kit + Deception = infiltration machine. Assassin Rogues get both.',
  'Tool proficiencies from backgrounds are free. Choose wisely at character creation.',
  'Artificer gets Thieves\' Tools + Tinker\'s Tools proficiency. Best tool user.',
  'Rock Gnome gets Tinker\'s Tools proficiency. Good for Artificer synergy.',
];
