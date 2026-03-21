/**
 * playerMysticArcanumGuide.js
 * Player Mode: Warlock Mystic Arcanum — spell selection by level
 * Pure JS — no React dependencies.
 */

export const MYSTIC_ARCANUM_RULES = {
  what: 'Warlock gets one spell of each level 6-9. Cast once per long rest.',
  slots: 'These are separate from Pact Magic slots. No upcasting.',
  change: 'Can swap one Arcanum when you gain a Warlock level.',
  key: 'Choose carefully — you only get ONE per level.',
};

export const LEVEL_6_PICKS = [
  { spell: 'Mass Suggestion', rating: 'S+', why: '12 creatures, no concentration, 24-hour duration. Best L6 pick.', note: 'No save if suggestion is reasonable. Encounter-ending.' },
  { spell: 'Soul Cage', rating: 'S', why: 'Capture a soul. Heal, ask questions, gain advantage. Warlock exclusive.', note: 'Requires humanoid death. Amazing in combat-heavy days.' },
  { spell: 'Arcane Gate', rating: 'A+', why: '500ft teleport portal. 10 min duration. Incredible utility.', note: 'Repositioning, escape, creative dungeon solutions.' },
  { spell: 'Mental Prison', rating: 'A+', why: '10d10 psychic on failed INT save. Restrained if they stay.', note: 'Great single-target lockdown + damage.' },
  { spell: 'Scatter', rating: 'A', why: 'Teleport up to 5 creatures 120ft. Reposition party or enemies.', note: 'Unwilling targets get CHA save.' },
  { spell: 'Circle of Death', rating: 'B+', why: '8d6 necrotic, 60ft radius. Big AoE.', note: 'Worse than Mass Suggestion in most cases.' },
];

export const LEVEL_7_PICKS = [
  { spell: 'Forcecage', rating: 'S+', why: 'No save. No HP. Trap anything. Best L7 spell in the game.', note: 'Cage or box. Teleport requires CHA save to escape.' },
  { spell: 'Plane Shift', rating: 'S', why: 'Banish enemy (CHA save) or travel planes. Dual purpose.', note: 'Offensive: send enemy to hostile plane permanently.' },
  { spell: 'Crown of Stars', rating: 'A+', why: '7 star motes, 4d12 radiant each. BA to throw. No concentration.', note: 'Amazing sustained damage. Frees concentration for other spells.' },
  { spell: 'Finger of Death', rating: 'A', why: '7d8+30 necrotic. Killed target rises as permanent zombie.', note: 'Build a zombie army over time.' },
  { spell: 'Etherealness', rating: 'A', why: 'Enter Ethereal Plane. Scout, bypass walls, escape anything.', note: 'Great utility but situational.' },
];

export const LEVEL_8_PICKS = [
  { spell: 'Glibness', rating: 'S+', why: 'Minimum 15 on CHA checks for 1 hour. No concentration.', note: 'Counterspell always succeeds vs L8 or lower. Social god.' },
  { spell: 'Dominate Monster', rating: 'S', why: 'Control any creature. WIS save. Concentration.', note: 'Turn the biggest enemy into your ally.' },
  { spell: 'Feeblemind', rating: 'A+', why: 'INT save. INT and CHA drop to 1. No spellcasting.', note: 'Permanently disables casters. INT save repeats every 30 days.' },
  { spell: 'Maddening Darkness', rating: 'A', why: '60ft darkness + 8d8 psychic/round. Warlock exclusive.', note: 'Combo with Devil\'s Sight. You see, they don\'t.' },
  { spell: 'Demiplane', rating: 'A', why: 'Personal pocket dimension. Storage, prison, safe room.', note: 'Creative uses are endless.' },
];

export const LEVEL_9_PICKS = [
  { spell: 'Foresight', rating: 'S+', why: 'Advantage on everything, enemies have disadvantage. 8 hours. No concentration.', note: 'Best buff in the game. Cast on yourself or ally.' },
  { spell: 'True Polymorph', rating: 'S+', why: 'Turn anything into anything. Permanent after 1 hour concentration.', note: 'Turn enemy into a snail. Or yourself into a dragon.' },
  { spell: 'Imprisonment', rating: 'S', why: 'Permanent removal of a creature. No save escapes without specific condition.', note: 'WIS save. Costs 500gp component per HD.' },
  { spell: 'Power Word Kill', rating: 'A', why: 'Instant kill if under 100 HP. No save.', note: 'Track enemy HP. Below 100 = dead.' },
  { spell: 'Psychic Scream', rating: 'A', why: '14d6 psychic, INT save, stunned on fail. 10 creatures.', note: 'Best damage L9 spell. Stun is incredible.' },
];

export const ARCANUM_TIPS = [
  'You only get ONE spell per Arcanum level. Choose the best.',
  'L6: Mass Suggestion. No concentration, 24 hours. Best pick.',
  'L7: Forcecage. No save, no HP. Trap anything.',
  'L8: Glibness. Counterspell auto-succeeds vs L8 or lower.',
  'L9: Foresight. Best buff in the game. 8 hours, no concentration.',
  'Arcanum spells can\'t be upcast. They\'re fixed level.',
  'One cast per long rest each. Budget them carefully.',
  'Crown of Stars (L7): amazing if you want sustained damage.',
  'True Polymorph (L9): permanent transformation. Game-changing.',
  'Swap one Arcanum when you level up. Don\'t feel locked in.',
];
