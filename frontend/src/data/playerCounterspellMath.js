/**
 * playerCounterspellMath.js
 * Player Mode: Counterspell mechanics, check math, and decision making
 * Pure JS — no React dependencies.
 */

export const COUNTERSPELL_RULES = {
  casting: 'Reaction. 60ft range. When you see a creature casting a spell.',
  automatic: 'If you cast Counterspell at the same level or higher as the target spell, it automatically counters.',
  check: 'If cast at a lower level: ability check DC = 10 + spell level. Your spellcasting ability modifier applies.',
  components: 'Somatic only. Can cast while holding things. Can\'t Counterspell if you can\'t see the caster.',
  counterCounter: 'An enemy can Counterspell your Counterspell. You can Counterspell theirs. Reaction chains.',
};

export const COUNTERSPELL_MATH = [
  { yourLevel: 3, targetLevel: 3, auto: true, checkDC: '-', successChance: '100%' },
  { yourLevel: 3, targetLevel: 4, auto: false, checkDC: 14, successChance: 'Varies (see ability mod)' },
  { yourLevel: 3, targetLevel: 5, auto: false, checkDC: 15, successChance: 'Varies' },
  { yourLevel: 3, targetLevel: 6, auto: false, checkDC: 16, successChance: 'Varies' },
  { yourLevel: 3, targetLevel: 7, auto: false, checkDC: 17, successChance: 'Varies' },
  { yourLevel: 3, targetLevel: 8, auto: false, checkDC: 18, successChance: 'Varies' },
  { yourLevel: 3, targetLevel: 9, auto: false, checkDC: 19, successChance: 'Varies' },
];

export const ABILITY_CHECK_BONUSES = [
  { source: 'Spellcasting ability mod', bonus: '+3 to +5', note: 'Always applies to Counterspell check.' },
  { source: 'Jack of All Trades (Bard)', bonus: '+half proficiency', note: 'Ability checks include Counterspell. Bards are natural Counterspellers.' },
  { source: 'Amulet of the Devout/Rod of Pact Keeper', bonus: '+1 to +3', note: 'Bonus to spell attacks and DCs. Does NOT help Counterspell check (it\'s an ability check, not DC).' },
  { source: 'Guidance', bonus: '+1d4', note: 'Only works if Guidance is active BEFORE the reaction. Rare but possible.' },
  { source: 'Flash of Genius (Artificer)', bonus: '+INT mod', note: 'Artificer can add INT to ally\'s ability check as reaction. Two reactions needed (one to CS, one for FoG).' },
  { source: 'Glibness (8th level Bard)', bonus: 'Minimum 15 on CHA checks', note: 'Counterspell check uses CHA for Bard. Minimum 15 = auto-counter up to 7th level spells.' },
];

export const COUNTERSPELL_DECISION = {
  alwaysCounter: ['Power Word Kill', 'Meteor Swarm', 'Disintegrate', 'Feeblemind', 'Dominate Monster', 'Forcecage', 'Banishment'],
  usuallyCounter: ['Hold Person/Monster', 'Hypnotic Pattern', 'Fireball (if allies in area)', 'Wall of Force', 'Finger of Death'],
  saveReaction: ['Cantrips', 'Low-level utility', 'Healing spells (unless keeping a target dead)'],
  cantIdentify: 'If you can\'t identify the spell, you must decide blind. Xanathar\'s: Arcana check (DC 15 + level) as reaction to identify, but this uses your reaction (can\'t also Counterspell).',
};

export const SUBTLE_COUNTERSPELL = {
  description: 'Sorcerer Subtle Spell: cast Counterspell without somatic components.',
  effect: 'Enemy can\'t see you casting → can\'t Counterspell your Counterspell.',
  cost: '1 Sorcery Point.',
  rating: 'S',
  note: 'The ultimate Counterspell. Uncounterable counter. 1 SP for guaranteed counter.',
};

export function counterspellSuccess(casterAbilityMod, targetSpellLevel, counterspellLevel) {
  if (counterspellLevel >= targetSpellLevel) return 100;
  const dc = 10 + targetSpellLevel;
  const needed = dc - casterAbilityMod;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}

export function bardCounterspellSuccess(chaMod, profBonus, targetSpellLevel, hasGlibness) {
  if (hasGlibness && targetSpellLevel <= 7) return 100; // minimum 15 on check
  const jackBonus = Math.floor(profBonus / 2);
  const dc = 10 + targetSpellLevel;
  const needed = dc - chaMod - jackBonus;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}
