/**
 * playerAmbushSurpriseGuide.js
 * Player Mode: Surprise rules, ambush tactics, and avoiding being surprised
 * Pure JS — no React dependencies.
 */

export const SURPRISE_RULES = {
  noSurpriseRound: 'There is NO "surprise round" in 5e. Surprise is a condition.',
  howItWorks: 'Surprised creatures can\'t move or take actions on their first turn. Can\'t take reactions until that turn ends.',
  determination: 'DM compares Stealth checks vs passive Perception of each creature.',
  perCreature: 'Surprise is determined per creature. Some may be surprised, others not.',
  initiative: 'Everyone rolls initiative normally. Surprised creatures just can\'t act on turn 1.',
  note: 'After your first turn (even if surprised), you CAN take reactions.',
};

export const AMBUSH_TACTICS = [
  { tactic: 'Group Stealth', how: 'Party rolls Stealth. If half succeed, group succeeds (optional rule).', note: 'Heavy armor characters hurt group stealth. Plan around this.' },
  { tactic: 'Distraction + Ambush', how: 'One character distracts (Deception) while others sneak into position.', note: 'Face character talks. Party sets up the kill zone.' },
  { tactic: 'Chokepoint Ambush', how: 'Set up at a doorway, corridor, or bridge. Funnel enemies.', note: 'Difficult terrain + ranged attacks from concealment.' },
  { tactic: 'Darkness Ambush', how: 'Attack from darkness. Enemies without darkvision can\'t see you.', note: 'Darkvision races: attack from dim light (disadvantage on their Perception).' },
  { tactic: 'Pass Without Trace', how: 'L2 Druid/Ranger spell. +10 to Stealth for entire party.', note: 'Practically guarantees surprise. Even plate armor characters pass.' },
  { tactic: 'Alpha Strike', how: 'Open with highest damage: Assassinate, smites, Action Surge, AoE.', note: 'First round is free. Make it count.' },
];

export const SURPRISE_SYNERGIES = [
  { feature: 'Assassinate (Assassin Rogue)', effect: 'Advantage on surprised creatures. Auto-crit if you hit.', note: 'Surprise + Sneak Attack crit = massive burst damage.' },
  { feature: 'Alert feat', effect: 'Can\'t be surprised while conscious. +5 initiative.', note: 'Best defensive feat. Never caught off guard.' },
  { feature: 'Bugbear Surprise Attack', effect: '+2d6 damage on surprised creatures in first round.', note: 'Stacks with Assassinate. Bugbear Assassin = insane burst.' },
  { feature: 'Gloom Stalker (Ranger)', effect: 'Extra attack on first turn. +1d8 damage. Invisible to darkvision.', note: 'Dread Ambusher. Best first-round class feature.' },
  { feature: 'War Magic (Wizard)', effect: 'React with spell after initiative. Power Surge.', note: '+2 to AC/saves on first round of combat. Defensive surprise counter.' },
];

export const AVOIDING_SURPRISE = [
  { method: 'High Passive Perception', how: '10 + WIS mod + proficiency (if proficient). Observant feat: +5.', note: 'Passive Perception 20+ catches most ambushes.' },
  { method: 'Alert Feat', how: 'Can\'t be surprised while conscious. +5 initiative.', note: 'The definitive anti-surprise tool.' },
  { method: 'Familiar Scout', how: 'Send familiar ahead. Owl has flyby and keen senses.', note: 'Familiar spots enemies. You\'re warned before entering.' },
  { method: 'Ranger (Feral Senses)', how: 'L18. Awareness of invisible creatures within 30ft.', note: 'Very high level. But powerful.' },
  { method: 'Alarm Spell (Ritual)', how: 'Set up perimeter. 8-hour alarm around camp.', note: 'Ritual cast: no slot. Set multiple alarms around camp.' },
  { method: 'Rogue (Reliable Talent)', how: 'L11. Can\'t roll below 10 on proficient checks. Perception 10+ minimum.', note: 'Passive Perception floor becomes very high.' },
];

export const SURPRISE_TIPS = [
  'No surprise ROUND in 5e. Surprise is per-creature, first turn only.',
  'After your first turn ends (even if surprised), you CAN react.',
  'Pass Without Trace: +10 Stealth. Party ambush almost guaranteed.',
  'Assassin Rogue: surprise = auto-crit. Build around it.',
  'Alert feat: never surprised + +5 initiative. Always act first.',
  'Gloom Stalker Ranger: best first-round burst. +1 attack, +1d8.',
  'Heavy armor: disadvantage on Stealth. Affects group ambushes.',
  'Send familiar ahead. Owl: flyby + Perception. Best scout.',
  'Alarm spell (ritual): free camp security. No slot needed.',
  'Alpha strike: use your best abilities round 1. Free round of damage.',
];
