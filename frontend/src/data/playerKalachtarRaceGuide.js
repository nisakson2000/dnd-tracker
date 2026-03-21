/**
 * playerKalachtarRaceGuide.js
 * Player Mode: Kalashtar — the psychic dreamer
 * Pure JS — no React dependencies.
 */

export const KALASHTAR_BASICS = {
  race: 'Kalashtar',
  source: 'Eberron: Rising from the Last War',
  asis: '+2 WIS, +1 CHA',
  speed: '30ft',
  size: 'Medium',
  note: 'Psychic resistance. Advantage on WIS saves. Telepathy. Can\'t be targeted by Dream. Excellent for WIS casters and telepathic roleplay.',
};

export const KALASHTAR_TRAITS = [
  { trait: 'Dual Mind', effect: 'Advantage on all WIS saving throws.', note: 'Advantage on the most important save type. WIS saves are the most common save-or-suck (Hold Person, Dominate, etc.).' },
  { trait: 'Mental Discipline', effect: 'Resistance to psychic damage.', note: 'Psychic damage is uncommon but devastating when it appears. Good protection.' },
  { trait: 'Mind Link', effect: 'Telepathy with one creature within 10× your level feet. They can reply. Works through language barriers.', note: 'Silent communication. Coordinate plans without enemies hearing. Cross-language communication.' },
  { trait: 'Severed from Dreams', effect: 'Can\'t be targeted by Dream spell. Immune to magical sleep effects that work through dreams.', note: 'Very niche but completely shuts down Dream spell harassment.' },
];

export const KALASHTAR_CLASS_SYNERGY = [
  { class: 'Cleric', priority: 'S', reason: 'WIS+CHA. Advantage on WIS saves protects concentration. Telepathy for coordination. Perfect.' },
  { class: 'Druid', priority: 'A', reason: 'WIS. Advantage on WIS saves. Telepathy while in Wild Shape (can communicate without speaking).' },
  { class: 'Monk', priority: 'A', reason: 'WIS. Advantage on WIS saves. Psychic resistance. Telepathic monk flavor.' },
  { class: 'Paladin', priority: 'A', reason: 'CHA. Advantage on WIS saves + Aura of Protection. Very hard to fail any save.' },
  { class: 'Bard/Warlock', priority: 'B', reason: 'CHA. Telepathy for social encounters. WIS save advantage is always good.' },
];

export const KALASHTAR_TACTICS = [
  { tactic: 'WIS save fortress', detail: 'Advantage on WIS saves + proficiency (Cleric/Druid/Monk) = near-immune to charm/fear/domination.', rating: 'S' },
  { tactic: 'Telepathic coordination', detail: 'Mind Link: silently plan ambushes, warn allies, coordinate in stealth. Enemies can\'t overhear.', rating: 'A' },
  { tactic: 'Language bypass', detail: 'Telepathy works regardless of language. Communicate with any creature that has a language.', rating: 'A' },
  { tactic: 'Paladin double advantage', detail: 'Kalashtar Paladin: Aura of Protection (+CHA to saves) + advantage on WIS saves. +5 with advantage = auto-succeed.', rating: 'S' },
];

export function kalachtarWisSave(wisMod, profBonus, hasProficiency = true, aurBonus = 0) {
  const bonus = wisMod + (hasProficiency ? profBonus : 0) + aurBonus;
  const normalChance = Math.min(1, Math.max(0, (21 - (15 - bonus)) / 20));
  const advantageChance = 1 - Math.pow(1 - normalChance, 2);
  return { bonus, normalChance: `${(normalChance * 100).toFixed(0)}%`, withAdvantage: `${(advantageChance * 100).toFixed(0)}%` };
}
