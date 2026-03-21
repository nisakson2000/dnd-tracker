/**
 * playerConcentrationMasteryGuide.js
 * Player Mode: Concentration mechanics, optimization, and spell management
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_RULES = {
  limit: 'You can only concentrate on ONE spell at a time.',
  newSpell: 'Casting a new concentration spell ends the current one. No save, no choice.',
  saveDC: 'When you take damage: CON save DC = 10 or half damage taken, whichever is higher.',
  multipleDamage: 'Each damage source triggers a separate save. 3 Magic Missiles = 3 saves.',
  incapacitated: 'Being incapacitated or killed ends concentration automatically.',
  duration: 'Concentration spells can last up to their full duration if maintained.',
};

export const BOOST_CONCENTRATION = [
  { method: 'War Caster feat', bonus: 'Advantage on CON saves for concentration.', rating: 'S+', note: 'Advantage = roughly +5. Also cast somatic with hands full.' },
  { method: 'Resilient (CON)', bonus: '+proficiency to CON saves.', rating: 'S+', note: '+2 to +6. Scales with level. Better than War Caster at high levels.' },
  { method: 'High CON', bonus: '+1 to +5 CON mod.', rating: 'S', note: '14-16 CON is standard for casters.' },
  { method: 'Bladesong (Wizard)', bonus: '+INT mod to concentration saves.', rating: 'S', note: 'Bladesinger exclusive. +5 INT on top of CON.' },
  { method: 'Aura of Protection (Paladin)', bonus: '+CHA mod to all saves.', rating: 'S', note: 'Applies to concentration saves too. Party-wide.' },
  { method: 'Mind Sharpener (Artificer)', bonus: 'Auto-succeed concentration save (4 charges/day).', rating: 'A+', note: 'Artificer infusion. Give to the party caster.' },
  { method: 'Dodge action', bonus: 'Disadvantage on attacks against you.', rating: 'A', note: 'Fewer hits = fewer concentration saves.' },
  { method: 'Shield spell', bonus: '+5 AC (reaction).', rating: 'A+', note: 'Block the hit entirely. No damage = no save.' },
  { method: 'Absorb Elements', bonus: 'Halve elemental damage (reaction).', rating: 'A', note: 'Half damage = lower DC. DC 10 minimum still applies.' },
  { method: 'Lucky feat', bonus: 'Reroll a failed save.', rating: 'A', note: '3 uses per long rest. Emergency save fix.' },
];

export const BEST_CONCENTRATION_SPELLS = [
  { level: 1, spells: ['Bless (+1d4 attacks/saves)', 'Faerie Fire (advantage)', 'Hex (1d6/hit)', 'Hunter\'s Mark (1d6/hit)'] },
  { level: 2, spells: ['Hold Person (paralyzed)', 'Spiritual Weapon is NOT concentration', 'Moonbeam', 'Spike Growth'] },
  { level: 3, spells: ['Hypnotic Pattern (incapacitate group)', 'Spirit Guardians (3d8/round AoE)', 'Haste (double action)', 'Slow'] },
  { level: 4, spells: ['Polymorph (157 HP Giant Ape)', 'Banishment (remove from fight)', 'Greater Invisibility'] },
  { level: 5, spells: ['Animate Objects (10d4+40/round)', 'Hold Monster', 'Wall of Force is NOT concentration'] },
  { level: 6, spells: ['Eyebite (action each turn)', 'Sunbeam (action each turn)'] },
  { level: 7, spells: ['Forcecage is NOT concentration', 'Reverse Gravity'] },
];

export const NON_CONCENTRATION_WINNERS = {
  note: 'These powerful spells DON\'T require concentration. Use alongside concentration spells.',
  spells: [
    { spell: 'Spiritual Weapon (L2)', why: 'Bonus action attack each turn. Free DPR.' },
    { spell: 'Wall of Force (L5)', why: 'Indestructible dome/wall. No save. No concentration.' },
    { spell: 'Forcecage (L7)', why: 'Prison. No save to trap. No concentration.' },
    { spell: 'Magic Missile (L1)', why: 'Auto-hit. 3 guaranteed concentration saves on enemies.' },
    { spell: 'Shield (L1)', why: 'Reaction +5 AC. Prevent damage = prevent saves.' },
    { spell: 'Counterspell (L3)', why: 'Negate enemy spells. Reaction.' },
    { spell: 'Fireball (L3)', why: 'Burst AoE. No concentration. Just damage.' },
    { spell: 'Healing Word (L1)', why: 'Bonus action ranged heal. No concentration.' },
  ],
};

export const CONCENTRATION_TIPS = [
  'ONE concentration spell at a time. Choose wisely.',
  'War Caster OR Resilient (CON): take one by L4. War Caster early, Resilient late.',
  'Resilient (CON) surpasses War Caster at ~L9 (proficiency +4).',
  'Dodge action while concentrating: fewer hits = fewer saves.',
  'Shield spell: block the hit entirely. Best concentration protection.',
  'Magic Missile forces 3 separate concentration saves. Break enemy spells.',
  'Spirit Guardians: best sustained damage spell. Protect your concentration.',
  'Bless: +1d4 to attacks AND saves. Including concentration saves.',
  'Haste: if concentration breaks, target loses a turn. Risky.',
  'Non-concentration spells (Wall of Force, Spiritual Weapon) combo with concentration.',
];
