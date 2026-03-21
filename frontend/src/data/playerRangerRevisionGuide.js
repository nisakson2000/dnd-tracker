/**
 * playerRangerRevisionGuide.js
 * Player Mode: Ranger — PHB vs Tasha's, how to make Ranger work
 * Pure JS — no React dependencies.
 */

export const RANGER_OVERVIEW = {
  class: 'Ranger',
  role: 'Martial half-caster. Explorer, tracker, nature warrior.',
  problem: 'PHB Ranger has notoriously weak features. Tasha\'s fixes most issues.',
  note: 'Always use Tasha\'s optional features. They replace weak PHB features with strong ones.',
};

export const PHB_VS_TASHAS = [
  { feature: 'Favored Enemy', phb: 'Language + advantage on Survival to track. No combat benefit.', tashas: 'Favored Foe: 1d4-1d8 per hit (concentration-free Hunter\'s Mark).', verdict: 'Tasha\'s. Free damage without concentration.' },
  { feature: 'Natural Explorer', phb: 'Favored terrain bonuses. Useless outside that terrain.', tashas: 'Deft Explorer: Expertise, languages, climbing/swimming speed.', verdict: 'Tasha\'s. Always useful vs terrain-dependent.' },
  { feature: 'Primeval Awareness', phb: 'Spend a slot to know if favored enemies are within 1 mile. No direction.', tashas: 'Primal Awareness: Free castings of specific spells.', verdict: 'Tasha\'s. Free spells vs worthless detection.' },
  { feature: 'Hide in Plain Sight', phb: '1 minute setup for +10 Stealth while motionless. Can\'t move.', tashas: 'Nature\'s Veil: BA invisibility until start of next turn. PB/LR.', verdict: 'Tasha\'s. Usable in combat. BA invisibility.' },
];

export const BEST_RANGER_SPELLS = [
  { spell: 'Goodberry', level: 1, rating: 'S', note: '10 berries = 10 days food OR 10 emergency 1 HP heals. Ritual out of combat.' },
  { spell: 'Pass Without Trace', level: 2, rating: 'S', note: '+10 Stealth for entire party. Best stealth spell in the game.' },
  { spell: 'Conjure Animals', level: 3, rating: 'S', note: '8 creatures = 8 attacks = massive DPR. Best Ranger damage spell.' },
  { spell: 'Absorb Elements', level: 1, rating: 'S', note: 'Halve elemental damage. Essential reaction.' },
  { spell: 'Spike Growth', level: 2, rating: 'A+', note: 'Area control. 2d4/5ft moved through it.' },
  { spell: 'Healing Spirit', level: 2, rating: 'A+', note: 'Best out-of-combat healing. Up to 1+mod uses.' },
  { spell: 'Summon Beast', level: 2, rating: 'A', note: 'Tasha\'s summon. Reliable, scales, no DM-chosen form.' },
  { spell: 'Guardian of Nature', level: 4, rating: 'A+', note: 'Great Tree: advantage on CON saves + 10ft difficult terrain. Primal Beast: advantage on attacks + extra damage.' },
];

export const RANGER_SUBCLASS_QUICK_PICKS = [
  { subclass: 'Gloom Stalker', rating: 'S', why: 'Best round 1 burst. Invisible to Darkvision. WIS to initiative.' },
  { subclass: 'Horizon Walker', rating: 'A', why: 'Force damage bonus. Teleport between attacks at L11.' },
  { subclass: 'Swarmkeeper', rating: 'A', why: 'Push/pull on hit. Spike Growth combo. Free forced movement.' },
  { subclass: 'Fey Wanderer', rating: 'A+', why: 'WIS to CHA checks. Psychic damage. Best face Ranger.' },
  { subclass: 'Beast Master (Tasha\'s)', rating: 'B+', why: 'Primal Companion (Tasha\'s) is decent. PHB version is bad.' },
  { subclass: 'Hunter', rating: 'B+', why: 'Simple and effective. Horde Breaker or Colossus Slayer.' },
  { subclass: 'Monster Slayer', rating: 'B', why: 'Counter casters. Niche but effective vs spellcasting monsters.' },
];

export const RANGER_TIPS = [
  'ALWAYS use Tasha\'s optional features. They\'re strict upgrades.',
  'Archery fighting style is mandatory for ranged Rangers (+2 to hit).',
  'Crossbow Expert + Sharpshooter is the highest sustained DPR for Rangers.',
  'Pass Without Trace is your best party spell. Cast it before sneaking.',
  'Gloom Stalker + Fighter 2 (Action Surge) = 7 attacks round 1.',
  'Conjure Animals is your most powerful L3 spell. 8 beasts = absurd damage.',
  'Rangers are better than their reputation. Tasha\'s made them competitive.',
];
