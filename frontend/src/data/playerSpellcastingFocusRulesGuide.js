/**
 * playerSpellcastingFocusRulesGuide.js
 * Player Mode: Spellcasting focus, components, and free hand rules
 * Pure JS — no React dependencies.
 */

export const COMPONENT_RULES = {
  verbal: { symbol: 'V', rule: 'Must speak in a clear voice.', note: 'Silenced = can\'t cast V spells. Subtle Spell bypasses this.' },
  somatic: { symbol: 'S', rule: 'Must have one free hand to gesture.', note: 'Shield + weapon = no free hand for S. Focus can replace M but not S.' },
  material: { symbol: 'M', rule: 'Must have the material or a focus. If material has a cost or is consumed, focus can\'t replace it.', note: 'Focus replaces non-costly materials. Costly materials must be held.' },
};

export const FOCUS_TYPES = [
  { focus: 'Arcane Focus', users: ['Sorcerer', 'Warlock', 'Wizard'], examples: 'Staff, wand, crystal, orb, rod.', note: 'Held in one hand. Replaces M components without a cost.' },
  { focus: 'Holy Symbol', users: ['Cleric', 'Paladin'], examples: 'Amulet, emblem, reliquary.', note: 'Can be worn (amulet) or on a shield (emblem). Frees up a hand.' },
  { focus: 'Druidic Focus', users: ['Druid'], examples: 'Sprig of mistletoe, yew wand, wooden staff.', note: 'Staff doubles as a weapon (quarterstaff).' },
  { focus: 'Component Pouch', users: ['Any caster'], examples: 'Small belt pouch.', note: 'Universal. Works for all non-costly material components.' },
  { focus: 'Musical Instrument', users: ['Bard'], examples: 'Lute, flute, drum, etc.', note: 'Bard-specific. Must be played to cast.' },
  { focus: 'Artificer Tools', users: ['Artificer'], examples: 'Thieves\' tools or artisan tools.', note: 'Must have tools in hand. Infused item can also serve as focus.' },
];

export const FREE_HAND_PROBLEM = {
  problem: 'Somatic (S) components require a free hand. If you hold a weapon + shield, no free hand.',
  solutions: [
    { solution: 'War Caster feat', detail: 'Perform somatic components with hands full of weapons/shields.', rating: 'S', note: 'Best solution. Also gives concentration advantage and OA spells.' },
    { solution: 'Holy Symbol on shield', detail: 'Cleric/Paladin: emblem on shield acts as focus AND frees hand for S (if spell has M component).', rating: 'A+', note: 'Only works for spells with M component. V+S only still needs free hand.' },
    { solution: 'Drop weapon (free)', detail: 'Drop weapon (free interaction) → cast → pick up weapon (free interaction next turn).', rating: 'B', note: 'Works but clunky. Enemy could pick up your weapon.' },
    { solution: 'Ruby of the War Mage', detail: 'Common magic item. Attach to weapon = weapon is your focus.', rating: 'A', note: 'Weapon becomes focus. Still need War Caster for S-only spells.' },
    { solution: 'Staff as focus + weapon', detail: 'Use a staff as both focus and quarterstaff.', rating: 'A', note: 'Works for any caster with staff focus.' },
  ],
};

export const COSTLY_COMPONENTS = {
  rule: 'If a spell lists a material cost (e.g., "diamond worth 300gp"), you MUST have that specific item. A focus cannot replace it.',
  consumed: 'If the spell says "which the spell consumes," the material is used up on casting.',
  examples: [
    { spell: 'Revivify', component: 'Diamonds worth 300gp (consumed)', note: 'Must have actual diamonds. Consumed each cast.' },
    { spell: 'Chromatic Orb', component: 'Diamond worth 50gp (not consumed)', note: 'Need the diamond but keep it. One-time purchase.' },
    { spell: 'Identify', component: 'Pearl worth 100gp (not consumed)', note: 'Buy once, use forever.' },
    { spell: 'Find Familiar', component: 'Charcoal, incense, herbs worth 10gp (consumed)', note: 'Consumed each time you cast/resummon.' },
    { spell: 'Resurrection', component: 'Diamond worth 1000gp (consumed)', note: 'Expensive but saves a life.' },
  ],
};

export const SUBTLE_SPELL = {
  metamagic: 'Subtle Spell',
  cost: '1 Sorcery Point',
  effect: 'Cast without V or S components.',
  benefits: [
    'Can\'t be Counterspelled (Counterspell requires seeing/hearing the casting).',
    'Cast in social situations without anyone noticing.',
    'Cast while Silenced.',
    'Cast while restrained or grappled (if S is the issue).',
  ],
  rating: 'S',
  note: 'Best Sorcerer metamagic for utility. Subtle Counterspell = uncounterable counter.',
};
