/**
 * playerSurpriseRulesGuide.js
 * Player Mode: Surprise rules — how ambushes actually work in 5e
 * Pure JS — no React dependencies.
 */

export const SURPRISE_RULES = {
  determination: 'DM compares each ambushing creature\'s Stealth check vs each target\'s Passive Perception. Each creature is surprised or not individually.',
  surprised: 'A surprised creature can\'t move or take actions on its first turn and can\'t take reactions until that turn ends.',
  notASurpriseRound: '5e does NOT have a "surprise round." Individual creatures are or aren\'t surprised. Initiative is rolled normally.',
  afterFirstTurn: 'After a surprised creature\'s first turn passes (even though they did nothing), they are no longer surprised and can use reactions.',
  alert: 'The Alert feat: "You can\'t be surprised while you are conscious." Negates surprise entirely for that creature.',
  note: 'Common misconception: surprise is per-creature, not per-side. Some enemies can be surprised while others aren\'t.',
};

export const SURPRISE_STEALTH_RULES = [
  { rule: 'Group Stealth check', detail: 'If the WHOLE party is sneaking, some DMs use group check: if half succeed, the group succeeds. RAW: each creature rolls individually.', note: 'One loud ally in heavy armor can ruin surprise for everyone.' },
  { rule: 'Passive Perception baseline', detail: 'Enemies use Passive Perception (10 + WIS mod + proficiency if proficient in Perception). Your Stealth must beat this.', note: 'Average PP is 10-12 for most humanoids. Alert enemies or those with high WIS are harder.' },
  { rule: 'Conditions for hiding', detail: 'You must be heavily obscured or behind total cover to attempt to hide. Can\'t hide in plain sight (usually).', note: 'Halfling Naturally Stealthy: hide behind Medium creatures. Wood Elf: hide in light natural phenomena.' },
  { rule: 'Armor disadvantage', detail: 'Heavy armor and some medium armor impose disadvantage on Stealth. This matters for group ambushes.', note: 'Solution: have the heavy armor wearer stay back during the initial approach.' },
];

export const SURPRISE_TACTICS = [
  { tactic: 'Scout ahead with Rogue', detail: 'High-Stealth Rogue scouts. If enemies don\'t detect the Rogue, party can set up an ambush.', rating: 'S' },
  { tactic: 'Pass Without Trace', detail: '+10 to Stealth for entire party for 1 hour. Even the plate-wearing Paladin becomes stealthy.', rating: 'S' },
  { tactic: 'Ambush at chokepoints', detail: 'Hide at a doorway/corridor. When enemies walk through, spring the ambush. Combine with readied actions.', rating: 'A' },
  { tactic: 'Assassin Rogue opener', detail: 'If enemy is surprised: auto-crit on first hit. Devastating opening Sneak Attack. Requires actual surprise.', rating: 'S' },
  { tactic: 'Gloomstalker Ranger', detail: 'Invisible in darkness to creatures relying on darkvision. Dread Ambusher: extra attack + 1d8 on first turn. Great ambusher.', rating: 'S' },
  { tactic: 'Alert feat for initiative', detail: '+5 to initiative ensures you act first even without surprise. Can\'t be surprised yourself. Defensive and offensive.', rating: 'A' },
];

export const SURPRISE_COMMON_MISTAKES = [
  { mistake: '"Surprise round"', correction: 'There is no surprise round in 5e. Creatures are individually surprised or not. Initiative rolls happen normally.' },
  { mistake: '"Everyone gets a free turn"', correction: 'Only creatures who aren\'t surprised act on round 1. Surprised creatures skip their turn but are no longer surprised after it passes.' },
  { mistake: '"Surprised creatures can\'t react until next round"', correction: 'They can\'t react until the END of their first turn. After their turn passes, they can use reactions (Counterspell, Shield, etc.).' },
  { mistake: '"We all sneak up"', correction: 'Each creature rolls Stealth individually vs each enemy\'s Passive Perception. One failure can spoil it.' },
  { mistake: '"I attack from hiding = surprise"', correction: 'Surprise is determined at the START of combat. You can\'t surprise someone mid-combat by hiding.' },
];

export function stealthVsPassivePerception(stealthRoll, passivePerception) {
  return { surprised: stealthRoll >= passivePerception, margin: stealthRoll - passivePerception };
}

export function passWithoutTraceGroupStealth(partyStealthMods) {
  return partyStealthMods.map(mod => ({ baseMod: mod, withPWT: mod + 10, avgRoll: 10.5 + mod + 10 }));
}
