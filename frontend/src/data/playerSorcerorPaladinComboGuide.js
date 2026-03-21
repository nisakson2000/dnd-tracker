/**
 * playerSorcerorPaladinComboGuide.js
 * Player Mode: Sorcadin — the ultimate multiclass build guide
 * Pure JS — no React dependencies.
 */

export const SORCADIN_OVERVIEW = {
  concept: 'Paladin 2-6 / Sorcerer X. Combine Divine Smite with Sorcerer spell slots and Metamagic.',
  whyItWorks: 'Paladin Smite uses ANY spell slot (including Sorcerer slots). Sorcerer provides more slots + Metamagic.',
  rating: 'S+ (best multiclass build in 5e)',
};

export const SORCADIN_SPLITS = [
  {
    split: 'Paladin 2 / Sorcerer 18',
    rating: 'S',
    gains: 'Divine Smite + Fighting Style + heavy armor + maximum sorcerer progression.',
    loses: 'No Extra Attack (L5). No Aura of Protection (L6). Rely on Booming Blade/Green-Flame Blade.',
    note: 'Maximum caster. Use Booming Blade for melee. Quicken + Booming Blade is your attack.',
  },
  {
    split: 'Paladin 6 / Sorcerer 14',
    rating: 'S+',
    gains: 'Extra Attack + Aura of Protection (+CHA to saves) + Oath feature + 14 Sorcerer levels.',
    loses: 'Higher sorcerer levels. No 8th/9th level spells.',
    note: 'THE optimal split. Aura of Protection is too good to skip. Extra Attack for consistent damage.',
  },
  {
    split: 'Paladin 7 / Sorcerer 13',
    rating: 'A+',
    gains: 'L7 Paladin feature (varies by Oath). Some are incredible (Oath of Ancients L7 = spell resistance aura).',
    loses: 'One more sorcerer level.',
    note: 'Only if L7 Paladin feature is amazing (Ancients, Watchers).',
  },
];

export const BEST_PALADIN_OATHS = [
  { oath: 'Vengeance', rating: 'S+', why: 'Vow of Enmity (advantage) + Hunter\'s Mark + Relentless Avenger. Best for damage.' },
  { oath: 'Conquest', rating: 'S', why: 'Conquering Presence (AoE fear) + Armor of Agathys. Control + damage.' },
  { oath: 'Ancients', rating: 'S (if L7)', why: 'Aura of Warding (L7): resistance to spell damage. If going Paladin 7.' },
  { oath: 'Devotion', rating: 'A+', why: 'Sacred Weapon (+CHA to attacks). Reliable accuracy.' },
  { oath: 'Watchers', rating: 'A+', why: 'Aura of the Sentinel (L7): +PB to initiative for party.' },
];

export const BEST_SORCERER_ORIGINS = [
  { origin: 'Divine Soul', rating: 'S+', why: 'Access to Cleric spell list. Healing + buffs + Sorcerer spells. Ultimate versatility.' },
  { origin: 'Clockwork Soul', rating: 'S', why: 'Free extra spells (10 from list). Restore Balance. Incredibly efficient.' },
  { origin: 'Shadow', rating: 'A+', why: 'Darkness without concentration (L3). Devil\'s Sight replacement via Shadow subclass.' },
  { origin: 'Draconic', rating: 'A', why: '13+DEX AC (save armor slot). Elemental affinity damage bonus.' },
];

export const SORCADIN_NOVA_COMBO = {
  setup: 'Quickened Hold Person (BA) → Attack Action (2 attacks with advantage, auto-crit if within 5ft)',
  damage: '2 × (weapon dice + Smite dice, all DOUBLED from auto-crit) + STR/CHA mod',
  example: '2 × (2d8 longsword + 4d8 L3 smite, doubled) = 2 × (4d8 + 8d8) = 24d8 + modifiers ≈ 108 + mods',
  rating: 'S++',
  note: 'This is the highest single-round damage combo for a single character in 5e.',
};

export const SORCADIN_BUILD_PATH = {
  levels: [
    { level: '1-2', class: 'Paladin 1-2', gains: 'Heavy armor, shields, weapons, Fighting Style, Divine Smite.' },
    { level: '3-5', class: 'Sorcerer 1-3', gains: 'Sorcerer origin, cantrips (Booming Blade), Metamagic.' },
    { level: '6-8', class: 'Paladin 3-5 (or continue Sorcerer)', gains: 'Extra Attack at Paladin 5 OR more sorcerer levels.' },
    { level: '8-10', class: 'Paladin 6', gains: 'Aura of Protection. THE reason to go Paladin 6.' },
    { level: '11+', class: 'Sorcerer for rest', gains: 'More spell slots for Smiting. Higher level spells. More SP.' },
  ],
  stats: 'CHA > STR/CON > WIS. CHA is your primary for both classes.',
  race: 'Half-Elf (Elven Accuracy for crit fishing) or Custom Lineage (free feat).',
};

export const SORCADIN_TIPS = [
  'Paladin 6 / Sorcerer X is THE build. Aura of Protection is too good to skip.',
  'Divine Smite works with ANY spell slot. Sorcerer slots = more Smites.',
  'Quickened Hold Person → auto-crit Smites. Best nova in 5e.',
  'Save Smite slots for CRITS. Doubled dice on crits is the whole point.',
  'Subtle Counterspell: you\'re a melee fighter who can\'t be Counterspelled.',
  'Divine Soul Sorcerer: access Cleric list. Spiritual Weapon + Spirit Guardians + Smite.',
  'CHA is your only stat that matters for both classes. Max it.',
  'Elven Accuracy + Vow of Enmity: 14.3% crit rate. Smite every crit.',
  'You delay spell progression. No Fireball at L5. But Smite compensates.',
  'This is widely considered the best multiclass build in 5e.',
];
