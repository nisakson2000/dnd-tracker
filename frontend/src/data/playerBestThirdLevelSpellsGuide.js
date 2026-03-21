/**
 * playerBestThirdLevelSpellsGuide.js
 * Player Mode: Best L3 spells — the most impactful spell level
 * Pure JS — no React dependencies.
 */

export const L3_OVERVIEW = {
  note: 'Level 3 spells (gained at character L5) are the biggest power spike in the game. Fireball, Spirit Guardians, Hypnotic Pattern — this is where casters become dominant.',
};

export const BEST_L3_SPELLS = [
  { spell: 'Fireball', classes: ['Sorcerer', 'Wizard'], damage: '8d6 fire', rating: 'S', note: 'Iconic AoE. 20ft radius. 28 avg damage. Fire resistance is common though.' },
  { spell: 'Spirit Guardians', classes: ['Cleric'], damage: '3d8/enemy/round', rating: 'S+', note: 'Best sustained damage spell. Damages all enemies near you every round.' },
  { spell: 'Hypnotic Pattern', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'S+', note: 'Mass incapacitation. No repeated saves. Splits encounters.' },
  { spell: 'Counterspell', classes: ['Sorcerer', 'Warlock', 'Wizard'], rating: 'S', note: 'Stop enemy spells. Auto-counter L3 or lower. Check for higher.' },
  { spell: 'Conjure Animals', classes: ['Druid', 'Ranger'], rating: 'S', note: '8 creatures = massive DPR. Most powerful L3 Druid spell.' },
  { spell: 'Haste', classes: ['Sorcerer', 'Wizard', 'Artificer'], rating: 'A+', note: '+2 AC, extra attack, doubled speed. Lethal if concentration breaks.' },
  { spell: 'Fly', classes: ['Sorcerer', 'Warlock', 'Wizard', 'Artificer'], rating: 'A+', note: '60ft fly speed. Concentration. 10 minutes.' },
  { spell: 'Revivify', classes: ['Cleric', 'Paladin', 'Druid (Wildfire)', 'Artificer'], rating: 'S', note: 'Bring back the dead. 300gp diamonds. 1-minute window.' },
  { spell: 'Dispel Magic', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer'], rating: 'A+', note: 'Remove any spell effect. Essential utility.' },
  { spell: 'Animate Dead', classes: ['Wizard', 'Cleric'], rating: 'A', note: 'Create undead minions. Requires daily maintenance.' },
  { spell: 'Fear', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'A+', note: '30ft cone. Frightened + forced dash away. WIS save.' },
  { spell: 'Sleet Storm', classes: ['Druid', 'Sorcerer', 'Wizard'], rating: 'A', note: 'Difficult terrain + concentration checks + prone checks. Area denial.' },
  { spell: 'Plant Growth', classes: ['Bard', 'Druid', 'Ranger'], rating: 'A+', note: '100ft radius. 4ft to move 1ft. No save. No concentration. Incredible control.' },
  { spell: 'Leomund\'s Tiny Hut', classes: ['Bard', 'Wizard'], rating: 'A+', note: 'Ritual. Safe rest anywhere. 8-hour dome. Essential for travel.' },
  { spell: 'Lightning Bolt', classes: ['Sorcerer', 'Wizard'], damage: '8d6 lightning', rating: 'A', note: 'Same damage as Fireball. 100ft line. Fewer resistance issues.' },
];

export const L3_CLASS_PRIORITIES = {
  cleric: 'Spirit Guardians > Revivify > Dispel Magic.',
  wizard: 'Fireball or Hypnotic Pattern > Counterspell > Fly > Tiny Hut (ritual).',
  sorcerer: 'Fireball or Hypnotic Pattern > Counterspell > Haste.',
  druid: 'Conjure Animals > Plant Growth > Revivify (Wildfire).',
  bard: 'Hypnotic Pattern > Fear > Tiny Hut (ritual) > Dispel Magic.',
  warlock: 'Counterspell > Hypnotic Pattern > Fly (only 2 slots, choose wisely).',
  paladin: 'Revivify > Dispel Magic > Spirit Shroud.',
  ranger: 'Conjure Animals > Plant Growth > Revivify (Fey Wanderer).',
};

export const L3_TIPS = [
  'L5 is the single biggest power spike. L3 spells change the game.',
  'Spirit Guardians is the highest sustained DPR spell for Clerics.',
  'Hypnotic Pattern wins fights. No repeated saves = permanent disable.',
  'Always have Counterspell prepared. It prevents enemy spells from working.',
  'Revivify needs 300gp diamonds. BUY THEM IN EVERY TOWN.',
  'Tiny Hut is ritual-castable. No slot cost. Safe rest anywhere.',
  'Plant Growth has no save, no concentration. 100ft radius = battlefield control.',
];
