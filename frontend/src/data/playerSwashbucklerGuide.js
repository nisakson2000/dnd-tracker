/**
 * playerSwashbucklerGuide.js
 * Player Mode: Swashbuckler Rogue subclass optimization — the duelist
 * Pure JS — no React dependencies.
 */

export const SWASHBUCKLER_BASICS = {
  class: 'Rogue (Swashbuckler)',
  source: 'Xanathar\'s Guide to Everything / SCAG',
  theme: 'Charming duelist. Sneak Attack without allies. Mobile melee Rogue.',
  note: 'Best melee Rogue. Solves the "Rogue needs an ally for Sneak Attack" problem.',
};

export const SWASHBUCKLER_FEATURES = [
  { feature: 'Fancy Footwork', level: 3, effect: 'When you make a melee attack against a creature, it can\'t take opportunity attacks against you for the rest of your turn.', note: 'Free Disengage from anyone you attack. Hit and run every turn without using Cunning Action.' },
  { feature: 'Rakish Audacity', level: 3, effect: 'Add CHA to initiative. You get Sneak Attack if no creature other than the target is within 5ft of you.', note: 'Solo Sneak Attack! Don\'t need allies nearby. Just need to be 1v1. Plus CHA to initiative.' },
  { feature: 'Panache', level: 9, effect: 'Persuasion vs Insight: charm (out of combat) or taunt (in combat, disadvantage on attacks vs others, can\'t OA others).', note: 'Taunt is a non-magical compelled duel. Charm is powerful social tool.' },
  { feature: 'Elegant Maneuver', level: 13, effect: 'Bonus action: advantage on next Acrobatics or Athletics check.', note: 'Climb, jump, escape grapples with advantage. Frees Cunning Action for other uses.' },
  { feature: 'Master Duelist', level: 17, effect: 'Miss an attack? Reroll with advantage. Once per short rest.', note: 'Turn a missed Sneak Attack into advantage. Huge damage insurance.' },
];

export const SWASHBUCKLER_TACTICS = [
  { tactic: 'Hit and run', detail: 'Move in → attack (Fancy Footwork) → move away. No OA. No Cunning Action needed.', rating: 'S', note: 'Every turn. Free. Defines the playstyle.' },
  { tactic: 'Solo Sneak Attack', detail: 'Engage enemy alone (no one within 5ft of you or target except you two). Rakish Audacity triggers SA.', rating: 'S', note: 'Unlike other Rogues, you don\'t need allies to get SA. Just be the only one fighting them.' },
  { tactic: 'CHA initiative + first strike', detail: 'CHA to initiative (Rakish Audacity). Go first, Sneak Attack before enemy acts.', rating: 'A' },
  { tactic: 'Panache taunt', detail: 'In combat: Persuasion vs Insight. Target has disadvantage on attacks against anyone except you. Can\'t OA others.', rating: 'A', note: 'Taunt the big enemy. Protect the party.' },
  { tactic: 'Booming Blade + Fancy Footwork', detail: 'Booming Blade hit → Fancy Footwork disengage → enemy must move to reach you → triggers Booming Blade extra damage.', rating: 'S', note: 'One of the best cantrip combos in the game.' },
];

export const SWASHBUCKLER_BUILDS = [
  { build: 'Swashbuckler pure (DEX + CHA)', detail: 'Max DEX, secondary CHA for initiative and Panache. Rapier + shield or dual wield.', rating: 'S' },
  { build: 'Swashbuckler 5 / Hexblade 1', detail: 'CHA to attacks (Hexblade). CHA to initiative (Rakish Audacity). Single-stat Rogue.', rating: 'A' },
  { build: 'Swashbuckler X / Battlemaster 3', detail: 'Riposte maneuver = reaction Sneak Attack (once per turn, not per round).', rating: 'A' },
  { build: 'Swashbuckler X / Swords Bard 3', detail: 'Blade Flourishes + Sneak Attack. Extra skills. Inspiration dice.', rating: 'B' },
];

export const BOOMING_BLADE_SWASHBUCKLER = {
  combo: 'Booming Blade → Fancy Footwork → walk away',
  damage: 'Weapon + SA + Booming Blade initial + Booming Blade rider (if they follow)',
  why: 'Fancy Footwork = no OA. Enemy must move to attack you. Moving = triggers Booming Blade bonus damage.',
  scaling: {
    level5: 'Rapier (1d8+DEX) + 3d6 SA + 1d8 Booming + 2d8 rider = huge burst.',
    level11: 'Rapier + 6d6 SA + 2d8 Booming + 3d8 rider = massive.',
  },
};

export function swashbucklerInitiative(dexMod, chaMod) {
  return dexMod + chaMod;
}

export function boomingBladeSwashDPR(rogueLevel, dexMod) {
  const saDice = Math.ceil(rogueLevel / 2);
  const bbDice = rogueLevel >= 17 ? 3 : rogueLevel >= 11 ? 2 : rogueLevel >= 5 ? 1 : 0;
  const rapier = 4.5 + dexMod;
  return rapier + saDice * 3.5 + bbDice * 4.5; // Without rider damage
}
