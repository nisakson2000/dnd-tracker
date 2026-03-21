/**
 * playerHealingEfficiencyGuide.js
 * Player Mode: Healing optimization — efficient healing and when NOT to heal
 * Pure JS — no React dependencies.
 */

export const HEALING_PHILOSOPHY = {
  principle: 'You CANNOT out-heal incoming damage in 5e. Healing is for picking up downed allies, not topping off.',
  bestHealing: 'Prevention > healing. Control spells, AC, positioning save more HP than Cure Wounds.',
};

export const HEALING_SPELLS_RANKED = [
  { spell: 'Healing Word', level: 1, type: 'BA, 60ft', rating: 'S+', note: 'THE healing spell. BA ranged pick-up. Always prepare.' },
  { spell: 'Goodberry', level: 1, type: '10 berries', rating: 'S+ (Life Cleric)', note: 'Life Cleric: 4 HP per berry = 40 HP per slot.' },
  { spell: 'Aura of Vitality', level: 3, type: 'Concentration, BA/round', rating: 'S', note: '20d6 total over 1 min. Best sustained healing.' },
  { spell: 'Revivify', level: 3, type: 'Action, Touch, 300gp', rating: 'S+', note: 'Bring back the dead within 1 min.' },
  { spell: 'Prayer of Healing', level: 2, type: '10 min cast', rating: 'A+', note: 'Out of combat. 2d8+mod to 6 creatures.' },
  { spell: 'Mass Healing Word', level: 3, type: 'BA, 6 targets', rating: 'A+', note: 'Party-wide pick-up. When multiple are down.' },
  { spell: 'Heal', level: 6, type: 'Action, 60ft', rating: 'S', note: '70 flat HP. Actually tops someone off.' },
  { spell: 'Heroes\' Feast', level: 6, type: '1 hr cast', rating: 'S+', note: 'Max HP boost + fear immunity + WIS advantage. 24hr.' },
  { spell: 'Power Word Heal', level: 9, type: 'Action, Touch', rating: 'S', note: 'Full HP + end conditions.' },
  { spell: 'Cure Wounds', level: 1, type: 'Action, Touch', rating: 'B+', note: 'Action + touch = worse than Healing Word usually.' },
];

export const HEALING_COMBOS = [
  { combo: 'Life Cleric + Goodberry', healing: '40 HP / L1 slot', rating: 'S++' },
  { combo: 'Life Cleric + Aura of Vitality', healing: '20d6+60 flat', rating: 'S+' },
  { combo: 'Healer feat + Kit', healing: '1d6+4+level per person/rest', rating: 'A+' },
  { combo: 'Celestial Warlock Healing Light', healing: 'd6 pool, BA, no slot', rating: 'A+' },
];

export const WHEN_TO_HEAL = [
  { situation: 'Ally at 0 HP', action: 'HEAL (Healing Word)', reason: 'Restoring action economy.' },
  { situation: 'Ally at 50% HP', action: 'DON\'T', reason: 'Action better on offense/control.' },
  { situation: 'Ally at 10% HP', action: 'Consider', reason: 'One hit drops them. Insurance.' },
  { situation: 'Out of combat', action: 'HEAL', reason: 'No action economy cost.' },
  { situation: 'Multiple allies down', action: 'Mass Healing Word', reason: 'BA, 6 targets.' },
];

export const HEALING_TIPS = [
  'Healing Word > Cure Wounds. BA + range wins.',
  'Don\'t heal allies at 50%+. Your action is worth more.',
  'Best healing = preventing damage via control spells.',
  'Life Cleric + Goodberry = 40 HP per L1 slot.',
  'Always carry 300gp diamond for Revivify.',
  'Healer feat: no-slot healing. Great on Thief Rogue (BA use).',
  'Short rest Hit Dice are free. Push for short rests.',
  'Heroes\' Feast before boss fights. Max HP + WIS advantage.',
];
