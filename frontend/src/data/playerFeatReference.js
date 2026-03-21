/**
 * playerFeatReference.js
 * Player Mode: Common feat quick-reference and combat reminders
 * Pure JS — no React dependencies.
 */

// ---------------------------------------------------------------------------
// COMBAT FEATS
// ---------------------------------------------------------------------------

export const COMBAT_FEATS = [
  {
    name: 'Great Weapon Master',
    combatReminder: 'Before attack: choose -5 to hit for +10 damage. On crit or kill: bonus action melee attack.',
    applicableTo: ['melee'],
    requiresHeavy: true,
  },
  {
    name: 'Sharpshooter',
    combatReminder: 'Before attack: choose -5 to hit for +10 damage. No disadvantage at long range. Ignore half/three-quarters cover.',
    applicableTo: ['ranged'],
  },
  {
    name: 'Polearm Master',
    combatReminder: 'Bonus action: d4 bludgeoning attack with butt end. Opportunity attack when creature enters your reach.',
    applicableTo: ['melee'],
  },
  {
    name: 'Sentinel',
    combatReminder: 'On opportunity attack hit: target\'s speed becomes 0. Creatures that Disengage still provoke from you. Reaction attack when ally within 5ft is attacked.',
    applicableTo: ['melee'],
  },
  {
    name: 'War Caster',
    combatReminder: 'Advantage on CON saves for concentration. Somatic components with hands full. Cast spell as opportunity attack.',
    applicableTo: ['spellcasting'],
  },
  {
    name: 'Crossbow Expert',
    combatReminder: 'Ignore loading. No disadvantage on ranged attacks within 5ft. Bonus action hand crossbow attack after one-handed weapon attack.',
    applicableTo: ['ranged'],
  },
  {
    name: 'Shield Master',
    combatReminder: 'Bonus action: shove with shield after Attack action. Add shield AC bonus to DEX saves vs single target. Evasion-like on successful DEX save.',
    applicableTo: ['melee'],
    requiresShield: true,
  },
  {
    name: 'Lucky',
    combatReminder: '3 luck points per long rest. Spend to reroll any d20 (attack, save, ability check). Can also force reroll on attack against you.',
    applicableTo: ['any'],
  },
  {
    name: 'Alert',
    combatReminder: '+5 to initiative. Can\'t be surprised. Hidden creatures don\'t get advantage on attacks against you.',
    applicableTo: ['any'],
  },
  {
    name: 'Resilient',
    combatReminder: '+1 to chosen ability score. Proficiency in saving throws for that ability.',
    applicableTo: ['any'],
  },
  {
    name: 'Mobile',
    combatReminder: '+10ft speed. Dash through difficult terrain without penalty. No opportunity attack from creature you attacked (hit or miss).',
    applicableTo: ['melee'],
  },
  {
    name: 'Tough',
    combatReminder: '+2 HP per level.',
    applicableTo: ['any'],
  },
  {
    name: 'Savage Attacker',
    combatReminder: 'Once per turn: reroll melee weapon damage dice, use either result.',
    applicableTo: ['melee'],
  },
  {
    name: 'Mage Slayer',
    combatReminder: 'Reaction attack when adjacent creature casts spell. Advantage on saves vs spells from adjacent. Concentration disadvantage on damage.',
    applicableTo: ['melee'],
  },
  {
    name: 'Ritual Caster',
    combatReminder: 'Can cast known ritual spells without expending a slot. Takes 10 extra minutes.',
    applicableTo: ['spellcasting'],
  },
];

// ---------------------------------------------------------------------------
// HALF FEATS (ASI + ability)
// ---------------------------------------------------------------------------

export const HALF_FEATS = [
  { name: 'Actor', ability: 'CHA', benefit: 'Advantage on Deception/Performance to impersonate. Mimic speech/sounds.' },
  { name: 'Athlete', ability: 'STR or DEX', benefit: 'Standing from prone costs 5ft. Running jump with 5ft start. Climbing at normal speed.' },
  { name: 'Durable', ability: 'CON', benefit: 'Minimum HP recovery from hit dice = 2x CON mod.' },
  { name: 'Keen Mind', ability: 'INT', benefit: 'Always know north, hours until sunrise/set, recall anything within past month.' },
  { name: 'Observant', ability: 'INT or WIS', benefit: '+5 to passive Perception and Investigation. Read lips.' },
  { name: 'Fey Touched', ability: 'INT, WIS, or CHA', benefit: 'Misty Step + one 1st-level divination/enchantment spell, each 1/long rest free.' },
  { name: 'Shadow Touched', ability: 'INT, WIS, or CHA', benefit: 'Invisibility + one 1st-level illusion/necromancy spell, each 1/long rest free.' },
];

// ---------------------------------------------------------------------------
// FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get combat reminders for a character's feats.
 */
export function getCombatReminders(featNames = []) {
  const lower = featNames.map(f => f.toLowerCase());
  return COMBAT_FEATS.filter(f => lower.includes(f.name.toLowerCase()));
}

/**
 * Check if a feat is applicable to a weapon type.
 */
export function isFeatApplicable(featName, weaponType) {
  const feat = COMBAT_FEATS.find(f => f.name.toLowerCase() === featName.toLowerCase());
  if (!feat) return false;
  return feat.applicableTo.includes('any') || feat.applicableTo.includes(weaponType);
}

/**
 * Get feat by name.
 */
export function getFeat(name) {
  return COMBAT_FEATS.find(f => f.name.toLowerCase() === name.toLowerCase())
    || HALF_FEATS.find(f => f.name.toLowerCase() === name.toLowerCase());
}
