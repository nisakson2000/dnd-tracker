/**
 * playerCoverRulesDetailGuide.js
 * Player Mode: Cover rules — types, interactions, and tactical use
 * Pure JS — no React dependencies.
 */

export const COVER_TYPES = [
  { type: 'Half Cover', bonus: '+2 AC, +2 DEX saves', examples: 'Low wall, furniture, another creature, thick tree trunk', note: 'Most common. Even another creature provides half cover.' },
  { type: 'Three-Quarters Cover', bonus: '+5 AC, +5 DEX saves', examples: 'Arrow slit, portcullis, thick pillar behind', note: 'Huge defensive bonus. Equivalent to Shield spell.' },
  { type: 'Total Cover', bonus: 'Can\'t be targeted directly', examples: 'Completely behind a wall, around a corner, inside a building', note: 'Can\'t be targeted by attacks or most spells. AoE can still reach.' },
];

export const COVER_RULES = {
  determination: 'Draw a line from any corner of attacker\'s space to any corner of target\'s space. If blocked, there\'s cover.',
  spellInteraction: 'Most spells require line of sight. Total cover blocks targeting. AoE spells can still hit if the area reaches.',
  aoeAndCover: 'If an AoE originates on the other side of total cover, the target has total cover from the AoE (unless it wraps around).',
  movingCover: 'Creatures provide half cover to targets behind them. Use allies as mobile cover.',
  prone: 'Prone doesn\'t grant cover, but ranged attacks beyond 5ft have disadvantage against prone targets.',
};

export const COVER_TACTICS = [
  { tactic: 'Ranged behind half cover', detail: 'Archer behind a low wall: +2 AC. Pop up, shoot, duck.', rating: 'S' },
  { tactic: 'Arrow slits', detail: 'Three-quarters cover = +5 AC. Archers in arrow slits are nearly unhittable.', rating: 'S' },
  { tactic: 'Use allies as cover', detail: 'RAW: another creature provides half cover. Position ranged PCs behind martials.', rating: 'A+' },
  { tactic: 'Corner peeking', detail: 'Step out from total cover, attack, step back. Costs movement but very safe.', rating: 'A+' },
  { tactic: 'Prone + cover', detail: 'Prone behind half cover: ranged attacks have disadvantage AND -2 to hit.', rating: 'A' },
  { tactic: 'Create cover with spells', detail: 'Wall of Stone, Wall of Force, Mold Earth (dig trench).', rating: 'S' },
  { tactic: 'Sharpshooter bypass', detail: 'Sharpshooter feat ignores half and three-quarters cover.', rating: 'S+' },
];

export const COVER_CREATING_SPELLS = [
  { spell: 'Wall of Force', level: 5, effect: 'Impenetrable invisible wall. Total cover.', rating: 'S+' },
  { spell: 'Wall of Stone', level: 5, effect: 'Permanent stone walls. Total cover + traps.', rating: 'S' },
  { spell: 'Wall of Fire', level: 4, effect: 'Not cover but heavily deters passage.', rating: 'A+' },
  { spell: 'Wind Wall', level: 3, effect: 'Blocks ranged attacks and small flyers.', rating: 'B+' },
  { spell: 'Minor Illusion', level: 0, effect: '5ft cube illusion. Appears to be cover. Investigation to see through.', rating: 'A' },
  { spell: 'Mold Earth', level: 0, effect: 'Dig a trench for half cover. Free and permanent.', rating: 'A' },
];

export const COVER_TIPS = [
  'Always end your turn behind cover if possible. Free AC boost.',
  'Sharpshooter and Spell Sniper both ignore cover. Key feats for ranged builds.',
  'Sacred Flame ignores cover (target makes DEX save, no attack roll needed per text).',
  'AoE spells bypass total cover if the area of effect reaches around the obstacle.',
  'Dodge + half cover = very tanky. +2 AC AND disadvantage on incoming attacks.',
  'Fog Cloud blocks line of sight for everyone. Different from cover but similar effect.',
];
