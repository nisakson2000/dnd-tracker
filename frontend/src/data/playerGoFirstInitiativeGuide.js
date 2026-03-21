/**
 * playerGoFirstInitiativeGuide.js
 * Player Mode: Initiative optimization — go first, act first, win first
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_FORMULA = {
  base: '1d20 + DEX modifier',
  tiebreaker: 'Higher DEX goes first. If still tied, DM decides (often re-roll or player choice).',
  note: 'Going first is MASSIVE. First-turn spells and attacks shape the entire fight.',
};

export const INITIATIVE_BOOSTERS = [
  { source: 'Alert feat', bonus: '+5 initiative', how: 'Flat +5. Can\'t be surprised.', rating: 'S+', note: 'Best initiative boost in the game. Also anti-surprise.' },
  { source: 'High DEX', bonus: '+1 to +5', how: 'DEX modifier directly adds to initiative.', rating: 'S', note: 'Max DEX = +5. Natural for DEX builds.' },
  { source: 'War Wizard (Wizard)', bonus: '+INT mod', how: 'Tactical Wit: add INT to initiative.', rating: 'S', note: '+5 INT + DEX mod = +10 initiative.' },
  { source: 'Swashbuckler (Rogue)', bonus: '+CHA mod', how: 'Rakish Audacity: add CHA to initiative.', rating: 'A+', note: 'CHA + DEX = double stat initiative.' },
  { source: 'Dread Ambusher (Ranger)', bonus: '+WIS mod', how: 'Add WIS to initiative.', rating: 'A+', note: 'Plus extra attack + 1d8 on first turn.' },
  { source: 'Gift of Alacrity (Chronurgy)', bonus: '+1d8', how: 'L1 Dunamancy spell. 8 hours, no concentration.', rating: 'A+', note: 'Average +4.5. Lasts all day.' },
  { source: 'Weapon of Warning', bonus: 'Advantage', how: 'Advantage on initiative. Also can\'t be surprised.', rating: 'A+', note: 'Uncommon magic item. Advantage = roughly +5.' },
  { source: 'Barbarian (Feral Instinct)', bonus: 'Advantage', how: 'L7. Advantage on initiative. Can act while surprised.', rating: 'A', note: 'Also act on surprise round if you rage.' },
  { source: 'Bard (Jack of All Trades)', bonus: '+half proficiency', how: 'Applies to initiative (it\'s a DEX check).', rating: 'A', note: '+1 to +3 depending on level. Often forgotten.' },
  { source: 'Harengon (race)', bonus: '+proficiency', how: 'Hare Trigger: add proficiency bonus to initiative.', rating: 'A+', note: '+2 to +6. Best racial initiative boost.' },
];

export const WHY_INITIATIVE_MATTERS = [
  { reason: 'Control Spells Land First', example: 'Hypnotic Pattern on round 1 before enemies act. Fight over.', impact: 'S+' },
  { reason: 'Alpha Strike Damage', example: 'Rogue/Fighter/Paladin nova before enemies react.', impact: 'S' },
  { reason: 'Positioning', example: 'Move to optimal position before enemies close distance.', impact: 'A+' },
  { reason: 'Buff Allies', example: 'Bless/Faerie Fire before allies\' turns. Everyone benefits round 1.', impact: 'A+' },
  { reason: 'Counter Enemy Casters', example: 'Counterspell ready. Or attack caster before they cast.', impact: 'A' },
];

export const INITIATIVE_STACKING = [
  { build: 'War Wizard + Alert + High DEX', total: '+5 (DEX) + 5 (INT) + 5 (Alert) = +15', note: 'Average roll: 25.5. You always go first.' },
  { build: 'Swashbuckler + Alert', total: '+5 (DEX) + 5 (CHA) + 5 (Alert) = +15', note: 'CHA + DEX rogue going first = devastating.' },
  { build: 'Gloom Stalker + Alert', total: '+5 (DEX) + 5 (WIS) + 5 (Alert) = +15 + extra attack', note: '+15 and Dread Ambusher extra attack. Devastating.' },
  { build: 'Harengon Bard + Alert', total: '+5 (DEX) + 3 (JoAT) + 5 (Alert) + 6 (prof) = +19', note: 'Average roll: 29.5 at L20. Absurd.' },
];

export const INITIATIVE_TIPS = [
  'Alert feat: +5 initiative + can\'t be surprised. Take it.',
  'Going first with a control spell can end fights before they start.',
  'Bard: Jack of All Trades applies to initiative. Don\'t forget.',
  'Weapon of Warning: advantage on initiative. Seek this item.',
  'War Wizard: +INT to initiative. +5 with 20 INT.',
  'Gloom Stalker: +WIS to initiative AND extra attack round 1.',
  'High initiative = cast Hypnotic Pattern before enemies act.',
  'If your initiative is low, Ready your action instead.',
  'Gift of Alacrity: +1d8 initiative for 8 hours. Amazing spell.',
  'Stack initiative bonuses. Going first is one of the biggest advantages in 5e.',
];
