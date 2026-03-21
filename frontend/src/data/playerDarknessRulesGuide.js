/**
 * playerDarknessRulesGuide.js
 * Player Mode: Light, darkness, vision rules, and tactical use
 * Pure JS — no React dependencies.
 */

export const LIGHT_LEVELS = [
  { level: 'Bright Light', effect: 'Normal vision. No penalties. Most creatures see normally.', sources: ['Sunlight', 'Daylight spell', 'Continual Flame', 'Most torches/lanterns (within radius)'] },
  { level: 'Dim Light', effect: 'Lightly obscured. Disadvantage on Perception checks relying on sight.', sources: ['Dusk/dawn', 'Torch outer radius', 'Moonlight', 'Shadow areas'] },
  { level: 'Darkness', effect: 'Heavily obscured. Effectively blinded: auto-fail sight-based checks, disadvantage on attacks, advantage on attacks against you.', sources: ['Night without moon', 'Unlit dungeons', 'Darkness spell'] },
];

export const VISION_TYPES = [
  { type: 'Normal Vision', range: 'Varies', effect: 'See in bright/dim light normally. Blind in darkness.', races: ['Most humans', 'Dragonborn', 'Halfling'] },
  { type: 'Darkvision', range: '60ft (most)', effect: 'See in darkness as dim light (grayscale). See dim light as bright light. Still have disadvantage on Perception in darkness (treated as dim).', races: ['Dwarf', 'Elf', 'Half-elf', 'Gnome', 'Half-orc', 'Tiefling'] },
  { type: 'Superior Darkvision', range: '120ft', effect: 'Same as darkvision but 120ft range.', races: ['Drow', 'Deep Gnome', 'Duergar', 'Owlin', 'Gloom Stalker'] },
  { type: 'Blindsight', range: 'Varies (usually 10-60ft)', effect: 'Perceive without sight. Immune to blindness within range. Sees invisible creatures.', sources: ['Bat familiar', 'Some monsters', 'Blind Fighting style'] },
  { type: 'Tremorsense', range: 'Varies', effect: 'Detect creatures touching the ground within range.', sources: ['Some monsters', 'Rarely available to PCs'] },
  { type: 'Truesight', range: 'Varies (usually 120ft)', effect: 'See through darkness, invisibility, illusions, shapechangers, ethereal plane.', sources: ['True Seeing spell', 'Some high-level monsters'] },
];

export const DARKVISION_MISCONCEPTIONS = [
  { misconception: 'Darkvision lets you see normally in darkness', truth: 'Darkness becomes dim light (grayscale). You still have disadvantage on Perception checks. You can\'t read in the dark.' },
  { misconception: 'Darkvision negates all darkness penalties', truth: 'Only turns darkness to dim light. Dim light = lightly obscured = Perception disadvantage. You still benefit from light sources.' },
  { misconception: 'The whole party has darkvision so we don\'t need light', truth: 'At least one party member probably doesn\'t. And darkvision = dim light = Perception disadvantage. Torches are still useful.' },
];

export const DARKNESS_SPELL_TACTICS = {
  spell: 'Darkness (L2)',
  effect: '15ft radius sphere of magical darkness. Darkvision can\'t see through it. Lasts 10 min (concentration).',
  combos: [
    { combo: 'Devil\'s Sight + Darkness', who: 'Warlock', effect: 'Devil\'s Sight: see in magical darkness. You see, enemies don\'t. Advantage on attacks, disadvantage for theirs.', rating: 'S', warning: 'ALLIES are also blinded. Communicate positioning.' },
    { combo: 'Shadow Sorcerer + Darkness', who: 'Shadow Sorcerer', effect: 'Can see through own Darkness spell at L3. Same as Devil\'s Sight combo. 2 SP (no slot).', rating: 'S' },
    { combo: 'Blind Fighting + Darkness', who: 'Fighter/Paladin/Ranger', effect: 'Blind Fighting style: 10ft blindsight. See in Darkness within 10ft. Attack normally at close range.', rating: 'A' },
    { combo: 'Darkness as cover', who: 'Any', effect: 'Cast Darkness between you and ranged enemies. They can\'t target you (total cover from vision).', rating: 'A' },
  ],
  counters: ['Dispel Magic', 'Daylight spell (L3+ magical light dispels Darkness)', 'Truesight', 'Blindsight', 'Tremorsense'],
};

export const LIGHT_SPELLS = [
  { spell: 'Light', level: 0, duration: '1 hour', radius: '20ft bright + 20ft dim', note: 'Free light cantrip. Cast on a pebble. Throw it.' },
  { spell: 'Dancing Lights', level: 0, duration: '1 min (concentration)', radius: '4 lights, 10ft dim each', note: 'Concentration makes it worse than Light. But can move lights.' },
  { spell: 'Continual Flame', level: 2, duration: 'Permanent', radius: '20ft bright + 20ft dim', cost: '50gp ruby dust', note: 'Permanent light. 50gp one-time cost. Can be covered to turn off.' },
  { spell: 'Daylight', level: 3, duration: '1 hour', radius: '60ft bright + 60ft dim', note: 'Massive radius. Dispels magical darkness of L3 or lower. NOT sunlight (doesn\'t hurt vampires).' },
];

export function canSeeInDarkness(hasDarkvision, darkvisionRange, distanceToTarget) {
  if (!hasDarkvision) return 'Blind (heavily obscured)';
  if (distanceToTarget <= darkvisionRange) return 'Dim light (lightly obscured, disadvantage on Perception)';
  return 'Blind (beyond darkvision range)';
}

export function effectiveACInDarkness(baseAC, canSeeTarget, targetCanSeeYou) {
  // Unseen attacker: advantage. Unseen defender: disadvantage on attacks against.
  if (!canSeeTarget && !targetCanSeeYou) return baseAC; // both blind, cancels out
  if (!targetCanSeeYou) return baseAC + 5; // effective AC boost (attacker has disadvantage)
  return baseAC;
}
