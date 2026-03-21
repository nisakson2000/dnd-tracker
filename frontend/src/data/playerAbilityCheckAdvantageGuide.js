/**
 * playerAbilityCheckAdvantageGuide.js
 * Player Mode: How to gain advantage on ability checks
 * Pure JS — no React dependencies.
 */

export const ADVANTAGE_SOURCES = {
  attacks: [
    { source: 'Reckless Attack (Barbarian)', condition: 'STR melee attacks on your turn. Enemies get advantage on you.', note: 'Trade defense for offense. Best with damage resistance.' },
    { source: 'Pack Tactics (Kobold/Wolf)', condition: 'Non-incapacitated ally within 5ft of target.', note: 'Free advantage with positioning.' },
    { source: 'Flanking (optional rule)', condition: 'Ally on opposite side of enemy.', note: 'Optional rule. Many tables use +2 instead of advantage.' },
    { source: 'Prone target (melee)', condition: 'Target is prone. Attacker within 5ft.', note: 'Melee attacks have advantage. Ranged attacks have disadvantage.' },
    { source: 'Unseen attacker', condition: 'Target can\'t see you.', note: 'Hide → attack with advantage. Invisibility. Darkness + Devil\'s Sight.' },
    { source: 'Faerie Fire', condition: 'Target outlined. Attacks against it have advantage.', note: 'Best AoE advantage spell. Party-wide. No save needed to see outline.' },
    { source: 'Guiding Bolt', condition: 'Next attack against target has advantage.', note: 'Single use. 4d6 radiant + advantage for next attack.' },
    { source: 'Restrained condition', condition: 'Target is restrained.', note: 'Attacks against restrained creatures have advantage.' },
    { source: 'Stunned condition', condition: 'Target is stunned.', note: 'Attacks against stunned creatures have advantage. Auto-fail STR/DEX saves.' },
    { source: 'Paralyzed condition', condition: 'Target is paralyzed.', note: 'Attacks have advantage. Hits within 5ft are auto-crits.' },
  ],
  savingThrows: [
    { source: 'Flash of Genius (Artificer)', condition: 'Reaction: +INT to ally\'s save.', note: 'Not advantage but significant bonus.' },
    { source: 'Aura of Protection (Paladin)', condition: '+CHA to all saves within 10ft.', note: 'Party-wide save bonus.' },
    { source: 'Bless', condition: '+1d4 to saves and attacks.', note: 'Three targets. Concentration. Excellent value.' },
    { source: 'Gnome Cunning', condition: 'Advantage on INT/WIS/CHA saves vs magic.', note: 'Racial. Always active against magic.' },
    { source: 'Magic Resistance', condition: 'Advantage on saves vs spells/magical effects.', note: 'Yuan-ti, Satyr. Best save protection in the game.' },
    { source: 'Danger Sense (Barbarian)', condition: 'Advantage on DEX saves you can see.', note: 'Free advantage on Fireball saves.' },
  ],
  abilityChecks: [
    { source: 'Help action', condition: 'Give one ally advantage on next ability check.', note: 'Free advantage. Underused. Great for skill checks.' },
    { source: 'Guidance cantrip', condition: '+1d4 to one ability check.', note: 'Best utility cantrip. Cast before every ability check.' },
    { source: 'Enhance Ability', condition: 'Advantage on checks for one ability score. 1 hour.', note: 'Bull\'s Strength, Cat\'s Grace, etc. Great for long skill challenges.' },
    { source: 'Bardic Inspiration', condition: '+1d6 to +1d12 to one check/save/attack.', note: 'Give to allies before important checks.' },
    { source: 'Rage (Barbarian)', condition: 'Advantage on STR checks.', note: 'Athletics, grapple, shove — all with advantage while raging.' },
    { source: 'Pass without Trace', condition: '+10 to Stealth checks.', note: 'Not advantage but +10 is better than advantage.' },
  ],
};

export const ADVANTAGE_MATH = {
  normalD20: { avg: 10.5, hitChanceVsAC15: '30%' },
  withAdvantage: { avg: 13.83, hitChanceVsAC15: '51%' },
  withDisadvantage: { avg: 7.18, hitChanceVsAC15: '9%' },
  note: 'Advantage = ~+3.3 to the roll on average. Equivalent to roughly +5 on lower DCs.',
};

export const ADVANTAGE_RULES = [
  { rule: 'Advantage + Disadvantage = cancel', detail: 'Any amount of advantage + any amount of disadvantage = straight roll. 3 advantages + 1 disadvantage = straight roll.' },
  { rule: 'Can\'t stack advantage', detail: 'Multiple sources of advantage still = roll 2d20, take higher. No triple-advantage.' },
  { rule: 'Elven Accuracy exception', detail: 'Half-elf/elf feat: when you have advantage on DEX/INT/WIS/CHA attacks, roll 3d20 take highest. Super-advantage.' },
  { rule: 'Lucky feat interaction', detail: 'Lucky: roll extra d20. If you have disadvantage + Lucky: choose from 3 dice (controversial ruling).', note: 'Sage Advice: pick from all 3 dice. Very powerful.' },
];

export function advantageHitChance(targetAC, attackBonus) {
  const normalHit = Math.max(0.05, Math.min(0.95, (21 - (targetAC - attackBonus)) / 20));
  const advantageHit = 1 - Math.pow(1 - normalHit, 2);
  return { normal: `${(normalHit * 100).toFixed(0)}%`, advantage: `${(advantageHit * 100).toFixed(0)}%`, improvement: `+${((advantageHit - normalHit) * 100).toFixed(0)}%` };
}
