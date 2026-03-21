/**
 * playerSpellComponentCostGuide.js
 * Player Mode: Costly spell components — what you need and where to get them
 * Pure JS — no React dependencies.
 */

export const COSTLY_COMPONENTS = [
  { spell: 'Revivify', level: 3, component: 'Diamond (300 gp)', consumed: true, note: 'ALWAYS carry spares. Non-negotiable death insurance.' },
  { spell: 'Raise Dead', level: 5, component: 'Diamond (500 gp)', consumed: true, note: 'Revive within 10 days.' },
  { spell: 'Resurrection', level: 7, component: 'Diamond (1,000 gp)', consumed: true, note: 'Revive within 100 years. Body not needed.' },
  { spell: 'True Resurrection', level: 9, component: 'Diamond (25,000 gp)', consumed: true, note: 'Revive within 200 years. No body needed.' },
  { spell: 'Greater Restoration', level: 5, component: 'Diamond dust (100 gp)', consumed: true, note: 'Cures curse, petrify, exhaustion, etc.' },
  { spell: 'Heroes\' Feast', level: 6, component: 'Gem-encrusted bowl (1,000 gp)', consumed: false, note: 'NOT consumed. One purchase. Immune to poison/frighten.' },
  { spell: 'Chromatic Orb', level: 1, component: 'Diamond (50 gp)', consumed: false, note: 'Not consumed. One purchase covers forever.' },
  { spell: 'Find Familiar', level: 1, component: 'Charcoal + incense + herbs (10 gp)', consumed: true, note: 'Consumed each cast. Resummon = 10 gp.' },
  { spell: 'Identify', level: 1, component: 'Pearl (100 gp)', consumed: false, note: 'Not consumed. Ritual cast. One purchase.' },
  { spell: 'Arcane Lock', level: 2, component: 'Gold dust (25 gp)', consumed: true, note: 'Consumed. Lock doors permanently.' },
  { spell: 'Glyph of Warding', level: 3, component: 'Powdered diamond + incense (200 gp)', consumed: true, note: 'Consumed each cast. Expensive trap.' },
  { spell: 'Stoneskin', level: 4, component: 'Diamond dust (100 gp)', consumed: true, note: 'Consumed. Resistance to BPS.' },
  { spell: 'Scrying', level: 5, component: 'Crystal ball or holy water font (1,000 gp)', consumed: false, note: 'Not consumed. One purchase.' },
  { spell: 'Contingency', level: 6, component: 'Ivory statuette (1,500 gp)', consumed: false, note: 'Not consumed. Pre-set emergency spell.' },
  { spell: 'Simulacrum', level: 7, component: 'Snow + ruby dust (1,500 gp)', consumed: true, note: 'Consumed. Create clone of yourself.' },
  { spell: 'Clone', level: 8, component: 'Diamond (1,000 gp) + vessel (2,000+ gp)', consumed: true, note: 'Consumed. Backup body. Auto-resurrect.' },
  { spell: 'Gate', level: 9, component: 'Diamond (5,000 gp)', consumed: false, note: 'Not consumed. Planar portal.' },
];

export const SHOPPING_PRIORITY = [
  { priority: 1, item: 'Diamonds (300 gp) × 3', total: '900 gp', note: 'Revivify. Always have 3 spares.' },
  { priority: 2, item: 'Diamond dust (100 gp) × 5', total: '500 gp', note: 'Greater Restoration. Multiple uses needed.' },
  { priority: 3, item: 'Diamond (500 gp)', total: '500 gp', note: 'Raise Dead backup.' },
  { priority: 4, item: 'Pearl (100 gp)', total: '100 gp', note: 'Identify. One purchase.' },
  { priority: 5, item: 'Gem-encrusted bowl (1,000 gp)', total: '1,000 gp', note: 'Heroes\' Feast. Not consumed. Long-term investment.' },
];

export const COMPONENT_TIPS = [
  'Revivify diamond (300 gp): ALWAYS carry 2-3. Non-negotiable.',
  'Consumed vs not consumed: check before buying multiples.',
  'Component pouch: covers ALL non-costly components. Universal.',
  'Focus replaces non-costly M components. Not costly ones.',
  'Shop for components when in cities. Dungeons don\'t have gem shops.',
  'Greater Restoration (100 gp diamond dust): needed for curses, petrify.',
  'Heroes\' Feast bowl: 1,000 gp but NOT consumed. Best investment.',
  'Pearl for Identify: 100 gp, not consumed. One purchase forever.',
  'Track consumed components. You will run out at bad moments.',
  'Ask DM about component availability in smaller towns.',
];
