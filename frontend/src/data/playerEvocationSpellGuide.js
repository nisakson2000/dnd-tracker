/**
 * playerEvocationSpellGuide.js
 * Player Mode: Evocation spells — damage, blasting, and area control
 * Pure JS — no React dependencies.
 */

export const EVOCATION_SPELLS_RANKED = [
  { spell: 'Eldritch Blast', level: 0, rating: 'S+', note: 'Best damage cantrip with invocations. 1d10 force per beam (1-4 beams).' },
  { spell: 'Fire Bolt', level: 0, rating: 'A', note: '1d10-4d10 fire. Good default cantrip. 120ft range.' },
  { spell: 'Sacred Flame', level: 0, rating: 'A', note: 'DEX save, radiant. Ignores cover. Worse damage than Toll the Dead but consistent.' },
  { spell: 'Magic Missile', level: 1, rating: 'A+', note: '3d4+3 force, auto-hit. Only Shield blocks it. Guaranteed concentration breaker (3 checks).' },
  { spell: 'Thunderwave', level: 1, rating: 'A', note: '2d8 thunder + push 10ft. CON save. AoE push. Noisy.' },
  { spell: 'Shatter', level: 2, rating: 'A', note: '3d8 thunder in 10ft sphere. 60ft range. Good early AoE.' },
  { spell: 'Scorching Ray', level: 2, rating: 'A+', note: '3 rays × 2d6 fire. Attack rolls. Can target different creatures. Upscales well.' },
  { spell: 'Fireball', level: 3, rating: 'S', note: '8d6 fire in 20ft sphere. 150ft range. Intentionally overtuned for its level.' },
  { spell: 'Lightning Bolt', level: 3, rating: 'A+', note: '8d6 lightning in 100ft line. Same damage as Fireball but line is harder to optimize.' },
  { spell: 'Spirit Guardians', level: 3, rating: 'S+', note: '3d8 radiant/round to enemies in 15ft radius. Best sustained damage. Cleric staple.' },
  { spell: 'Wall of Fire', level: 4, rating: 'S', note: '5d8 fire to creatures on one side. Zone control. Concentration.' },
  { spell: 'Ice Storm', level: 4, rating: 'A', note: '2d8 bludgeoning + 4d6 cold + difficult terrain. AoE + area denial.' },
  { spell: 'Cone of Cold', level: 5, rating: 'A', note: '8d8 cold in 60ft cone. Big AoE. Less efficient than Fireball per slot level.' },
  { spell: 'Synaptic Static', level: 5, rating: 'S', note: '8d6 psychic + -1d6 to attacks/checks/CON saves for 1 minute. Best L5 AoE.' },
  { spell: 'Chain Lightning', level: 6, rating: 'A+', note: '10d8 lightning to one target, 3 secondary targets take half (DEX save).' },
  { spell: 'Sunbeam', level: 6, rating: 'A', note: '6d8 radiant line, blinds, undead disadvantage. Repeat as action each turn. Concentration.' },
  { spell: 'Delayed Blast Fireball', level: 7, rating: 'A', note: '12d6+ fire, increases 1d6/round held. Concentration but devastating if held.' },
  { spell: 'Prismatic Wall', level: 9, rating: 'S', note: '7 layers, each with different damage + effect. Near-impenetrable barrier.' },
  { spell: 'Meteor Swarm', level: 9, rating: 'S', note: '40d6 fire+bludgeoning across 4 40ft-radius spheres. Ultimate damage spell.' },
];

export const EVOCATION_TIPS = [
  'Sculpt Spells (Evocation Wizard): allies auto-succeed on YOUR evocation saves + take 0 damage. Fireball the melee safely.',
  'Overchannel (Evocation Wizard L14): maximize damage dice on L5 or lower spell 1/LR for free. 48 damage Fireball.',
  'Magic Missile forces 3 separate concentration checks (1 per missile). Good for breaking enemy concentration.',
  'Fireball is intentionally stronger than other L3 spells. Use it. 8d6 at L3 is above the curve.',
  'Synaptic Static > Fireball at L5. Same AoE, psychic damage (less resisted), AND a lingering -1d6 debuff.',
  'Spirit Guardians deals damage EVERY round. Over 3 rounds vs 3 enemies = 9d8×3 = better than Fireball.',
  'Wall of Fire is zone control, not just damage. Split the battlefield. Force enemies through it.',
  'Meteor Swarm: 40d6 (140 avg). One casting ends most encounters. But most campaigns never reach L9 spells.',
];

export const DAMAGE_TYPE_RESISTANCE = {
  note: 'Damage type matters. Fire is the most resisted, force is the least.',
  frequency: [
    { type: 'Fire', resistedBy: 'Very Common (40+ creatures)', immuneBy: 'Common (37+)', note: 'Most resisted. Still good because of spell options.' },
    { type: 'Cold', resistedBy: 'Common (30+)', immuneBy: 'Moderate (20+)', note: 'Second most resisted.' },
    { type: 'Lightning', resistedBy: 'Moderate (20+)', immuneBy: 'Moderate (15+)', note: 'Middle of the pack.' },
    { type: 'Thunder', resistedBy: 'Rare (5-10)', immuneBy: 'Very Rare', note: 'Excellent. Rarely resisted.' },
    { type: 'Psychic', resistedBy: 'Rare (3-5)', immuneBy: 'Very Rare', note: 'Excellent. Almost never resisted.' },
    { type: 'Force', resistedBy: 'Almost None', immuneBy: 'None', note: 'Best damage type. Nothing resists force.' },
    { type: 'Radiant', resistedBy: 'Rare', immuneBy: 'Very Rare', note: 'Excellent. Bonus vs undead/fiends.' },
    { type: 'Necrotic', resistedBy: 'Common (undead)', immuneBy: 'Common (undead)', note: 'Good vs living. Bad vs undead.' },
  ],
};
