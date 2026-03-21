/**
 * playerBestL7L8L9SpellsGuide.js
 * Player Mode: Best level 7-9 spells — endgame magic
 * Pure JS — no React dependencies.
 */

export const BEST_L7_SPELLS = [
  { spell: 'Forcecage', classes: ['Bard', 'Warlock', 'Wizard'], rating: 'S+', why: 'No save. No HP. Trap anything. Cage or box. CHA save to teleport out.' },
  { spell: 'Simulacrum', classes: ['Wizard'], rating: 'S+', why: 'Create a copy of yourself. Half HP, all features, all spells. 12 hours + 1500gp.' },
  { spell: 'Teleport', classes: ['Bard', 'Sorcerer', 'Wizard'], rating: 'S+', why: 'Instant long-distance travel. Up to 8 creatures. Chance of mishap.' },
  { spell: 'Plane Shift', classes: ['Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'S', why: 'Travel between planes or banish enemy (CHA save). Permanent banishment.' },
  { spell: 'Reverse Gravity', classes: ['Druid', 'Sorcerer', 'Wizard'], rating: 'S', why: 'Flip gravity in 50ft cylinder. Enemies fall up, take fall damage, can\'t reach you.' },
  { spell: 'Crown of Stars', classes: ['Sorcerer', 'Warlock', 'Wizard'], rating: 'A+', why: '7 motes. BA: throw for 4d12 radiant each. No concentration.' },
  { spell: 'Resurrection', classes: ['Bard', 'Cleric'], rating: 'A+', why: 'Revive dead up to 100 years. Removes all conditions. 1000gp diamond.' },
  { spell: 'Conjure Celestial', classes: ['Cleric'], rating: 'A', why: 'Couatl: healing, shields, spellcasting. Reliable celestial ally.' },
  { spell: 'Regenerate', classes: ['Bard', 'Cleric', 'Druid'], rating: 'A', why: '1 HP/round for 1 hour + regrow limbs. 60 HP total over duration.' },
  { spell: 'Mirage Arcane', classes: ['Bard', 'Druid', 'Wizard'], rating: 'A (creative)', why: 'Terrain looks AND feels real. 1-mile square. 10 days. Create lava, cliffs, etc.' },
];

export const BEST_L8_SPELLS = [
  { spell: 'Maze', classes: ['Wizard'], rating: 'S+', why: 'Banish to a demiplane maze. No save. INT check (DC 20) to escape. Most monsters can\'t.' },
  { spell: 'Feeblemind', classes: ['Bard', 'Druid', 'Warlock', 'Wizard'], rating: 'S+', why: 'INT save. INT and CHA drop to 1. Can\'t cast spells. Save repeats every 30 DAYS.' },
  { spell: 'Holy Aura', classes: ['Cleric'], rating: 'S+', why: 'Advantage on saves. Attacks against you have disadvantage. Blind fiends/undead on hit.' },
  { spell: 'Sunburst', classes: ['Druid', 'Sorcerer', 'Wizard'], rating: 'A', why: '12d6 radiant in 60ft radius + blind (CON save). Anti-undead nuke.' },
  { spell: 'Glibness', classes: ['Bard', 'Warlock'], rating: 'S+', why: 'Minimum 15 on CHA checks for 1 hour. Counterspell auto-succeeds vs L8 or lower.' },
  { spell: 'Dominate Monster', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'S', why: 'Control any creature type. WIS save. Concentration. Turn enemy into ally.' },
  { spell: 'Antimagic Field', classes: ['Cleric', 'Wizard'], rating: 'S', why: '10ft sphere: no magic works. Shut down casters. Suppress magic items.' },
  { spell: 'Clone', classes: ['Wizard'], rating: 'S', why: 'Backup body. If you die, soul transfers. Permanent death insurance.' },
  { spell: 'Mind Blank', classes: ['Bard', 'Wizard'], rating: 'A+', why: 'Immune to psychic damage, divination, charmed. 24 hours. No concentration.' },
  { spell: 'Telepathy', classes: ['Wizard'], rating: 'A', why: 'Unlimited range telepathic bond. 24 hours.' },
];

export const BEST_L9_SPELLS = [
  { spell: 'Wish', classes: ['Sorcerer', 'Wizard'], rating: 'S+', why: 'Most powerful spell. Replicate any L8 or lower spell. Or creative wishes (risky).' },
  { spell: 'True Polymorph', classes: ['Bard', 'Warlock', 'Wizard'], rating: 'S+', why: 'Turn anything into anything. Permanent after 1 hour concentration. Ancient Dragon form.' },
  { spell: 'Foresight', classes: ['Bard', 'Druid', 'Warlock', 'Wizard'], rating: 'S+', why: 'Advantage on everything. Attacks against you have disadvantage. 8 hours. No concentration.' },
  { spell: 'Mass Heal', classes: ['Cleric'], rating: 'S+', why: 'Heal 700 HP split among creatures. Cure blind/deaf/disease. Full party instant heal.' },
  { spell: 'Psychic Scream', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'S', why: '14d6 psychic to 10 creatures. INT save. Stunned on fail. Head explodes at 0 HP.' },
  { spell: 'Meteor Swarm', classes: ['Sorcerer', 'Wizard'], rating: 'S', why: '40d6 (20d6 fire + 20d6 bludgeoning). 4 points, 40ft radius each. 1 mile range.' },
  { spell: 'Gate', classes: ['Cleric', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'A+', why: 'Open portal to another plane. Name a creature to summon it through.' },
  { spell: 'Shapechange', classes: ['Druid', 'Wizard'], rating: 'S', why: 'Become any creature. Keep your spellcasting. Change forms as action.' },
  { spell: 'Power Word Kill', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'A', why: 'Instant kill if under 100 HP. No save. Track enemy HP.' },
  { spell: 'True Resurrection', classes: ['Cleric', 'Druid'], rating: 'A+', why: 'Revive anyone dead up to 200 years. New body if needed. 25,000gp diamond.' },
  { spell: 'Prismatic Wall', classes: ['Wizard'], rating: 'A+', why: '7 layers of different effects. Each layer must be dealt with separately.' },
  { spell: 'Time Stop', classes: ['Sorcerer', 'Wizard'], rating: 'A', why: '1d4+1 extra turns. Can\'t affect other creatures. Buff/prep time.' },
];

export const HIGH_LEVEL_SPELL_TIPS = [
  'Forcecage (L7): no save, no HP. Best control spell in the game.',
  'Simulacrum (L7): clone yourself. Two of you casting spells.',
  'Maze (L8): no save banishment. INT check DC 20 to escape. Most fail.',
  'Feeblemind (L8): INT and CHA to 1. No spellcasting. Save every 30 DAYS.',
  'Wish (L9): replicate any L8 or lower = safest use. No risk.',
  'True Polymorph (L9): permanent after 1 hour. Become an Ancient Dragon.',
  'Foresight (L9): advantage on everything for 8 hours. No concentration.',
  'Mass Heal (L9): 700 HP split among party. Full heal + cure conditions.',
  'Meteor Swarm (L9): 40d6 damage. Destroys encounters. 1 mile range.',
  'L7-9 slots are ultra-rare. One per day. Make them count.',
];
