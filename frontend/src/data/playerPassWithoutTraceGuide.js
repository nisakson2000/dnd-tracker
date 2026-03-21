/**
 * playerPassWithoutTraceGuide.js
 * Player Mode: Pass without Trace — +10 Stealth for entire party
 * Pure JS — no React dependencies.
 */

export const PASS_WITHOUT_TRACE_BASICS = {
  spell: 'Pass without Trace',
  level: 2,
  school: 'Abjuration',
  castTime: '1 action',
  range: 'Self (30ft radius)',
  duration: '1 hour (concentration)',
  classes: ['Druid', 'Ranger'],
  effect: '+10 bonus to Stealth checks for all creatures within 30ft of you. Targets can\'t be tracked except by magical means.',
  note: 'The most powerful Stealth spell in the game. +10 is absurd. Even heavy armor wearers become stealthy.',
};

export const PWoT_MATH = [
  { character: 'Rogue (DEX 20, Expertise)', stealth: '+13', withPWoT: '+23', note: 'Minimum roll: 24 (1+23). Nothing detects this.' },
  { character: 'Fighter (DEX 10, no prof)', stealth: '+0', withPWoT: '+10', note: 'Minimum roll: 11. Better than most enemies\' passive Perception.' },
  { character: 'Paladin (heavy armor, disadvantage)', stealth: '-1 (with disadvantage)', withPWoT: '+9 (with disadvantage)', note: 'Even with disadvantage: avg roll ~14. Still stealthy.' },
  { character: 'Wizard (DEX 14, prof)', stealth: '+5', withPWoT: '+15', note: 'Minimum roll: 16. Easily beats most Perception.' },
];

export const PWoT_USES = [
  { use: 'Party-wide ambush', detail: 'Entire party sneaks up on enemies. Group Stealth check easily beats passive Perception. Surprise round.', rating: 'S' },
  { use: 'Bypass encounters', detail: 'Sneak past dangerous encounters. Avoid unnecessary fights. Conserve resources.', rating: 'S' },
  { use: 'Cover heavy armor weakness', detail: 'Paladins/Fighters in heavy armor have disadvantage on Stealth. +10 mostly compensates.', rating: 'S' },
  { use: 'Infiltration', detail: 'Break into buildings, camps, castles. Full party stealth for 1 hour.', rating: 'A' },
  { use: 'Anti-tracking', detail: 'Can\'t be tracked by non-magical means. Escape pursuit.', rating: 'B' },
];

export const PWoT_TIPS = [
  'Concentration: only one concentration spell at a time. Can\'t run PWoT and Spike Growth simultaneously.',
  '30ft radius: party must stay within 30ft of caster. Spread out = lose the bonus.',
  '1 hour duration: long enough for most stealth missions. Cast before approaching.',
  'Group Stealth rules: if at least half the group succeeds, the whole group succeeds. PWoT makes this trivial.',
  'Druids get this at L3, Rangers at L5. Druids are earlier and better casters of this spell.',
  'Shadow Monk gets this at L6 (2 Ki). Limited but available to Monks.',
];

export const PWoT_CLASS_PRIORITY = [
  { class: 'Druid', rating: 'S', reason: 'Gets it at L3. Always prepare when stealth is needed.' },
  { class: 'Ranger', rating: 'S', reason: 'Gets it at L5. Ranger + PWoT = party scout leader.' },
  { class: 'Shadow Monk', rating: 'A', reason: 'Gets it at L6 via Shadow Arts (2 Ki). Limited uses but strong.' },
  { class: 'Trickery Cleric', rating: 'A', reason: 'On domain spell list. Always prepared. Cleric + PWoT is rare and valuable.' },
  { class: 'Land Druid (Grassland)', rating: 'S', reason: 'Always prepared via Circle Spells. Free preparation slot.' },
];

export function pwotStealthCheck(dexMod, profBonus, isProficient, hasExpertise, hasDisadvantage) {
  let bonus = dexMod + 10;
  if (isProficient) bonus += profBonus;
  if (hasExpertise) bonus += profBonus;
  const minRoll = 1 + bonus;
  const avgRoll = hasDisadvantage ? Math.round(7 + bonus) : Math.round(10.5 + bonus);
  return { bonus, minRoll, avgRoll, note: `With PWoT: +${bonus} Stealth. Min roll: ${minRoll}. Avg: ~${avgRoll}${hasDisadvantage ? ' (disadvantage)' : ''}.` };
}
