/**
 * Skill Check DC Reference & Passive Score Rules — D&D 5e
 *
 * Covers roadmap items 359, 390 (Skill check DC reference, Passive scores display).
 * Complete reference for DMs setting DCs and understanding skill mechanics.
 */

// ── Standard DC Benchmarks ──
export const DC_BENCHMARKS = [
  { dc: 5,  label: 'Very Easy', description: 'Almost anyone can do this. Only a fumble would fail.', example: 'Climb a rope with knots, track a bleeding creature through snow' },
  { dc: 10, label: 'Easy', description: 'A competent person succeeds most of the time.', example: 'Calm a frightened commoner, pick a simple lock, recall common lore' },
  { dc: 15, label: 'Medium', description: 'Requires focus or training to reliably succeed.', example: 'Kick down a stuck door, navigate dense fog, haggle a fair price' },
  { dc: 20, label: 'Hard', description: 'Even skilled individuals may fail.', example: 'Pick a high-quality lock, track over hard stone, swim against a strong current' },
  { dc: 25, label: 'Very Hard', description: 'Exceptional ability required. Most people can\'t do this.', example: 'Leap a 30-foot chasm, escape masterwork manacles, forge a document' },
  { dc: 30, label: 'Nearly Impossible', description: 'Only legendary heroes or divine intervention can accomplish this.', example: 'Climb a greased surface upside down, track a creature through a Teleport spell' },
];

// ── Skills by Ability ──
export const SKILLS_BY_ABILITY = {
  Strength: [
    { name: 'Athletics', uses: 'Climbing, jumping, swimming, grappling, shoving, feats of raw power' },
  ],
  Dexterity: [
    { name: 'Acrobatics', uses: 'Balance, tumbling, flips, staying on feet on tricky surfaces' },
    { name: 'Sleight of Hand', uses: 'Pickpocketing, planting items, concealing objects, card tricks' },
    { name: 'Stealth', uses: 'Hiding, moving silently, avoiding detection, tailing someone' },
  ],
  Intelligence: [
    { name: 'Arcana', uses: 'Recall magical lore, identify spells, recognize magical creatures/items' },
    { name: 'History', uses: 'Recall historical events, identify cultural significance, recognize heraldry' },
    { name: 'Investigation', uses: 'Deduce, search for clues, piece together information, find hidden things' },
    { name: 'Nature', uses: 'Recall lore about terrain, plants, animals, weather, natural cycles' },
    { name: 'Religion', uses: 'Recall lore about deities, rites, prayers, holy symbols, undead' },
  ],
  Wisdom: [
    { name: 'Animal Handling', uses: 'Calm an animal, intuit animal intent, control a mount' },
    { name: 'Insight', uses: 'Detect lies, read body language, sense motives, determine true intent' },
    { name: 'Medicine', uses: 'Stabilize dying, diagnose illness, determine cause of death' },
    { name: 'Perception', uses: 'Spot, hear, or otherwise detect something — the most rolled skill' },
    { name: 'Survival', uses: 'Track, forage, navigate wilderness, predict weather, avoid hazards' },
  ],
  Charisma: [
    { name: 'Deception', uses: 'Lie convincingly, disguise intent, mislead, create diversions' },
    { name: 'Intimidation', uses: 'Threaten, coerce, bully, demand compliance through fear' },
    { name: 'Performance', uses: 'Entertain, act, orate, play music, dance, tell stories' },
    { name: 'Persuasion', uses: 'Convince, negotiate, charm, make diplomatic arguments' },
  ],
};

// ── Passive Score Rules ──
export const PASSIVE_SCORES = {
  formula: '10 + all modifiers that normally apply to the check',
  commonPassives: [
    { name: 'Passive Perception', ability: 'Wisdom', skill: 'Perception', uses: 'Notice hidden creatures, traps, secret doors without actively searching' },
    { name: 'Passive Investigation', ability: 'Intelligence', skill: 'Investigation', uses: 'Notice clues, inconsistencies, or hidden details automatically' },
    { name: 'Passive Insight', ability: 'Wisdom', skill: 'Insight', uses: 'Detect obvious lies or suspicious behavior without actively checking' },
  ],
  advantageModifier: '+5 to passive score if you have advantage on the check',
  disadvantageModifier: '-5 to passive score if you have disadvantage on the check',
  proficiencyNote: 'Add proficiency bonus if proficient in the skill, double if expertise',
};

