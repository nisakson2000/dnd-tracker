/**
 * playerCavalierFighterGuide.js
 * Player Mode: Cavalier Fighter — the mounted sentinel
 * Pure JS — no React dependencies.
 */

export const CAVALIER_BASICS = {
  class: 'Fighter (Cavalier)',
  source: 'Xanathar\'s Guide to Everything',
  theme: 'Mark enemies and punish them for attacking allies. Best tanking Fighter. Works great even without a mount.',
  note: 'Despite the name, Cavalier is an incredible tank even on foot. Unwavering Mark forces enemies to attack you. Warding Maneuver protects allies. Hold the Line stops all movement near you.',
};

export const CAVALIER_FEATURES = [
  { feature: 'Bonus Proficiency', level: 3, effect: 'Proficiency in Animal Handling, History, Insight, Performance, or Persuasion. Or one language.', note: 'Minor ribbon. Pick whatever you need.' },
  { feature: 'Born to the Saddle', level: 3, effect: 'Advantage on saves vs falling off mount. Mount/dismount costs 5ft. Land on feet if fall < 10ft.', note: 'Ribbon for mounted combat. Nice but not why you play Cavalier.' },
  { feature: 'Unwavering Mark', level: 3, effect: 'When you hit a creature, mark it. If it attacks anyone but you: you get BA attack with +STR mod bonus damage. STR uses/LR.', note: 'THE core feature. Force enemies to attack you or eat a bonus attack. Tank + damage.' },
  { feature: 'Warding Maneuver', level: 7, effect: 'Reaction: ally (or you) within 5ft hit by attack — add 1d8 to AC. If still hit, target has resistance. CON uses/LR.', note: '+1d8 AC or half damage. CON uses = lots of reactions. Incredible party protection.' },
  { feature: 'Hold the Line', level: 10, effect: 'Creatures provoke OA when moving within your reach (not just leaving). OA hit: speed = 0.', note: 'Sentinel feat built in. ANY movement within your reach triggers OA. Lockdown machine.' },
  { feature: 'Ferocious Charger', level: 15, effect: 'Move 10ft+ in straight line before attack: target makes STR save or is knocked prone.', note: 'Free prone on charge. Works every attack. Advantage on follow-up attacks.' },
  { feature: 'Vigilant Defender', level: 18, effect: 'One OA per creature per turn (not one OA per round). Reaction refreshes at start of each creature\'s turn.', note: 'Multiple OAs per round. With Hold the Line: lock down entire enemy teams. Best tank capstone.' },
];

export const CAVALIER_TACTICS = [
  { tactic: 'Unwavering Mark pressure', detail: 'Hit enemy → marked. They attack your Wizard? You get BA attack with +STR mod damage. Forces enemies to focus you.', rating: 'S' },
  { tactic: 'Hold the Line + PAM', detail: 'L10: OA when moving within reach. With Polearm Master: 10ft reach = enormous lockdown zone.', rating: 'S' },
  { tactic: 'Warding Maneuver + frontline', detail: 'Stand near squishies. Reaction: +1d8 AC or half damage. CON uses = 4-5 per long rest.', rating: 'A' },
  { tactic: 'Vigilant Defender lockdown', detail: 'L18: OA against every creature that moves near you, every round. Nothing gets past you.', rating: 'S' },
  { tactic: 'Cavalier vs Sentinel feat', detail: 'Hold the Line IS Sentinel. Take PAM instead and have both. Save a feat slot.', rating: 'A' },
];

export function unwaveringMarkDamage(strMod, fighterLevel) {
  const extraAttacks = fighterLevel >= 20 ? 4 : fighterLevel >= 11 ? 3 : fighterLevel >= 5 ? 2 : 1;
  return { baDamage: `weapon + ${strMod}`, usesPerLR: strMod, note: 'Bonus action attack with +STR mod damage when marked target attacks ally' };
}

export function wardingManeuverUses(conMod) {
  return Math.max(1, conMod);
}
