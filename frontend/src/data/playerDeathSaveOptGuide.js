/**
 * playerDeathSaveOptGuide.js
 * Player Mode: Death saves — rules, optimization, and party rescue tactics
 * Pure JS — no React dependencies.
 */

export const DEATH_SAVE_RULES = {
  trigger: 'When you start your turn at 0 HP.',
  dc: 'DC 10 flat d20 roll. No modifiers (usually).',
  success: '3 successes = stabilize (1 HP after 1d4 hours).',
  failure: '3 failures = death.',
  nat20: 'Regain 1 HP + consciousness. Reset all death saves.',
  nat1: 'Counts as 2 failures.',
  damage: 'Taking damage at 0 HP = 1 death save failure. Crit = 2 failures.',
  melee: 'Melee attacks against unconscious creatures within 5ft auto-crit.',
  note: 'Death saves are HIDDEN (RAW). Only the player knows their count.',
};

export const DEATH_SAVE_MODIFIERS = [
  { modifier: 'Aura of Protection (Paladin)', effect: '+CHA to death saves (it\'s a saving throw).', rating: 'S+', note: '+5 to death saves. DC 10 becomes trivial.' },
  { modifier: 'Bless', effect: '+1d4 to death saves.', rating: 'S', note: 'Must be cast BEFORE going down. Concentration.' },
  { modifier: 'Beacon of Hope', effect: 'Advantage on death saves.', rating: 'S', note: 'Must be cast before going down. 3rd level Cleric spell.' },
  { modifier: 'Diamond Soul (Monk L14)', effect: 'Proficiency in all saves. Spend 1 ki to reroll.', rating: 'S', note: '+PB to death saves. Ki reroll if you fail.' },
  { modifier: 'Lucky feat', effect: 'Add a Lucky die to death save roll.', rating: 'A+', note: 'Effectively advantage on death saves. Limited uses.' },
  { modifier: 'Halfling Luck', effect: 'Reroll natural 1s on death saves.', rating: 'A+', note: 'Natural 1 = 2 failures. Rerolling it is huge.' },
  { modifier: 'Inspiration (DM)', effect: 'Spend inspiration for advantage on death save.', rating: 'A', note: 'If you have inspiration saved.' },
];

export const RESCUE_METHODS_RANKED = [
  { method: 'Healing Word', action: 'BA + 60ft range. Bring ally to 1+ HP.', rating: 'S+', note: 'Best rescue spell. BA lets you still attack. Long range.' },
  { method: 'Lay on Hands (1 HP)', action: 'Action + touch. 1 HP from pool revives.', rating: 'S', note: 'Only costs 1 HP from pool. Very efficient.' },
  { method: 'Spare the Dying', action: 'Action + touch (or 30ft for Grave Cleric). Stabilize.', rating: 'A', note: 'Stabilizes but doesn\'t wake up. No HP restored.' },
  { method: 'Healer feat + kit', action: 'Action + touch. Restore 1d6+4+HD HP.', rating: 'A+', note: 'No spell slot needed. Good for non-casters.' },
  { method: 'Goodberry', action: 'Action + touch. Feed berry for 1 HP.', rating: 'A+', note: 'Cast before combat. Feed berry to downed ally. 1 HP wakes them.' },
  { method: 'Cure Wounds', action: 'Action + touch. 1d8+MOD HP.', rating: 'A', note: 'Action + touch. Healing Word is usually better for rescue.' },
  { method: 'Potion of Healing', action: 'Action (administer) + touch. 2d4+2 HP.', rating: 'A', note: 'No spell slot. Anyone can do it. Costs gold.' },
  { method: 'Medicine check (DC 10)', action: 'Action + touch. Stabilize.', rating: 'B', note: 'Last resort. Stabilize only, no HP.' },
];

export const DEATH_SAVE_TIPS = [
  'Healing Word is the #1 rescue spell. BA, 60ft range. Always have it prepared.',
  'Getting someone from 0 to 1 HP is more impactful than any other heal.',
  'RAW: death saves are secret. Only the player sees their count.',
  'Melee attacks on unconscious within 5ft auto-crit = 2 death save failures.',
  'Don\'t risk stabilizing with Medicine when a 1 HP heal wakes them up.',
  'Aura of Protection applies to death saves. Paladin saves lives by existing.',
  'Bless applies to death saves if cast before going down. Remember this.',
  'Damage at 0 HP = failure. Massive damage (2× max HP remaining) = instant death.',
  'Stabilized ≠ conscious. They regain 1 HP after 1d4 hours.',
  'Natural 20: wake up at 1 HP. Natural 1: 2 failures. Incredibly swingy.',
];
