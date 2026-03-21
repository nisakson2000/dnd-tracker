/**
 * playerHarengonRaceGuide.js
 * Player Mode: Harengon (rabbitfolk) — initiative and mobility
 * Pure JS — no React dependencies.
 */

export const HARENGON_BASICS = {
  race: 'Harengon',
  source: 'The Wild Beyond the Witchlight',
  size: 'Small or Medium (your choice)',
  speed: '30 feet',
  traits: [
    { name: 'Hare-Trigger', desc: 'Add proficiency bonus to initiative rolls.' },
    { name: 'Leporine Senses', desc: 'Proficiency in Perception.' },
    { name: 'Lucky Footwork', desc: 'When you fail a DEX save, add 1d4 to the result (possibly turning failure into success). PB uses per LR.' },
    { name: 'Rabbit Hop', desc: 'BA to jump distance = 5 × PB feet without provoking OA. PB uses per LR.' },
  ],
  asi: '+2/+1 or +1/+1/+1 (MotM flexible)',
  note: 'Best initiative race in the game. Rabbit Hop is free disengagement. Lucky Footwork is mini-Shield for saves.',
};

export const HARENGON_CLASS_SYNERGY = [
  { class: 'Gloom Stalker Ranger', rating: 'S', reason: 'Hare-Trigger + Dread Ambusher WIS + Alert = +15+ initiative. Highest possible initiative build.' },
  { class: 'Assassin Rogue', rating: 'S', reason: 'Initiative = Assassinate. Hare-Trigger + Alert makes you almost always go first.' },
  { class: 'Wizard/Sorcerer', rating: 'A', reason: 'Going first to land AoE. Rabbit Hop for emergency escape. Lucky Footwork covers weak DEX saves.' },
  { class: 'Fighter', rating: 'A', reason: 'Rabbit Hop = free disengage as BA. Great for ranged Fighters or hit-and-run.' },
  { class: 'Monk', rating: 'B', reason: 'Monk already has good mobility. Rabbit Hop overlaps with Step of the Wind. Some redundancy.' },
];

export const INITIATIVE_STACKING = [
  { source: 'Hare-Trigger', bonus: '+PB (2-6)', note: 'Scales with level. +2 at L1, +6 at L17.' },
  { source: 'Alert feat', bonus: '+5', note: 'Flat bonus. Stacks with everything.' },
  { source: 'Dread Ambusher (Gloom Stalker)', bonus: '+WIS mod', note: 'Adds WIS to initiative. +5 at WIS 20.' },
  { source: 'DEX modifier', bonus: '+5 max', note: 'Standard initiative stat.' },
  { source: 'Weapon of Warning', bonus: 'Advantage', note: 'Advantage = roughly +5. Stacks with all bonuses.' },
  { source: 'Total possible', bonus: '+21 + advantage', note: 'L17 Harengon Gloom Stalker: DEX 5 + WIS 5 + PB 6 + Alert 5 = +21 + advantage.' },
];

export const RABBIT_HOP_TACTICS = [
  { tactic: 'Escape melee without OA', detail: 'BA Rabbit Hop out of reach. No opportunity attack triggered. Better than Disengage.', rating: 'S' },
  { tactic: 'Hop over obstacles', detail: 'It\'s a jump, not movement. Hop over low walls, across gaps, over enemies.', rating: 'A' },
  { tactic: 'Vertical hop', detail: 'Can jump straight up. Reach ledges, climb walls, avoid ground effects.', rating: 'A' },
  { tactic: 'Small size hop', detail: 'If Small: hop through Tiny spaces. Squeeze where enemies can\'t follow.', rating: 'B' },
];

export function harengonInitiative(dexMod, profBonus, hasAlert, wisMod, hasGloomStalker) {
  let total = dexMod + profBonus;
  if (hasAlert) total += 5;
  if (hasGloomStalker) total += wisMod;
  return { total, note: `Harengon initiative: +${total}` };
}
