/**
 * playerVampireHunting.js
 * Player Mode: Hunting vampires — weaknesses, tactics, and preparation
 * Pure JS — no React dependencies.
 */

export const VAMPIRE_STATS = {
  cr: 13,
  ac: 16,
  hp: 144,
  speed: '30ft',
  resistances: 'Necrotic. Bludgeoning/piercing/slashing from nonmagical attacks.',
  legendaryResistance: '3/day',
  legendaryActions: 3,
  regeneration: '20 HP/turn (unless in sunlight or running water, or took radiant damage).',
  shapechange: 'Bat, mist, or wolf form at will.',
  spiderClimb: 'Walk on walls and ceilings.',
  charmGaze: 'Target WIS DC 17 or charmed. Repeat save if you or allies harm the target.',
};

export const VAMPIRE_WEAKNESSES = [
  { weakness: 'Sunlight', effect: 'Disadvantage on attacks/checks. Takes 20 radiant damage per turn. No regeneration.', counter: 'Dawn spell (5th), Sunbeam (6th), Sunburst (8th). Or just fight during the day.' },
  { weakness: 'Running Water', effect: 'Takes 20 acid damage if ending turn in running water. No regeneration.', counter: 'Fight near rivers. Create Water + Gust/Tidal Wave to force into water.' },
  { weakness: 'Stake to the Heart', effect: 'While incapacitated in coffin: stake = paralyzed until removed.', counter: 'Find the coffin. Reduce to 0 HP. It mist-forms to coffin. Follow and stake.' },
  { weakness: 'Radiant Damage', effect: 'Stops regeneration for 1 turn. No resistance to radiant.', counter: 'Spirit Guardians, Guiding Bolt, Sacred Flame, Holy Water, Sun weapons.' },
  { weakness: 'Holy Symbols', effect: 'Must make DC 10 + CHA WIS save or be turned (as Turn Undead).', counter: 'Cleric presents holy symbol. Works like Turn Undead.' },
  { weakness: 'Must enter coffin', effect: 'When at 0 HP, turns to mist and flies to coffin. Must rest 1 hour. If can\'t reach coffin: destroyed.', counter: 'Find and destroy coffin BEFORE the fight. Or block path to coffin.' },
  { weakness: 'Invitation rule', effect: 'Can\'t enter a residence without invitation.', counter: 'Lure it outside. Fight in a house it hasn\'t been invited into.' },
];

export const VAMPIRE_HUNTING_PREP = [
  { item: 'Holy Water', cost: '25 gp', note: '2d6 radiant. Stops regen. Anyone can use.' },
  { item: 'Silvered weapons', cost: '+100 gp', note: 'Bypass resistance. Essential for martials.' },
  { item: 'Wooden Stakes', cost: 'Free', note: 'For the coffin kill. Carry several.' },
  { item: 'Mirrors', cost: '5 gp', note: 'Vampires have no reflection. Detection tool.' },
  { item: 'Garlic', cost: 'Trivial', note: 'Folklore. No mechanical effect in 5e unless DM rules otherwise.' },
  { item: 'Protection from Evil and Good', cost: '1st level slot', note: 'Charm immunity. Disadvantage on vampire\'s attacks.' },
];

export const ANTI_VAMPIRE_SPELLS = [
  { spell: 'Dawn (5th)', class: 'Cleric/Wizard', effect: '30ft cylinder of sunlight. 4d10 radiant. Counts as SUNLIGHT. Devastating to vampires.' },
  { spell: 'Sunbeam (6th)', class: 'Druid/Sorcerer/Wizard', effect: '60ft line of sunlight. 6d8 radiant. Disadvantage for undead.' },
  { spell: 'Spirit Guardians (3rd)', class: 'Cleric', effect: '3d8 radiant/turn. Stops regen. AoE control.' },
  { spell: 'Daylight (3rd)', class: 'Cleric/Druid/Sorcerer/Ranger/Paladin', effect: 'Bright light 60ft. NOT sunlight (doesn\'t trigger sunlight weakness). Still useful for darkness.' },
  { spell: 'Protection from Evil and Good (1st)', class: 'Cleric/Paladin/Warlock/Wizard', effect: 'Immune to charm. Disadvantage on vampire attacks against you.' },
  { spell: 'Hallow (5th)', class: 'Cleric', effect: 'Consecrate area. Choose extra effect: Courage (immune to frightened), Tongues, etc.' },
];

export const VAMPIRE_SPAWN = {
  cr: 5,
  hp: 82,
  note: 'Weaker version. No Legendary Resistance/Actions. Regeneration 10 instead of 20.',
  key: 'Controlled by vampire creator. Kill the master vampire = spawn freed (but still undead).',
  danger: 'Vampire sends spawn as expendable minions. Can create more by killing humanoids.',
};

export function vampireRegenBlocked(tookRadiant, inSunlight, inRunningWater) {
  return tookRadiant || inSunlight || inRunningWater;
}

export function effectiveDPRvsVampire(dpr, isRadiant, isMagical) {
  let effective = dpr;
  if (!isMagical && !isRadiant) effective *= 0.5; // resistance
  if (!isRadiant) effective -= 20; // regen 20/turn
  return Math.max(0, effective);
}
