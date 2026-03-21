/**
 * playerTransmutationWizardGuide.js
 * Player Mode: School of Transmutation Wizard — the alchemist
 * Pure JS — no React dependencies.
 */

export const TRANSMUTATION_BASICS = {
  class: 'Wizard (School of Transmutation)',
  source: 'Player\'s Handbook',
  theme: 'Alchemist and shapechanger. Transmuter\'s Stone provides party buffs.',
  note: 'Weakest PHB Wizard subclass mechanically. Transmuter\'s Stone is decent but other Wizards get better features. Great flavor though.',
};

export const TRANSMUTATION_FEATURES = [
  { feature: 'Transmutation Savant', level: 2, effect: 'Copy transmutation spells for half time and gold.', note: 'Standard Savant. Saves gold on transmutation spells.' },
  { feature: 'Minor Alchemy', level: 2, effect: '10 min per cubic foot: transmute wood → stone, stone → iron, iron → copper, copper → silver. Reverts after 1 hour or lose concentration.', note: 'Turn a wooden door to stone (harder to break). Turn stone to iron (sell?). Creative but temporary.' },
  { feature: 'Transmuter\'s Stone', level: 6, effect: 'Create a stone over 8 hours. Choose one benefit for whoever carries it: darkvision 60ft, +10ft speed, CON save proficiency, or resistance to acid/cold/fire/lightning/thunder.', note: 'Give an ally darkvision, or CON saves, or elemental resistance. Can change benefit each time you cast a transmutation spell.' },
  { feature: 'Shapechanger', level: 10, effect: 'Cast Polymorph on yourself without a spell slot. Must become a beast of CR 1 or lower. Once/short rest.', note: 'Free Polymorph to beast (CR 1 max). Giant Eagle for flight. Giant Octopus for grapple. Once per short rest.' },
  { feature: 'Master Transmuter', level: 14, effect: 'Destroy Transmuter\'s Stone for one effect: transmute 5ft nonmagical object into another, remove curses/diseases/poisons, cast Raise Dead (no components), or de-age target by 3d10 years.', note: 'Free Raise Dead or major transmutation. Consumes the stone (remake over 8 hours). Once per use.' },
];

export const TRANSMUTERS_STONE_OPTIONS = [
  { benefit: 'Darkvision 60ft', bestFor: 'Human/Halfling ally without darkvision', rating: 'B' },
  { benefit: '+10ft speed', bestFor: 'Melee fighters, Monks, anyone who needs mobility', rating: 'B' },
  { benefit: 'CON save proficiency', bestFor: 'Concentration casters. This is huge for maintaining spells.', rating: 'S', note: 'CON save proficiency is normally only available through Resilient (CON) feat. Free for your ally.' },
  { benefit: 'Elemental resistance', bestFor: 'Before a known elemental encounter (fire dragon, ice dungeon)', rating: 'A' },
];

export const TRANSMUTATION_TACTICS = [
  { tactic: 'CON save stone for casters', detail: 'Give the stone (CON proficiency) to the Sorcerer/Druid maintaining concentration. They\'re much less likely to drop it.', rating: 'S' },
  { tactic: 'Free Polymorph scout', detail: 'L10: free Polymorph to Giant Eagle. Fly and scout. Once per short rest.', rating: 'A' },
  { tactic: 'Stone swap on transmutation cast', detail: 'Each time you cast a transmutation spell, you can change the stone\'s benefit. Haste? Change stone. Slow? Change stone.', rating: 'A' },
  { tactic: 'Master Transmuter Raise Dead', detail: 'L14: free Raise Dead. No 500gp diamond needed. Just 8 hours to remake the stone.', rating: 'A' },
];

export function transmutersStoneSpeedBonus(baseSpeed) {
  return baseSpeed + 10;
}

export function freePolymorphMaxCR() {
  return 1; // CR 1 beast max
}
