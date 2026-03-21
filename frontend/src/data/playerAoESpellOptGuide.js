/**
 * playerAoESpellOptGuide.js
 * Player Mode: AoE spell optimization — shapes, targeting, and maximizing hits
 * Pure JS — no React dependencies.
 */

export const AOE_SHAPES = [
  { shape: 'Sphere', examples: ['Fireball (20ft)', 'Spirit Guardians (15ft)', 'Shatter (10ft)'], targeting: 'Pick a point. Sphere extends from center.', note: 'Fireball: 40ft diameter. Hits huge area.' },
  { shape: 'Cube', examples: ['Hypnotic Pattern (30ft)', 'Thunderwave (15ft)', 'Cloudkill (20ft)'], targeting: 'One face starts at point of origin.', note: 'Cubes are bigger than you think.' },
  { shape: 'Cone', examples: ['Burning Hands (15ft)', 'Cone of Cold (60ft)', 'Fear (30ft)'], targeting: 'Starts at you. Widens out.', note: 'Width at end = cone length.' },
  { shape: 'Cylinder', examples: ['Moonbeam (5ft r, 40ft h)', 'Insect Plague (20ft r)', 'Flame Strike (10ft r)'], targeting: 'Circle on ground. Extends upward.', note: 'Catches flying creatures too.' },
  { shape: 'Line', examples: ['Lightning Bolt (100ft)', 'Wall of Fire', 'Gust of Wind (60ft)'], targeting: 'Straight line from you.', note: 'Position to hit maximum enemies in a row.' },
];

export const AOE_SPELLS_RANKED = [
  { spell: 'Fireball', level: 3, shape: '20ft sphere', damage: '8d6 fire (28 avg)', rating: 'S+', note: 'Gold standard AoE. 40ft diameter. DEX save.' },
  { spell: 'Spirit Guardians', level: 3, shape: '15ft around you', damage: '3d8 radiant/necrotic per turn', rating: 'S+', note: 'Moves with you. Damage + difficult terrain. Best sustained AoE.' },
  { spell: 'Hypnotic Pattern', level: 3, shape: '30ft cube', damage: 'None (incapacitate)', rating: 'S+', note: 'Control > damage. Removes multiple enemies.' },
  { spell: 'Synaptic Static', level: 5, shape: '20ft sphere', damage: '8d6 psychic + debuff', rating: 'S+', note: 'Fireball but psychic + -1d6 to attacks/saves. Amazing.' },
  { spell: 'Cone of Cold', level: 5, shape: '60ft cone', damage: '8d8 cold (36 avg)', rating: 'A+', note: 'Huge cone. Good damage. CON save.' },
  { spell: 'Shatter', level: 2, shape: '10ft sphere', damage: '3d8 thunder', rating: 'A+', note: 'Early AoE. Thunder = rarely resisted.' },
  { spell: 'Lightning Bolt', level: 3, shape: '100ft line', damage: '8d6 lightning', rating: 'A', note: 'Same damage as Fireball. Line is harder to target.' },
  { spell: 'Ice Storm', level: 4, shape: '20ft cylinder', damage: '2d8 + 4d6 + difficult terrain', rating: 'A', note: 'Damage + terrain. Two damage types.' },
];

export const AOE_PLACEMENT_TIPS = [
  { tip: 'Careful Spell (Sorcerer)', effect: 'CHA mod creatures auto-succeed on AoE saves.', rating: 'S', note: 'Fireball your allies. They take 0 (with Careful + Evasion).' },
  { tip: 'Sculpt Spells (Evocation Wizard)', effect: 'Choose creatures to auto-succeed on YOUR evocation spells.', rating: 'S+', note: 'Even better than Careful Spell. School-specific.' },
  { tip: 'Wait for clumping', effect: 'Don\'t rush AoE. Wait for enemies to cluster.', rating: 'A+', note: '3+ targets = AoE worth it. 1-2 targets = single target.' },
  { tip: 'Funnel enemies', effect: 'Chokepoints, walls, difficult terrain force clustering.', rating: 'S', note: 'Create choke → AoE into the crowd.' },
  { tip: 'Wall + AoE combo', effect: 'Wall of Force traps. AoE inside. No escape.', rating: 'S+', note: 'Wall of Force + Sickening Radiance = death box.' },
];

export const AOE_TIPS = [
  'Fireball: 40ft diameter. Bigger than most rooms.',
  'Spirit Guardians: best sustained AoE. Moves with you. Get into melee.',
  'Sculpt Spells: Evocation Wizard can Fireball their own party safely.',
  'Wait for 3+ targets before using AoE. Otherwise single-target is better.',
  'Synaptic Static: Fireball upgrade. Psychic + -1d6 debuff.',
  'Hypnotic Pattern: control AoE > damage AoE. Remove threats.',
  'Choke enemies into clusters, then AoE. Wall spells help.',
  'Careful Spell: allies auto-succeed. Good but not as good as Sculpt.',
  'Lightning Bolt: 100ft line. Position to hit 3+ in a row.',
  'AoE + difficult terrain (Ice Storm, Spike Growth): damage + slow.',
];
