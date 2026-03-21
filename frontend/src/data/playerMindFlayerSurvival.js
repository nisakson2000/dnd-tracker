/**
 * playerMindFlayerSurvival.js
 * Player Mode: Surviving Mind Flayer encounters — tactics, saves, and counters
 * Pure JS — no React dependencies.
 */

export const MIND_FLAYER_STATS = {
  cr: 7,
  ac: 15,
  hp: 71,
  speed: '30ft',
  saves: 'INT +7, WIS +6, CHA +6',
  magicResistance: 'Advantage on saves vs spells and magical effects.',
  tentacles: '2d10+4 psychic. Grappled (escape DC 15). If grappled: Extract Brain next turn.',
  mindBlast: '60ft cone. 4d8+4 psychic (INT DC 15). Fail = stunned 1 minute. Recharge 5-6.',
  extractBrain: 'Grappled + incapacitated target: instant kill. No HP threshold.',
};

export const MIND_FLAYER_TACTICS = {
  theirStrategy: [
    'Mind Blast first to stun as many targets as possible.',
    'Move in to grapple stunned targets with tentacles.',
    'Extract Brain on grappled + stunned creatures = instant death.',
    'Use Plane Shift to escape if losing.',
    'Use thralls (dominated humanoids) as meat shields.',
  ],
  yourCounter: [
    'SPREAD OUT. 60ft cone hits everyone if you\'re clustered.',
    'INT saves are KEY. Mind Blast is INT save DC 15.',
    'Kill them FAST. Don\'t let them get to turn 2+ with grappled allies.',
    'Counterspell their Plane Shift (if they try to flee).',
    'Protection from Evil and Good: immune to their charm/dominate.',
  ],
};

export const ANTI_MIND_FLAYER = [
  { counter: 'INT save boosters', detail: 'Artificer Flash of Genius (+INT), Paladin Aura (+CHA), Bless (+1d4). Stack them.', priority: 'Critical' },
  { counter: 'Protection from Evil and Good', detail: 'Immune to charmed condition. Mind Flayers rely on domination. Concentration, 1st level.', priority: 'Critical' },
  { counter: 'Intellect Fortress (3rd)', detail: 'Resistance to psychic damage + advantage on INT/WIS/CHA saves. Artificer/Bard/Sorcerer/Warlock/Wizard.', priority: 'High' },
  { counter: 'Silence', detail: 'Mind Flayers have innate spellcasting. Silence blocks Plane Shift, Dominate Monster, Levitate.', priority: 'High' },
  { counter: 'Long range attacks', detail: 'Mind Blast is 60ft cone. Eldritch Blast is 120ft. Stay outside blast range.', priority: 'High' },
  { counter: 'Stun immunity/resistance', detail: 'Berserker Barbarian Mindless Rage (immune to charmed/frightened, not stunned though). Monk Stillness of Mind.', priority: 'Medium' },
  { counter: 'Grapple escape', detail: 'If grappled, escape immediately. DC 15 Athletics/Acrobatics. Or ally kills it before Extract Brain.', priority: 'Critical' },
];

export const ELDER_BRAIN_TIPS = {
  cr: 14,
  hp: 210,
  threat: 'Psychic Hub: all Mind Flayers within 5 miles share telepathy through Elder Brain.',
  abilities: [
    'Creature Sense: locate all creatures within 5 miles.',
    'Mind Blast: 60ft, 5d10+5 psychic, INT DC 18.',
    'Psychic Link: dominate creatures. Range 5 miles.',
    'Legendary Actions: 3/round. Tentacle, Break Concentration, Psychic Pulse.',
  ],
  strategy: 'Kill the Elder Brain = cut off the hive mind. Mind Flayers become disorganized.',
};

export function mindBlastDamage(intSave, dc) {
  const avgDmg = 22; // 4d8+4
  if (intSave >= dc) return 0; // no half damage on save, just no stun
  return avgDmg;
}

export function intSaveChance(intMod, profBonus, isProficient, dc) {
  const bonus = intMod + (isProficient ? profBonus : 0);
  return Math.min(95, Math.max(5, (21 - (dc - bonus)) * 5));
}
