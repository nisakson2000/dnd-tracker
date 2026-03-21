/**
 * playerUnarmedStrikeGuide.js
 * Player Mode: Unarmed strikes — rules, Monk martial arts, and edge cases
 * Pure JS — no React dependencies.
 */

export const UNARMED_RULES = {
  base: '1 + STR mod bludgeoning damage. No proficiency bonus to damage.',
  proficiency: 'Everyone is proficient with unarmed strikes.',
  notWeapon: 'Unarmed strikes are NOT weapon attacks for most features. They ARE melee weapon attacks.',
  dueling: 'Dueling fighting style does NOT apply (not a weapon held in one hand).',
  note: 'RAW distinction: melee weapon attack ≠ attack with a melee weapon.',
};

export const MONK_MARTIAL_ARTS = {
  damage: 'Martial Arts die replaces unarmed damage: d4 (L1) → d6 (L5) → d8 (L11) → d10 (L17).',
  dexOrStr: 'Can use DEX instead of STR for unarmed strikes and monk weapons.',
  bonusAttack: 'When you Attack with unarmed or monk weapon: bonus action unarmed strike.',
  magical: 'L6: Ki-Empowered Strikes. Unarmed strikes count as magical.',
  note: 'Monk unarmed strikes scale with level. Best unarmed class.',
};

export const UNARMED_BUILDS = [
  { build: 'Monk', why: 'Martial Arts die + DEX + Flurry of Blows. Built for unarmed.', note: 'Best unarmed class. Stunning Strike, Flurry, ki powers.' },
  { build: 'Tavern Brawler feat', why: '+1 STR/CON. Proficient with improvised weapons. Bonus action grapple after unarmed hit.', note: 'Any class can grapple-brawl with this feat.' },
  { build: 'Fighting Initiate (Unarmed)', why: 'Unarmed Fighting style: 1d6+STR (1d8 with both hands free). +1d4 to grappled foe.', note: 'Fighter, Ranger, Paladin. Decent unarmed option.' },
  { build: 'Beast Barbarian (Tasha\'s)', why: 'Natural weapons on rage: claws (extra attack), tail (reaction AC), bite (heal).', note: 'Not technically unarmed but feels like it.' },
  { build: 'Dhampir (race)', why: 'Vampiric Bite: CON-based. Empowered if missing HP.', note: 'Natural weapon. Self-healing bite.' },
];

export const NATURAL_WEAPONS = {
  note: 'Natural weapons (claws, bite, tail) are NOT unarmed strikes unless specified.',
  examples: [
    { source: 'Tabaxi Claws', damage: '1d4+STR slashing', note: 'Natural weapon. Not unarmed. Doesn\'t work with Monk Martial Arts RAW.' },
    { source: 'Lizardfolk Bite', damage: '1d6+STR piercing', note: 'Natural weapon. Can use as unarmed for Monk (errata/Tasha\'s).' },
    { source: 'Minotaur Horns', damage: '1d6+STR piercing', note: 'Natural weapon. Bonus action after Dash.' },
    { source: 'Beast Barbarian', damage: 'Various (claw, tail, bite)', note: 'Simple melee weapons while raging.' },
  ],
  tashaClarification: 'Tasha\'s Cauldron: natural weapons can be used for Monk features if they\'re simple melee weapons.',
};

export const UNARMED_TIPS = [
  'Base unarmed: 1 + STR. Very weak without features.',
  'Monk: best unarmed class. Martial Arts die scales.',
  'Unarmed Fighting style: 1d6+STR (1d8 two free hands).',
  'Tavern Brawler: bonus action grapple after unarmed hit.',
  'Monk unarmed strikes become magical at L6.',
  'Natural weapons ≠ unarmed strikes (usually).',
  'Tasha\'s: some natural weapons work with Monk features.',
  'Flurry of Blows: 2 bonus action unarmed strikes (1 ki).',
  'Stunning Strike: unarmed hit + CON save or stunned (1 ki).',
  'Unarmed strikes ARE melee weapon attacks. Smite works RAW.',
];
