/**
 * playerSpellComponentCosts.js
 * Player Mode: Expensive spell material components reference
 * Pure JS — no React dependencies.
 */

export const EXPENSIVE_COMPONENTS = [
  { spell: 'Chromatic Orb', level: 1, cost: '50 gp', component: 'Diamond', consumed: false },
  { spell: 'Find Familiar', level: 1, cost: '10 gp', component: 'Charcoal, incense, herbs (brass brazier)', consumed: true },
  { spell: 'Identify', level: 1, cost: '100 gp', component: 'Pearl', consumed: false },
  { spell: 'Protection from Evil/Good', level: 1, cost: '—', component: 'Holy water or silver/iron powder', consumed: true },
  { spell: 'Arcane Lock', level: 2, cost: '25 gp', component: 'Gold dust', consumed: true },
  { spell: 'Augury', level: 2, cost: '25 gp', component: 'Specially marked sticks/bones/cards', consumed: false },
  { spell: 'Continual Flame', level: 2, cost: '50 gp', component: 'Ruby dust', consumed: true },
  { spell: 'Gentle Repose', level: 2, cost: '—', component: 'Copper pieces on eyes, no cost', consumed: false },
  { spell: 'Revivify', level: 3, cost: '300 gp', component: 'Diamonds', consumed: true },
  { spell: 'Glyph of Warding', level: 3, cost: '200 gp', component: 'Incense and diamond dust', consumed: true },
  { spell: 'Leomund\'s Tiny Hut', level: 3, cost: '—', component: 'Small crystal bead', consumed: false },
  { spell: 'Stoneskin', level: 4, cost: '100 gp', component: 'Diamond dust', consumed: true },
  { spell: 'Divination', level: 4, cost: '25 gp', component: 'Incense and sacrificial offering', consumed: true },
  { spell: 'Greater Restoration', level: 5, cost: '100 gp', component: 'Diamond dust', consumed: true },
  { spell: 'Raise Dead', level: 5, cost: '500 gp', component: 'Diamond', consumed: true },
  { spell: 'Scrying', level: 5, cost: '1,000 gp', component: 'Crystal ball or holy water font', consumed: false },
  { spell: 'Heroes\' Feast', level: 6, cost: '1,000 gp', component: 'Gem-encrusted bowl', consumed: true },
  { spell: 'True Seeing', level: 6, cost: '25 gp', component: 'Ointment for eyes', consumed: true },
  { spell: 'Resurrection', level: 7, cost: '1,000 gp', component: 'Diamond', consumed: true },
  { spell: 'Forcecage', level: 7, cost: '1,500 gp', component: 'Ruby dust', consumed: false },
  { spell: 'Clone', level: 8, cost: '3,000 gp', component: 'Diamond + vessel + cubic inch of flesh', consumed: true },
  { spell: 'True Resurrection', level: 9, cost: '25,000 gp', component: 'Diamonds', consumed: true },
  { spell: 'Wish', level: 9, cost: '—', component: 'No material component needed', consumed: false },
];

export const COMPONENT_TIPS = [
  'Consumed components MUST be tracked. Non-consumed can be reused.',
  'A component pouch contains all FREE components (no gold cost).',
  'An arcane focus replaces non-consumed, free components only.',
  'Always carry 300gp in diamonds for Revivify. Always.',
  'Stock up on diamond dust (100gp) for Greater Restoration.',
  'Ruby dust for Continual Flame (50gp) — create permanent torches!',
];

export function getComponentsForSpell(spellName) {
  return EXPENSIVE_COMPONENTS.find(c => c.spell.toLowerCase() === (spellName || '').toLowerCase()) || null;
}

export function getConsumedComponents() {
  return EXPENSIVE_COMPONENTS.filter(c => c.consumed);
}

export function getShoppingList(spellList) {
  return (spellList || [])
    .map(s => getComponentsForSpell(s))
    .filter(c => c && c.consumed && c.cost !== '—');
}
