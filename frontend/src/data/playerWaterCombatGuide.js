/**
 * playerWaterCombatGuide.js
 * Player Mode: Underwater and water-based combat rules and tactics
 * Pure JS — no React dependencies.
 */

export const UNDERWATER_COMBAT_RULES = {
  meleeAttacks: {
    rule: 'Melee weapon attacks have DISADVANTAGE unless using a dagger, javelin, shortsword, spear, or trident.',
    reason: 'Water resistance makes slashing/bludgeoning weapons unwieldy.',
    exception: 'Creatures with swim speed are not affected by this penalty.',
  },
  rangedAttacks: {
    rule: 'Ranged weapon attacks auto-miss beyond normal range. Within normal range: disadvantage.',
    reason: 'Projectiles lose velocity in water.',
    exception: 'Crossbow, net, and thrown weapons (javelin, dart, etc.) work at normal range with disadvantage.',
  },
  spells: {
    rule: 'Fire-based spells may be affected (DM discretion). Most spells work normally.',
    common: 'Fireball: often functions but DM may rule reduced damage or steam cloud. Lightning spells may affect a larger area.',
    note: 'RAW, spells work normally underwater unless they specify otherwise.',
  },
  movement: {
    rule: 'Swim speed or Athletics check to swim. Without swim speed, use half movement.',
    difficult: 'Swimming without a swim speed is effectively difficult terrain.',
  },
  breathing: {
    rule: 'Hold breath: CON modifier + 1 minutes (minimum 30 seconds). After: CON mod rounds, then 0 HP.',
    spells: ['Water Breathing (ritual, 24 hours, 10 targets)', 'Alter Self (self, gills)'],
  },
};

export const UNDERWATER_SPELL_INTERACTIONS = [
  { spell: 'Fireball', ruling: 'DM dependent. RAW: works normally. Many DMs create steam cloud (heavily obscured) instead of fire.', recommendation: 'Ask your DM before relying on fire spells underwater.' },
  { spell: 'Lightning Bolt', ruling: 'RAW: works normally. Many DMs rule it conducts through water, hitting everything in a larger area.', recommendation: 'Could be amazing or dangerous to allies. Clarify with DM.' },
  { spell: 'Thunderwave', ruling: 'RAW: works normally. Sound travels well in water. Push effect may be enhanced.', recommendation: 'Generally works well underwater.' },
  { spell: 'Fog Cloud', ruling: 'Underwater equivalent: ink cloud or murky water. Same mechanical effect.', recommendation: 'Flavor changes but mechanics stay.' },
  { spell: 'Create/Destroy Water', ruling: 'Creating water underwater is redundant. Destroying water creates an air pocket.', recommendation: 'Air pocket could be useful for non-water-breathers.' },
  { spell: 'Control Water', ruling: 'Extremely powerful. Part Water creates a dry path. Whirlpool is devastating.', recommendation: 'Best spell for underwater encounters. Period.' },
];

export const WATER_COMBAT_TACTICS = [
  { tactic: 'Secure breathing first', description: 'Water Breathing (ritual) before entering water. 24 hours, 10 creatures. No excuses.', priority: 1 },
  { tactic: 'Use piercing weapons', description: 'Daggers, javelins, spears, tridents work without disadvantage. Switch before diving.', priority: 1 },
  { tactic: 'Ranged is weak', description: 'Most ranged weapons auto-miss beyond normal range. Spells are your ranged option.', priority: 2 },
  { tactic: 'Grapple + drown', description: 'If you can breathe and they can\'t, grapple them underwater. They suffocate.', priority: 2 },
  { tactic: 'Control Water dominance', description: 'Part Water creates dry zone = no water penalties. Whirlpool = AoE + restrained.', priority: 3 },
  { tactic: '3D movement', description: 'Combat is 3D underwater. Enemies can be above and below. Watch all directions.', priority: 3 },
  { tactic: 'Freedom of Movement', description: 'Ignore difficult terrain (swimming), can\'t be restrained or grappled by water creatures.', priority: 2 },
];

export const AQUATIC_THREATS = [
  { creature: 'Sahuagin', danger: 'Pack tactics + blood frenzy (advantage when target is below max HP)', counter: 'Focus fire to reduce numbers. They\'re fragile individually.' },
  { creature: 'Aboleth', danger: 'Enslave (psychic domination), mucus cloud, lair actions', counter: 'WIS saves are critical. Mind Blank or high WIS party. Don\'t fight in its lair.' },
  { creature: 'Kraken', danger: 'Legendary creature. Lightning Storm, tentacles, swallow.', counter: 'DON\'T fight underwater if possible. Freedom of Movement is critical.' },
  { creature: 'Dragon Turtle', danger: 'Steam breath (15d6), 341 HP, swim speed 40ft', counter: 'Fire/steam resistance. Fight at range. Or negotiate (they can speak).' },
  { creature: 'Merrow', danger: 'Harpoon (pull 20ft toward them), swim speed 40ft', counter: 'Freedom of Movement prevents pull. Kill at range before they close.' },
  { creature: 'Sea Hag', danger: 'Horrific Appearance (frightened), Death Glare (drop to 0 HP if frightened)', counter: 'Don\'t fail the WIS save. Heroes\' Feast immunity. Kill her fast.' },
];

export function canFightUnderwater(hasSwimSpeed, hasWaterBreathing) {
  if (hasSwimSpeed && hasWaterBreathing) return { ready: true, penalties: 'None. Full combat capability.' };
  if (hasWaterBreathing && !hasSwimSpeed) return { ready: true, penalties: 'Half speed. Melee disadvantage with most weapons.' };
  if (!hasWaterBreathing) return { ready: false, penalties: 'Drowning risk. Limited combat time. Get Water Breathing ASAP.' };
  return { ready: false, penalties: 'Multiple penalties. Prepare before entering water.' };
}

export function effectiveWeaponsUnderwater() {
  return ['Dagger', 'Javelin', 'Shortsword', 'Spear', 'Trident', 'Net'];
}
