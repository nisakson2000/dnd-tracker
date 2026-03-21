/**
 * playerAberrationHunting.js
 * Player Mode: Fighting aberrations — mind flayers, beholders, and eldritch horrors
 * Pure JS — no React dependencies.
 */

export const ABERRATION_TRAITS = {
  description: 'Alien beings from the Far Realm or Underdark. Defy natural law.',
  commonFeatures: ['Psychic damage/abilities', 'INT-based attacks', 'Unusual movement (float, teleport)', 'Resistance to psychic', 'Often have Magic Resistance'],
  rareTraits: ['Antimagic abilities (Beholder)', 'Mind control (Mind Flayer)', 'Reality warping'],
};

export const KEY_ABERRATIONS = [
  {
    creature: 'Mind Flayer (Illithid)',
    cr: 7,
    danger: 'Mind Blast (60ft cone, 4d8+stun on INT save). Extract Brain (kills grappled stunned target).',
    counter: 'HIGH INT saves. Freedom of Movement. Don\'t get stunned or it\'s instant death. Kill from range.',
    immunities: 'None special. But Magic Resistance.',
  },
  {
    creature: 'Beholder',
    cr: 13,
    danger: 'Antimagic Cone (central eye). 10 eye rays (random). Legendary actions.',
    counter: 'Stay out of the central eye cone. Spread out. Martial characters thrive (not affected by antimagic). Casters attack from behind.',
    immunities: 'Prone (hovering).',
  },
  {
    creature: 'Aboleth',
    cr: 10,
    danger: 'Enslaving (3/day, CHA save). Disease on hit (can\'t breathe air after 1 minute). Legendary actions.',
    counter: 'High CHA saves. Greater Restoration cures disease and enslave. Fight on land if possible (aboleth needs water).',
    immunities: 'None special. Aquatic.',
  },
  {
    creature: 'Intellect Devourer',
    cr: 2,
    danger: 'Devour Intellect: INT save or INT drops to 0 (incapacitated). Then Body Thief: takes over your body.',
    counter: 'HIGH INT. Protection from Evil and Good prevents Body Thief. Kill fast (21 HP).',
    immunities: 'Blinded (blindsight only).',
  },
  {
    creature: 'Gibbering Mouther',
    cr: 2,
    danger: 'Gibbering: WIS save or incapacitated. Ground becomes difficult terrain.',
    counter: 'Ranged attacks. WIS saves. Don\'t engage in melee if possible.',
    immunities: 'Prone (amorphous).',
  },
  {
    creature: 'Elder Brain',
    cr: 14,
    danger: 'Psychic Link (1 mile range). Sense Thoughts. Legendary actions: Tentacle, Break Concentration, Psychic Pulse.',
    counter: 'Kill the Elder Brain to free all thralls. Mind Blank blocks its detection. Very high INT saves needed.',
    immunities: 'None. But massive psychic power.',
  },
];

export const ANTI_ABERRATION_TOOLKIT = [
  { tool: 'Protection from Evil and Good', effect: 'Disadvantage on aberration attacks. Can\'t be charmed/frightened/possessed.', rating: 'S' },
  { tool: 'Mind Blank (8th level)', effect: 'Immune to psychic damage, divination, and charm for 24 hours.', rating: 'S' },
  { tool: 'Intellect Fortress (3rd, Tasha\'s)', effect: 'Resistance to psychic + advantage on INT/WIS/CHA saves. Concentration.', rating: 'A' },
  { tool: 'High INT saves', effect: 'Mind Flayer attacks target INT. Resilient (INT) or high base INT.', rating: 'A' },
  { tool: 'Physical damage', effect: 'Against Beholders: martial attacks bypass Antimagic Cone.', rating: 'S' },
  { tool: 'Banishment', effect: 'Send aberrations back to the Far Realm.', rating: 'A' },
];

export const BEHOLDER_TACTICS = {
  antimagicCone: 'Central eye projects a 150ft cone of antimagic. Anything magical stops working inside it.',
  strategy: [
    'Split the party: martials in front (in the cone), casters behind (outside the cone).',
    'The beholder can only point the cone one direction. Attack from multiple angles.',
    'The beholder\'s OWN eye rays don\'t work in the cone. It must choose: suppress magic OR use rays.',
    'Hide behind total cover to avoid eye rays (they require line of sight).',
    'Focus fire. Beholders have 180 HP. A coordinated party can take one down in 3-4 rounds.',
  ],
};

export function mindBlastDamage(targetCount) {
  return targetCount * 18; // 4d8+stun avg per target
}

export function intSaveChance(intMod, profBonus, isProficient, dc) {
  const bonus = intMod + (isProficient ? profBonus : 0);
  const needed = dc - bonus;
  return Math.min(95, Math.max(5, (21 - needed) * 5));
}
