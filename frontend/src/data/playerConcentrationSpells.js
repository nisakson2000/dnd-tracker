/**
 * playerConcentrationSpells.js
 * Player Mode: High-value concentration spells ranked by impact
 * Pure JS — no React dependencies.
 */

export const TOP_CONCENTRATION_SPELLS = [
  { name: 'Bless', level: 1, description: '+1d4 to attacks and saves for 3 creatures.', rating: 'S', classes: ['Cleric', 'Paladin'] },
  { name: 'Faerie Fire', level: 1, description: 'Advantage on attacks against affected creatures. Reveals invisible.', rating: 'S', classes: ['Bard', 'Druid'] },
  { name: 'Entangle', level: 1, description: 'Restrain creatures in 20ft area.', rating: 'A', classes: ['Druid'] },
  { name: 'Hex', level: 1, description: '+1d6 necrotic on hits. Disadvantage on one ability.', rating: 'A', classes: ['Warlock'] },
  { name: 'Hunter\'s Mark', level: 1, description: '+1d6 on weapon hits. Track target.', rating: 'A', classes: ['Ranger'] },
  { name: 'Shield of Faith', level: 1, description: '+2 AC to one creature.', rating: 'B', classes: ['Cleric', 'Paladin'] },
  { name: 'Hold Person', level: 2, description: 'Paralyze a humanoid. Auto-crit within 5ft.', rating: 'S', classes: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'] },
  { name: 'Web', level: 2, description: 'Restrain creatures in 20ft cube. Difficult terrain.', rating: 'A', classes: ['Sorcerer', 'Wizard'] },
  { name: 'Spike Growth', level: 2, description: '2d4 per 5ft moved in 20ft radius. Difficult terrain.', rating: 'A', classes: ['Druid', 'Ranger'] },
  { name: 'Spirit Guardians', level: 3, description: '3d8 radiant/necrotic to enemies in 15ft aura. Half speed.', rating: 'S', classes: ['Cleric'] },
  { name: 'Hypnotic Pattern', level: 3, description: 'Incapacitate creatures in 30ft cube.', rating: 'S', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'] },
  { name: 'Haste', level: 3, description: '+2 AC, doubled speed, extra action. Lethargy if dropped.', rating: 'S', classes: ['Sorcerer', 'Wizard'] },
  { name: 'Conjure Animals', level: 3, description: 'Summon beasts for 1 hour.', rating: 'S', classes: ['Druid', 'Ranger'] },
  { name: 'Polymorph', level: 4, description: 'Transform creature into beast. Massive temp HP.', rating: 'S', classes: ['Bard', 'Druid', 'Sorcerer', 'Wizard'] },
  { name: 'Banishment', level: 4, description: 'Remove creature from combat (CHA save).', rating: 'S', classes: ['Cleric', 'Paladin', 'Sorcerer', 'Warlock', 'Wizard'] },
  { name: 'Wall of Force', level: 5, description: 'Indestructible wall. No save. Split encounter.', rating: 'S', classes: ['Wizard'] },
  { name: 'Animate Objects', level: 5, description: '10 tiny objects: +8, 1d4+4 each. Massive damage.', rating: 'S', classes: ['Bard', 'Sorcerer', 'Wizard'] },
  { name: 'Hold Monster', level: 5, description: 'Paralyze any creature. Auto-crit within 5ft.', rating: 'S', classes: ['Bard', 'Sorcerer', 'Warlock', 'Wizard'] },
];

export const CONCENTRATION_TIPS = [
  'Only ONE concentration spell at a time.',
  'Taking damage = CON save (DC 10 or half damage, whichever is higher).',
  'War Caster feat: advantage on concentration saves.',
  'Resilient (CON): add proficiency to CON saves.',
  'Being incapacitated or killed ends concentration.',
  'If you have a great concentration spell up, be very careful about taking damage.',
];

export function getConcentrationSpells(className) {
  return TOP_CONCENTRATION_SPELLS.filter(s =>
    s.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

export function getSRatedSpells(className) {
  return getConcentrationSpells(className).filter(s => s.rating === 'S');
}
