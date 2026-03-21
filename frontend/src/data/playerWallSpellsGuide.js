/**
 * playerWallSpellsGuide.js
 * Player Mode: Wall spells ranked — battlefield shaping mastery
 * Pure JS — no React dependencies.
 */

export const WALL_SPELLS_RANKED = [
  { spell: 'Wall of Force', level: 5, class: 'Wizard', concentration: true, effect: '10 panels (10×10ft each) or hemisphere/sphere. Invisible. Indestructible. Blocks everything except Disintegrate.', rating: 'S', note: 'THE best wall. Split encounters in half. Trap creatures. Nothing breaks it. Game-changing.' },
  { spell: 'Wall of Fire', level: 4, class: 'Druid/Sorcerer/Wizard', concentration: true, effect: '60ft long, 20ft high, 1ft thick (or ring). One side: 5d8 fire on entry/start of turn. Opaque from hot side.', rating: 'S', note: 'Damage wall + vision blocker. Split the battlefield with fire. Choose which side deals damage.' },
  { spell: 'Wall of Stone', level: 5, class: 'Druid/Sorcerer/Wizard', concentration: true, effect: '10 panels (10×10×6in). Permanent after 10 min concentration. Can be chipped through (AC 15, 30 HP per panel).', rating: 'A', note: 'Becomes permanent! Create permanent structures, bridges, barriers. Can seal dungeons.' },
  { spell: 'Wall of Ice', level: 6, class: 'Wizard', concentration: true, effect: '10 panels (10×10×1ft). 10d6 cold damage on creation (DEX save). Each panel: AC 12, 30 HP, vulnerable to fire.', rating: 'A', note: 'Damage on creation + wall. Fire-vulnerable so not as durable. But initial 10d6 is great.' },
  { spell: 'Wall of Thorns', level: 6, class: 'Druid', concentration: true, effect: '60×10×5ft wall. 7d8 piercing (DEX save) to enter or start turn. Difficult terrain. Provides cover.', rating: 'A', note: 'Highest damage wall. 7d8 to anyone entering. Druid exclusive.' },
  { spell: 'Wind Wall', level: 3, class: 'Druid/Ranger', concentration: true, effect: '50ft long, 15ft high. Blocks Small or smaller creatures, gases, fog, projectiles. 3d8 bludgeoning.', rating: 'B', note: 'Blocks ranged attacks! Arrows, bolts can\'t pass through. Also blocks Fog Cloud, gases.' },
  { spell: 'Wall of Sand', level: 3, class: 'Wizard', concentration: true, effect: '30ft long, 10ft high. Heavily obscures. Difficult terrain. 1/3 movement speed through it.', rating: 'B', note: 'Vision blocker + difficult terrain. Cheap L3 option.' },
  { spell: 'Wall of Water', level: 3, class: 'Druid/Sorcerer/Wizard', concentration: true, effect: '30ft long, 10ft high. Difficult terrain. Ranged attacks at disadvantage. Fire damage halved. Cold damage freezes section.', rating: 'B', note: 'Weak wall but disrupts ranged attackers and reduces fire damage.' },
  { spell: 'Wall of Light', level: 5, class: 'Sorcerer/Warlock/Wizard', concentration: true, effect: '60ft long, 5ft high. Blinding (CON save) when created. 4d8 radiant beam attack each turn.', rating: 'B', note: 'More damage dealer than wall. Radiant beam is nice. But less control than Wall of Force.' },
  { spell: 'Prismatic Wall', level: 9, class: 'Wizard', effect: '90ft long or 30ft sphere. 7 layers, each with different effect. Must breach each layer to pass.', rating: 'S', note: 'Ultimate wall. 7 layers of destruction. L9 slot. Basically unpassable without specific counters.' },
];

export const WALL_TACTICS = [
  { tactic: 'Split the encounter', detail: 'Wall of Force: divide enemies in half. Kill one half, then drop wall. Fight is now 2× easier.', rating: 'S' },
  { tactic: 'Dome of Force', detail: 'Wall of Force hemisphere over enemies. They\'re trapped. AoE through (some spells work, most don\'t). Or just trap and ignore.', rating: 'S', note: 'Most spells can\'t pass through WoF. But gases inside can suffocate them.' },
  { tactic: 'Wall of Fire + Spirit Guardians', detail: 'Wall of Fire on one side of enemies. Spirit Guardians on the other. They take damage no matter which way they go.', rating: 'S' },
  { tactic: 'Permanent Wall of Stone', detail: 'Maintain concentration for 10 min. Wall becomes permanent. Build fortifications, bridges, seal passages.', rating: 'A' },
  { tactic: 'Wall of Fire ring', detail: 'Cast as 20ft radius ring around enemies. They take 5d8 fire wherever they move. Trapped in fire.', rating: 'S' },
  { tactic: 'Wind Wall anti-ranged', detail: 'L3 wall blocks all projectiles. Enemy archers/crossbowmen become useless. Your casters are safe.', rating: 'A' },
];

export const WALL_OF_FORCE_COUNTERS = {
  note: 'Wall of Force is ALMOST unbeatable. These are the only ways through:',
  counters: [
    { counter: 'Disintegrate', method: 'Instantly destroys one panel.', note: 'Only reliable counter. L6 spell.' },
    { counter: 'Teleportation', method: 'Misty Step, Dimension Door, etc. bypass physical barriers.', note: 'Can\'t go through but can go around/over.' },
    { counter: 'Dispel Magic', method: 'Target the caster (if visible) to dispel. DC 15 check for L5 spell.', note: 'Must target the caster, not the wall.' },
    { counter: 'Antimagic Field', method: 'Suppresses the wall within the field.', note: 'L8 spell. Rare but effective.' },
    { counter: 'Wait it out', method: 'Concentration spell. 10 minutes max. Damage the caster to break concentration.', note: 'If you can\'t reach the caster, just wait.' },
  ],
};

export function wallOfFireDamage(spellLevel) {
  const baseDice = 5; // 5d8
  const extraDice = spellLevel - 4; // +1d8 per upcast level
  return (baseDice + extraDice) * 4.5;
}

export function wallOfForceAC() {
  return Infinity; // Can't be damaged
}
