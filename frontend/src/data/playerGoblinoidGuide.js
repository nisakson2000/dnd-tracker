/**
 * playerGoblinoidGuide.js
 * Player Mode: Goblin, Hobgoblin, and Bugbear PC race optimization
 * Pure JS — no React dependencies.
 */

export const GOBLIN_TRAITS = {
  source: 'Volo\'s Guide / MotM',
  asi: '+2 DEX, +1 CON (Volo\'s)',
  size: 'Small',
  speed: '30ft',
  darkvision: '60ft',
  furyOfTheSmall: 'Once per short rest: deal extra damage = your level to a creature larger than you.',
  nimbleEscape: 'Disengage or Hide as a bonus action (like Rogue\'s Cunning Action).',
  bestFor: 'Rogue (stacks with Cunning Action for flexibility), Fighter, Ranger',
};

export const HOBGOBLIN_TRAITS = {
  source: 'Volo\'s Guide / MotM',
  asi: '+2 CON, +1 INT (Volo\'s)',
  size: 'Medium',
  speed: '30ft',
  darkvision: '60ft',
  savingFace: 'When you fail a check/save/attack, add +1 per ally within 30ft you can see (max +5). Once per short rest.',
  martialTraining: 'Two martial weapon proficiencies + light armor.',
  motmVersion: 'Fey Gift: Help as bonus action. Grants temp HP, or speed boost, or frightened on target.',
  bestFor: 'Wizard (martial weapons + armor from race), Fighter, Artificer',
};

export const BUGBEAR_TRAITS = {
  source: 'Volo\'s Guide / MotM',
  asi: '+2 STR, +1 DEX (Volo\'s)',
  size: 'Medium',
  speed: '30ft',
  darkvision: '60ft',
  longLimbed: '+5ft reach on your turn (melee attacks only).',
  sneaky: 'Proficiency in Stealth.',
  surpriseAttack: 'If you surprise a creature, deal extra 2d6 damage on first hit.',
  bestFor: 'Rogue (surprise + sneak attack = massive burst), Fighter, Barbarian, Paladin',
};

export const GOBLINOID_BUILDS = [
  { race: 'Goblin', build: 'Goblin Rogue', detail: 'Nimble Escape frees Cunning Action for other things. Fury of the Small adds level damage. Small and sneaky.', rating: 'A' },
  { race: 'Goblin', build: 'Goblin Artificer', detail: 'DEX + CON. Nimble Escape for escape. Fury for burst. Battle Smith works well.', rating: 'B' },
  { race: 'Hobgoblin', build: 'Hobgoblin Wizard', detail: 'INT + CON. Light armor + martial weapons from race. Saving Face prevents failed saves.', rating: 'A' },
  { race: 'Hobgoblin', build: 'Hobgoblin Fighter', detail: 'CON tank. Saving Face prevents critical failures. Martial training redundant but stats are great.', rating: 'A' },
  { race: 'Bugbear', build: 'Bugbear Rogue', detail: 'Surprise Attack (2d6) + Sneak Attack. Long-Limbed reach for safe melee. Stealth proficiency.', rating: 'S' },
  { race: 'Bugbear', build: 'Bugbear Paladin', detail: '+5ft reach on Smite attacks. Surprise Attack + Smite = devastating opening.', rating: 'A' },
  { race: 'Bugbear', build: 'Bugbear Battle Master', detail: 'Long-Limbed reach + PAM + Sentinel = enormous threat zone.', rating: 'S' },
];

export function furyDamage(characterLevel) {
  return characterLevel;
}

export function surpriseAttackTotal(sneakAttackDice) {
  return (2 * 3.5) + (sneakAttackDice * 3.5); // 2d6 surprise + sneak attack dice
}

export function bugbearReach(weaponReach) {
  return weaponReach + 5; // +5ft on your turn
}
