/**
 * playerLineOfSightRulesGuide.js
 * Player Mode: Line of Sight and Cover rules — targeting, obstruction, and tactical use
 * Pure JS — no React dependencies.
 */

export const COVER_TYPES = [
  { type: 'No Cover', ac: '+0', dex: '+0', description: 'Clear line to target. No obstruction.', rating: 'N/A' },
  { type: 'Half Cover', ac: '+2', dex: '+2', description: 'Obstacle blocks at least half the target. Low wall, furniture, creature.', rating: 'Common' },
  { type: 'Three-Quarters Cover', ac: '+5', dex: '+5', description: 'Obstacle blocks three-quarters. Arrow slit, tree trunk, creature behind another.', rating: 'Strong' },
  { type: 'Total Cover', ac: 'Untargetable', dex: 'Untargetable', description: 'Completely concealed. Cannot be targeted by spells requiring sight.', rating: 'Immune' },
];

export const LINE_OF_SIGHT_RULES = {
  basic: 'Draw a line from any corner of your square to any corner of the target\'s square. If unobstructed → clear sight.',
  spells: 'Most spells require "a target you can see." No sight = no spell (unless it says otherwise).',
  darkness: 'Darkness blocks sight unless you have darkvision, truesight, or Devil\'s Sight.',
  invisibility: 'Invisible creatures can still be targeted if you know their location — but with disadvantage.',
  fog: 'Fog Cloud, Sleet Storm: heavily obscured. Can\'t see in or out. Blocks LoS.',
};

export const COVER_INTERACTIONS = [
  { spell: 'Sacred Flame', interaction: 'Ignores cover. Target gains no benefit from cover.', rating: 'S+' },
  { spell: 'Magic Missile', interaction: 'Requires sight. Blocked by total cover. Auto-hits through half/3/4 cover.', rating: 'S' },
  { spell: 'Fireball', interaction: 'Spreads around corners. DEX save gets cover bonus. But still in the area.', rating: 'S' },
  { spell: 'Lightning Bolt', interaction: 'Line effect. Blocked by total cover. Hits everything in the line.', rating: 'A+' },
  { spell: 'Toll the Dead', interaction: 'Requires sight. WIS save — cover doesn\'t help (only AC/DEX saves).', rating: 'A+' },
  { feat: 'Spell Sniper', interaction: 'Ignore half and three-quarters cover for spell attacks.', rating: 'S' },
  { feat: 'Sharpshooter', interaction: 'Ignore half and three-quarters cover for ranged weapon attacks.', rating: 'S+' },
];

export const CONCEALMENT_VS_COVER = {
  cover: 'Physical barrier. Gives AC and DEX save bonus. Blocks projectiles.',
  concealment: 'Can\'t see clearly but barrier may not stop attacks. Fog, darkness, foliage.',
  lightlyObscured: 'Disadvantage on Perception (sight). Dim light, patchy fog, moderate foliage.',
  heavilyObscured: 'Effectively blind. Can\'t see. Darkness, opaque fog, dense foliage.',
  note: 'Cover protects your body. Concealment hides your location. They can overlap.',
};

export const TACTICAL_COVER_TIPS = [
  'Half cover (+2 AC) from allies: RAW, creatures provide half cover. Use your positioning.',
  'Sharpshooter/Spell Sniper: ignore half and 3/4 cover. Essential for ranged builds.',
  'Duck behind total cover after attacking: enemies can\'t target you until your next turn.',
  'Prone = disadvantage on ranged attacks against you beyond 5ft. Free "cover" at range.',
  'Sacred Flame ignores cover. Best cantrip for hitting enemies behind walls.',
  'Fireball spreads around corners. Total cover from the point of origin still blocks it.',
  'Use Minor Illusion to create fake cover. Enemies might not realize it\'s fake.',
  'Wall spells (Wall of Force, Wall of Fire) create total cover. Powerful battlefield control.',
  'Fog Cloud on yourself: enemies can\'t see you to target with spells. You can\'t see either.',
  'Cover applies to DEX saves too. Stand behind a wall when the dragon breathes.',
];
