/**
 * playerArcanaClericGuide.js
 * Player Mode: Arcana Domain Cleric — the wizard-cleric hybrid
 * Pure JS — no React dependencies.
 */

export const ARCANA_CLERIC_BASICS = {
  class: 'Cleric (Arcana Domain)',
  source: 'Sword Coast Adventurer\'s Guide',
  theme: 'Wizard cantrips on a Cleric. Dispel/detect magic always prepared. Steal Wizard spells at L17.',
  note: 'Gets 2 Wizard cantrips at L1, Arcane domain spells (Detect Magic, Magic Missile, etc.), and at L17 can add any 4 Wizard spells (6-9th level) to your Cleric list. Unique hybrid.',
};

export const ARCANA_CLERIC_FEATURES = [
  { feature: 'Arcane Initiate', level: 1, effect: 'Choose 2 Wizard cantrips. They count as Cleric cantrips for you.', note: 'Booming Blade + Green-Flame Blade, or utility like Minor Illusion + Prestidigitation. Huge flexibility.' },
  { feature: 'Channel Divinity: Arcane Abjuration', level: 2, effect: 'Turn celestials, elementals, fey, and fiends (as Turn Undead). At L5+: banish if CR ≤ 1/2 Cleric level.', note: 'Niche but powerful vs extraplanar creatures. Banish effect is incredible when it works.' },
  { feature: 'Spell Breaker', level: 6, effect: 'When you heal a creature, you can also end one spell on them (spell level ≤ slot used).', note: 'Healing Word + free dispel on an ally. Removes charm, hold person, etc. while healing. Amazing action economy.' },
  { feature: 'Potent Spellcasting', level: 8, effect: 'Add WIS mod to Cleric cantrip damage.', note: '+5 to Booming Blade/Green-Flame Blade/Sacred Flame. Booming Blade especially strong.' },
  { feature: 'Arcane Mastery', level: 17, effect: 'Choose one 6th, 7th, 8th, and 9th level Wizard spell. They\'re always prepared and count as Cleric spells.', note: 'Contingency, Forcecage, Simulacrum, Wish on a CLERIC. Game-breaking capstone.' },
];

export const ARCANA_CLERIC_DOMAIN_SPELLS = [
  { level: 1, spells: ['Detect Magic', 'Magic Missile'], note: 'Detect Magic as ritual is nice. Magic Missile auto-hits — good for concentration checks.' },
  { level: 3, spells: ['Magic Weapon', 'Nystul\'s Magic Aura'], note: 'Magic Weapon helps martials vs resistant enemies. Nystul\'s is very niche.' },
  { level: 5, spells: ['Dispel Magic', 'Magic Circle'], note: 'Dispel Magic always prepared is excellent. Magic Circle for summoning/protection.' },
  { level: 7, spells: ['Arcane Eye', 'Leomund\'s Secret Chest'], note: 'Arcane Eye is great scouting. Secret Chest is rarely used.' },
  { level: 9, spells: ['Planar Binding', 'Teleportation Circle'], note: 'Planar Binding for permanent summons. Teleportation Circle for travel.' },
];

export const ARCANA_CLERIC_TACTICS = [
  { tactic: 'Booming Blade + Potent Spellcasting', detail: 'Weapon damage + 1d8 thunder + WIS mod. If enemy moves: +2d8 more. Better than Extra Attack for single hits.', rating: 'S' },
  { tactic: 'Spell Breaker + Healing Word', detail: 'Bonus action: heal ally AND remove a spell effect (charm, hold, slow). Incredible action economy.', rating: 'S' },
  { tactic: 'Arcane Mastery Wish', detail: 'L17: Wish on a Cleric. Use for safe L8 replications. You still have full Cleric spell list too.', rating: 'S' },
  { tactic: 'Spirit Guardians + Booming Blade', detail: 'Spirit Guardians for AoE. Booming Blade for melee punishment. Full Cleric chassis underneath.', rating: 'A' },
];

export function arcaneAbjurationBanishCR(clericLevel) {
  if (clericLevel < 5) return 0;
  return Math.floor(clericLevel / 2);
}

export const ARCANE_MASTERY_TOP_PICKS = {
  level6: ['Contingency', 'Mental Prison', 'Tenser\'s Transformation'],
  level7: ['Forcecage', 'Simulacrum', 'Plane Shift'],
  level8: ['Maze', 'Clone', 'Demiplane'],
  level9: ['Wish', 'True Polymorph', 'Shapechange'],
  note: 'Wish is the obvious L9 pick. Forcecage or Simulacrum for L7. Contingency for L6.',
};
