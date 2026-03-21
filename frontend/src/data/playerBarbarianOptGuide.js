/**
 * playerBarbarianOptGuide.js
 * Player Mode: Barbarian optimization — rage, subclasses, builds
 * Pure JS — no React dependencies.
 */

export const BARBARIAN_CORE = {
  strengths: ['Highest HP pool (d12 HD).', 'Rage: resistance to BPS + bonus damage.', 'Reckless Attack: advantage on all attacks (at cost).', 'Danger Sense: advantage on DEX saves you can see.'],
  weaknesses: ['Can\'t cast or concentrate on spells while raging.', 'Low ranged options.', 'Limited utility outside combat.', 'Few skill proficiencies.'],
  stats: 'STR > CON > DEX (or DEX > CON if using medium armor).',
  key: 'Rage every combat. Reckless Attack = your defining feature.',
};

export const RAGE_MANAGEMENT = {
  rages: [
    { level: '1-2', count: 2 },
    { level: '3-5', count: 3 },
    { level: '6-11', count: 4 },
    { level: '12-16', count: 5 },
    { level: '17-19', count: 6 },
    { level: '20', count: 'Unlimited' },
  ],
  rules: [
    'Rage lasts 1 minute (10 rounds). Ends early if you don\'t attack or take damage.',
    'Resistance to bludgeoning, piercing, slashing (nonmagical at some levels).',
    'Bonus rage damage: +2 (L1) → +4 (L16).',
    'Can\'t cast spells or concentrate while raging.',
    'Advantage on STR checks and saves while raging.',
  ],
  tips: [
    'Attack every round or take damage to keep rage active.',
    'Pre-cast spells BEFORE raging if multiclass.',
    'Rage is a bonus action. Attack the same turn.',
    'At low levels, conserve rages. You only have 2-3.',
  ],
};

export const SUBCLASS_RANKINGS = [
  { subclass: 'Totem Warrior (Bear)', rating: 'S+', why: 'Resistance to ALL damage except psychic while raging. Best tank.', note: 'Effectively double HP while raging. Ridiculous durability.' },
  { subclass: 'Zealot', rating: 'S', why: 'Extra radiant damage each turn. Free resurrection. Rage Beyond Death at L14.', note: 'Can\'t die while raging at L14. Literally unkillable.' },
  { subclass: 'Ancestral Guardian', rating: 'S', why: 'Mark enemy: disadvantage on attacks vs allies + resistance for allies.', note: 'Best party protector Barbarian. Forces enemies to attack you.' },
  { subclass: 'Wild Magic', rating: 'A+', why: 'Random magical effects on rage. Some are incredibly powerful.', note: 'Tasha\'s. Fun and strong. Some rolls are amazing.' },
  { subclass: 'Beast', rating: 'A', why: 'Natural weapons: claws (extra attack), tail (AC), bite (healing).', note: 'Claws: 3 attacks at L5 without dual wielding. Good damage.' },
  { subclass: 'Storm Herald', rating: 'B+', why: 'Aura effects: Desert (fire damage), Sea (lightning), Tundra (temp HP).', note: 'Decent but outclassed by Totem and Zealot.' },
  { subclass: 'Berserker', rating: 'B', why: 'Frenzy: BA attack but gain exhaustion after rage. Intimidating Presence.', note: 'Exhaustion penalty is crippling. Worst designed subclass.' },
  { subclass: 'Battlerager', rating: 'C', why: 'Dwarf only. Spike armor for 3 damage. Temp HP on reckless.', note: 'Terrible. Never pick this.' },
];

export const RECKLESS_ATTACK_GUIDE = {
  what: 'Advantage on all STR melee attacks this turn. Enemies have advantage on you until next turn.',
  when: [
    { use: true, situation: 'You need to hit. Missing wastes your turn more than taking extra damage.', note: 'Barbarian HP is high enough. You can take the hits.' },
    { use: true, situation: 'You have resistance active (Rage). Extra damage is halved anyway.', note: 'Raging + Reckless = net positive. Halved damage vs double hit chance.' },
    { use: true, situation: 'Enemies are attacking allies, not you.', note: 'If enemies aren\'t targeting you, the downside doesn\'t matter.' },
    { use: false, situation: 'Many enemies with multiattack targeting you specifically.', note: '6 attacks with advantage = lots of damage even halved.' },
    { use: false, situation: 'You\'re low HP and can\'t afford to go down.', note: 'Going unconscious loses your rage. Then you lose resistance.' },
  ],
  synergies: [
    'Great Weapon Master: advantage offsets -5 penalty. More hits = more +10 damage.',
    'Brutal Critical: more crits from advantage. Doubles crit chance.',
    'Half-Orc: extra crit die. Advantage = more crits = more damage.',
    'Sentinel: enemies provoke OA even with Disengage. Advantage helps hit.',
  ],
};

export const BARBARIAN_FEAT_PICKS = [
  { feat: 'Great Weapon Master', rating: 'S+', why: '-5 attack / +10 damage. Reckless Attack offsets the penalty. Best feat.' },
  { feat: 'Polearm Master', rating: 'S', why: 'BA attack + OA when entering reach. Sentinel combo.' },
  { feat: 'Sentinel', rating: 'S', why: 'OA reduces speed to 0. Enemy is stuck in melee with you.' },
  { feat: 'Resilient (WIS)', rating: 'A+', why: 'Proficiency in WIS saves. Barbarians are vulnerable to WIS effects.' },
  { feat: 'Tough', rating: 'A', why: '+2 HP/level. Stacks with d12 HD. Massive HP pool.' },
  { feat: 'Slasher/Crusher', rating: 'A', why: 'Reduce speed (Slasher) or push 5ft (Crusher). Crit bonus.' },
  { feat: 'Mobile', rating: 'A', why: '+10ft speed. Free Disengage after attacking.' },
  { feat: 'Shield Master', rating: 'A', why: 'BA to shove prone. Add shield AC to DEX saves. Evasion-lite.' },
];

export const BARBARIAN_BUILD_TIPS = [
  'STR > CON > DEX. Max STR first. GWM needs it.',
  'Great Weapon Master: best feat. Reckless Attack offsets -5.',
  'Bear Totem: resistance to all damage. Best defensive option.',
  'Zealot: can\'t die while raging at L14. Free resurrection.',
  'Reckless Attack every round while raging. The math supports it.',
  'Polearm Master + Sentinel: control the battlefield. Lock enemies down.',
  'Multiclass: Fighter 1-2 for Action Surge. Or Rogue 2 for Cunning Action.',
  'Don\'t dump WIS. Mind control effects target WIS and devastate Barbarians.',
  'Carry a javelin or handaxe for ranged options. You need something.',
  'Berserker is a trap. Exhaustion from Frenzy is crippling. Avoid it.',
];
