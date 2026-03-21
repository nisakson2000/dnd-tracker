/**
 * playerBestCantripsByClassGuide.js
 * Player Mode: Best cantrips for each class
 * Pure JS — no React dependencies.
 */

export const CANTRIPS_BY_CLASS = {
  wizard: [
    { cantrip: 'Fire Bolt', damage: '1d10 fire', range: 120, rating: 'A+', note: 'Default damage. Long range. Fire resistance is the downside.' },
    { cantrip: 'Minor Illusion', damage: 'None', rating: 'S', note: 'Create a sound or image. Unlimited creative utility.' },
    { cantrip: 'Prestidigitation', damage: 'None', rating: 'A+', note: 'Swiss army knife cantrip. Light, clean, flavor, ignite.' },
    { cantrip: 'Mage Hand', damage: 'None', rating: 'A', note: 'Interact with objects at 30ft. Trigger traps, grab items.' },
    { cantrip: 'Toll the Dead', damage: '1d12 necrotic (damaged)', range: 60, rating: 'A+', note: 'WIS save. 1d12 on damaged targets. Better damage type than fire.' },
    { cantrip: 'Booming Blade', damage: 'Weapon + 1d8 thunder (on move)', range: 5, rating: 'S (melee)', note: 'Bladesinger/EK. Punishes movement.' },
    { cantrip: 'Mind Sliver', damage: '1d6 psychic', range: 60, rating: 'A+', note: 'INT save + target takes -1d4 on next save. Setup for Hold Person.' },
  ],
  cleric: [
    { cantrip: 'Guidance', damage: 'None', rating: 'S+', note: 'Add 1d4 to any ability check. Cast before EVERY check.' },
    { cantrip: 'Sacred Flame', damage: '1d8 radiant', range: 60, rating: 'A', note: 'DEX save. Ignores cover. Radiant rarely resisted.' },
    { cantrip: 'Toll the Dead', damage: '1d12 necrotic (damaged)', range: 60, rating: 'A+', note: 'Better damage than Sacred Flame. WIS save.' },
    { cantrip: 'Word of Radiance', damage: '1d6 radiant', range: 5, rating: 'A (melee)', note: 'AoE melee cantrip. CON save. Good for Spirit Guardians build.' },
    { cantrip: 'Thaumaturgy', damage: 'None', rating: 'A', note: 'RP cantrip. Booming voice, trembling ground, flickering flames.' },
  ],
  warlock: [
    { cantrip: 'Eldritch Blast', damage: '1d10 force', range: 120, rating: 'S+', note: 'THE Warlock cantrip. Multiple beams + invocations.' },
    { cantrip: 'Minor Illusion', damage: 'None', rating: 'S', note: 'Creative utility. Sound + image.' },
    { cantrip: 'Prestidigitation', damage: 'None', rating: 'A', note: 'General utility.' },
  ],
  sorcerer: [
    { cantrip: 'Fire Bolt', damage: '1d10 fire', range: 120, rating: 'A+', note: 'Standard damage cantrip.' },
    { cantrip: 'Mind Sliver', damage: '1d6 psychic', range: 60, rating: 'A+', note: '-1d4 on next save. Combo with Quickened control spell.' },
    { cantrip: 'Prestidigitation', damage: 'None', rating: 'A+', note: 'Utility.' },
    { cantrip: 'Minor Illusion', damage: 'None', rating: 'S', note: 'Creative utility.' },
    { cantrip: 'Booming Blade', damage: 'Weapon + thunder', range: 5, rating: 'A (gish)', note: 'Melee Sorcerer/multiclass.' },
  ],
  druid: [
    { cantrip: 'Guidance', damage: 'None', rating: 'S+', note: '+1d4 to any check. Best cantrip.' },
    { cantrip: 'Thorn Whip', damage: '1d6 piercing', range: 30, rating: 'A+', note: 'Pulls target 10ft toward you. Spike Growth combo.' },
    { cantrip: 'Produce Flame', damage: '1d8 fire', range: 30, rating: 'A', note: 'Damage + light source.' },
    { cantrip: 'Shillelagh', damage: '1d8+WIS', range: 5, rating: 'A (melee)', note: 'WIS-based melee. Great for melee Druids.' },
  ],
  bard: [
    { cantrip: 'Vicious Mockery', damage: '1d4 psychic', range: 60, rating: 'A', note: 'Low damage BUT disadvantage on next attack. Defensive.' },
    { cantrip: 'Minor Illusion', damage: 'None', rating: 'S', note: 'Creative utility. Sound + image.' },
    { cantrip: 'Prestidigitation (via Magical Secrets)', damage: 'None', rating: 'A+', note: 'If accessible.' },
  ],
};

export const UNIVERSAL_BEST_CANTRIPS = [
  { cantrip: 'Guidance', rating: 'S+', note: 'Best cantrip in the game. +1d4 to ANY ability check.' },
  { cantrip: 'Minor Illusion', rating: 'S', note: 'Infinite creative problem-solving.' },
  { cantrip: 'Eldritch Blast', rating: 'S+ (Warlock)', note: 'Best damage cantrip with invocations.' },
  { cantrip: 'Prestidigitation', rating: 'A+', note: 'Swiss army knife utility.' },
  { cantrip: 'Mage Hand', rating: 'A', note: 'Remote interaction. Trap triggering.' },
  { cantrip: 'Toll the Dead', rating: 'A+', note: 'Best non-EB damage cantrip. 1d12 on damaged targets.' },
  { cantrip: 'Mind Sliver', rating: 'A+', note: 'Debuff + damage. Combo enabler.' },
  { cantrip: 'Booming Blade', rating: 'S (melee builds)', note: 'Best melee cantrip. Punishes movement.' },
];
