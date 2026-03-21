/**
 * playerTeamworkTactics.js
 * Player Mode: Coordinated party tactics and combo strategies
 * Pure JS — no React dependencies.
 */

export const PARTY_COMBOS = [
  { name: 'Hold & Smite', participants: ['Caster', 'Paladin'], setup: 'Caster holds enemy with Hold Person/Monster. Paladin attacks.', result: 'Paralyzed = auto-crit within 5ft. Smite crits deal massive damage.', rating: 'S' },
  { name: 'Web & Burn', participants: ['Wizard', 'Any fire source'], setup: 'Web to restrain enemies. Set the web on fire.', result: '2d4 fire damage + restrained + difficult terrain.', rating: 'A' },
  { name: 'Darkness + Devil\'s Sight', participants: ['Warlock', 'Anyone'], setup: 'Warlock casts Darkness. Uses Devil\'s Sight invocation.', result: 'Warlock attacks with advantage (can see). Enemies blinded. Party stays out.', rating: 'A' },
  { name: 'Grease + Fire', participants: ['Wizard/Sorcerer', 'Any fire'], setup: 'Grease to prone enemies. Fire to ignite (DM ruling).', result: 'Prone = melee advantage. Fire for damage.', rating: 'B' },
  { name: 'Shove + Attack', participants: ['Fighter', 'Rogue'], setup: 'Fighter shoves enemy prone. Rogue attacks.', result: 'Rogue gets advantage for Sneak Attack. Guaranteed SA without hiding.', rating: 'A' },
  { name: 'Faerie Fire + Full Party', participants: ['Bard/Druid', 'Everyone'], setup: 'Faerie Fire on enemy group. Entire party attacks.', result: 'All attacks have advantage. Reveals invisible. 1st-level slot for massive team benefit.', rating: 'S' },
  { name: 'Sentinel + Polearm Master Lock', participants: ['Fighter/Paladin', 'Ranged allies'], setup: 'PAM triggers OA when enemy enters reach. Sentinel stops movement.', result: 'Enemies can never reach your backline. 10ft reach wall.', rating: 'S' },
  { name: 'Twin Haste', participants: ['Sorcerer', '2 Martials'], setup: 'Sorcerer Twins Haste on two martial characters.', result: 'Two characters get double speed, +2 AC, and extra action each. Devastating.', rating: 'S' },
  { name: 'Silence Zone', participants: ['Cleric/Bard', 'Melee'], setup: 'Cast Silence on enemy caster. Melee fighters engage inside.', result: 'Enemy can\'t cast verbal spells. Martial allies unaffected.', rating: 'A' },
  { name: 'Pass Without Trace Ambush', participants: ['Ranger/Druid', 'Whole party'], setup: 'Cast Pass Without Trace. Entire party hides.', result: '+10 Stealth to everyone. Near-guaranteed surprise round.', rating: 'S' },
];

export const HELP_ACTION_TIPS = [
  'Help action gives an ally advantage on their next attack or check.',
  'Familiars can use the Help action (Flyby to avoid OA).',
  'Mastermind Rogue: Help as a bonus action at 30ft range.',
  'Use Help to give advantage to the Rogue for Sneak Attack.',
  'Help on skill checks too — not just combat.',
];

export const FLANKING_RULES = {
  optional: 'Flanking is an OPTIONAL rule (DMG). Check with your DM.',
  requirement: 'Two allies on opposite sides of a creature.',
  benefit: 'Advantage on melee attack rolls against that creature.',
  warning: 'This works BOTH ways. Enemies can flank YOU too.',
};

export function getCombosByRating(rating) {
  return PARTY_COMBOS.filter(c => c.rating === rating);
}

export function getCombosForRole(role) {
  return PARTY_COMBOS.filter(c =>
    c.participants.some(p => p.toLowerCase().includes((role || '').toLowerCase()))
  );
}
