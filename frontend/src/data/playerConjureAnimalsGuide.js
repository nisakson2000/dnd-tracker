/**
 * playerConjureAnimalsGuide.js
 * Player Mode: Conjure Animals — the action economy king
 * Pure JS — no React dependencies.
 */

export const CONJURE_ANIMALS_BASICS = {
  spell: 'Conjure Animals',
  level: 3,
  school: 'Conjuration',
  castingTime: '1 action',
  range: '60ft',
  duration: 'Concentration, up to 1 hour',
  classes: ['Druid', 'Ranger'],
  note: 'One of the most powerful L3 spells. Summon 8 CR 1/4 beasts = 8 extra attacks per round. Dominates action economy. DM chooses the creatures (RAW) but many DMs let you pick.',
};

export const CONJURE_AMOUNTS = [
  { cr: '2', count: 1, note: 'One CR 2 beast (Giant Constrictor Snake, etc.). Single creature is weakest option.' },
  { cr: '1', count: 2, note: 'Two CR 1 beasts (Brown Bears, Dire Wolves). Moderate but not optimal.' },
  { cr: '1/2', count: 4, note: 'Four CR 1/2 beasts (Giant Goats, Apes). Decent. 4 attacks per round.' },
  { cr: '1/4', count: 8, note: 'Eight CR 1/4 beasts (Wolves, Giant Badgers, Elk). BEST option. 8 attacks per round. Overwhelming action economy.' },
];

export const BEST_CONJURED_BEASTS = [
  { beast: 'Wolf', cr: '1/4', hp: 11, attack: '+4, 2d4+2', special: 'Pack Tactics (advantage when ally within 5ft). Knock prone on hit (STR save).', note: '8 wolves = 8 attacks with advantage + prone chance each hit. Devastating.', rating: 'S' },
  { beast: 'Giant Badger', cr: '1/4', hp: 13, attack: '+3, bite 1d6+1 + claws 2d4+1', special: 'Multiattack. Darkvision 30ft. Burrow 10ft.', note: '8 badgers = 16 attacks per round (multiattack). More attacks than wolves.', rating: 'S' },
  { beast: 'Elk', cr: '1/4', hp: 13, attack: '+5, 1d6+3', special: 'Charge: 20ft straight → 2d6 extra + knock prone (STR DC 13).', note: '8 elk charges = 8 × (1d6+3+2d6) = massive damage if they charge.', rating: 'A' },
  { beast: 'Velociraptor', cr: '1/4', hp: 10, attack: '+4, bite 1d6+2 + claws 1d4+2', special: 'Multiattack. Pack Tactics.', note: '8 velociraptors = 16 attacks with advantage. Best DPR option.', rating: 'S' },
  { beast: 'Giant Owl', cr: '1/4', hp: 19, attack: '+3, talons 2d6+1', special: 'Flyby (no OA). 120ft darkvision. 60ft fly.', note: 'Can carry Small creatures. Flyby attacks. Good utility.', rating: 'A' },
];

export const CONJURE_ANIMALS_TACTICS = [
  { tactic: '8 wolves surrounding a target', detail: 'All wolves attack one target. Pack Tactics = advantage on all attacks. Prone chance on each hit. Target is overwhelmed.', rating: 'S' },
  { tactic: 'Action economy flooding', detail: '8 extra attacks per round means 8 extra concentration checks on enemy casters. Even 1-2 damage per hit forces CON saves.', rating: 'S' },
  { tactic: 'Body blocking', detail: '8 beasts create a wall of bodies. Block corridors, protect the caster, create difficult terrain for enemies.', rating: 'A' },
  { tactic: 'Scatter for scouting', detail: 'Send wolves/owls in 8 directions to scout. If one dies, you know where the enemy is.', rating: 'A' },
  { tactic: 'Grapple assist', detail: 'Giant Constrictor Snake (CR 2): grapple + restrain on hit. Or 8 wolves knock prone for melee advantage.', rating: 'A' },
];

export const CONJURE_ANIMALS_ISSUES = [
  { issue: 'Table speed', detail: '8 creatures = 8 attack rolls, damage rolls, movement. Can add 5-10 minutes to your turn.', fix: 'Roll all attacks simultaneously. Pre-calculate damage. Use average damage.' },
  { issue: 'DM chooses creatures (RAW)', detail: 'RAW: "you choose the CR, DM chooses the specific beast." Many DMs let you pick.', fix: 'Discuss with DM before game. Most DMs allow player choice.' },
  { issue: 'Concentration', detail: 'Losing concentration = all 8 disappear. Protect your concentration at all costs.', fix: 'War Caster. Resilient (CON). Position safely.' },
];

export function conjuredBeastDPR(count, attackBonus, targetAC, avgDamagePerHit, hasPackTactics = false) {
  let hitChance = Math.min(0.95, Math.max(0.05, (attackBonus + 21 - targetAC) / 20));
  if (hasPackTactics) hitChance = 1 - (1 - hitChance) * (1 - hitChance); // advantage
  return { dpr: Math.round(count * hitChance * avgDamagePerHit * 10) / 10, count, hitChance: Math.round(hitChance * 100) };
}
