/**
 * playerArchfeyWarlockGuide.js
 * Player Mode: Archfey Warlock — the fey trickster warlock
 * Pure JS — no React dependencies.
 */

export const ARCHFEY_BASICS = {
  class: 'Warlock (The Archfey)',
  source: 'Player\'s Handbook',
  theme: 'Fey patron. Charm, fear, teleportation, and illusions.',
  note: 'Control-focused Warlock. Fey Presence is AoE charm/fear. Misty Escape is free teleport. Beguiling Defenses counters charm.',
};

export const ARCHFEY_FEATURES = [
  { feature: 'Fey Presence', level: 1, effect: 'Action: each creature in 10ft cube must WIS save or be charmed/frightened (your choice) until end of your next turn. Once per short rest.', note: 'AoE charm or fear. No concentration. Short rest recharge. Good crowd control opener.' },
  { feature: 'Misty Escape', level: 6, effect: 'Reaction when you take damage: turn invisible and teleport 60ft. Invisible until start of next turn or until you attack/cast.', note: 'Damage → invisible + 60ft teleport. One of the best escape tools. Once per short rest.' },
  { feature: 'Beguiling Defenses', level: 10, effect: 'Immune to charm. When a creature tries to charm you: redirect the charm back at them (WIS save or charmed by you for 1 minute).', note: 'Charm immunity + reverse charm. Enemy tries Dominate Person? You\'re immune AND they might get charmed.' },
  { feature: 'Dark Delirium', level: 14, effect: 'Action: target creature within 60ft. WIS save or charmed/frightened for 1 minute. Target perceives itself in a misty, illusory realm. Concentration. Once per short rest.', note: 'Single-target illusion prison. Target is effectively removed from combat for 1 minute.' },
];

export const ARCHFEY_SPELLS = [
  { level: 1, spells: ['Faerie Fire', 'Sleep'], note: 'Faerie Fire: party-wide advantage. Sleep: strong at low levels.' },
  { level: 2, spells: ['Calm Emotions', 'Phantasmal Force'], note: 'Phantasmal Force: target believes illusion is real. 1d6/turn.' },
  { level: 3, spells: ['Blink', 'Plant Growth'], note: 'Blink: 50% vanish each turn. Plant Growth: no-save difficult terrain.' },
  { level: 4, spells: ['Dominate Beast', 'Greater Invisibility'], note: 'Greater Invisibility: attack while invisible. Excellent.' },
  { level: 5, spells: ['Dominate Person', 'Seeming'], note: 'Dominate Person: mind control. Seeming: disguise entire party.' },
];

export const ARCHFEY_TACTICS = [
  { tactic: 'Fey Presence opener', detail: 'Start combat: Fey Presence (fear). Enemies frightened can\'t approach. Then EB from safety.', rating: 'A' },
  { tactic: 'Misty Escape survival', detail: 'Take a big hit → invisible + teleport 60ft. You\'re safe, invisible, and repositioned.', rating: 'S', note: 'Best Warlock escape. Reaction, no spell slot, short rest recharge.' },
  { tactic: 'Beguiling Defenses counter', detail: 'L10: enemy casts Charm Person on you. You\'re immune. They make WIS save or YOU charm THEM. Reverse uno.', rating: 'A' },
  { tactic: 'Greater Invisibility + EB', detail: 'Greater Invisibility: attack with advantage (invisible). EB with advantage. Enemies attack with disadvantage.', rating: 'S' },
];

export const ARCHFEY_VS_GENIE = {
  archfey: { pros: ['AoE charm/fear', 'Misty Escape (best escape)', 'Charm immunity + reversal', 'Greater Invisibility spell'], cons: ['No extra damage/turn', 'No flight', 'No safe room', 'Control-focused not damage'] },
  genie: { pros: ['PB extra damage/turn', 'Flight (PB/LR)', 'Safe room (vessel)', 'Limited Wish', 'Stronger overall'], cons: ['No escape tool', 'No charm immunity', 'Less control'] },
  verdict: 'Genie is stronger mechanically. Archfey is better for control/escape-focused play.',
};

export function feyPresenceTargets(cubeSize) {
  return Math.floor(cubeSize / 5) ** 3; // 10ft cube = 8 possible 5ft squares
}

export function mistyEscapeRange() {
  return 60; // ft teleport
}
