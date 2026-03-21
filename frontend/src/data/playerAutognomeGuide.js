/**
 * playerAutognomeGuide.js
 * Player Mode: Autognome race guide — the mechanical gnomes
 * Pure JS — no React dependencies.
 */

export const AUTOGNOME_BASICS = {
  race: 'Autognome',
  source: 'Astral Adventurer\'s Guide (Spelljammer)',
  asi: '+2/+1 or +1/+1/+1 (Tasha\'s flexible)',
  speed: 30,
  size: 'Small',
  type: 'Construct',
  languages: ['Common', 'one of your choice'],
  theme: 'Mechanical gnome constructs. Immune to disease, don\'t need food/water/air. Mending heals them.',
};

export const AUTOGNOME_TRAITS = [
  { trait: 'Armored Casing', effect: 'AC = 13 + DEX mod (no armor). Can still wear armor if better.', rating: 'A', note: 'Better than most light armor at low levels. AC 16 with +3 DEX. Free to wear armor if you get better.' },
  { trait: 'Built for Success', effect: 'Add 1d4 to attack, check, or save (PB times per long rest).', rating: 'S', note: 'Like free Guidance/Bless on demand. PB uses per LR. Incredibly versatile.' },
  { trait: 'Mechanical Nature', effect: 'Construct type. Advantage on saves vs paralysis/poison. Immune to disease. Don\'t need food/water/air/sleep.', rating: 'S', note: 'Construct type means many humanoid-targeting spells don\'t work on you (Hold Person, Charm Person, etc.).' },
  { trait: 'Sentry\'s Rest', effect: 'Instead of sleeping: inactive but conscious for 6 hours. Can see and hear normally.', rating: 'A', note: 'Can\'t be surprised while resting. Perfect sentinel. Still counts as long rest.' },
  { trait: 'Specialized Design', effect: 'Gain 2 tool proficiencies.', rating: 'B', note: 'Extra tool proficiencies. Good for Artificers or crafting campaigns.' },
  { trait: 'Healing via Mending', effect: 'Mending cantrip restores 1d8 HP to you (1 casting per short/long rest). Also benefit from Healing Word etc.', rating: 'A', note: 'Free out-of-combat healing via cantrip. Anyone with Mending can heal you.' },
];

export const AUTOGNOME_BUILDS = [
  { build: 'Artificer', why: 'Thematic perfection. Construct building construct. Tool proficiencies stack. Built for Success on infusion checks.', rating: 'S' },
  { build: 'Wizard', why: 'Armored Casing gives free AC. Construct type dodges humanoid spells. Built for Success on saves.', rating: 'S' },
  { build: 'Rogue', why: 'Built for Success on attack = land Sneak Attack. Armored Casing decent AC. Sentry\'s Rest perfect for watch.', rating: 'A' },
  { build: 'Fighter', why: 'Built for Success on key attacks. Construct type. Tool proficiencies for utility.', rating: 'A' },
];

export const CONSTRUCT_TYPE_INTERACTIONS = {
  immuneTo: ['Hold Person', 'Charm Person', 'Dominate Person', 'Crown of Madness'],
  stillAffectedBy: ['Hold Monster', 'Charm Monster', 'Dominate Monster', 'Banishment'],
  note: '"Person" spells target humanoids only. Autognomes are constructs. "Monster" spells work on any creature.',
  healingSpells: 'Despite being a construct, Autognomes ARE affected by healing spells normally (unlike most constructs).',
};

export function armoredCasingAC(dexMod) {
  return 13 + dexMod;
}

export function builtForSuccessUses(proficiencyBonus) {
  return proficiencyBonus;
}
