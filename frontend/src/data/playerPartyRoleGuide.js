/**
 * playerPartyRoleGuide.js
 * Player Mode: Party roles — what every party needs and how to fill gaps
 * Pure JS — no React dependencies.
 */

export const PARTY_ROLES = [
  {
    role: 'Tank / Frontliner',
    purpose: 'Absorb damage, protect squishier allies, control enemy positioning.',
    keyStats: 'High AC, high HP, CON, STR',
    bestClasses: ['Bear Totem Barbarian', 'Cavalier Fighter', 'Ancestral Guardian Barbarian', 'Armorer Artificer', 'Any Paladin'],
    essentialFeatures: ['Heavy armor', 'Shield proficiency', 'High HP', 'Sentinel feat', 'Forced targeting (Ancestral Guardian, Armorer)'],
    ifMissing: 'Summon creatures as meat shields. Use control spells to prevent enemies from reaching backline.',
  },
  {
    role: 'Damage Dealer (DPS)',
    purpose: 'Eliminate threats quickly. Focus fire priority targets.',
    keyStats: 'STR/DEX (martial) or primary casting stat (caster)',
    bestClasses: ['Gloom Stalker Ranger', 'Battle Master Fighter', 'Assassin Rogue', 'Hexblade Warlock', 'Evocation Wizard'],
    essentialFeatures: ['Extra Attack', 'GWM/Sharpshooter', 'Sneak Attack', 'High-damage spells'],
    ifMissing: 'Everyone can contribute damage. Bless the martial characters. Summon creatures for action economy.',
  },
  {
    role: 'Healer',
    purpose: 'Keep allies conscious. Restore HP. Remove conditions.',
    keyStats: 'WIS (Cleric/Druid) or CHA (Divine Soul Sorcerer)',
    bestClasses: ['Life Cleric', 'Shepherd Druid', 'Divine Soul Sorcerer', 'Dreams Druid', 'Celestial Warlock'],
    essentialFeatures: ['Healing Word (BA ranged heal)', 'Revivify', 'Lesser/Greater Restoration'],
    ifMissing: 'Buy healing potions. Take Healer feat (anyone). Goodberry. Short rest healing (Hit Dice).',
  },
  {
    role: 'Controller',
    purpose: 'Remove enemies from the fight. Area denial. Battlefield shaping.',
    keyStats: 'INT (Wizard) or WIS (Druid/Cleric)',
    bestClasses: ['Chronurgy Wizard', 'Divination Wizard', 'Circle of the Land Druid', 'Eloquence Bard', 'Aberrant Mind Sorcerer'],
    essentialFeatures: ['Hypnotic Pattern', 'Web', 'Wall of Force', 'Hold Person/Monster', 'Banishment'],
    ifMissing: 'Most dangerous gap. Without control, fights are just DPS races. Prioritize this role.',
  },
  {
    role: 'Face / Social',
    purpose: 'Handle social encounters. Negotiate, deceive, intimidate.',
    keyStats: 'CHA',
    bestClasses: ['Eloquence Bard', 'Any Bard', 'Swashbuckler Rogue', 'Any Paladin', 'Warlock'],
    essentialFeatures: ['Persuasion', 'Deception', 'Insight', 'Expertise in social skills'],
    ifMissing: 'Someone with decent CHA can fill in. Friends/Charm Person spells as backup.',
  },
  {
    role: 'Scout / Explorer',
    purpose: 'Detect traps, find secrets, navigate, stealth ahead.',
    keyStats: 'DEX, WIS',
    bestClasses: ['Rogue (any)', 'Gloom Stalker Ranger', 'Way of Shadow Monk', 'Scout Rogue'],
    essentialFeatures: ['Stealth', 'Perception', 'Investigation', 'Thieves\' Tools', 'Darkvision'],
    ifMissing: 'Find Familiar (owl) for scouting. Guidance cantrip for skill checks. Pass Without Trace for party stealth.',
  },
  {
    role: 'Support / Buffer',
    purpose: 'Enhance allies. Debuff enemies. Force multiplier.',
    keyStats: 'Varies by class',
    bestClasses: ['Peace Cleric', 'Order Cleric', 'Glamour Bard', 'Shepherd Druid', 'Artificer'],
    essentialFeatures: ['Bless', 'Haste', 'Bardic Inspiration', 'Faerie Fire', 'Emboldening Bond'],
    ifMissing: 'Anyone with Bless or Faerie Fire can fill this role. Magic items (potions, scrolls) help.',
  },
  {
    role: 'Utility / Problem Solver',
    purpose: 'Handle non-combat challenges. Rituals, skills, creative solutions.',
    keyStats: 'INT, WIS',
    bestClasses: ['Wizard (ritual casting)', 'Knowledge Cleric', 'Lore Bard', 'Artificer'],
    essentialFeatures: ['Ritual casting', 'Many skill proficiencies', 'Utility spells (Knock, Comprehend Languages, Detect Magic)'],
    ifMissing: 'Ritual Caster feat on anyone. Tome Warlock with Book of Ancient Secrets.',
  },
];

export const MINIMUM_PARTY_NEEDS = [
  { need: 'Healing Word access', priority: 'Critical', detail: 'BA ranged heal to pick up downed allies. Without this, downed = dead.' },
  { need: 'Control spells', priority: 'Critical', detail: 'Without AoE control, every fight is a slugfest. Hypnotic Pattern or Web minimum.' },
  { need: 'Frontliner', priority: 'High', detail: 'Someone needs to absorb hits. If no tank, summon creatures or use control.' },
  { need: 'Damage output', priority: 'High', detail: 'You need to actually kill things. Bless + martial characters works fine.' },
  { need: 'Trap handling', priority: 'Medium', detail: 'Thieves\' Tools proficiency. Dungeons are dangerous without it.' },
  { need: 'Social skills', priority: 'Medium', detail: 'At least one person with Persuasion/Deception.' },
  { need: 'Revivify access', priority: 'Medium', detail: 'By L5, someone should have Revivify. 300gp diamond insurance.' },
];

export const PARTY_COMPOSITION_TIPS = [
  'A party of 4 needs: 1 tank/frontliner, 1 healer/support, 1 controller, 1 DPS minimum.',
  'Overlapping roles is fine. Two controllers is incredible. Two healers is safe.',
  'The most dangerous gap is control. Without it, fights are just DPS races.',
  'Healing Word is more important than any other healing spell. BA ranged pick-up saves lives.',
  'Bard or Cleric can fill multiple roles. Most flexible classes for party composition.',
  'If everyone is a martial class, bring scrolls/potions. You NEED some magic.',
  'Communicate during Session 0. Avoid 4 DPS with no healer.',
  'Single-class parties can work but need very specific builds to cover gaps.',
];
