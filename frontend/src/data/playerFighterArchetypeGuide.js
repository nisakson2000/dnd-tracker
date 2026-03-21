/**
 * playerFighterArchetypeGuide.js
 * Player Mode: All Fighter subclasses ranked — features, playstyle, and optimization
 * Pure JS — no React dependencies.
 */

export const FIGHTER_ARCHETYPES_RANKED = [
  { subclass: 'Echo Knight', rating: 'S+', role: 'Versatile', key: 'Attack from echo position. Teleport swap. Extra attacks CON/LR.', note: 'Best Fighter subclass.' },
  { subclass: 'Battle Master', rating: 'S', role: 'Tactical', key: 'Superiority dice + maneuvers. Precision Attack, Riposte, Trip.', note: 'Most tactical Fighter.' },
  { subclass: 'Rune Knight', rating: 'S', role: 'Tank/Control', key: 'Giant\'s Might (Large). Fire Rune (restrain). Cloud Rune (redirect).', note: 'Best grappler Fighter.' },
  { subclass: 'Eldritch Knight', rating: 'A+', role: 'Hybrid', key: 'Shield + Absorb Elements. War Magic L7. Booming Blade.', note: 'Tankiest Fighter.' },
  { subclass: 'Samurai', rating: 'A+', role: 'Damage', key: 'BA advantage 3/LR. WIS saves L7. Extra attack for advantage L15.', note: 'GWM/SS dream.' },
  { subclass: 'Champion', rating: 'A', role: 'Simple', key: 'Crit on 19-20 (18-20 L15). Remarkable Athlete.', note: 'Best for beginners.' },
  { subclass: 'Cavalier', rating: 'A', role: 'Defender', key: 'Mark enemies. Warding Maneuver. Hold the Line.', note: 'Best pure defender.' },
  { subclass: 'Psi Warrior', rating: 'A', role: 'Control', key: 'Psionic dice: reduce damage, add force, telekinesis.', note: 'Psychic Battle Master.' },
  { subclass: 'Arcane Archer', rating: 'B+', role: 'Ranged', key: 'Arcane Shot 2/SR. Curving Shot L7.', note: '2/SR too limiting.' },
  { subclass: 'Purple Dragon Knight', rating: 'B', role: 'Support', key: 'Second Wind heals allies. Persuasion expertise.', note: 'Weakest subclass.' },
];

export const FIGHTER_ARCHETYPE_TIPS = [
  'Action Surge: extra FULL action. Best nova feature. 8 attacks at L20.',
  'Fighters get 7 ASIs. More feats than any other class.',
  'PAM + Sentinel: reaction attack on enter reach + speed 0. Best lock-down.',
  'Echo Knight: attack from 30ft, teleport, tank with echo.',
  'Battle Master: Precision Attack turns GWM -5 into a hit.',
  'Eldritch Knight: Shield spell = +5 AC reaction. Nearly unkillable.',
  'Samurai + Action Surge + GWM = 8 attacks with advantage. Devastating.',
  'Second Wind: free BA heal. Use every single fight.',
  'Fighters have the best sustained martial DPR in 5e.',
  'Champion dip (3 levels): 19-20 crits for Paladin crit-fishing builds.',
];
