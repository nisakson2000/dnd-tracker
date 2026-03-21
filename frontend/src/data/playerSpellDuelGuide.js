/**
 * playerSpellDuelGuide.js
 * Player Mode: Caster vs caster combat tactics and counterspell strategy
 * Pure JS — no React dependencies.
 */

export const COUNTERSPELL_RULES = {
  level: 3,
  castingTime: 'Reaction (when you see a creature within 60ft casting a spell)',
  range: '60ft',
  auto: 'Auto-counters spells of 3rd level or lower',
  check: 'For spells 4th level or higher: ability check DC 10 + spell level',
  upcasting: 'Casting Counterspell at higher level auto-counters spells of that level or lower',
  important: [
    'You must SEE the creature casting. Subtle Spell beats Counterspell.',
    'Counterspell is itself a spell — it can be Counterspelled.',
    'Uses your Reaction — one per round.',
    'You don\'t automatically know what spell is being cast (Xanathar\'s optional rule: Arcana check as reaction).',
  ],
};

export const COUNTERSPELL_DECISION = [
  { situation: 'Enemy casts a spell you recognize as dangerous (Fireball, Hold Person)', action: 'Counterspell immediately', reason: 'Known dangerous spell. Don\'t gamble.' },
  { situation: 'Enemy casts an unknown spell', action: 'Counterspell if you have slots to spare', reason: 'Unknown = potentially devastating. Better safe.' },
  { situation: 'Enemy casts a cantrip', action: 'Don\'t Counterspell', reason: 'Waste of a 3rd level slot. Let cantrips through.' },
  { situation: 'Enemy casts a buff spell on themselves', action: 'Usually skip', reason: 'Buffs are lower priority than damage/control. Save your reaction.' },
  { situation: 'Multiple enemy casters', action: 'Save Counterspell for the biggest threat', reason: 'You only get one reaction. Don\'t waste it on the lesser caster.' },
  { situation: 'Enemy is casting Counterspell on YOUR ally\'s spell', action: 'Counter-Counterspell!', reason: 'Counterspell the Counterspell. Your ally\'s spell goes through.' },
];

export const COUNTER_COUNTERSPELL = {
  name: 'Counter-Counterspell chain',
  description: 'You cast a spell. Enemy Counterspells. Your ally Counterspells their Counterspell. The enemy\'s ally Counterspells your ally\'s Counterspell. Etc.',
  rules: [
    'Each Counterspell uses a reaction (one per creature per round)',
    'You can\'t Counterspell while casting your own spell (you already used your reaction on your turn... wait, actually:',
    'Casting a spell on your turn does NOT use your reaction. You CAN Counterspell a Counterspell of your own spell.',
    'This means: Cast Fireball → Enemy Counterspells → You Counterspell their Counterspell. Legal.',
  ],
  cost: 'Two spell slots for one spell to get through. Worth it for game-changing spells.',
};

export const SUBTLE_SPELL = {
  name: 'Subtle Spell (Sorcerer Metamagic)',
  cost: '1 sorcery point',
  effect: 'Cast a spell without verbal or somatic components',
  antiCounterspell: 'If a spell has no material component, Subtle Spell makes it UNDETECTABLE. Can\'t be Counterspelled because no one sees you casting.',
  bestWith: ['Counterspell (subtle Counterspell can\'t be counter-Counterspelled)', 'Suggestion (no one knows you cast)', 'Dispel Magic', 'Banishment'],
  limit: 'Spells with material components still require a visible focus/component pouch.',
};

export const CASTER_DUEL_TACTICS = [
  { tactic: 'Stay at range', description: 'Most combat spells have 60-120ft range. Counterspell is only 60ft. Stay at 65+ ft to avoid being Counterspelled.', priority: 1 },
  { tactic: 'Bait the Counterspell', description: 'Cast a cheap spell to draw out enemy Counterspell, then cast your real spell. They used their reaction.', priority: 2 },
  { tactic: 'Break line of sight', description: 'Cast from behind a pillar. Enemy can\'t see you = can\'t Counterspell. Emerge after casting.', priority: 3 },
  { tactic: 'Use non-spell abilities', description: 'Breath weapons, racial abilities, magic items don\'t count as spellcasting. Can\'t be Counterspelled.', priority: 4 },
  { tactic: 'Dispel Magic their buffs', description: 'Strip Shield, Mage Armor, Mirror Image. Make them vulnerable.', priority: 5 },
  { tactic: 'Silence area', description: 'Silence spell prevents verbal components. Most spells need verbal. Shuts down casters completely.', priority: 1 },
];

export const SPELL_DUEL_PRIORITY = [
  { priority: 1, target: 'Concentration', method: 'Break their concentration. Every hit forces a CON save. Multiple small hits > one big hit.' },
  { priority: 2, target: 'Positioning', method: 'Force them to move (grapple, shove, forced movement). Casters hate being displaced.' },
  { priority: 3, target: 'Action economy', method: 'Make them waste actions. Counterspell bait, summoned creatures, multiple threats.' },
  { priority: 4, target: 'Spell slots', method: 'Force them to burn slots on defense (Shield, Counterspell, Misty Step). They\'ll run dry.' },
  { priority: 5, target: 'Components', method: 'Take their focus. Grapple the hand with the staff. Silence the area.' },
];

export function shouldCounterspell(enemySpellLevel, yourSlotLevel, importanceRating) {
  // importanceRating: 1 (critical) to 5 (trivial)
  if (importanceRating <= 2) return { counterspell: true, reason: 'Critical spell — must counter' };
  if (enemySpellLevel <= yourSlotLevel) return { counterspell: true, reason: 'Auto-success at your slot level' };
  if (enemySpellLevel <= 3) return { counterspell: true, reason: 'Auto-counter with 3rd level slot' };
  const dc = 10 + enemySpellLevel;
  return { counterspell: importanceRating <= 3, dc, reason: `Need ability check DC ${dc}` };
}

export function counterspellSuccessChance(enemySpellLevel, yourSlotLevel, abilityMod, proficient) {
  if (enemySpellLevel <= yourSlotLevel) return 100;
  const dc = 10 + enemySpellLevel;
  const bonus = abilityMod + (proficient ? 0 : 0); // Proficiency doesn't apply to Counterspell checks by default
  const needed = dc - bonus;
  const chance = Math.min(100, Math.max(0, (21 - needed) * 5));
  return chance;
}
