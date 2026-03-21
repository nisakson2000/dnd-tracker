/**
 * playerControllerBuildGuide.js
 * Player Mode: Controller builds — best classes and spells for battlefield control
 * Pure JS — no React dependencies.
 */

export const CONTROLLER_PHILOSOPHY = {
  role: 'Remove enemies from the fight without killing them. Deny actions, restrict movement, divide the battlefield.',
  whyItsBest: 'A Hypnotic Pattern that incapacitates 4 enemies is worth more than a Fireball that damages them all.',
  keyMetrics: ['Number of enemies removed per spell', 'Duration of control', 'Save difficulty', 'Action denial'],
  note: 'Controllers win fights by denying enemy actions. The best controller makes half the encounter irrelevant.',
};

export const BEST_CONTROLLER_SUBCLASSES = [
  { subclass: 'Chronurgy Wizard', class: 'Wizard', rating: 'S+', keyFeature: 'Chronal Shift: force any d20 reroll. Arcane Abeyance: store spells.', note: 'Control fate itself. Force boss to fail save. Best controller.' },
  { subclass: 'Divination Wizard', class: 'Wizard', rating: 'S+', keyFeature: 'Portent: replace d20 rolls. Low portent + save-or-suck = guaranteed fail.', note: 'Roll a 3 → give to boss for save against Banishment. Guaranteed.' },
  { subclass: 'Eloquence Bard', class: 'Bard', rating: 'S', keyFeature: 'Unsettling Words: subtract BI from next save. Stack with save-or-suck.', note: 'Reduce save by d6-d12. Effectively -4 to enemy save.' },
  { subclass: 'Aberrant Mind Sorcerer', class: 'Sorcerer', rating: 'S', keyFeature: 'Subtle spell for free on psionic spells. Can\'t be Counterspelled.', note: 'Uncounterable control spells. Cast without anyone knowing.' },
  { subclass: 'Clockwork Soul Sorcerer', class: 'Sorcerer', rating: 'S', keyFeature: 'Restore Balance: cancel advantage/disadvantage. Extra spells known.', note: 'Cancel enemy advantage. More spells = more control options.' },
  { subclass: 'Peace Cleric', class: 'Cleric', rating: 'S', keyFeature: 'Emboldening Bond: +1d4 to allies\' saves = harder for enemies to control YOUR party.', note: 'Anti-control controller. Your party resists everything.' },
  { subclass: 'Graviturgy Wizard', class: 'Wizard', rating: 'A+', keyFeature: 'Adjust Density: double/halve weight. Gravity Well: move targets 5ft on spell hit.', note: 'Move enemies into hazards. Gravity control.' },
  { subclass: 'Order Cleric', class: 'Cleric', rating: 'A+', keyFeature: 'Voice of Authority: buff ally = they get reaction attack. Command + order.', note: 'Cast Hold Person on enemy → ally (Rogue?) gets reaction SA.' },
];

export const BEST_CONTROL_SPELLS = [
  { spell: 'Hypnotic Pattern', level: 3, rating: 'S+', note: 'Incapacitate 30ft cube. WIS save. No repeat saves. Only damage/shaking ends.' },
  { spell: 'Web', level: 2, rating: 'S', note: 'Restrained + difficult terrain. DEX save. Cheap and incredibly effective.' },
  { spell: 'Wall of Force', level: 5, rating: 'S+', note: 'Split encounter. Nothing penetrates. Game-changing.' },
  { spell: 'Banishment', level: 4, rating: 'S', note: 'Remove one creature. CHA save. Permanent if native to another plane.' },
  { spell: 'Slow', level: 3, rating: 'S', note: '-2 AC, half speed, no reactions, no BA, 50% chance to waste spell.', },
  { spell: 'Hold Person/Monster', level: '2/5', rating: 'S', note: 'Paralyze. Auto-crit melee. WIS save each turn.' },
  { spell: 'Forcecage', level: 7, rating: 'S+', note: 'Trap for 1 hour. No concentration. No HP threshold.' },
  { spell: 'Plant Growth', level: 3, rating: 'S', note: '4ft per 1ft moved. 100ft radius. No concentration. No save.' },
  { spell: 'Polymorph', level: 4, rating: 'S', note: 'Turn enemy into snail. WIS save. Concentration. Versatile.' },
  { spell: 'Entangle', level: 1, rating: 'A+', note: 'Restrained in 20ft square. L1 control. STR save.' },
  { spell: 'Fog Cloud', level: 1, rating: 'A+', note: 'Block all vision. Cheap. Anti-ranged. Escape tool.' },
  { spell: 'Spike Growth', level: 2, rating: 'S', note: 'Difficult terrain + 2d4 per 5ft moved. Control + damage.' },
];

export const CONTROLLER_TACTICS = [
  'Open with biggest AoE control: Hypnotic Pattern, Web, or Slow.',
  'After control, party focuses fire on unaffected enemies.',
  'Save Banishment/Hold for single high-priority targets (boss, caster).',
  'Wall of Force to divide: fight half the encounter at a time.',
  'Layer control: Spike Growth + forced movement = damage without attacking.',
  'Don\'t break your own control: don\'t Fireball Hypnotic Patterned enemies.',
  'Target weak saves: INT saves are rarest. WIS saves common but many spells target it.',
  'Heightened Spell (3 SP): impose disadvantage on first save. Worth it on critical control spells.',
];

export const CONTROLLER_TIPS = [
  'Controllers are the most impactful role in combat. One spell can trivialize an encounter.',
  'Don\'t blast when you can control. Fireball deals damage; Hypnotic Pattern ends fights.',
  'Know enemy save weaknesses. INT is usually weakest, then CHA, then STR.',
  'Protect your concentration. War Caster or Resilient (CON). Your control ending = enemies act again.',
  'Don\'t let allies break your Hypnotic Pattern with AoE damage. Communicate!',
  'At high levels, Forcecage + Sickening Radiance/Cloudkill = guaranteed kill combo.',
];
