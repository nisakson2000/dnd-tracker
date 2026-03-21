/**
 * playerSpellcastingFocusVsPouchGuide.js
 * Player Mode: Spellcasting focus vs component pouch comparison
 * Pure JS — no React dependencies.
 */

export const FOCUS_TYPES = [
  { focus: 'Arcane Focus', users: 'Wizard, Sorcerer, Warlock', examples: 'Orb, crystal, rod, staff, wand.', cost: '5-20 gp' },
  { focus: 'Holy Symbol', users: 'Cleric, Paladin', examples: 'Amulet, emblem, reliquary. Can be on shield.', cost: '5 gp' },
  { focus: 'Druidic Focus', users: 'Druid', examples: 'Sprig of mistletoe, totem, wooden staff, yew wand.', cost: '1-10 gp' },
  { focus: 'Musical Instrument', users: 'Bard', examples: 'Lute, flute, drum, etc. Must be proficient.', cost: '2-35 gp' },
  { focus: 'Component Pouch', users: 'Any caster', examples: 'Belt pouch with compartments for material components.', cost: '25 gp' },
];

export const FOCUS_RULES = {
  whatItReplaces: 'A focus replaces material components that have NO gold cost and are NOT consumed.',
  goldCost: 'If a component has a listed gold cost (e.g., 300 gp diamond for Revivify), you MUST have the actual component.',
  consumed: 'If a component is consumed by the spell, you MUST have the actual component.',
  somatic: 'You can perform somatic components with the same hand holding your focus.',
  freeHand: 'Without War Caster, you need a free hand for somatic components if your focus is on a shield.',
};

export const FOCUS_VS_POUCH = {
  focus: {
    pros: ['Thematic and flavorful', 'Can double as weapon (staff)', 'Holy symbol on shield = no free hand needed', 'Single item to track'],
    cons: ['Class-restricted', 'Can be disarmed/stolen', 'Doesn\'t cover gold-cost components'],
  },
  pouch: {
    pros: ['Works for ANY caster class', 'Best for multiclass', 'Contains all non-gold materials', 'Harder to notice/steal', 'Always has what you need'],
    cons: ['Less thematic', 'Doesn\'t double as weapon', 'Still need gold-cost components separately'],
  },
};

export const WHEN_TO_USE_WHAT = [
  { situation: 'Single-class caster', best: 'Focus', why: 'Thematic. Staff can be quarterstaff weapon.' },
  { situation: 'Multiclass caster', best: 'Component Pouch', why: 'Works for all your casting classes.' },
  { situation: 'Cleric/Paladin with shield', best: 'Holy Symbol on Shield', why: 'Free hand for weapon. Cast with shield hand.' },
  { situation: 'Druid with shield', best: 'Druidic Focus (shield itself if wooden)', why: 'Wooden shield = druidic focus.' },
  { situation: 'Bard', best: 'Instrument', why: 'Performance + spellcasting in one.' },
  { situation: 'Ruby of the War Mage', best: 'Any weapon becomes focus', why: 'Attunement. Weapon + focus in one hand.' },
];

export const COMMON_GOLD_COMPONENTS = [
  { spell: 'Revivify', component: 'Diamond worth 300 gp (consumed)', level: 3 },
  { spell: 'Raise Dead', component: 'Diamond worth 500 gp (consumed)', level: 5 },
  { spell: 'Resurrection', component: 'Diamond worth 1,000 gp (consumed)', level: 7 },
  { spell: 'Greater Restoration', component: 'Diamond dust worth 100 gp (consumed)', level: 5 },
  { spell: 'Chromatic Orb', component: 'Diamond worth 50 gp (not consumed)', level: 1 },
  { spell: 'Find Familiar', component: 'Charcoal, incense, herbs worth 10 gp (consumed)', level: 1 },
  { spell: 'Identify', component: 'Pearl worth 100 gp (not consumed)', level: 1 },
  { spell: 'Arcane Lock', component: 'Gold dust worth 25 gp (consumed)', level: 2 },
  { spell: 'Stoneskin', component: 'Diamond dust worth 100 gp (consumed)', level: 4 },
  { spell: 'Heroes\' Feast', component: 'Gem-encrusted bowl worth 1,000 gp (consumed)', level: 6 },
];

export const FOCUS_TIPS = [
  'Focus replaces M components WITHOUT gold cost. Not consumed ones.',
  'Component pouch: best for multiclass. Works for all classes.',
  'Holy symbol on shield: Cleric/Paladin best setup.',
  'Staff focus = quarterstaff weapon. Two birds, one stone.',
  'Ruby of the War Mage: any weapon becomes arcane focus.',
  'Always carry diamonds. Revivify needs 300 gp diamond.',
  'War Caster feat: somatic components with both hands full.',
  'Druid: wooden shield counts as druidic focus.',
  'Component pouch assumed to have all non-gold components.',
  'Track gold-cost components in your inventory. Focus doesn\'t cover them.',
];
