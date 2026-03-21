/**
 * playerAncientsPaladinGuide.js
 * Player Mode: Oath of the Ancients Paladin — the nature paladin
 * Pure JS — no React dependencies.
 */

export const ANCIENTS_BASICS = {
  class: 'Paladin (Oath of the Ancients)',
  source: 'Player\'s Handbook',
  theme: 'Nature guardian. Anti-magic aura. The "Green Knight" Paladin.',
  note: 'Best anti-caster Paladin. Aura of Warding gives resistance to ALL spell damage to everyone nearby. Incredible.',
};

export const ANCIENTS_FEATURES = [
  { feature: 'Nature\'s Wrath', level: 3, effect: 'Channel Divinity: spectral vines restrain a creature within 10ft (STR/DEX save to escape).', note: 'Restrained = advantage on attacks against, disadvantage on DEX saves. Decent control.' },
  { feature: 'Turn the Faithless', level: 3, effect: 'Channel Divinity: fey and fiends within 30ft must WIS save or be turned for 1 minute.', note: 'Niche but strong in fey/fiend encounters. Equivalent of Turn Undead for different types.' },
  { feature: 'Aura of Warding', level: 7, effect: 'You and allies within 10ft (30ft at L18) have resistance to damage from spells.', note: 'RESISTANCE TO ALL SPELL DAMAGE. Fireball? Halved. Lightning Bolt? Halved. For the whole party in the aura.' },
  { feature: 'Undying Sentinel', level: 15, effect: 'When reduced to 0 HP, drop to 1 HP instead (once/long rest). Also don\'t age and can\'t be aged magically.', note: 'Death Ward built in. One free save per long rest.' },
  { feature: 'Elder Champion', level: 20, effect: 'Transform for 1 minute: regain 10 HP at start of each turn. Paladin spells have no material components. Enemies within 10ft have disadvantage on saves vs your spells/CD.', note: 'Massive regeneration + spell enhancement. But L20 is rare.' },
];

export const ANCIENTS_SPELLS = {
  oathSpells: [
    { level: 1, spells: 'Ensnaring Strike, Speak with Animals', note: 'Ensnaring Strike: restrain on hit. Speak with Animals is great RP.' },
    { level: 2, spells: 'Moonbeam, Misty Step', note: 'Misty Step! Best mobility spell. Moonbeam for sustained damage.' },
    { level: 3, spells: 'Plant Growth, Protection from Energy', note: 'Plant Growth: area becomes difficult terrain (no save, no concentration). Incredible control.' },
    { level: 4, spells: 'Ice Storm, Stoneskin', note: 'Ice Storm for AoE. Stoneskin is expensive but good.' },
    { level: 5, spells: 'Commune with Nature, Tree Stride', note: 'Both are situational. Commune for info, Tree Stride for travel.' },
  ],
};

export const AURA_OF_WARDING_ANALYSIS = {
  whatItCovers: 'ALL damage from spells. Fire, cold, lightning, thunder, necrotic, radiant, psychic, force, poison, acid — if it comes from a spell, resistance.',
  whatItDoesnt: 'Damage from non-spell sources: breath weapons, melee attacks, traps, environmental damage.',
  partyImpact: 'At L18: 30ft aura. Entire party resists spell damage. Against spell-heavy enemies (liches, archmages, beholders), this effectively doubles party HP vs their attacks.',
  stacksWithOther: 'Stacks with Absorb Elements (double resistance = 1/4 damage for the Absorb Elements user). Stacks with Evasion (half on success becomes quarter).',
  rating: 'S-tier at L7. Best defensive aura in the game against casters.',
};

export const ANCIENTS_TACTICS = [
  { tactic: 'Anti-caster positioning', detail: 'Stay near allies. Enemy caster Fireballs the group? Everyone in aura takes half. Your Aura of Protection (+CHA to saves) helps them save too.', rating: 'S' },
  { tactic: 'Plant Growth + melee', detail: 'Plant Growth: 100ft radius difficult terrain (4× movement cost). Enemies trapped. You and melee allies walk up and attack.', rating: 'A' },
  { tactic: 'Double aura stack', detail: 'Aura of Protection (+CHA to saves) + Aura of Warding (spell damage resistance). Two defensive auras at once.', rating: 'S' },
  { tactic: 'Nature\'s Wrath + Smite', detail: 'Restrain target → advantage on attacks → Smite with advantage. Good single-target lockdown.', rating: 'B' },
];

export const ANCIENTS_VS_DEVOTION = {
  ancients: { pros: ['Spell damage resistance (party aura)', 'Plant Growth control', 'Misty Step', 'Anti-caster specialist', 'Undying Sentinel'], cons: ['Less anti-undead', 'No Sacred Weapon (self-buff)', 'Weaker oath spells overall'] },
  devotion: { pros: ['Sacred Weapon (+CHA to attacks)', 'Immunity to charm (aura)', 'Beacon of Hope (max healing)'], cons: ['No spell resistance', 'No Misty Step', 'Less defensive'] },
  verdict: 'Ancients against spell-heavy enemies. Devotion for general-purpose holy warrior.',
};

export function auraOfWardingReduction(spellDamage) {
  return Math.floor(spellDamage / 2); // Resistance = half
}

export function doubleAuraStackSaveBonus(chaMod) {
  return chaMod; // Aura of Protection bonus
}

export function plantGrowthMovementCost(normalSpeed) {
  return normalSpeed / 4; // 4× movement cost in affected area
}
