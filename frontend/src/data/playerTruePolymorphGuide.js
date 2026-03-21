/**
 * playerTruePolymorphGuide.js
 * Player Mode: True Polymorph — the ultimate transformation spell
 * Pure JS — no React dependencies.
 */

export const TRUE_POLYMORPH_BASICS = {
  spell: 'True Polymorph',
  level: 9,
  school: 'Transmutation',
  castingTime: '1 action',
  range: '30ft',
  duration: 'Concentration, up to 1 hour. Becomes permanent if concentrated for full duration.',
  classes: ['Bard', 'Warlock', 'Wizard'],
  note: 'The most versatile spell in D&D. Turn creature into creature, creature into object, or object into creature. Permanent after 1 hour concentration.',
};

export const TRUE_POLYMORPH_MODES = [
  { mode: 'Creature → Creature', rule: 'Target CR ≤ subject\'s CR (or level for PCs). New form can be any creature.', use: 'Turn yourself into an Adult Dragon. Turn enemy into a slug.', note: 'You gain ALL stats of the new form including HP, abilities, legendary actions. But you lose your own class features.' },
  { mode: 'Creature → Object', rule: 'Turn a creature into a nonmagical object. Size ≤ target\'s size. WIS save if unwilling.', use: 'Turn the boss into a paperweight. Remove them from combat permanently.', note: 'Creature becomes the object. Permanent after 1 hour. Dispel Magic can reverse it.' },
  { mode: 'Object → Creature', rule: 'Turn an object into a creature. CR ≤ object\'s size (Tiny = CR 0, etc.)', use: 'Turn a rock into an Adult Dragon (Large object = up to CR 9). Or a Huge object into a higher CR creature.', note: 'Created creature is friendly and obeys you. Permanent after 1 hour. Essentially creating life.' },
];

export const TRUE_POLYMORPH_BEST_FORMS = [
  { form: 'Adult Gold Dragon', cr: 17, hp: 256, note: 'For L17+ characters. Fire breath, flight, frightful presence, legendary actions. You become a dragon.', rating: 'S' },
  { form: 'Planetar', cr: 16, hp: 200, note: 'Celestial. Flying, innate spellcasting, radiant damage, healing touch. Extremely versatile.', rating: 'S' },
  { form: 'Iron Golem', cr: 16, hp: 210, note: 'Immune to nearly everything. Fire heals it. Poison breath. Incredibly durable.', rating: 'A' },
  { form: 'Adult Red Dragon', cr: 17, hp: 256, note: 'Same as Gold but evil-themed. Fire immunity. Legendary actions.', rating: 'S' },
  { form: 'Androsphinx', cr: 17, hp: 199, note: 'Legendary actions, roar abilities, spellcasting. Very versatile.', rating: 'A' },
];

export const TRUE_POLYMORPH_TACTICS = [
  { tactic: 'Become a dragon', detail: 'Turn yourself into an Adult Gold Dragon. 256 HP, fire breath, flight, legendary actions. Concentrate for 1 hour = permanent.', rating: 'S' },
  { tactic: 'Turn enemy into object', detail: 'WIS save or enemy becomes a paperweight. Permanent. Carry them around. Drop in the ocean.', rating: 'S' },
  { tactic: 'Create allies from objects', detail: 'Turn a boulder into a creature. CR depends on object size. Permanent ally after 1 hour.', rating: 'A' },
  { tactic: 'Pre-fight transformation', detail: 'Before the big fight: True Polymorph yourself into a dragon. Concentrate for 1 hour. Walk into the fight as a permanent dragon.', rating: 'S' },
  { tactic: 'Turn enemy into harmless animal', detail: 'Turn the BBEG into a snail. Permanent after 1 hour. But: Dispel Magic can reverse it. Kill the snail to be safe.', rating: 'S' },
];

export const TRUE_POLYMORPH_LIMITS = [
  { limit: 'Concentration for 1 hour', note: 'Must maintain concentration for full hour for permanent effect. Any disruption = form reverts.' },
  { limit: 'Dispel Magic reverses it', note: 'Even "permanent" True Polymorph can be reversed by Dispel Magic (DC 19 check).' },
  { limit: 'Lose class features', note: 'When you become a creature, you gain its stats but lose all your class features. No spellcasting (unless new form has it).' },
  { limit: 'DM interpretation', note: 'Many DMs limit True Polymorph due to its extreme power. Discuss expectations.' },
];

export function truePolymorphMaxCR(characterLevel) {
  return characterLevel; // CR ≤ character level
}
