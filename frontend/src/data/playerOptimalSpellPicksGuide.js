/**
 * playerOptimalSpellPicksGuide.js
 * Player Mode: Must-have spells by class — never leave home without these
 * Pure JS — no React dependencies.
 */

export const MUST_HAVE_SPELLS = {
  wizard: {
    cantrips: ['Mind Sliver (INT save + debuff)', 'Fire Bolt (range damage)', 'Prestidigitation (utility)', 'Minor Illusion (creativity)'],
    level1: ['Shield (S+)', 'Find Familiar (S+)', 'Absorb Elements (S)', 'Silvery Barbs (S+ if allowed)'],
    level2: ['Web (S+)', 'Misty Step (S)', 'Mirror Image (A+)'],
    level3: ['Hypnotic Pattern (S+)', 'Counterspell (S+)', 'Fireball (S)', 'Fly (S)'],
    level4: ['Polymorph (S+)', 'Banishment (S)', 'Greater Invisibility (S)'],
    level5: ['Wall of Force (S+)', 'Animate Objects (S)', 'Telekinesis (A+)'],
    level6: ['Mass Suggestion (S)', 'Globe of Invulnerability (A+)'],
    level7: ['Forcecage (S+)', 'Simulacrum (S)', 'Plane Shift (S)'],
    level8: ['Maze (S)', 'Feeblemind (S)', 'Clone (S)'],
    level9: ['Wish (S++)', 'True Polymorph (S+)', 'Foresight (S)'],
  },
  cleric: {
    cantrips: ['Toll the Dead (damage)', 'Guidance (S+)', 'Sacred Flame (radiant)'],
    level1: ['Healing Word (S+)', 'Bless (S+)', 'Guiding Bolt (A+)', 'Shield of Faith (A)'],
    level2: ['Spiritual Weapon (S+)', 'Aid (A+)', 'Lesser Restoration (A)'],
    level3: ['Spirit Guardians (S+)', 'Revivify (S+)', 'Dispel Magic (S)'],
    level4: ['Banishment (S)', 'Death Ward (A+)', 'Guardian of Faith (A)'],
    level5: ['Holy Weapon (S)', 'Greater Restoration (S)', 'Raise Dead (A+)'],
  },
  druid: {
    cantrips: ['Guidance (S+)', 'Thorn Whip (pull control)', 'Produce Flame (light+damage)'],
    level1: ['Healing Word (S+)', 'Entangle (S)', 'Goodberry (A+)', 'Absorb Elements (S)'],
    level2: ['Spike Growth (S)', 'Pass Without Trace (S+)', 'Moonbeam (A)'],
    level3: ['Conjure Animals (S+)', 'Plant Growth (A+)', 'Call Lightning (S)'],
    level4: ['Polymorph (S+)', 'Conjure Woodland Beings (S)'],
    level5: ['Conjure Elemental (A)', 'Wall of Stone (A+)', 'Greater Restoration (S)'],
  },
  sorcerer: {
    cantrips: ['Mind Sliver (debuff)', 'Fire Bolt (damage)', 'Prestidigitation (utility)'],
    level1: ['Shield (S+)', 'Absorb Elements (S)', 'Silvery Barbs (S+ if allowed)'],
    level2: ['Web (S+)', 'Misty Step (S)', 'Suggestion (S)'],
    level3: ['Hypnotic Pattern (S+)', 'Counterspell (S+)', 'Fireball (S)', 'Haste (S+)'],
    level4: ['Polymorph (S+)', 'Banishment (S)', 'Greater Invisibility (S)'],
    level5: ['Wall of Force (S+)', 'Animate Objects (S)', 'Synaptic Static (S)'],
    metamagic: ['Subtle Spell (S+)', 'Twinned Spell (S)', 'Quickened Spell (S)', 'Heightened Spell (A+)'],
  },
  bard: {
    cantrips: ['Vicious Mockery (disadvantage)', 'Minor Illusion (creativity)', 'Mage Hand (utility)'],
    level1: ['Healing Word (S+)', 'Faerie Fire (S)', 'Dissonant Whispers (A+)', 'Silvery Barbs (S+)'],
    level2: ['Suggestion (S)', 'Heat Metal (S)', 'Lesser Restoration (A)'],
    level3: ['Hypnotic Pattern (S+)', 'Fear (A+)', 'Dispel Magic (S)'],
    level4: ['Polymorph (S+)', 'Greater Invisibility (S)', 'Dimension Door (A+)'],
    level5: ['Synaptic Static (S)', 'Animate Objects (S)', 'Greater Restoration (S)'],
    magicalSecrets: ['Counterspell (S+)', 'Find Greater Steed (Paladin, S+)', 'Aura of Vitality (Paladin, A+)', 'Steel Wind Strike (A+)'],
  },
  warlock: {
    cantrips: ['Eldritch Blast (S++)', 'Minor Illusion (utility)', 'Prestidigitation (utility)'],
    level1: ['Hex (A+)', 'Shield (Hexblade S+)', 'Armor of Agathys (A+)'],
    level2: ['Misty Step (S)', 'Mirror Image (A+)', 'Darkness (S with Devil\'s Sight)', 'Suggestion (S)'],
    level3: ['Counterspell (S+)', 'Hypnotic Pattern (S+)', 'Fly (S)', 'Summon Undead (A+)'],
    level4: ['Banishment (S)', 'Shadow of Moil (S)', 'Dimension Door (A+)'],
    level5: ['Synaptic Static (S)', 'Hold Monster (S)'],
    invocations: ['Agonizing Blast (S+)', 'Repelling Blast (S+)', 'Book of Ancient Secrets (Tome, S+)', 'Investment of the Chain Master (Chain, S+)'],
  },
  paladin: {
    level1: ['Shield of Faith (A)', 'Bless (S+)', 'Wrathful Smite (A+)', 'Thunderous Smite (A)'],
    level2: ['Find Steed (S+)', 'Aid (A+)', 'Lesser Restoration (A)'],
    level3: ['Revivify (S+)', 'Crusader\'s Mantle (A)', 'Aura of Vitality (A+)'],
    level4: ['Find Greater Steed (S+)', 'Banishment (S)', 'Death Ward (A+)'],
    level5: ['Destructive Wave (S)', 'Holy Weapon (S+)', 'Raise Dead (A+)'],
    note: 'Paladin spell slots are best used for Divine Smite. Prepare utility spells.',
  },
  ranger: {
    level1: ['Hunter\'s Mark (A)', 'Absorb Elements (S)', 'Goodberry (A+)', 'Entangle (S)'],
    level2: ['Pass Without Trace (S+)', 'Spike Growth (S)', 'Silence (A+)'],
    level3: ['Conjure Animals (S+)', 'Plant Growth (A+)', 'Lightning Arrow (A)'],
    level4: ['Greater Invisibility (S)', 'Conjure Woodland Beings (S)'],
    level5: ['Swift Quiver (S)', 'Steel Wind Strike (A+)'],
    note: 'Tasha\'s optional features (Favored Foe, Deft Explorer) replace weak PHB features.',
  },
};

export const SPELL_PICK_TIPS = [
  'Shield is the best L1 spell for any class that gets it.',
  'Healing Word > Cure Wounds. BA ranged pick-up saves lives.',
  'Guidance is the best cantrip in the game. +1d4 to any ability check.',
  'Web is the best L2 control spell. Restrained + difficult terrain.',
  'Hypnotic Pattern is the best L3 control spell. Incapacitate entire groups.',
  'Counterspell: if your class gets it, always prepare/learn it.',
  'Polymorph: offense (T-Rex ally) AND defense (save a dying ally with 136 HP).',
  'Wall of Force: no save, no escape (usually). Split encounters.',
  'Bless is always worth concentrating on. +1d4 to attacks AND saves.',
  'Known spellcasters (Bard, Sorcerer, Warlock, Ranger): choose VERY carefully.',
];
