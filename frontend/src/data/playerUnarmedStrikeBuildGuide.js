/**
 * playerUnarmedStrikeBuildGuide.js
 * Player Mode: Unarmed strike builds — Monk, Tavern Brawler, and punch builds
 * Pure JS — no React dependencies.
 */

export const UNARMED_STRIKE_RULES = {
  default: '1 + STR modifier bludgeoning. Not a weapon.',
  monk: 'Martial Arts die (d4 → d6 → d8 → d10 → d12 at L17). Use DEX or STR.',
  notWeapon: 'Unarmed strikes are NOT weapon attacks for most features (e.g., Divine Smite).',
  exception: 'Unarmed strikes ARE melee weapon attacks for Stunning Strike, Flurry, etc.',
  magicFists: 'Monk: Ki-Empowered Strikes (L6) = magical unarmed strikes.',
};

export const MONK_MARTIAL_ARTS = [
  { level: '1-4', die: 'd4', avgDamage: '2.5 + DEX', note: 'Low but multiple attacks.' },
  { level: '5-10', die: 'd6', avgDamage: '3.5 + DEX', note: 'Extra Attack online. 3 attacks/turn.' },
  { level: '11-16', die: 'd8', avgDamage: '4.5 + DEX', note: '4 attacks with Flurry.' },
  { level: '17+', die: 'd10', avgDamage: '5.5 + DEX', note: 'Competitive damage die.' },
];

export const UNARMED_BUILDS = [
  {
    name: 'Open Hand Monk',
    class: 'Way of the Open Hand',
    strategy: 'Flurry of Blows + Open Hand techniques (prone, push, no reactions).',
    damage: '4 attacks × (d8+DEX) at L11 = solid DPR.',
    rating: 'A+',
  },
  {
    name: 'Astral Self Monk',
    class: 'Way of the Astral Self',
    strategy: 'WIS for unarmed attacks. Extra reach. Astral arms.',
    damage: 'WIS-based attacks. Better stat dependency.',
    rating: 'A+',
  },
  {
    name: 'Tavern Brawler Fighter',
    class: 'Fighter (any) + Tavern Brawler feat',
    strategy: 'D4 unarmed + grapple as BA. Use improvised weapons.',
    damage: 'Low unarmed damage. Grapple + shove combo.',
    rating: 'B+',
  },
  {
    name: 'Beast Barbarian',
    class: 'Path of the Beast (Tasha\'s)',
    strategy: 'Natural weapons (claws = extra attack, tail = AC reaction).',
    damage: 'Claws: 2d6+STR per Attack action. Extra claw attack when using claws.',
    rating: 'S',
    note: 'Not technically unarmed but natural weapons. Best "fist" build.',
  },
  {
    name: 'Dhampir Monk',
    class: 'Monk (any) + Dhampir lineage',
    strategy: 'Bite attack = unarmed strike. Heal on hit.',
    damage: 'Normal Monk damage + bite healing.',
    rating: 'A',
  },
];

export const STUNNING_STRIKE = {
  cost: '1 Ki point',
  trigger: 'When you hit with a melee weapon attack (unarmed counts).',
  effect: 'CON save or Stunned until end of your next turn.',
  rating: 'S+ (when it lands)',
  problem: 'CON is the best monster save. Many creatures have high CON.',
  optimization: [
    'Save for big targets. Don\'t stun trash mobs.',
    'Multiple attempts: 4 attacks = 4 chances to stun.',
    'Target low-CON enemies: casters, humanoids.',
    'Stunning Strike + Hold Person (party caster): double lockdown.',
    'Ki is limited. Don\'t blow all Ki on stun attempts.',
  ],
};

export const UNARMED_TIPS = [
  'Monk: only class that makes unarmed viable long-term.',
  'Martial Arts die scales. d10 at L17 is competitive.',
  'Ki-Empowered Strikes (L6): magic fists. Bypasses resistance.',
  'Stunning Strike: save for important targets. CON saves are tough.',
  'Flurry of Blows: 4 attacks/turn at L5+. Most attacks of any class.',
  'Beast Barbarian: best "fist" build. Claws get extra attack.',
  'Tavern Brawler: grapple as BA. Pair with Athletics expertise.',
  'Unarmed strikes are NOT weapon attacks for Divine Smite (RAW).',
  'Monk needs DEX > WIS > CON. Don\'t dump any of them.',
  'Open Hand: Flurry + prone + no reactions = best control Monk.',
];
