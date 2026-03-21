/**
 * playerCounterplayGuide.js
 * Player Mode: How to counter common enemy tactics and abilities
 * Pure JS — no React dependencies.
 */

export const COUNTER_ENEMY_CASTERS = [
  { threat: 'Enemy Spellcaster', counters: ['Counterspell (reaction)', 'Silence (20ft, no V spells)', 'Grapple (prevents somatic)', 'Focus fire (low HP/AC)', 'Mage Slayer feat'], note: 'Casters are fragile. Rush them.' },
  { threat: 'Enemy Concentration', counters: ['Magic Missile (3 guaranteed saves)', 'Multi-attack (more saves)', 'Any damage forces DC 10 or half damage save'], note: 'Break concentration = end their best spell.' },
  { threat: 'Counterspell War', counters: ['Subtle Spell (no V/S = can\'t be countered)', 'Cast from out of range (60ft)', 'Use non-spell abilities instead', 'Counter their Counterspell with your Counterspell'], note: 'Yes, you can Counterspell a Counterspell.' },
];

export const COUNTER_PHYSICAL_THREATS = [
  { threat: 'Multi-attack Brutes', counters: ['High AC (Shield, Shield spell)', 'Mirror Image', 'Blur (disadvantage)', 'Dodge action if tanking'], note: 'More attacks = more chances to miss. Stack AC.' },
  { threat: 'Grapple/Restrain', counters: ['Misty Step (teleport, no check)', 'Freedom of Movement (immune)', 'Acrobatics/Athletics to escape', 'Enlarge to break size limit'], note: 'Misty Step: best escape. No check needed.' },
  { threat: 'Pack Tactics (advantage)', counters: ['Kill one to break pair', 'AoE to thin numbers', 'Wall spells to separate', 'Frightened condition (can\'t approach)'], note: 'Pack Tactics requires ally adjacent. Remove the ally.' },
  { threat: 'Swarm of Minions', counters: ['Fireball / AoE', 'Spirit Guardians', 'Hypnotic Pattern', 'Wall spells to block', 'Caltrops/Ball Bearings'], note: 'AoE is king against many weak enemies.' },
  { threat: 'Flying Enemies', counters: ['Earthbind (ground them)', 'Ranged attacks/spells', 'Fly spell (meet them up there)', 'Hold Person/Monster (fall damage)'], note: 'Stunned/paralyzed flying creatures fall. Bonus damage.' },
];

export const COUNTER_SPECIAL_ABILITIES = [
  { threat: 'Regeneration (Troll)', counters: ['Fire damage stops troll regen', 'Acid damage stops troll regen', 'Read the ability for what stops it'], note: 'ALWAYS check what stops regeneration. It varies by creature.' },
  { threat: 'Magic Resistance', counters: ['Attack roll spells (not saves)', 'No-save spells (Magic Missile, Forcecage)', 'Physical damage from martials', 'Spells without saving throws'], note: 'Magic Resistance = advantage on saves. Use attacks instead.' },
  { threat: 'Damage Resistance/Immunity', counters: ['Switch damage types', 'Force damage (rarely resisted)', 'Psychic damage (rarely resisted)', 'Radiant damage (rarely resisted)'], note: 'Force, psychic, and radiant are the safest damage types.' },
  { threat: 'Frightful Presence (Dragon)', counters: ['Heroes\' Feast (immune to frightened)', 'Calm Emotions', 'Paladin Aura of Courage', 'High WIS saves'], note: 'Heroes\' Feast before dragon fights. Immune to fear.' },
  { threat: 'Charm/Domination', counters: ['Calm Emotions', 'Protection from Evil/Good', 'High WIS saves', 'Elves: advantage vs charmed (Fey Ancestry)'], note: 'Charmed allies attack you. Protection from E&G prevents.' },
  { threat: 'Petrification (Medusa)', counters: ['Don\'t look at it (disadvantage on attacks)', 'Mirror to redirect gaze', 'Blindfold fighting', 'Greater Restoration to undo'], note: 'Fight with eyes averted. Disadvantage but no petrification.' },
  { threat: 'Level Drain / Necrotic', counters: ['Radiant damage', 'Greater Restoration', 'Death Ward (prevent going to 0)', 'Necrotic resistance'], note: 'Greater Restoration undoes max HP reduction.' },
];

export const COUNTER_TERRAIN = [
  { threat: 'Darkness / Fog', counters: ['Darkvision', 'Devil\'s Sight', 'Daylight spell', 'Truesight', 'Blindsight items'], note: 'Devil\'s Sight sees through magical darkness.' },
  { threat: 'Difficult Terrain', counters: ['Freedom of Movement', 'Fly spell', 'Spider Climb', 'Land\'s Stride (Ranger)'], note: 'Flight bypasses all ground terrain.' },
  { threat: 'Underwater Combat', counters: ['Water Breathing', 'Freedom of Movement (no disadvantage)', 'Trident/spear (not disadvantaged underwater)'], note: 'Most weapons have disadvantage underwater.' },
  { threat: 'Anti-Magic Zone', counters: ['Physical attacks only', 'Martial characters shine here', 'Move out of the zone', 'Magic items are suppressed, not destroyed'], note: 'Martials dominate in Antimagic Field.' },
];

export const COUNTERPLAY_TIPS = [
  'Counterspell: best reaction vs casters. Learn to use it.',
  'Silence: shuts down all verbal spells in 20ft. Area denial.',
  'Magic Missile: 3 guaranteed concentration saves. Break their spells.',
  'Troll regeneration: fire or acid stops it. Always bring fire.',
  'Flying enemies: Earthbind, ranged attacks, or stunning them (they fall).',
  'Magic Resistance: use attack rolls not saves. Or no-save spells.',
  'Force/psychic/radiant: rarely resisted. Default to these.',
  'Heroes\' Feast: immune to fear and poison. Cast before boss fights.',
  'Grappled? Misty Step. No check needed. Teleport = free escape.',
  'Swarms: AoE damage. Fireball, Spirit Guardians, Hypnotic Pattern.',
];
