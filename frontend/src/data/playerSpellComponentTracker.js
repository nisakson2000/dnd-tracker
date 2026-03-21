/**
 * playerSpellComponentTracker.js
 * Player Mode: Track expensive spell components and shopping lists
 * Pure JS — no React dependencies.
 */

export const COMPONENT_TYPES = {
  verbal: { code: 'V', description: 'Speak words of power. Can\'t cast in Silence or if gagged.', counter: 'Subtle Spell (Sorcerer) removes verbal component.' },
  somatic: { code: 'S', description: 'Hand gestures. Need a free hand (or War Caster feat).', counter: 'War Caster allows somatic with full hands. Focus counts if also material.' },
  material: { code: 'M', description: 'Physical component. Replaced by focus/pouch unless consumed or has a cost.', counter: 'Component Pouch or Spellcasting Focus replaces non-cost materials.' },
};

export const EXPENSIVE_COMPONENTS = [
  { spell: 'Chromatic Orb', component: 'Diamond worth 50 gp', consumed: false, level: 1 },
  { spell: 'Find Familiar', component: 'Charcoal, incense, herbs worth 10 gp', consumed: true, level: 1 },
  { spell: 'Identify', component: 'Pearl worth 100 gp', consumed: false, level: 1 },
  { spell: 'Protection from Evil and Good', component: 'Holy water or powdered silver and iron', consumed: true, level: 1 },
  { spell: 'Arcane Lock', component: 'Gold dust worth 25 gp', consumed: true, level: 2 },
  { spell: 'Augury', component: 'Marked sticks/bones worth 25 gp', consumed: false, level: 2 },
  { spell: 'Continual Flame', component: 'Ruby dust worth 50 gp', consumed: true, level: 2 },
  { spell: 'Glyph of Warding', component: 'Incense and powdered diamond worth 200 gp', consumed: true, level: 3 },
  { spell: 'Revivify', component: 'Diamond worth 300 gp', consumed: true, level: 3 },
  { spell: 'Remove Curse', component: 'None', consumed: false, level: 3, note: 'Surprisingly no material component!' },
  { spell: 'Stoneskin', component: 'Diamond dust worth 100 gp', consumed: true, level: 4 },
  { spell: 'Greater Restoration', component: 'Diamond dust worth 100 gp', consumed: true, level: 5 },
  { spell: 'Raise Dead', component: 'Diamond worth 500 gp', consumed: true, level: 5 },
  { spell: 'Planar Binding', component: 'Jewel worth 1,000 gp', consumed: true, level: 5 },
  { spell: 'Heroes\' Feast', component: 'Gem-encrusted bowl worth 1,000 gp', consumed: true, level: 6 },
  { spell: 'Resurrection', component: 'Diamond worth 1,000 gp', consumed: true, level: 7 },
  { spell: 'Clone', component: 'Diamond worth 1,000 gp + vessel worth 2,000 gp', consumed: true, level: 8 },
  { spell: 'True Resurrection', component: 'Diamonds worth 25,000 gp', consumed: true, level: 9 },
  { spell: 'Gate', component: 'Diamond worth 5,000 gp', consumed: false, level: 9 },
  { spell: 'Wish', component: 'None', consumed: false, level: 9, note: 'The most powerful spell requires NOTHING.' },
];

export const SHOPPING_LIST_TEMPLATE = {
  character: '',
  items: [],
  totalCost: 0,
};

export function getComponentsForSpell(spellName) {
  return EXPENSIVE_COMPONENTS.find(c =>
    c.spell.toLowerCase().includes((spellName || '').toLowerCase())
  ) || null;
}

export function generateShoppingList(spellNames) {
  const items = spellNames
    .map(name => getComponentsForSpell(name))
    .filter(Boolean)
    .filter(c => c.consumed);

  const totalCost = items.reduce((sum, item) => {
    const match = item.component.match(/(\d[\d,]*)\s*gp/);
    return sum + (match ? parseInt(match[1].replace(',', ''), 10) : 0);
  }, 0);

  return { items, totalCost };
}

export function getConsumedComponents() {
  return EXPENSIVE_COMPONENTS.filter(c => c.consumed);
}

export function getComponentsByLevel(maxLevel) {
  return EXPENSIVE_COMPONENTS.filter(c => c.level <= maxLevel);
}
