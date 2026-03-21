/**
 * playerShifterRaceGuide.js
 * Player Mode: Shifter — the weretouched
 * Pure JS — no React dependencies.
 */

export const SHIFTER_BASICS = {
  race: 'Shifter',
  source: 'Eberron: Rising from the Last War / Mordenkainen Presents: Monsters of the Multiverse',
  asis: 'Varies by subrace (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  darkvision: '60ft',
  note: 'Shifting: BA to gain temp HP + subrace benefit for 1 minute. PB uses/LR. Four subtypes: Beasthide (tank), Longtooth (offense), Swiftstride (mobility), Wildhunt (perception).',
};

export const SHIFTER_SHIFTING = {
  activation: 'Bonus action',
  duration: '1 minute',
  tempHP: 'Level + CON mod temporary HP on activation',
  uses: 'PB uses per long rest (MotM). Once per short rest (legacy).',
  note: 'Temp HP + subtype effect. No concentration. Works with any class. Self-buff.',
};

export const SHIFTER_SUBTYPES = [
  {
    subtype: 'Beasthide',
    asis: '+2 CON, +1 STR (legacy)',
    shiftBenefit: '+1 AC while shifting.',
    note: 'Tank shifter. +1 AC + temp HP. Best for frontliners. Barbarian/Fighter.',
    rating: 'A',
  },
  {
    subtype: 'Longtooth',
    asis: '+2 STR, +1 DEX (legacy)',
    shiftBenefit: 'BA: bite attack (1d6+STR piercing) on each turn while shifted. Replaces normal BA.',
    note: 'Free BA attack every turn for 1 minute. Like PAM but racial. Excellent DPR.',
    rating: 'S',
  },
  {
    subtype: 'Swiftstride',
    asis: '+2 DEX, +1 CHA (legacy)',
    shiftBenefit: '+10ft speed. When creature ends turn within 5ft: reaction to move 10ft without OA.',
    note: 'Speed + free reactive movement. Hit-and-run. Rogue/Monk synergy.',
    rating: 'A',
  },
  {
    subtype: 'Wildhunt',
    asis: '+2 WIS, +1 DEX (legacy)',
    shiftBenefit: 'No creature within 30ft can have advantage on attacks against you.',
    note: 'Deny advantage = Pack Tactics, Reckless Attack, invisibility don\'t work on you. Strong defense.',
    rating: 'A',
  },
];

export const SHIFTER_CLASS_SYNERGY = [
  { subtype: 'Longtooth', class: 'Fighter/Barbarian', priority: 'S', reason: 'Free BA attack every turn while shifted. Like PAM without a feat. STR bonus.' },
  { subtype: 'Beasthide', class: 'Barbarian', priority: 'A', reason: '+1 AC + temp HP + Rage resistance. Very tanky. CON bonus.' },
  { subtype: 'Swiftstride', class: 'Rogue', priority: 'A', reason: 'DEX. Extra speed + free reactive movement. Perfect hit-and-run.' },
  { subtype: 'Wildhunt', class: 'Ranger/Druid', priority: 'A', reason: 'WIS. Deny advantage = hard to hit. Concentration protection (fewer hits).' },
];

export const SHIFTER_TACTICS = [
  { tactic: 'Longtooth DPR', detail: 'Shift → BA bite every turn for 1 minute. At L5: 3 attacks/turn (2 weapon + BA bite). No feat needed.', rating: 'S' },
  { tactic: 'Beasthide + Rage', detail: 'Shift for +1 AC + temp HP. Rage for resistance. Stack both for extreme tankiness.', rating: 'A' },
  { tactic: 'Wildhunt anti-advantage', detail: 'Enemies can\'t have advantage on you. Wolves, Pack Tactics, flanking, invisible attackers = all denied.', rating: 'A' },
  { tactic: 'Pre-combat shifting', detail: 'Shift before combat starts. 1 minute duration = most combats. Enter with temp HP and benefits already active.', rating: 'A' },
];

export function shiftingTempHP(level, conMod) {
  return level + conMod;
}

export function longtoothBiteDPR(strMod, numMainAttacks) {
  const mainDamage = numMainAttacks * (4.5 + strMod);
  const biteDamage = 3.5 + strMod;
  return { total: mainDamage + biteDamage, bite: biteDamage, note: `${numMainAttacks} attacks + BA bite` };
}
