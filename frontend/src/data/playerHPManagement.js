/**
 * playerHPManagement.js
 * Player Mode: Hit point management, healing efficiency, and temp HP tactics
 * Pure JS — no React dependencies.
 */

export const HP_BASICS = {
  maxHP: 'First level: max hit die + CON mod. Subsequent: roll or average + CON mod per level.',
  averages: { d6: 4, d8: 5, d10: 6, d12: 7 },
  recommendation: 'Take the average (rounded up). Rolling is fun but risky — one bad roll hurts forever.',
  toughFeat: '+2 HP per level. At level 10: +20 HP. Equivalent to +4 CON but only for HP.',
};

export const TEMP_HP_RULES = {
  stacking: 'Temp HP does NOT stack. If you gain temp HP while you have some, choose which to keep.',
  duration: 'Temp HP lasts until depleted or until you finish a long rest (unless stated otherwise).',
  healing: 'Temp HP is not real HP. Healing spells don\'t restore temp HP.',
  damage: 'Temp HP absorbs damage first. Excess goes to real HP.',
};

export const TEMP_HP_SOURCES = [
  { source: 'Armor of Agathys (1st)', amount: '5/spell level', duration: '1 hour', note: 'Also deals 5/level cold to melee attackers. Scales incredibly.' },
  { source: 'False Life (1st)', amount: '1d4+4', duration: '1 hour', note: 'Self-only. Decent at level 1.' },
  { source: 'Heroism (1st)', amount: 'CHA mod/turn', duration: 'Concentration 1 min', note: 'Refreshes every turn. Also immune to frightened.' },
  { source: 'Twilight Sanctuary (CD)', amount: '1d6+Cleric level', duration: '1 minute', note: 'Every ally in 30ft. Every turn. Broken.' },
  { source: 'Inspiring Leader feat', amount: 'Level+CHA', duration: 'Until long rest', note: '6 creatures. 10 minute speech. At L10 CHA 20: 15 temp HP each.' },
  { source: 'Aid (2nd)', amount: '+5/+10/+15 max HP', duration: '8 hours', note: 'NOT temp HP — increases MAX HP. Stacks with temp HP.' },
  { source: 'Dark One\'s Blessing (Fiend Warlock)', amount: 'CHA+Warlock level', duration: 'Until long rest', note: 'On every kill. At L10 CHA 20: 15 temp HP per kill.' },
];

export const HEALING_EFFICIENCY = {
  inCombat: [
    'Don\'t heal unless someone is DOWN. Damage prevention > healing.',
    'Healing Word (bonus action, 1d4+mod) is better than Cure Wounds in combat. Action economy.',
    'Goodberry: 1 HP each. Use to pick up unconscious allies (1 HP = conscious).',
    'Life Cleric + Healing Word = 1d4+WIS+3. Small but keeps people conscious.',
  ],
  outOfCombat: [
    'Short rest + Hit Dice first. Free healing.',
    'Prayer of Healing: 2d8+mod to 6 creatures. 10 minute cast. Best post-combat heal.',
    'Goodberry: 10 HP total from a 1st level slot. Eat between fights.',
    'Catnap (3rd): 10-minute short rest for 3 creatures. Spend Hit Dice.',
  ],
  yoyoHealing: {
    what: 'Let ally drop to 0, then Healing Word them to 1. They get a full turn.',
    why: 'Spending a 1st level slot to get an ally back = enormous value.',
    risk: 'If enemy has multi-attack, they can hit the 0 HP ally (auto-crit + 2 death save fails).',
    verdict: 'Effective but risky. Don\'t yo-yo against enemies with multi-attack.',
  },
};

export const HIT_DICE_OPTIMIZATION = {
  recovery: 'Regain half your total Hit Dice (minimum 1) on a long rest.',
  spending: 'Short rest: roll any number of Hit Dice + CON mod each. Regain that many HP.',
  tips: [
    'Don\'t spend all Hit Dice on one short rest. Save some for emergencies.',
    'Barbarian/Fighter d10/d12 Hit Dice heal more per die. Let them use theirs first.',
    'Song of Rest (Bard): +1d6 to one Hit Die roll per short rest. Free healing.',
    'Durable feat: minimum healing from Hit Dice = 2× CON mod. With CON 16: minimum 6 per die.',
    'Periapt of Wound Closure: double HP from Hit Dice. Uncommon magic item.',
  ],
};

export function hitDiceHealing(dieSize, conMod) {
  return Math.max(1, dieSize / 2 + 0.5 + conMod);
}

export function aidMaxHPBoost(spellLevel) {
  return 5 * (spellLevel - 1); // 5 at 2nd, 10 at 3rd, etc.
}

export function inspiringLeaderTempHP(level, chaMod) {
  return level + chaMod;
}
