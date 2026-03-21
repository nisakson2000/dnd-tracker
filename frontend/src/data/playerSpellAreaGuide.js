/**
 * playerSpellAreaGuide.js
 * Player Mode: AoE spell shapes, placement, and ally-safe casting
 * Pure JS — no React dependencies.
 */

export const AOE_SHAPES = [
  {
    shape: 'Sphere',
    description: 'Expands from a point you choose. Radius from center.',
    examples: ['Fireball (20ft radius)', 'Spirit Guardians (15ft from you)', 'Hunger of Hadar (20ft)'],
    placement: 'Point of origin = center. You choose where.',
    note: 'Most common AoE. Goes around corners.',
  },
  {
    shape: 'Cone',
    description: 'Triangle from you. Width = length at the far end.',
    examples: ['Burning Hands (15ft)', 'Cone of Cold (60ft)', 'Dragon breath weapons'],
    placement: 'Starts from you. You choose direction.',
    note: 'Gets wider as it goes. 60ft cone is huge at the end.',
  },
  {
    shape: 'Cube',
    description: 'Square area. Origin on one face.',
    examples: ['Thunderwave (15ft cube)', 'Fog Cloud (20ft radius sphere, not cube)'],
    placement: 'You choose which face the origin is on.',
    note: 'Thunderwave: origin on one face = push AWAY from that face.',
  },
  {
    shape: 'Line',
    description: 'Straight line from you. Width usually 5ft.',
    examples: ['Lightning Bolt (100ft x 5ft)', 'Wall of Fire (60ft long, 1ft thick)'],
    placement: 'From you in a direction. Everything in the line is hit.',
    note: 'Position yourself to hit multiple enemies in a line.',
  },
  {
    shape: 'Cylinder',
    description: 'Circle on the ground with height.',
    examples: ['Moonbeam (5ft radius, 40ft tall)', 'Flame Strike (10ft radius, 40ft tall)'],
    placement: 'Choose point on ground. Extends upward.',
    note: 'Hits flying creatures within the column.',
  },
];

export const ALLY_SAFE_SPELLS = {
  alwaysSafe: [
    { spell: 'Spirit Guardians (L3)', why: 'You choose which creatures are affected.', note: 'Allies pass through safely. Enemies take 3d8.' },
    { spell: 'Dawn (L5)', why: 'Choose creatures to exclude from the light.', note: 'Selective sunlight.' },
    { spell: 'Aura of Vitality (L3)', why: 'Heals allies only. Centered on you.', note: 'You choose who to heal each turn.' },
  ],
  selectiveSpells: [
    { spell: 'Evocation Wizard Sculpt Spells', why: 'L2 feature. Choose INT mod creatures to auto-succeed and take no damage.', note: 'Fireball your allies. They take 0 damage. Amazing.' },
    { spell: 'Careful Spell (Sorcerer)', why: '1 SP. Choose CHA mod creatures. They auto-succeed the save.', note: 'Works with Hypnotic Pattern, Fear. Allies save automatically.' },
  ],
  naturallySelective: [
    { spell: 'Hypnotic Pattern (L3)', why: 'Allies can avert their eyes (not RAW but commonly ruled).', note: 'RAW: affects everyone in the area. Careful Spell fixes.' },
    { spell: 'Wall spells', why: 'Place the wall between enemies and allies.', note: 'Walls are selective by placement, not targeting.' },
    { spell: 'Spike Growth (L2)', why: 'Allies can see it and walk around it.', note: 'Place it where enemies will walk, not allies.' },
  ],
};

export const AOE_PLACEMENT_TACTICS = [
  { tactic: 'Edge Fireball', how: 'Place Fireball origin at the edge of enemy group. Maximize targets, minimize ally hits.', note: '20ft radius is HUGE. Often can catch 4-6 enemies.' },
  { tactic: 'Funnel into AoE', how: 'Use Wall spells to funnel enemies through chokepoint covered by AoE.', note: 'Wall of Fire + Spike Growth = devastation.' },
  { tactic: 'Vertical Cylinder', how: 'Moonbeam/Flame Strike hit flying creatures in the column.', note: '40ft tall. Catches hovering enemies.' },
  { tactic: 'Behind Cover AoE', how: 'Fireball goes around corners. Enemies behind cover still get hit.', note: 'AoE spreads around corners (PHB).' },
  { tactic: 'Lightning Bolt Alignment', how: 'Position yourself so enemies line up. 100ft x 5ft is long and thin.', note: 'Rarely hits more than 2-3. But 8d6 to each.' },
  { tactic: 'Spirit Guardians + Melee', how: 'Walk into enemies. They take 3d8 entering or starting in area.', note: 'Move adjacent to as many enemies as possible.' },
];

export const AOE_TIPS = [
  'Fireball: 20ft radius. Goes around corners. The gold standard.',
  'Spirit Guardians: choose who is affected. Walk into enemies.',
  'Sculpt Spells (Evocation Wizard): allies take 0 damage from your AoE.',
  'Careful Spell (Sorcerer): allies auto-save. Great for Hypnotic Pattern.',
  'Wall spells: selective by placement. Split the battlefield.',
  'Lightning Bolt: 100ft line. Position for maximum alignment.',
  'AoE goes around corners. Enemies can\'t hide from Fireball behind a pillar.',
  'Spike Growth: allies can see it, enemies often can\'t. Place wisely.',
  'Cones get wider. 60ft Cone of Cold covers massive area at the end.',
  'Cylinders hit flyers. Moonbeam reaches 40ft up.',
];
