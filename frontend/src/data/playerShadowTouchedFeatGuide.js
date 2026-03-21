/**
 * playerShadowTouchedFeatGuide.js
 * Player Mode: Shadow Touched — stealth and darkness half-feat
 * Pure JS — no React dependencies.
 */

export const SHADOW_TOUCHED_BASICS = {
  feat: 'Shadow Touched',
  source: "Tasha's Cauldron of Everything",
  type: 'Half-feat (+1 INT, WIS, or CHA)',
  benefits: [
    '+1 to INT, WIS, or CHA.',
    'Learn Invisibility (free cast 1/LR, also castable with spell slots).',
    'Learn one L1 illusion or necromancy spell (free cast 1/LR, also castable with slots).',
  ],
  note: 'Invisibility is always excellent. Slightly weaker than Fey Touched (Misty Step > Invisibility in combat) but still A-tier.',
};

export const BEST_L1_SPELL_PICKS = [
  { spell: 'Inflict Wounds', school: 'Necromancy', rating: 'A', reason: '3d10 necrotic (avg 16.5). Highest L1 single-target damage. Deliver via familiar touch.' },
  { spell: 'Cause Fear', school: 'Necromancy', rating: 'B+', reason: 'Single target frightened for 1 minute. WIS save each turn. No concentration needed.' },
  { spell: 'False Life', school: 'Necromancy', rating: 'B', reason: '1d4+4 temp HP. Not amazing but free cast 1/LR for a small buffer.' },
  { spell: 'Silent Image', school: 'Illusion', rating: 'A', reason: 'Create a 15ft cube illusion. Investigation check to see through. Highly creative uses.' },
  { spell: 'Disguise Self', school: 'Illusion', rating: 'A', reason: 'Change appearance for 1 hour. No concentration. Great for infiltration.' },
  { spell: 'Color Spray', school: 'Illusion', rating: 'C', reason: 'Blinding based on HP. Falls off fast. Not recommended.' },
  { spell: 'Ray of Sickness', school: 'Necromancy', rating: 'B', reason: '2d8 poison + poisoned condition. Many creatures resist poison though.' },
];

export const SHADOW_TOUCHED_CLASS_VALUE = [
  { class: 'Rogue', rating: 'S', reason: 'Invisibility = guaranteed advantage = guaranteed Sneak Attack. Free once per LR. +1 DEX alternative would be better but +1 CHA/WIS works for face Rogues.' },
  { class: 'Bard', rating: 'A', reason: '+1 CHA. Free Invisibility saves a known spell. Disguise Self for infiltration.' },
  { class: 'Warlock', rating: 'A', reason: '+1 CHA. Free Invisibility. Warlocks may already have Invisibility but free cast saves slots.' },
  { class: 'Wizard', rating: 'B', reason: '+1 INT. Wizard already has Invisibility. Take for the L1 pick and stat bump.' },
  { class: 'Cleric', rating: 'B', reason: '+1 WIS. Invisibility not on Cleric list. Good for stealthy Clerics.' },
  { class: 'Fighter/Barbarian', rating: 'B', reason: 'Invisibility for stealth/scouting. But mental stat bump is less useful.' },
];

export const INVISIBILITY_USES = [
  'Scout ahead without being seen.',
  'Set up ambush (attack from invisibility = advantage).',
  'Escape from danger (go invisible and sneak away).',
  'Social infiltration (invisible in restricted areas).',
  'Avoid random encounters while traveling.',
  'Ends when you attack or cast a spell — plan accordingly.',
];

export const FEY_VS_SHADOW_TOUCHED = {
  feyTouched: { spell: 'Misty Step (BA teleport 30ft)', combat: 'S (escape, reposition, dodge)', utility: 'A', overall: 'S' },
  shadowTouched: { spell: 'Invisibility (1 hour stealth)', combat: 'A (advantage on first attack)', utility: 'S (infiltration, scouting)', overall: 'A' },
  verdict: 'Fey Touched is better for combat (Misty Step is instant, BA, no concentration). Shadow Touched is better for stealth/utility. Take Fey Touched first in most cases.',
};
