/**
 * playerRacialCombatFeatures.js
 * Player Mode: Racial features that affect combat — often forgotten but impactful
 * Pure JS — no React dependencies.
 */

export const RACIAL_COMBAT_FEATURES = {
  Elf: [
    { feature: 'Fey Ancestry', effect: 'Advantage on saves vs charm. Immune to magical sleep.', combatUse: 'Resist Hypnotic Pattern, Crown of Madness, Dominate.' },
    { feature: 'Trance', effect: '4 hours of meditation instead of 8 hours sleep.', combatUse: 'Take longer watches. More flexible rest scheduling.' },
    { feature: 'Darkvision', effect: '60ft. See in darkness as dim light.', combatUse: 'Fight in darkness without Light cantrip.' },
  ],
  'High Elf': [
    { feature: 'Cantrip', effect: 'One Wizard cantrip (INT-based).', combatUse: 'Free cantrip. Booming Blade for melee fighters. Fire Bolt for ranged.' },
  ],
  'Wood Elf': [
    { feature: 'Fleet of Foot', effect: '35ft base speed.', combatUse: '+5ft movement. Compounding with Dash.' },
    { feature: 'Mask of the Wild', effect: 'Hide in light obscurement (rain, fog, foliage).', combatUse: 'Much easier to hide outdoors. Ambush from natural cover.' },
  ],
  Dwarf: [
    { feature: 'Dwarven Resilience', effect: 'Advantage on saves vs poison. Resistance to poison damage.', combatUse: 'Half damage from poison and advantage on poison saves. Very common damage type for monsters.' },
    { feature: 'Darkvision', effect: '60ft.', combatUse: 'See in darkness.' },
    { feature: 'Stonecunning', effect: 'Double proficiency on History checks about stonework.', combatUse: 'Identify dungeon traps and construction weaknesses.' },
  ],
  'Mountain Dwarf': [
    { feature: 'Dwarven Armor Training', effect: 'Light and medium armor proficiency.', combatUse: 'Wizards/Sorcerers in medium armor. AC 15+ without spells.' },
  ],
  Halfling: [
    { feature: 'Lucky', effect: 'Reroll natural 1s on attacks, checks, and saves.', combatUse: 'Never fumble an important attack. Extremely consistent.' },
    { feature: 'Brave', effect: 'Advantage on saves vs being frightened.', combatUse: 'Resist dragon frightful presence, Fear spell, etc.' },
    { feature: 'Naturally Stealthy', effect: 'Hide behind Medium or larger creatures.', combatUse: 'Hide behind allies in combat for Cunning Action hide.' },
  ],
  Gnome: [
    { feature: 'Gnome Cunning', effect: 'Advantage on INT, WIS, CHA saves vs magic.', combatUse: 'INCREDIBLE. Advantage vs most save-or-suck spells. One of the best racial features in the game.' },
  ],
  'Half-Orc': [
    { feature: 'Relentless Endurance', effect: 'Drop to 1 HP instead of 0, once per long rest.', combatUse: 'Free death save. Stay conscious and fighting.' },
    { feature: 'Savage Attacks', effect: 'Extra weapon damage die on critical hits.', combatUse: 'Crit with greatsword: 3d6 instead of 2d6 extra dice.' },
  ],
  Tiefling: [
    { feature: 'Hellish Resistance', effect: 'Resistance to fire damage.', combatUse: 'Half damage from Fireball, fire breath, lava. Very common damage type.' },
    { feature: 'Hellish Rebuke', effect: '2d10 fire damage as reaction when hit (1/day).', combatUse: 'Free damage when you\'re attacked. No spell slot needed.' },
  ],
  Dragonborn: [
    { feature: 'Breath Weapon', effect: 'AoE damage (type based on ancestry). Scales with level.', combatUse: 'Free AoE attack. Good at low levels. Falls off at higher levels.' },
    { feature: 'Damage Resistance', effect: 'Resistance to breath weapon damage type.', combatUse: 'Half damage from your element. Useful if matching common damage types (fire, cold, lightning).' },
  ],
  Aasimar: [
    { feature: 'Healing Hands', effect: 'Heal a creature for your level in HP. Once per long rest.', combatUse: 'Free healing without spell slots. Any class.' },
    { feature: 'Celestial Resistance', effect: 'Resistance to necrotic and radiant damage.', combatUse: 'Two rare resistance types. Good against undead and divine enemies.' },
  ],
  Harengon: [
    { feature: 'Hare-Trigger', effect: 'Add proficiency bonus to initiative rolls.', combatUse: 'Best initiative racial feature. +2 to +6 initiative. Go first more often.' },
    { feature: 'Rabbit Hop', effect: 'Bonus action jump without provoking OAs.', combatUse: 'Free Disengage-like movement. Number of uses = proficiency bonus.' },
  ],
};

export const FORGOTTEN_RACIAL_FEATURES = [
  'Gnome Cunning: Advantage on ALL INT/WIS/CHA saves vs MAGIC. This is the best defensive racial.',
  'Halfling Lucky: Rerolling nat 1s sounds small but it removes ~5% of auto-fails.',
  'Fey Ancestry (Elf/Half-Elf): Advantage vs charm includes Hypnotic Pattern, a very common spell.',
  'Dwarf Poison Resistance: Poison is a common monster damage type. Half damage adds up.',
  'Half-Orc Relentless: Free pseudo-death-save once per long rest. Keeps you fighting.',
  'Tiefling Fire Resistance: Fire is the most common elemental damage type. Half damage from Fireball.',
  'Mountain Dwarf Armor: Free medium armor on a Wizard is AC 17 with half plate.',
];

export function getRacialFeatures(race) {
  return RACIAL_COMBAT_FEATURES[race] || [];
}

export function getAllRacialDefenses() {
  const defenses = [];
  for (const [race, features] of Object.entries(RACIAL_COMBAT_FEATURES)) {
    for (const f of features) {
      if (f.effect.toLowerCase().includes('resistance') || f.effect.toLowerCase().includes('advantage on save')) {
        defenses.push({ race, ...f });
      }
    }
  }
  return defenses;
}
