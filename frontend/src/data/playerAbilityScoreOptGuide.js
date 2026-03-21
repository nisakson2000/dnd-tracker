/**
 * playerAbilityScoreOptGuide.js
 * Player Mode: Ability score optimization by class — what to max and when
 * Pure JS — no React dependencies.
 */

export const ABILITY_SCORE_PRIORITY_BY_CLASS = [
  { class: 'Barbarian', primary: 'STR', secondary: 'CON', tertiary: 'DEX', dump: 'INT, CHA', note: 'Max STR for GWM. CON for HP + Unarmored Defense. DEX for AC (medium armor or Unarmored).' },
  { class: 'Bard', primary: 'CHA', secondary: 'DEX', tertiary: 'CON', dump: 'STR', note: 'CHA for spells + skills. DEX for AC + initiative. CON for concentration.' },
  { class: 'Cleric', primary: 'WIS', secondary: 'CON', tertiary: 'STR or DEX', dump: 'INT or CHA', note: 'WIS for spells. CON for concentration + HP. STR for heavy armor (no speed penalty at 15 STR).' },
  { class: 'Druid', primary: 'WIS', secondary: 'CON', tertiary: 'DEX', dump: 'STR, CHA', note: 'WIS for spells. CON for concentration. Wild Shape uses beast stats, not yours.' },
  { class: 'Fighter', primary: 'STR or DEX', secondary: 'CON', tertiary: 'WIS', dump: 'INT (usually), CHA', note: 'STR for GWM/heavy armor. DEX for archery/finesse. CON always important.' },
  { class: 'Monk', primary: 'DEX', secondary: 'WIS', tertiary: 'CON', dump: 'STR, INT, CHA', note: 'DEX for attacks + AC + saves. WIS for AC + Ki save DC. Monk is very MAD.' },
  { class: 'Paladin', primary: 'STR or CHA', secondary: 'CHA or STR', tertiary: 'CON', dump: 'INT', note: 'STR for attacks. CHA for saves (Aura) + spells. Both matter. Very MAD.' },
  { class: 'Ranger', primary: 'DEX', secondary: 'WIS', tertiary: 'CON', dump: 'STR, INT, CHA', note: 'DEX for attacks + AC. WIS for spells. CON for HP on the front line.' },
  { class: 'Rogue', primary: 'DEX', secondary: 'CON or CHA', tertiary: 'WIS', dump: 'STR, INT', note: 'DEX for everything. CHA for face skills. CON for survivability.' },
  { class: 'Sorcerer', primary: 'CHA', secondary: 'CON', tertiary: 'DEX', dump: 'STR', note: 'CHA for spells. CON for concentration + HP. DEX for AC + initiative.' },
  { class: 'Warlock', primary: 'CHA', secondary: 'CON', tertiary: 'DEX', dump: 'STR (unless Hexblade)', note: 'CHA for spells + EB. CON for HP. Hexblade: CHA replaces STR/DEX for attacks.' },
  { class: 'Wizard', primary: 'INT', secondary: 'CON', tertiary: 'DEX', dump: 'STR, CHA', note: 'INT for spells. CON for concentration + HP. DEX for AC + initiative.' },
  { class: 'Artificer', primary: 'INT', secondary: 'CON', tertiary: 'DEX', dump: 'STR, CHA', note: 'INT for spells + infusions. CON for HP. Battle Smith: INT replaces STR/DEX for attacks.' },
];

export const POINT_BUY_TEMPLATES = [
  { name: 'Standard SAD (single ability dependent)', spread: '15/14/14/10/10/8', note: 'Max primary, decent secondaries. Safe and balanced.' },
  { name: 'Glass Cannon', spread: '15/15/12/10/10/8', note: 'Two high stats, decent CON. For builds needing two stats.' },
  { name: 'MAD Build', spread: '15/14/13/12/8/8', note: 'Three decent stats. For Paladin, Monk, or multiclass prerequisites.' },
  { name: 'Skill Monkey', spread: '14/14/14/12/8/8', note: 'Three +2 stats. Good for Bard, Rogue, or skill-focused builds.' },
  { name: 'Generalist', spread: '14/13/13/12/12/8', note: 'No glaring weakness. Jack of all trades.' },
];

export const ASI_VS_FEAT_DECISION = {
  takeASI: [
    'Your primary stat is odd (17 → 18 is huge).',
    'Your primary stat is below 18.',
    'You\'re a SAD class with one dominant stat (Wizard, Sorcerer).',
    'You need CON for concentration saves.',
  ],
  takeFeat: [
    'Your primary stat is already 20.',
    'Your primary stat is even (16 is fine; feat is more impactful).',
    'A half-feat rounds up an odd score (+1 to a stat + bonus).',
    'The feat fundamentally changes your playstyle (GWM, PAM, Sentinel).',
    'You\'re a Variant Human and got a free feat at L1.',
  ],
  bestHalfFeats: [
    { feat: 'Fey Touched', stat: 'CHA/WIS/INT', effect: '+1 stat + Misty Step + 1 divination/enchantment spell', rating: 'S+' },
    { feat: 'Shadow Touched', stat: 'CHA/WIS/INT', effect: '+1 stat + Invisibility + 1 illusion/necromancy spell', rating: 'A+' },
    { feat: 'Telekinetic', stat: 'CHA/WIS/INT', effect: '+1 stat + invisible Mage Hand + BA shove 5ft', rating: 'A+' },
    { feat: 'Skill Expert', stat: 'Any', effect: '+1 any + 1 skill + 1 expertise', rating: 'A+' },
    { feat: 'Crusher/Slasher/Piercer', stat: 'STR or DEX', effect: '+1 stat + weapon damage type bonus', rating: 'A' },
    { feat: 'Resilient', stat: 'Any', effect: '+1 stat + save proficiency', rating: 'S (CON) / A (WIS)' },
    { feat: 'Elven Accuracy', stat: 'DEX/INT/WIS/CHA', effect: '+1 stat + super-advantage (reroll 1 die when you have advantage)', rating: 'S (elf builds)' },
  ],
};

export const ABILITY_SCORE_TIPS = [
  'Max your primary stat FIRST. Going from 16 → 20 is a +2 to hit/DC/damage.',
  'Odd scores are wasted points. Always aim for even numbers (or plan a half-feat).',
  'CON is never a dump stat. Every class needs HP.',
  'INT is the safest dump stat for non-INT classes. INT saves are very rare.',
  'CHA is safe to dump unless you\'re the party face.',
  'STR below 15 with heavy armor = -10 speed penalty.',
  'Resilient (CON) is almost as good as an ASI for concentration casters.',
  'At L4, +2 to primary stat is almost always correct if below 20.',
  'Half-feats are incredible at odd scores: +1 stat + a powerful ability.',
  'Tasha\'s: any race can put +2/+1 wherever they want. Optimization is race-agnostic now.',
];
