/**
 * playerBattlemasterComboGuide.js
 * Player Mode: Battlemaster maneuver combos — maximize Fighter effectiveness
 * Pure JS — no React dependencies.
 */

export const MANEUVER_COMBOS = [
  {
    combo: 'Trip Attack + Action Surge',
    maneuvers: ['Trip Attack'],
    how: 'Trip Attack on first hit (prone). Action Surge: all remaining attacks have advantage (prone = advantage on melee).',
    damage: 'Superiority die + advantage on 3-7 attacks depending on level.',
    note: 'Trip first attack. If it works, dump everything.',
    tier: 'S+',
  },
  {
    combo: 'Menacing Attack + Sentinel',
    maneuvers: ['Menacing Attack'],
    how: 'Frighten target. Frightened can\'t move toward you. Sentinel stops them leaving.',
    damage: 'Lock enemy in place. Can\'t approach or flee.',
    note: 'Total movement denial. Enemy is stuck.',
    tier: 'S',
  },
  {
    combo: 'Precision Attack + GWM/Sharpshooter',
    maneuvers: ['Precision Attack'],
    how: 'Take -5 to hit from GWM/SS. If you miss, add superiority die to the roll.',
    damage: 'Turn a miss into a +10 damage hit.',
    note: 'Best use of Precision Attack. Saves the -5 penalty.',
    tier: 'S+',
  },
  {
    combo: 'Pushing Attack + Hazard',
    maneuvers: ['Pushing Attack'],
    how: 'Push target 15ft into: Wall of Fire, Spike Growth, cliff edge, ally\'s Spirit Guardians.',
    damage: 'Superiority die + hazard damage + forced movement.',
    note: 'Coordinate with caster allies. Push into their AoE.',
    tier: 'S',
  },
  {
    combo: 'Riposte + PAM',
    maneuvers: ['Riposte'],
    how: 'Enemy misses you. Riposte: reaction attack. PAM: bonus action attack on your turn.',
    damage: 'Three attacks on your turn + reaction Riposte = 4 attacks per round.',
    note: 'High AC fighter gets more misses = more Ripostes.',
    tier: 'A+',
  },
  {
    combo: 'Goading Attack + Tank Build',
    maneuvers: ['Goading Attack'],
    how: 'Force enemy to attack you (disadvantage on attacks vs others). High AC = they miss you.',
    damage: 'Superiority die + team protection.',
    note: 'Aggro mechanic. Tank fantasy realized.',
    tier: 'A+',
  },
  {
    combo: 'Disarming Attack + Ally Pickup',
    maneuvers: ['Disarming Attack'],
    how: 'Knock weapon from enemy hand. Ally picks it up or kicks it away.',
    damage: 'Enemy loses weapon. Forced to unarmed (1 + STR) or find another.',
    note: 'Devastating vs single-weapon enemies. Less useful vs natural weapons.',
    tier: 'A',
  },
  {
    combo: 'Maneuvering Attack + Ally Escape',
    maneuvers: ['Maneuvering Attack'],
    how: 'Hit enemy. Ally can move half speed without provoking AoO from that enemy.',
    damage: 'Superiority die + ally repositioning.',
    note: 'Save the squishy caster stuck in melee.',
    tier: 'A',
  },
  {
    combo: 'Rally + Short Rest',
    maneuvers: ['Rally'],
    how: 'Bonus action: CHA mod + superiority die temp HP to an ally.',
    damage: 'No damage. But 10-15 temp HP is a mini Healing Word.',
    note: 'No attack needed. Use between fights or before ambush.',
    tier: 'B+',
  },
];

export const MANEUVER_SELECTION_BY_BUILD = {
  gwm: {
    name: 'Great Weapon Master',
    mustHave: ['Precision Attack', 'Trip Attack'],
    recommended: ['Menacing Attack', 'Pushing Attack'],
    note: 'Precision Attack + GWM is the #1 combo. Trip for advantage.',
  },
  sharpshooter: {
    name: 'Sharpshooter',
    mustHave: ['Precision Attack'],
    recommended: ['Goading Attack', 'Menacing Attack', 'Disarming Attack'],
    note: 'Precision Attack saves Sharpshooter misses at range.',
  },
  tank: {
    name: 'Shield Tank',
    mustHave: ['Riposte', 'Goading Attack'],
    recommended: ['Menacing Attack', 'Maneuvering Attack', 'Rally'],
    note: 'High AC = more Riposte triggers. Goading for aggro.',
  },
  pam: {
    name: 'Polearm Master',
    mustHave: ['Trip Attack', 'Riposte'],
    recommended: ['Precision Attack', 'Pushing Attack'],
    note: 'Trip on first hit. Remaining attacks with advantage.',
  },
};

export const SUPERIORITY_DICE_MANAGEMENT = {
  dice: '4 d8s at L3. 5 at L7. 6 at L15. Grow to d10 (L10) and d12 (L18).',
  recovery: 'All dice recover on short or long rest.',
  tip: 'Don\'t hoard them. Short rests refill. Use 1-2 per fight.',
  priority: 'Precision Attack on -5 penalty misses > Trip on first attack > everything else.',
  note: 'Fighter gets more short rests than most. Ask for them.',
};

export const BATTLEMASTER_TIPS = [
  'Precision Attack + GWM/Sharpshooter: #1 maneuver use. Turns misses into +10 hits.',
  'Trip Attack round 1. Prone = advantage on all melee attacks.',
  'Trip + Action Surge: trip first hit, dump remaining attacks with advantage.',
  'Riposte: high AC fighters trigger this often. Reaction attack = extra DPR.',
  'Pushing Attack: coordinate with caster AoE (Wall of Fire, Spike Growth).',
  'Short rests refill superiority dice. Ask for short rests often.',
  'Don\'t save all dice for one fight. 1-2 per encounter is sustainable.',
  'Menacing Attack: frightened condition is strong control.',
  'Goading Attack: tank mechanic. Force enemies to attack you.',
  'Rally: no attack needed. Use before combat for temp HP.',
];
