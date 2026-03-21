/**
 * playerGloryPaladinGuide.js
 * Player Mode: Oath of Glory Paladin — the athletic champion
 * Pure JS — no React dependencies.
 */

export const GLORY_BASICS = {
  class: 'Paladin (Oath of Glory)',
  source: 'Tasha\'s Cauldron of Everything / Mythic Odysseys of Theros',
  theme: 'Heroic champion. Speed buffs, athletic prowess, and inspiring presence.',
  note: 'Best mobility Paladin. Peerless Athlete + Haste oath spell. Good for charging builds.',
};

export const GLORY_FEATURES = [
  { feature: 'Peerless Athlete', level: 3, effect: 'Channel Divinity, bonus action: 10 minutes. Advantage on Athletics/Acrobatics. Carry/push/lift double. Jump distance +10ft.', note: 'Advantage on grapple/shove (Athletics). Double carry capacity. Great for grapple builds.' },
  { feature: 'Inspiring Smite', level: 3, effect: 'Channel Divinity: after Divine Smite, distribute 2d8+level temp HP among creatures within 30ft.', note: 'Smite → party temp HP. At L10: 2d8+10 = avg 19 temp HP split among allies.' },
  { feature: 'Aura of Alacrity', level: 7, effect: 'Your walking speed increases by 10ft. Allies within 5ft (10ft at L18) gain +10ft speed at start of their turn.', note: 'Party speed boost. Small aura (5ft) limits it but still useful. 40ft base speed Paladin.' },
  { feature: 'Glorious Defense', level: 15, effect: 'Reaction: when a creature you see within 10ft is hit, add your CHA mod to their AC (potentially turning hit to miss). If it misses, you can make one weapon attack against the attacker.', note: '+5 AC to an ally as reaction + free attack if it causes a miss. CHA mod times/LR.' },
  { feature: 'Living Legend', level: 20, effect: 'Transform for 1 minute: advantage on CHA checks, missed attack → hit instead (once/turn), emanate disadvantage aura 10ft (WIS save).', note: 'Turn misses into hits. Guaranteed attacks for 1 minute.' },
];

export const GLORY_SPELLS = {
  oathSpells: [
    { level: 1, spells: 'Guiding Bolt, Heroism', note: 'Guiding Bolt: 4d6 radiant + advantage on next attack. Heroism: temp HP each turn.' },
    { level: 2, spells: 'Enhance Ability, Magic Weapon', note: 'Enhance Ability for Athletics advantage (stacks with Peerless Athlete).' },
    { level: 3, spells: 'Haste, Protection from Energy', note: 'HASTE. Self-Haste: +2 AC, double speed, extra attack. The big spell.' },
    { level: 4, spells: 'Compulsion, Freedom of Movement', note: 'Freedom of Movement prevents restraints, difficult terrain.' },
    { level: 5, spells: 'Commune, Flame Strike', note: 'Flame Strike: AoE radiant + fire. Decent.' },
  ],
};

export const GLORY_TACTICS = [
  { tactic: 'Grapple champion', detail: 'Peerless Athlete (advantage on Athletics) + Enhance Ability (double advantage). Grapple anything. Drag enemies into hazards.', rating: 'A' },
  { tactic: 'Self-Haste charge', detail: 'Haste: +2 AC, double speed (50ft with aura), extra attack. 3 attacks/turn + Smite.', rating: 'S' },
  { tactic: 'Inspiring Smite support', detail: 'Smite + distribute temp HP. Big Smite = lots of temp HP for the party.', rating: 'A' },
  { tactic: 'Glorious Defense stack', detail: 'L15: +5 AC to ally as reaction. If miss: free attack. Do this CHA mod times per long rest.', rating: 'S' },
  { tactic: 'Speed stacking', detail: 'Base 30 + Aura 10 + Haste double = 80ft speed. Charge across the battlefield.', rating: 'A' },
];

export function auraOfAlacritySpeed(baseSpeed) {
  return baseSpeed + 10;
}

export function inspiringSmiteTempHP(paladinLevel) {
  return 9 + paladinLevel; // 2d8 (avg 9) + level
}

export function gloriousDefenseAC(chaMod) {
  return chaMod; // Added to ally's AC
}