// ── Contest Rules ──
export const CONTESTED_CHECKS = [
  { name: 'Grapple', attacker: 'Athletics', defender: 'Athletics or Acrobatics (defender\'s choice)' },
  { name: 'Shove', attacker: 'Athletics', defender: 'Athletics or Acrobatics (defender\'s choice)' },
  { name: 'Hide vs Notice', attacker: 'Stealth', defender: 'Perception (passive or active)' },
  { name: 'Disguise vs Detect', attacker: 'Deception', defender: 'Investigation or Insight' },
  { name: 'Pickpocket', attacker: 'Sleight of Hand', defender: 'Perception (usually passive)' },
  { name: 'Arm Wrestle', attacker: 'Athletics', defender: 'Athletics' },
  { name: 'Haggle', attacker: 'Persuasion or Deception', defender: 'Insight' },
  { name: 'Lie Detection', attacker: 'Deception', defender: 'Insight' },
  { name: 'Chase/Escape', attacker: 'Athletics or Acrobatics', defender: 'Athletics or Acrobatics' },
];

// ── Common DCs by Situation ──
export const SITUATION_DCS = {
  locks: [
    { dc: 10, description: 'Simple padlock or latch' },
    { dc: 15, description: 'Average door lock' },
    { dc: 20, description: 'High-quality lock or strongbox' },
    { dc: 25, description: 'Masterwork lock or vault' },
    { dc: 30, description: 'Arcane lock (without Knock spell)' },
  ],
  climbing: [
    { dc: 5, description: 'Knotted rope, rough natural rock with handholds' },
    { dc: 10, description: 'Tree, unknotted rope, rough stone wall' },
    { dc: 15, description: 'Brick or stone wall with few handholds' },
    { dc: 20, description: 'Smooth wall with tiny cracks' },
    { dc: 25, description: 'Perfectly smooth or overhanging surface' },
  ],
  tracking: [
    { dc: 5, description: 'Soft ground (mud, snow) with clear tracks' },
    { dc: 10, description: 'Dirt or grass, normal conditions' },
    { dc: 15, description: 'Hard ground, light rain, moderate traffic obscuring tracks' },
    { dc: 20, description: 'Stone floor, heavy rain, many creatures in area' },
    { dc: 25, description: 'Creature deliberately covering tracks, across water' },
  ],
  socialInfluence: [
    { dc: 0,  description: 'Friendly NPC, trivial favor' },
    { dc: 10, description: 'Friendly NPC, modest favor' },
    { dc: 15, description: 'Indifferent NPC, reasonable request' },
    { dc: 20, description: 'Indifferent NPC, significant favor; Hostile NPC, trivial request' },
    { dc: 25, description: 'Hostile NPC, modest favor' },
    { dc: 30, description: 'Hostile NPC, significant request against their interests' },
  ],
};

// ── Group Checks ──
export const GROUP_CHECK_RULES = {
  description: 'When multiple characters attempt the same thing, everyone rolls. If at least half succeed, the group succeeds.',
  commonUses: ['Group Stealth', 'Group Survival (navigation)', 'Group Athletics (climbing)', 'Group Perception (searching area)'],
  threshold: 'At least half the group (rounded down) must meet or exceed the DC',
};

/**
 * Get the DC benchmark label for a given DC.
 */
export function getDCLabel(dc) {
  if (dc <= 5) return DC_BENCHMARKS[0];
  if (dc <= 10) return DC_BENCHMARKS[1];
  if (dc <= 15) return DC_BENCHMARKS[2];
  if (dc <= 20) return DC_BENCHMARKS[3];
  if (dc <= 25) return DC_BENCHMARKS[4];
  return DC_BENCHMARKS[5];
}

/**
 * Calculate passive score.
 */
export function calculatePassiveScore(abilityMod, proficiencyBonus = 0, proficient = false, expertise = false, hasAdvantage = false, hasDisadvantage = false) {
  let score = 10 + abilityMod;
  if (proficient) score += proficiencyBonus;
  if (expertise) score += proficiencyBonus; // doubles
  if (hasAdvantage) score += 5;
  if (hasDisadvantage) score -= 5;
  return score;
}

/**
 * Get skills for a given ability.
 */
export function getSkillsForAbility(ability) {
  return SKILLS_BY_ABILITY[ability] || [];
}

/**
 * Get all skills as a flat list.
 */
export function getAllSkills() {
  return Object.entries(SKILLS_BY_ABILITY).flatMap(([ability, skills]) =>
    skills.map(s => ({ ...s, ability }))
  );
}

/**
 * Get suggested DC for a situation category.
 */
export function getSituationDCs(category) {
  return SITUATION_DCS[category] || [];
}

/**
 * Calculate success probability for a given modifier vs DC.
 */
export function calculateSuccessProbability(modifier, dc) {
  const needed = dc - modifier;
  if (needed <= 1) return 100;
  if (needed > 20) return 0;
  return (21 - needed) * 5;
}
