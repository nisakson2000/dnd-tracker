/**
 * playerLevelDipGuide.js
 * Player Mode: Best 1-3 level multiclass dips for optimization
 * Pure JS — no React dependencies.
 */

export const MULTICLASS_DIP_BASICS = {
  definition: 'Taking 1-3 levels in another class for specific features before continuing your main class.',
  requirements: 'Must meet both classes\' ability score prerequisites (13+ in key stats).',
  tradeoff: 'You delay your main class progression. Higher-level features come later.',
  note: 'A good dip gives more value in 1-3 levels than your main class would. A bad dip just delays you.',
};

export const BEST_1_LEVEL_DIPS = [
  { dip: 'Fighter 1', gives: ['Heavy armor', 'Con save proficiency', 'Fighting Style', 'Second Wind'], bestFor: 'Any caster wanting heavy armor + CON saves', prereq: 'STR 13 or DEX 13', rating: 'S', note: 'CON save proficiency is invaluable for concentration. Heavy armor raises AC to 18+ immediately.' },
  { dip: 'Cleric 1', gives: ['Heavy armor (some domains)', 'Shield proficiency', 'Healing Word', 'Cleric cantrips', 'Domain features'], bestFor: 'Any caster wanting armor + healing', prereq: 'WIS 13', rating: 'S', note: 'Life/Forge/Twilight Cleric L1 gives heavy armor + amazing domain features. No STR needed.' },
  { dip: 'Hexblade 1', gives: ['CHA to attack/damage (1 weapon)', 'Medium armor + shield', 'Hex spell', 'Hexblade\'s Curse'], bestFor: 'Paladin, Bard, Sorcerer', prereq: 'CHA 13', rating: 'S', note: 'Single best 1-level dip. CHA for attacks + armor = SAD build for any CHA class.' },
  { dip: 'Artificer 1', gives: ['Medium armor + shield', 'CON save proficiency', 'INT-based spellcasting', 'Magical Tinkering'], bestFor: 'Wizard wanting armor/CON saves', prereq: 'INT 13', rating: 'A', note: 'CON save + armor for Wizards. INT-based = no stat conflicts.' },
  { dip: 'Rogue 1', gives: ['Expertise (2 skills)', 'Sneak Attack 1d6', 'Thieves\' tools proficiency'], bestFor: 'Bard, Ranger for skill expertise', prereq: 'DEX 13', rating: 'A', note: 'Free Expertise in 2 skills. Sneak Attack is a nice bonus for DEX builds.' },
];

export const BEST_2_LEVEL_DIPS = [
  { dip: 'Fighter 2', gives: ['Everything from L1', 'Action Surge'], bestFor: 'ANY class', prereq: 'STR 13 or DEX 13', rating: 'S', note: 'Action Surge = extra action once per rest. Casters: two spells in one turn. Martials: double attacks. Best 2-level dip.' },
  { dip: 'Warlock 2', gives: ['2 L1 Pact slots (short rest recovery)', '2 Invocations (Agonizing Blast, Devil\'s Sight)', 'Eldritch Blast'], bestFor: 'Sorcerer, Bard', prereq: 'CHA 13', rating: 'A', note: 'Agonizing Blast for reliable damage. Devil\'s Sight for Darkness combo. Short rest slots for Sorcery Points conversion.' },
  { dip: 'Paladin 2', gives: ['Fighting Style', 'Divine Smite', 'Spellcasting'], bestFor: 'Fighter, Barbarian', prereq: 'STR 13, CHA 13', rating: 'A', note: 'Divine Smite on crits = massive damage. Smite uses any spell slots.' },
];

export const BEST_3_LEVEL_DIPS = [
  { dip: 'Fighter 3 (Battlemaster)', gives: ['Action Surge', 'Subclass', 'Superiority Dice'], bestFor: 'Any martial', prereq: 'STR or DEX 13', rating: 'S', note: 'Action Surge + 4d8 Superiority Dice. Maneuvers add control/damage to any martial.' },
  { dip: 'Fighter 3 (Echo Knight)', gives: ['Action Surge', 'Echo', 'Unleash Incarnation'], bestFor: 'Rogue (extra Sneak Attack trigger)', prereq: 'STR or DEX 13', rating: 'A', note: 'Echo provides flanking, reach, and bonus attack. Great for Rogues needing Sneak Attack positioning.' },
  { dip: 'Warlock 3', gives: ['Pact Boon', '2 L2 slots (short rest)', 'Invocations'], bestFor: 'Sorcerer (Coffelock), Bard', prereq: 'CHA 13', rating: 'A', note: 'Pact of the Chain (familiar) or Tome (cantrips+rituals). L2 slots = better SP conversion for Sorlock.' },
  { dip: 'Rogue 3 (Assassin)', gives: ['Expertise', 'Sneak Attack 2d6', 'Assassinate'], bestFor: 'Gloomstalker Ranger', prereq: 'DEX 13', rating: 'S', note: 'Assassinate auto-crits on surprised enemies. Combos with Dread Ambusher for devastating first turns.' },
];

export const DIP_WARNINGS = [
  { warning: 'Delay capstone', detail: 'Every dip level delays your main class capstone. A L20 ability you never reach is worthless.' },
  { warning: 'Spellcaster progression', detail: 'Multiclassing slows spell slot progression. You get higher-level spells later. Missing Fireball for 2 levels hurts.' },
  { warning: 'Feature delays', detail: 'Extra Attack at L5 is critical. If you dip before L5, you delay your biggest power spike.' },
  { warning: 'MAD stats', detail: 'Multiclass prerequisites can force you to spread stats thin. Check prerequisites before building.' },
];

export function spellSlotProgression(class1Level, class2Level, isFullCaster1, isFullCaster2) {
  const casterLevel1 = isFullCaster1 ? class1Level : Math.floor(class1Level / 2);
  const casterLevel2 = isFullCaster2 ? class2Level : Math.floor(class2Level / 2);
  return casterLevel1 + casterLevel2;
}
