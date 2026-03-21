/**
 * playerRangerConclaveGuide.js
 * Player Mode: All Ranger subclasses ranked — features, playstyle, and optimization
 * Pure JS — no React dependencies.
 */

export const RANGER_CONCLAVES_RANKED = [
  { subclass: 'Gloom Stalker', rating: 'S+', role: 'Nova/Ambush', key: 'Extra attack+1d8 round 1. +WIS initiative. Invisible to darkvision.', note: 'Best Ranger.' },
  { subclass: 'Fey Wanderer', rating: 'S', role: 'Social/Support', key: '+WIS psychic per target. WIS to CHA checks.', note: 'Best social Ranger.' },
  { subclass: 'Swarmkeeper', rating: 'A+', role: 'Control', key: '+1d6 OR push 15ft OR move self. Hover L7.', note: 'Spike Growth combo.' },
  { subclass: 'Horizon Walker', rating: 'A+', role: 'Mobility', key: 'Force damage +1d8. Teleporting 3-target attack L11.', note: 'Force damage rarely resisted.' },
  { subclass: 'Hunter', rating: 'A', role: 'Versatile', key: 'Colossus Slayer +1d8. Volley/Whirlwind L11.', note: 'Simple, reliable.' },
  { subclass: 'Drake Warden', rating: 'A', role: 'Pet', key: 'Drake companion. Ride at L7. Breath weapon L15.', note: 'Scales well.' },
  { subclass: 'Monster Slayer', rating: 'A', role: 'Anti-boss', key: '+1d6 to marked target. +1d6 saves vs prey.', note: 'Boss killer.' },
  { subclass: 'Beast Master', rating: 'B+ (Tasha\'s)', role: 'Pet', key: 'Primal Companion scales with PB.', note: 'Only Tasha\'s version.' },
];

export const RANGER_CONCLAVE_TIPS = [
  'Gloom Stalker: best Ranger by far. Invisible in darkness to most monsters.',
  'Sharpshooter + Crossbow Expert: best Ranger damage combo.',
  'Tasha\'s optional features: always use Deft Explorer, Primal Awareness, Favored Foe.',
  'Swarmkeeper + Spike Growth: push 15ft = 6d4 damage through the growth.',
  'Pass without Trace is the best spell on the Ranger list.',
  'Beast Master: PHB version is terrible. Tasha\'s Primal Companion fixes it.',
];
