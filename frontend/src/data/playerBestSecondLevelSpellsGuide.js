/**
 * playerBestSecondLevelSpellsGuide.js
 * Player Mode: Best L2 spells — most impactful second-level picks
 * Pure JS — no React dependencies.
 */

export const BEST_L2_SPELLS = [
  { spell: 'Web', classes: ['Wizard', 'Sorcerer', 'Artificer'], rating: 'S', note: 'Best L2 control. Restrained. Difficult terrain. DEX save to escape.' },
  { spell: 'Pass Without Trace', classes: ['Druid', 'Ranger', 'Trickery Cleric'], rating: 'S', note: '+10 Stealth entire party. Broken.' },
  { spell: 'Spiritual Weapon', classes: ['Cleric'], rating: 'S', note: 'BA attack every turn. No concentration. Lasts 1 minute.' },
  { spell: 'Aid', classes: ['Cleric', 'Paladin', 'Artificer', 'Ranger'], rating: 'S', note: '+5 max HP to 3 targets. 8 hours. No concentration.' },
  { spell: 'Misty Step', classes: ['Sorcerer', 'Warlock', 'Wizard'], rating: 'A+', note: 'BA teleport 30ft. Escape, reposition, cross gaps.' },
  { spell: 'Hold Person', classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'A+', note: 'Paralyzed = auto-crit on melee. WIS save. Humanoids only.' },
  { spell: 'Spike Growth', classes: ['Druid', 'Ranger'], rating: 'A+', note: 'Concealed thorns. 2d4/5ft moved. Forced movement combo.' },
  { spell: 'Enhance Ability', classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard', 'Artificer', 'Ranger'], rating: 'A', note: 'Advantage on ability checks of chosen stat. 1 hour concentration.' },
  { spell: 'Lesser Restoration', classes: ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Artificer'], rating: 'A', note: 'Cure disease, blindness, deafness, paralysis, poison. Essential utility.' },
  { spell: 'Suggestion', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'S', note: 'Make someone do anything "reasonable." 8 hour duration.' },
  { spell: 'Shatter', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'], rating: 'A', note: '3d8 thunder AoE. Good early damage. CON save.' },
  { spell: 'Summon Beast', classes: ['Druid', 'Ranger'], rating: 'A', note: 'Tasha\'s summon. Reliable, scales. No DM-chosen form.' },
  { spell: 'Mirror Image', classes: ['Sorcerer', 'Warlock', 'Wizard'], rating: 'A+', note: 'No concentration. 3 images absorb attacks. Incredible defense.' },
  { spell: 'Invisibility', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer'], rating: 'A', note: '1 hour. Scouting, infiltration, surprise round setup.' },
  { spell: 'Healing Spirit', classes: ['Druid', 'Ranger'], rating: 'A+', note: 'Best out-of-combat healing. Mobile healing zone.' },
];

export const L2_SPELL_TIPS = [
  'Web is the best L2 spell in the game for combat control.',
  'Pass Without Trace makes the entire party stealthy, even in plate armor.',
  'Spiritual Weapon is free sustained damage — no concentration, BA attack each turn.',
  'Misty Step is a BA — can still attack or cast a cantrip on the same turn.',
  'Hold Person is incredible but HUMANOID ONLY. Doesn\'t work on beasts, fiends, etc.',
  'Mirror Image is one of the best defensive spells because it costs NO concentration.',
  'Aid can revive unconscious allies (raises current HP from 0).',
];
