/**
 * playerWatchersPaladinGuide.js
 * Player Mode: Oath of the Watchers Paladin — the extraplanar sentinel
 * Pure JS — no React dependencies.
 */

export const WATCHERS_BASICS = {
  class: 'Paladin (Oath of the Watchers)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Sentinel against extraplanar threats. Initiative aura and anti-charm/fright defense.',
  note: 'Best initiative Paladin. Aura adds CHA to everyone\'s initiative. Plus Counterspell as an oath spell.',
};

export const WATCHERS_FEATURES = [
  { feature: 'Watcher\'s Will', level: 3, effect: 'Channel Divinity, action: choose creatures within 30ft (up to CHA mod). Each gains advantage on INT/WIS/CHA saves for 1 minute.', note: 'Advantage on mental saves for the party. Counters charm, fear, psychic attacks.' },
  { feature: 'Abjure the Extraplanar', level: 3, effect: 'Channel Divinity: aberrations, celestials, elementals, fey, fiends within 30ft must WIS save or be turned for 1 minute.', note: 'Turn Undead but for extraplanar creatures. Covers many enemy types.' },
  { feature: 'Aura of the Sentinel', level: 7, effect: 'You and allies within 10ft (30ft at L18) add your proficiency bonus to initiative rolls.', note: 'PARTY-WIDE PB TO INITIATIVE. At L7: +3 to everyone\'s initiative. At L17: +6. Incredible.' },
  { feature: 'Vigilant Rebuke', level: 15, effect: 'When you or ally within 30ft succeeds on INT/WIS/CHA save, reaction: force damage = 2d8+CHA mod to the spell caster.', note: 'Punish enemy spellcasters when their spells fail. 2d8+5 force damage per failed spell.' },
  { feature: 'Mortal Bulwark', level: 20, effect: 'Transform for 1 minute: truesight 120ft, advantage on attacks vs aberrations/celestials/elementals/fey/fiends, banish on hit (CHA save, banished for 24 hours).', note: 'Truesight + advantage + banishment on hit. Anti-extraplanar capstone.' },
];

export const WATCHERS_SPELLS = {
  oathSpells: [
    { level: 1, spells: 'Alarm, Detect Magic', note: 'Detect Magic always useful. Alarm for safe resting.' },
    { level: 2, spells: 'Moonbeam, See Invisibility', note: 'See Invisibility counters a major threat. Moonbeam is sustained damage.' },
    { level: 3, spells: 'Counterspell, Nondetection', note: 'COUNTERSPELL ON A PALADIN. Use CHA for the check. Incredible.' },
    { level: 4, spells: 'Aura of Purity, Banishment', note: 'Banishment is great. Aura of Purity prevents conditions.' },
    { level: 5, spells: 'Hold Monster, Scrying', note: 'Hold Monster = auto-crit + paralysis. Scrying for info.' },
  ],
};

export const WATCHERS_TACTICS = [
  { tactic: 'Initiative aura stacking', detail: 'Aura of the Sentinel: +PB to initiative for party. At L9: party-wide +4 initiative. Everyone goes before enemies.', rating: 'S', note: 'Stack with Alert, Harengon, Gloom Stalker dips for insane initiative.' },
  { tactic: 'Counterspell Paladin', detail: 'L9: Counterspell. Use CHA for ability checks. With +5 CHA: reliably counter 4th-5th level spells.', rating: 'S' },
  { tactic: 'Mental save advantage', detail: 'Watcher\'s Will: party-wide advantage on INT/WIS/CHA saves. Counters domination, fear, illusions.', rating: 'A' },
  { tactic: 'Vigilant Rebuke revenge', detail: 'L15: when ally saves vs spell, attacker takes 2d8+5 force. Multiple allies saving = multiple triggers.', rating: 'A' },
  { tactic: 'Aura of Protection + initiative', detail: 'Two passive auras: +CHA to saves AND +PB to initiative. Both always active. Best passive aura Paladin.', rating: 'S' },
];

export const WATCHERS_VS_ANCIENTS = {
  watchers: { pros: ['Party initiative boost', 'Counterspell access', 'Mental save advantage', 'Vigilant Rebuke (spell revenge)'], cons: ['Less defensive (no spell resistance)', 'Abjure the Extraplanar is niche', 'No Misty Step'] },
  ancients: { pros: ['Spell damage resistance (party)', 'Misty Step', 'Plant Growth control', 'Undying Sentinel'], cons: ['No initiative boost', 'No Counterspell', 'No mental save advantage'] },
  verdict: 'Watchers for initiative control + Counterspell. Ancients for spell damage resistance.',
};

export function sentinelInitiativeBonus(proficiencyBonus) {
  return proficiencyBonus;
}

export function vigilantRebukeDamage(chaMod) {
  return 9 + chaMod; // 2d8 avg + CHA
}
