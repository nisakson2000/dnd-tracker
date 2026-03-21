/**
 * playerKalashtarGuide.js
 * Player Mode: Kalashtar race guide — the psychic dreamtouched
 * Pure JS — no React dependencies.
 */

export const KALASHTAR_BASICS = {
  race: 'Kalashtar',
  source: 'Eberron: Rising from the Last War',
  size: 'Medium',
  speed: '30ft',
  asi: '+2 WIS, +1 CHA',
  theme: 'Psychic humanoid bonded with a dream spirit. Telepathy, psychic resistance, and dream defense.',
  note: 'Excellent defensive race. Psychic resistance + advantage on WIS saves. Great for Cleric/Druid builds.',
};

export const KALASHTAR_TRAITS = [
  { trait: 'Dual Mind', effect: 'Advantage on all Wisdom saving throws.', note: 'ADVANTAGE ON WIS SAVES. WIS saves cover: charm, fear, domination, many of the worst save-or-suck effects.' },
  { trait: 'Mental Discipline', effect: 'Resistance to psychic damage.', note: 'Psychic resistance. Not the most common damage type but nice to have.' },
  { trait: 'Mind Link', effect: 'Telepathy: speak to one creature within 10× your level ft. They can respond while linked. No shared language needed.', note: 'Scaling telepathy. At L10: 100ft range. Silent communication. Works across language barriers.' },
  { trait: 'Severed from Dreams', effect: 'Immune to spells/effects that require you to dream (Dream spell targeting).', note: 'Niche. Prevents the Dream spell from being used to torment you.' },
];

export const KALASHTAR_BUILDS = [
  { build: 'Kalashtar Cleric', detail: '+2 WIS. Advantage on WIS saves (your best save gets better). Psychic resistance. Telepathy for coordination.', rating: 'S' },
  { build: 'Kalashtar Druid', detail: '+2 WIS. Same benefits. Telepathy works in Wild Shape.', rating: 'S', note: 'Telepathy while in beast form is huge. Communicate with the party as a bear.' },
  { build: 'Kalashtar Monk', detail: '+2 WIS for AC/saves. Advantage on WIS saves + Monk proficiency in saves = near-immune to mental effects.', rating: 'A' },
  { build: 'Kalashtar Ranger', detail: '+2 WIS. Advantage on WIS saves protects against charm/fear. Telepathy for silent scouting reports.', rating: 'A' },
  { build: 'Kalashtar Warlock', detail: '+1 CHA. Advantage on WIS saves covers Warlock\'s worst save. Telepathy enhances social play.', rating: 'A' },
];

export const DUAL_MIND_ANALYSIS = {
  wisdomSaves: [
    'Hold Person / Hold Monster (paralysis)',
    'Dominate Person / Dominate Monster',
    'Charm Person / Charm Monster',
    'Fear / Cause Fear / Frightful Presence',
    'Hypnotic Pattern (incapacitated)',
    'Banishment',
    'Phantasmal Force / Phantasmal Killer',
    'Modify Memory',
    'Suggestion / Mass Suggestion',
  ],
  note: 'WIS saves are arguably the most important saves in the game. Advantage on ALL of them is incredibly powerful.',
  effectiveBonus: 'Advantage ≈ +5 to the roll on average. Equivalent to proficiency + a good modifier.',
};

export function kalashtarTelepathyRange(characterLevel) {
  return characterLevel * 10; // 10ft per level
}

export function wisdomSaveWithAdvantage(wisMod, profBonus, saveDC) {
  const baseChance = Math.min(0.95, Math.max(0.05, (21 - (saveDC - wisMod - profBonus)) / 20));
  return 1 - Math.pow(1 - baseChance, 2); // Advantage
}
