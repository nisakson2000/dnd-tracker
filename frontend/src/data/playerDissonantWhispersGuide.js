/**
 * playerDissonantWhispersGuide.js
 * Player Mode: Dissonant Whispers — forced movement + OA trigger
 * Pure JS — no React dependencies.
 */

export const DISSONANT_WHISPERS_BASICS = {
  spell: 'Dissonant Whispers',
  level: 1,
  school: 'Enchantment',
  castTime: '1 action',
  range: '60 feet',
  save: 'WIS save. Success: half damage, no fleeing. Failure: full damage + target uses reaction to flee.',
  damage: '3d6 psychic (scales +1d6 per slot level)',
  classes: ['Bard', 'Warlock (Great Old One)'],
  note: 'The fleeing movement uses the target\'s REACTION. This means it provokes opportunity attacks from ALL adjacent allies.',
};

export const OA_INTERACTION = {
  key: 'The forced movement from Dissonant Whispers uses the target\'s reaction to move. This is VOLUNTARY movement (using reaction), not forced movement.',
  result: 'Because it\'s voluntary movement (using reaction), it PROVOKES opportunity attacks.',
  note: 'This is the #1 reason DW is S-tier. Compare to Thunderwave/Fear which are forced movement and do NOT provoke OA.',
  combo: [
    'Target fails save → moves away from you → ALL melee allies adjacent get free OA.',
    'With PAM+Sentinel allies: target triggers PAM entry OA when they re-enter reach later.',
    'Rogue ally gets OA = extra Sneak Attack (once per turn, OA is a different turn than their turn).',
  ],
};

export const DISSONANT_WHISPERS_COMBOS = [
  { combo: 'DW + Rogue ally', detail: 'Target flees → Rogue OA → Sneak Attack on your turn (separate from Rogue\'s own turn SA).', rating: 'S' },
  { combo: 'DW + Sentinel ally', detail: 'Target flees → Sentinel OA → speed becomes 0. Target stopped in its tracks.', rating: 'S' },
  { combo: 'DW + PAM ally', detail: 'Target flees through PAM user\'s reach → OA. If Sentinel too: speed 0.', rating: 'S' },
  { combo: 'DW + multiple melee allies', detail: '3 melee allies around target → 3 opportunity attacks. Massive burst damage.', rating: 'S' },
  { combo: 'DW + Spirit Guardians', detail: 'Target flees through SG area → takes SG damage for entering/starting in area.', rating: 'A' },
];

export const DISSONANT_WHISPERS_SCALING = [
  { slot: 1, damage: '3d6 (10.5 avg)', note: 'Good L1 damage + forced movement.' },
  { slot: 2, damage: '4d6 (14 avg)', note: 'Better damage. Still great OA trigger.' },
  { slot: 3, damage: '5d6 (17.5 avg)', note: 'Solid. But may have better L3 options.' },
  { slot: 4, damage: '6d6 (21 avg)', note: 'Getting expensive. Use lower slots.' },
];

export const DISSONANT_WHISPERS_TIPS = [
  'Target enemies SURROUNDED by melee allies for maximum OA triggers.',
  'WIS save: weak against low-WIS enemies (beasts, undead, some aberrations).',
  'Deafened creatures auto-succeed the save (can\'t hear the whispers).',
  'Psychic damage: very rarely resisted. Almost nothing is immune to psychic.',
  'Scales well but OA trigger is the main value, not the damage itself.',
  'Warlock (Great Old One): on their spell list. Cast with Warlock slots (always max level).',
];

export function dwTotalDamage(slotLevel, numAlliesWithOA, allyAvgOADamage) {
  const spellDmg = (slotLevel + 2) * 3.5;
  const oaDmg = numAlliesWithOA * allyAvgOADamage;
  return { spellDamage: Math.round(spellDmg), oaDamage: Math.round(oaDmg), total: Math.round(spellDmg + oaDmg), note: `DW: ${Math.round(spellDmg)} spell + ${Math.round(oaDmg)} from ${numAlliesWithOA} OAs = ${Math.round(spellDmg + oaDmg)} total` };
}
