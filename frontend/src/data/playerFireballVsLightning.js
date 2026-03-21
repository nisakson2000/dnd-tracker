/**
 * playerFireballVsLightning.js
 * Player Mode: Fireball vs Lightning Bolt comparison and situational analysis
 * Pure JS — no React dependencies.
 */

export const SPELL_COMPARISON = {
  fireball: {
    damage: '8d6 fire (avg 28)',
    area: '20ft radius sphere (40ft diameter)',
    range: '150ft (point you can see)',
    save: 'DEX',
    shape: 'Sphere — covers a circle',
    hazard: 'Ignites flammable objects not worn/carried',
    targeting: 'Pick a point. Everything in radius.',
    friendlyFire: 'Hard to avoid allies in the blob',
  },
  lightningBolt: {
    damage: '8d6 lightning (avg 28)',
    area: '100ft long, 5ft wide line',
    range: 'Self (100ft line)',
    save: 'DEX',
    shape: 'Line — covers a narrow corridor',
    hazard: 'Ignites flammable objects not worn/carried. Sets fire to what it touches.',
    targeting: 'Line from you. Must aim carefully.',
    friendlyFire: 'Easier to avoid allies (narrow line)',
  },
};

export const SITUATIONAL_WINNER = [
  { situation: 'Enemies clustered in a group', winner: 'Fireball', reason: '20ft radius covers clustered enemies easily. LB might only catch 1-2 in a line.' },
  { situation: 'Enemies in a hallway', winner: 'Lightning Bolt', reason: '100ft line hits everyone in a narrow corridor. Fireball\'s radius might not align.' },
  { situation: 'Allies are mixed in with enemies', winner: 'Lightning Bolt', reason: '5ft wide line is easier to aim between allies. 40ft diameter blob is harder to place.' },
  { situation: 'Enemy is 150ft away', winner: 'Fireball', reason: 'Fireball has 150ft range. LB starts from you and goes 100ft.' },
  { situation: 'Multiple enemy resistances', winner: 'Lightning Bolt', reason: 'Fire resistance is the most common. Lightning resistance is rarer.' },
  { situation: 'You need consistent area coverage', winner: 'Fireball', reason: 'Sphere is more versatile than line for random enemy positions.' },
  { situation: 'You\'re Evocation Wizard', winner: 'Fireball', reason: 'Sculpt Spells protects allies. Fireball\'s bigger area = more targets safely.' },
  { situation: 'Enemies are spread in a line', winner: 'Lightning Bolt', reason: 'If enemies happen to be in a line (approaching you), LB hits all of them.' },
];

export const DAMAGE_RESISTANCE_FREQUENCY = {
  fire: {
    resistant: ['Red/Gold Dragon', 'Fire Elemental', 'Tiefling', 'Many fiends', 'Fire Giant', 'Efreeti'],
    immune: ['Red Dragon (ancient)', 'Fire Elemental', 'Various fire creatures'],
    frequency: 'VERY common. Fire resistance is the #1 most frequent in the MM.',
  },
  lightning: {
    resistant: ['Blue/Bronze Dragon', 'Storm Giant', 'Shambling Mound (absorbs!)'],
    immune: ['Blue Dragon (ancient)', 'Flesh Golem (heals from it!)'],
    frequency: 'Uncommon. Much rarer than fire resistance.',
  },
  verdict: 'Lightning Bolt has a significant advantage in damage reliability. Fewer creatures resist lightning.',
};

export const BOTH_SPELLS_TIPS = [
  'Both deal 8d6 (avg 28) damage. Identical base output.',
  'Both use DEX save. Same defense mechanic.',
  'Both upcast identically: +1d6 per level above 3rd.',
  'Fireball spreads around corners. Lightning Bolt does too (it\'s a line, follows geometry).',
  'Take BOTH if you can. Different situations call for different shapes.',
  'If you can only take ONE: Fireball is generally more versatile due to sphere shape.',
  'Sculpt Spells (Evocation Wizard) makes Fireball strictly better in mixed combat.',
];

export function expectedDamage(avgTargets, hasResistance) {
  const base = 28; // 8d6 avg
  const perTarget = hasResistance ? base / 2 : base;
  return { perTarget, total: perTarget * avgTargets };
}

export function whichSpell(enemiesGrouped, alliesInArea, inHallway, fireResistance) {
  if (fireResistance) return { spell: 'Lightning Bolt', reason: 'Enemies resist fire. Use lightning.' };
  if (inHallway) return { spell: 'Lightning Bolt', reason: 'Hallway = line shape is optimal.' };
  if (alliesInArea && !inHallway) return { spell: 'Lightning Bolt', reason: 'Easier to avoid allies with narrow line.' };
  if (enemiesGrouped) return { spell: 'Fireball', reason: 'Clustered enemies. Sphere covers them all.' };
  return { spell: 'Fireball', reason: 'Default: sphere is more versatile for most situations.' };
}
