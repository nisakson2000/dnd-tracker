/**
 * playerActionEconomyMasteryGuide.js
 * Player Mode: Action economy — the most important concept in 5e combat
 * Pure JS — no React dependencies.
 */

export const ACTION_ECONOMY_BASICS = {
  perTurn: {
    action: '1 action (attack, cast a spell, Dash, Dodge, Help, Hide, etc.)',
    bonusAction: '1 bonus action (only if you have a feature/spell that uses it)',
    reaction: '1 reaction per round (opportunity attack, Shield, Counterspell, etc.)',
    movement: 'Speed in feet (typically 30ft). Can split before/after actions.',
    freeAction: 'Interact with one object (draw weapon, open door, etc.)',
  },
  principle: 'The side with more actions per round generally wins.',
};

export const ACTION_ECONOMY_MULTIPLIERS = [
  { source: 'Action Surge (Fighter)', type: 'Extra action', rating: 'S+', detail: 'Entire extra action. Best action economy feature in the game.' },
  { source: 'Extra Attack', type: 'More attacks per action', rating: 'S+', detail: '2 attacks at L5. Fighter gets 3 (L11) then 4 (L20).' },
  { source: 'Haste', type: 'Extra action (limited)', rating: 'S+', detail: 'Extra action for 1 attack, Dash, Disengage, or Hide. Double speed.' },
  { source: 'Bonus Action attacks', type: 'Extra attack', rating: 'A+ to S', detail: 'PAM, Crossbow Expert, Two-Weapon Fighting, Flurry of Blows.' },
  { source: 'Spiritual Weapon', type: 'BA attack (no concentration)', rating: 'S', detail: 'Free BA attack every round for 1 minute.' },
  { source: 'Quickened Spell (Sorcerer)', type: 'Spell as BA', rating: 'S', detail: 'Cast a leveled spell as BA + cantrip as action.' },
  { source: 'Conjure Animals/Animate Objects', type: 'Extra creatures', rating: 'S+', detail: '8 wolves or 10 objects = massive action multiplication.' },
  { source: 'Twin Spell (Sorcerer)', type: 'Double target', rating: 'S', detail: 'One spell hits two targets. Haste on two allies.' },
];

export const ACTION_ECONOMY_DENIERS = [
  { method: 'Stunning Strike (Monk)', effect: 'Target loses their entire turn.', rating: 'S+' },
  { method: 'Hypnotic Pattern', effect: 'Incapacitate multiple enemies.', rating: 'S+' },
  { method: 'Hold Person/Monster', effect: 'Paralyzed = no actions + auto-crits.', rating: 'S' },
  { method: 'Banishment', effect: 'Remove creature entirely.', rating: 'S' },
  { method: 'Wall of Force', effect: 'Split the encounter. Half enemies can\'t participate.', rating: 'S+' },
  { method: 'Forcecage', effect: 'Trap enemies. No escape without teleportation.', rating: 'S+' },
  { method: 'Sleep (early levels)', effect: 'Remove multiple low-HP enemies. No save.', rating: 'S (L1-4)' },
  { method: 'Sentinel OA', effect: 'Speed = 0. Enemy can\'t reach their target.', rating: 'S' },
  { method: 'Killing enemies', effect: 'Dead enemies take 0 actions. Focus fire is best denial.', rating: 'S+' },
];

export const ACTION_ECONOMY_TACTICS = [
  'Focus fire: killing one enemy removes their ENTIRE action economy.',
  'Control > damage: Hypnotic Pattern on 4 enemies = denying 4 actions per round.',
  'Never waste your action on something that doesn\'t matter.',
  'Bonus action: if you have nothing to use it on, get a feature that does.',
  'Reaction: Shield, Counterspell, OA — your reaction is a free extra action.',
  'Summon spells multiply your party\'s actions enormously.',
  'Action Surge is the best 2-level dip because an extra action is priceless.',
  'Pre-combat buffing is free action economy. Cast before the fight.',
  'Dodge action is underrated if you can\'t do anything useful.',
];

export const ACTION_ECONOMY_MISTAKES = [
  { mistake: 'Spreading damage across all enemies', fix: 'Focus fire. Dead enemies deal 0 damage.' },
  { mistake: 'Using action to Disengage every turn', fix: 'Just take the OA. 1 hit costs less than your whole action.' },
  { mistake: 'Ignoring bonus action', fix: 'Plan for feats or spells that use BA.' },
  { mistake: 'Not using reaction', fix: 'OA, Shield, Absorb Elements, Counterspell — reactions are free.' },
  { mistake: 'Buffing after combat starts', fix: 'Pre-buff if you know combat is coming.' },
];
