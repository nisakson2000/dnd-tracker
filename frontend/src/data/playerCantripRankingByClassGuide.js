/**
 * playerCantripRankingByClassGuide.js
 * Player Mode: Best cantrips ranked by class — damage, utility, and must-haves
 * Pure JS — no React dependencies.
 */

export const CANTRIP_SCALING = {
  levels: [
    { level: '1-4', dice: '1 die', note: 'Base damage.' },
    { level: '5-10', dice: '2 dice', note: 'First scaling. Matches Extra Attack.' },
    { level: '11-16', dice: '3 dice', note: 'Second scaling.' },
    { level: '17-20', dice: '4 dice', note: 'Final scaling. 4d10 Fire Bolt = 22 avg.' },
  ],
  rule: 'Cantrips scale with CHARACTER level, not class level. Great for multiclass.',
};

export const DAMAGE_CANTRIPS_RANKED = [
  { cantrip: 'Eldritch Blast', class: 'Warlock', damage: '1d10 force per beam', rating: 'S+', note: 'Best cantrip. Multiple beams. Agonizing Blast adds CHA to each.' },
  { cantrip: 'Toll the Dead', class: 'Cleric/Wizard', damage: '1d8/1d12 necrotic', rating: 'S', note: 'WIS save. d12 if already damaged. Best save-based cantrip.' },
  { cantrip: 'Fire Bolt', class: 'Wizard/Sorcerer', damage: '1d10 fire', rating: 'A+', note: 'Best ranged attack cantrip (non-EB). 120ft range.' },
  { cantrip: 'Booming Blade', class: 'Melee casters', damage: 'Weapon + 1d8 thunder (if moves)', rating: 'S+', note: 'Best melee cantrip. Punishes movement.' },
  { cantrip: 'Green-Flame Blade', class: 'Melee casters', damage: 'Weapon + fire splash to adjacent', rating: 'A+', note: 'Good when enemies cluster.' },
  { cantrip: 'Mind Sliver', class: 'Wizard/Sorcerer', damage: '1d6 psychic', rating: 'S', note: '-1d4 to next save. Set up ally\'s save-or-suck.' },
  { cantrip: 'Sacred Flame', class: 'Cleric', damage: '1d8 radiant', rating: 'A', note: 'DEX save. Ignores cover.' },
  { cantrip: 'Chill Touch', class: 'Wizard/Sorcerer/Warlock', damage: '1d8 necrotic', rating: 'A', note: 'Prevents healing. Anti-undead.' },
  { cantrip: 'Vicious Mockery', class: 'Bard', damage: '1d4 psychic', rating: 'A (utility)', note: 'Disadvantage on next attack. Defensive.' },
  { cantrip: 'Word of Radiance', class: 'Cleric', damage: '1d6 radiant (AoE)', rating: 'A', note: 'All creatures within 5ft. Melee Cleric AoE.' },
];

export const UTILITY_CANTRIPS_RANKED = [
  { cantrip: 'Guidance', class: 'Cleric/Druid', effect: '+1d4 to ability check', rating: 'S+', note: 'Best utility cantrip. Cast before EVERY check.' },
  { cantrip: 'Mage Hand', class: 'Wizard/Sorcerer/others', effect: 'Spectral hand at 30ft', rating: 'S', note: 'Disarm traps, grab items, open doors.' },
  { cantrip: 'Prestidigitation', class: 'Wizard/Sorcerer', effect: 'Minor magical effects', rating: 'S', note: 'Infinite creative uses.' },
  { cantrip: 'Minor Illusion', class: 'Many', effect: 'Sound or 5ft cube image', rating: 'S', note: 'Hide inside image. Distractions.' },
  { cantrip: 'Light', class: 'Many', effect: 'Bright light 20ft', rating: 'A+', note: 'Essential for non-Darkvision.' },
  { cantrip: 'Mending', class: 'Many', effect: 'Repair break/tear', rating: 'A', note: 'Fix equipment.' },
  { cantrip: 'Shape Water', class: 'Druid/Wizard/Sorcerer', effect: 'Move/freeze/shape water', rating: 'A+', note: 'Freeze = bridge. Creative uses.' },
  { cantrip: 'Message', class: 'Wizard/Sorcerer/Bard', effect: 'Whispered message 120ft', rating: 'A', note: 'Silent communication.' },
];

export const CANTRIPS_BY_CLASS = {
  wizard: { mustHave: ['Fire Bolt', 'Mind Sliver', 'Mage Hand', 'Prestidigitation', 'Minor Illusion'] },
  sorcerer: { mustHave: ['Fire Bolt or Toll the Dead', 'Mind Sliver', 'Prestidigitation', 'Mage Hand'] },
  cleric: { mustHave: ['Guidance', 'Toll the Dead', 'Sacred Flame', 'Light or Thaumaturgy'] },
  druid: { mustHave: ['Guidance', 'Produce Flame', 'Shape Water or Thorn Whip'] },
  warlock: { mustHave: ['Eldritch Blast', 'Minor Illusion or Prestidigitation'] },
  bard: { mustHave: ['Vicious Mockery', 'Mage Hand (Magical Secrets)'] },
  artificer: { mustHave: ['Guidance', 'Fire Bolt', 'Mending'] },
};

export const CANTRIP_TIPS = [
  'Guidance: cast before EVERY ability check. +1d4 average = +2.5.',
  'Eldritch Blast: best cantrip. Multiple beams for forced movement.',
  'Booming Blade: best melee cantrip. Replaces Extra Attack for casters.',
  'Mind Sliver: -1d4 to next save. Cast before ally\'s Hold Person.',
  'Toll the Dead: d12 if damaged. Best save cantrip damage.',
  'Cantrips scale with CHARACTER level. Multiclass keeps full scaling.',
  'Take at least 1 damage cantrip and 1 utility cantrip.',
  'Minor Illusion: 5ft cube. You can hide inside the image.',
];
