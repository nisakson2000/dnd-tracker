/**
 * playerScribesWizardGuide.js
 * Player Mode: Order of Scribes Wizard — the living spellbook
 * Pure JS — no React dependencies.
 */

export const SCRIBES_BASICS = {
  class: 'Wizard (Order of Scribes)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Living spellbook. Swap spell damage types. Free ritual casting speed. Manifest Mind scout.',
  note: 'Underrated subclass. Awakened Spellbook lets you swap damage types freely. Master Scrivener creates free spell scrolls. Incredibly versatile.',
};

export const SCRIBES_FEATURES = [
  { feature: 'Wizardly Quill', level: 2, effect: 'Bonus action: create magical quill. Copy spells at 2 minutes per level (not 2 hours). Quill costs no gold for copying ink.', note: 'Copy spells for FREE and FAST. 2 min/level vs 2 hours/level. Massive advantage for expanding your spellbook.' },
  { feature: 'Awakened Spellbook', level: 2, effect: 'Replace damage type of a spell with the type of another spell of the same level in your spellbook. Cast ritual spells in normal casting time (not +10 min).', note: 'Fireball deals cold/lightning/thunder/any type. Just need another L3 spell with that damage type in your book. Bypass resistances freely.' },
  { feature: 'Manifest Mind', level: 6, effect: 'Bonus action: manifest spellbook as Tiny spectral object. 60ft range. You can cast spells from its location. PB uses/LR.', note: 'Cast spells from 60ft away. See/hear through it. It\'s basically a free 60ft range extension on every spell. Scout around corners.' },
  { feature: 'Master Scrivener', level: 10, effect: 'After long rest: create a L1-2 spell scroll for free. It uses minimum slot level. Once used, feature refreshes on LR.', note: 'Free spell scroll every day. L2 spell scroll = extra spell per day. No material cost.' },
  { feature: 'One with the Word', level: 14, effect: 'Advantage on Arcana checks. When you take damage: reaction, dismiss spectral mind, turn one spell (level ≥ damage type) to blank pages. Reduce damage to 0.', note: 'Take 0 damage by sacrificing a spell from your book. Expensive but can save your life. Re-copy the spell later.' },
];

export const AWAKENED_SPELLBOOK_COMBOS = [
  { swap: 'Fireball → Cold/Lightning/Thunder', detail: 'Have Sleet Storm (cold), Lightning Bolt (lightning), or Shatter (thunder) in book. Fireball now deals any of those types.', rating: 'S' },
  { swap: 'Chromatic Orb → any type', detail: 'Chromatic Orb already picks types. But Awakened Spellbook can make ANY spell deal acid/cold/fire/lightning/poison/thunder.', rating: 'A' },
  { swap: 'Bypass fire immunity', detail: 'Enemy immune to fire? Fireball now deals cold damage. Full damage against what was previously immune.', rating: 'S' },
  { swap: 'Trigger Absorb Elements', detail: 'Deal specific damage types to set up ally interactions or environmental combos.', rating: 'B' },
  { swap: 'Instant rituals', detail: 'Cast Detect Magic, Identify, Find Familiar as regular casting time (1 action instead of 11 min). Huge in time-sensitive situations.', rating: 'A' },
];

export const MANIFEST_MIND_TACTICS = [
  { tactic: 'Cast from around corners', detail: 'Manifest Mind peeks around corner. Cast Fireball from its position. You stay in total cover. No counterplay.', rating: 'S' },
  { tactic: 'Scouting', detail: 'Send spectral mind ahead. See and hear through it. 60ft range. Free recon.', rating: 'A' },
  { tactic: 'Range extension', detail: 'Touch-range spells cast from 60ft away. Shocking Grasp, Bestow Curse, etc. from safety.', rating: 'A' },
  { tactic: 'Concentration-safe positioning', detail: 'You stay 60ft back behind cover. Mind is near enemies. Cast through it. You never get attacked.', rating: 'S' },
];

export function copySpellTime(spellLevel, isQuill = true) {
  if (isQuill) return spellLevel * 2; // 2 minutes per level
  return spellLevel * 120; // 2 hours per level (normal)
}

export function copySpellCost(spellLevel, isQuill = true) {
  if (isQuill) return 0; // Free with quill
  return spellLevel * 50; // 50gp per level (normal)
}
