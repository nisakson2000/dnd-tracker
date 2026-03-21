/**
 * playerCombatOpenerGuide.js
 * Player Mode: Optimal first-round actions by class and role
 * Pure JS — no React dependencies.
 */

export const ROUND_ONE_PRIORITY = {
  principle: 'Round 1 is the most important round. Set up advantages, remove threats, establish control.',
  actionEconomy: 'Front-loading effectiveness wins fights. A controlled enemy at round 1 can\'t act for the rest of combat.',
};

export const OPENERS_BY_CLASS = [
  {
    class: 'Fighter (Battle Master)',
    opener: 'Action Surge + Precision/Trip Attack',
    rating: 'S+',
    detail: 'Full Attack + Action Surge = 4-8 attacks round 1. Use Trip Attack to prone for allies. Devastating alpha strike.',
  },
  {
    class: 'Fighter (Echo Knight)',
    opener: 'Manifest Echo + Unleash Incarnation',
    rating: 'S',
    detail: 'Summon echo (BA) + attack from echo position + extra attacks from Unleash. Control two positions immediately.',
  },
  {
    class: 'Paladin (Vengeance)',
    opener: 'Vow of Enmity (BA) + Attack + Smite',
    rating: 'S+',
    detail: 'Advantage on all attacks vs one creature. Smite on hits (especially crits). Massive burst.',
  },
  {
    class: 'Barbarian',
    opener: 'Rage (BA) + Reckless Attack',
    rating: 'S',
    detail: 'Rage for damage/resistance. Reckless for advantage. GWM with advantage = huge damage.',
  },
  {
    class: 'Rogue (Assassin)',
    opener: 'Attack surprised target (auto-crit)',
    rating: 'S+ (if surprised)',
    detail: 'Assassinate: advantage + auto-crit. Sneak Attack dice doubled. Can one-shot enemies.',
  },
  {
    class: 'Rogue (other)',
    opener: 'Steady Aim (BA) + Attack or Hide (BA) + Attack',
    rating: 'A+',
    detail: 'Guarantee Sneak Attack with advantage. Position for ongoing SA.',
  },
  {
    class: 'Wizard/Sorcerer (controller)',
    opener: 'Hypnotic Pattern / Web / Slow',
    rating: 'S+',
    detail: 'AoE control round 1 removes multiple enemies from the fight. Best opening for casters.',
  },
  {
    class: 'Wizard/Sorcerer (blaster)',
    opener: 'Fireball / Synaptic Static',
    rating: 'S',
    detail: 'AoE damage while enemies are grouped. Synaptic Static adds lingering debuff.',
  },
  {
    class: 'Cleric',
    opener: 'Spirit Guardians (if front) or Bless (if supporting)',
    rating: 'S',
    detail: 'SG R1 starts dealing damage immediately. Bless on 3 attackers boosts party DPR for entire fight.',
  },
  {
    class: 'Cleric (continued)',
    opener: 'Spiritual Weapon (BA) if Spirit Guardians already up',
    rating: 'A+',
    detail: 'SG (concentration) + SW (no concentration) = BA attack every round + AoE damage. Online by R2.',
  },
  {
    class: 'Druid',
    opener: 'Entangle/Spike Growth (control) or Wild Shape (Moon)',
    rating: 'A+',
    detail: 'Control terrain R1. Moon Druid: BA Wild Shape into bear for immediate HP buffer + damage.',
  },
  {
    class: 'Bard',
    opener: 'Hypnotic Pattern or Bardic Inspiration to key ally',
    rating: 'S',
    detail: 'AoE control or BI to the Paladin about to smite. Eloquence: Unsettling Words + control spell.',
  },
  {
    class: 'Warlock',
    opener: 'Hex (BA) + Eldritch Blast or Hexblade Curse (BA) + Attack',
    rating: 'S',
    detail: 'Hex for sustained damage across beams. Curse for single-target boss. Then blast every round.',
  },
  {
    class: 'Ranger (Gloom Stalker)',
    opener: 'Dread Ambusher: extra attack + 1d8 + extra damage',
    rating: 'S+',
    detail: 'Best round 1 in the game for martials. Extra attack, extra damage, extra movement.',
  },
  {
    class: 'Monk',
    opener: 'Attack + Flurry of Blows (Stunning Strike on hits)',
    rating: 'A+',
    detail: '4 attacks at L5 = 4 Stunning Strike chances. Stun priority targets round 1.',
  },
  {
    class: 'Artificer (Armorer)',
    opener: 'Thunder Gauntlets on biggest threat (Guardian)',
    rating: 'A',
    detail: 'Hit = disadvantage attacking anyone but you. Establish aggro immediately.',
  },
];

export const ROUND_ONE_TIPS = [
  'Control > damage on round 1. Hypnotic Pattern removing 4 enemies > Fireball damaging them.',
  'Buff first IF the combat will be long. Bless on a 3-round fight saves 3 potential misses.',
  'Front-load burst on boss fights. Action Surge + Smite + GWM = potential 100+ damage round 1.',
  'Establish concentration spells round 1. Spirit Guardians, Bless, Haste — they compound over time.',
  'Gloom Stalker + Assassin multiclass: 7+ attacks with advantage/auto-crits round 1.',
  'Communicate R1 plans before initiative. "I\'ll Hold Person the mage, you smite him."',
  'If going last in initiative, adapt: don\'t Fireball enemies your ally is standing next to.',
];
