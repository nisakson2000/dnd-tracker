/**
 * playerSacredOathRankingGuide.js
 * Player Mode: All Paladin Sacred Oaths ranked
 * Pure JS — no React dependencies.
 */

export const SACRED_OATHS_RANKED = [
  { oath: 'Vengeance', rating: 'S+', role: 'Damage', key: 'Vow of Enmity: advantage vs 1 target. Hunter\'s Mark. Haste. Misty Step.', note: 'Best damage. Advantage = crits = Smites.' },
  { oath: 'Conquest', rating: 'S', role: 'Control/Tank', key: 'Aura of Conquest: frightened = speed 0 + psychic damage. AoE frighten.', note: 'Fear lock. Best control Paladin.' },
  { oath: 'Watchers', rating: 'A+', role: 'Support', key: 'L7: +PB initiative for all allies in 30ft.', note: 'Party initiative boost is S+ tier.' },
  { oath: 'Ancients', rating: 'A+', role: 'Anti-Caster', key: 'L7: resistance to spell damage within 10ft.', note: 'Half damage from all spells in aura.' },
  { oath: 'Devotion', rating: 'A+', role: 'Reliable', key: 'Sacred Weapon: +CHA to hit. Immunity to charm.', note: 'Most consistent Paladin.' },
  { oath: 'Glory', rating: 'A', role: 'Buff', key: 'Temp HP distribution after Smite. Enhanced athletics.', note: 'Good support.' },
  { oath: 'Redemption', rating: 'A', role: 'Pacifist Tank', key: 'Reflect damage. Absorb ally damage.', note: 'Unique tanking style.' },
  { oath: 'Crown', rating: 'B+', role: 'Tank', key: 'Compel enemies to fight you. Mass heal.', note: 'Outclassed by others.' },
  { oath: 'Oathbreaker', rating: 'A+ (evil)', role: 'Damage', key: '+CHA melee damage aura (you + undead).', note: 'Best damage aura. Evil only.' },
];

export const SACRED_OATH_TIPS = [
  'ALL Paladins: Aura of Protection L6 is the reason to play Paladin.',
  'Vengeance: Vow of Enmity + Elven Accuracy = 14.3% crit rate.',
  'Conquest + Dragon Fear: AoE frighten → enemies can\'t move.',
  'Smite on CRITS. Doubled dice. Declare after seeing the 20.',
  'Lay on Hands: 1 HP revives. Most efficient use of pool.',
  'Bless: best L1 spell. +1d4 to attacks and saves for 3 allies.',
  'Find Steed: permanent mount. Shares self-target spells.',
  'Paladin is the best 2-level multiclass dip (Divine Smite + Fighting Style).',
];
