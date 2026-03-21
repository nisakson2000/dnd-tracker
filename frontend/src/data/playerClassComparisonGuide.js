/**
 * playerClassComparisonGuide.js
 * Player Mode: Side-by-side class comparisons for character selection
 * Pure JS — no React dependencies.
 */

export const CLASS_COMPARISON = [
  { class: 'Barbarian', role: 'Melee Tank/DPS', complexity: 'Low', hp: 'Highest (d12)', armor: 'Medium (Unarmored)', spells: 'None', saveProficiency: 'STR/CON', strengths: ['Damage resistance while raging', 'Highest HP pool', 'Simple to play'], weaknesses: ['No ranged options', 'No magic', 'Limited out-of-combat utility'] },
  { class: 'Bard', role: 'Support/Face', complexity: 'Medium', hp: 'Medium (d8)', armor: 'Light', spells: 'Full Caster', saveProficiency: 'DEX/CHA', strengths: ['Most versatile skill monkey', 'Bardic Inspiration buffs team', 'Magical Secrets steals any spell'], weaknesses: ['Low AC', 'Limited damage options', 'Needs CHA + DEX + CON'] },
  { class: 'Cleric', role: 'Healer/Tank/Caster', complexity: 'Medium', hp: 'Medium (d8)', armor: 'Heavy (domain)', spells: 'Full Caster', saveProficiency: 'WIS/CHA', strengths: ['Best healer', 'Heavy armor available', 'Prepared caster (full list)'], weaknesses: ['Average damage', 'Slow movement in heavy armor', 'Concentration-heavy'] },
  { class: 'Druid', role: 'Controller/Utility', complexity: 'High', hp: 'Medium (d8)', armor: 'Medium (no metal)', spells: 'Full Caster', saveProficiency: 'INT/WIS', strengths: ['Wild Shape adds HP buffer', 'Amazing battlefield control', 'Prepared caster'], weaknesses: ['No metal armor/shields', 'Wild Shape complexity', 'Needs CON and WIS'] },
  { class: 'Fighter', role: 'Melee/Ranged DPS', complexity: 'Low-Medium', hp: 'High (d10)', armor: 'Heavy + Shields', spells: 'None (EK: 1/3)', saveProficiency: 'STR/CON', strengths: ['Most attacks per round', 'Action Surge is incredible', 'Most ASI/Feats'], weaknesses: ['Limited out-of-combat ability', 'No magic (base)', 'Can feel repetitive'] },
  { class: 'Monk', role: 'Melee DPS/Control', complexity: 'Medium', hp: 'Medium (d8)', armor: 'None (Unarmored)', spells: 'None', saveProficiency: 'STR/DEX', strengths: ['Stunning Strike is incredible', 'Fastest class', 'Self-sufficient'], weaknesses: ['Ki is limited resource', 'Needs DEX + WIS + CON', 'Lower damage than other martials'] },
  { class: 'Paladin', role: 'Tank/Burst DPS', complexity: 'Medium', hp: 'High (d10)', armor: 'Heavy + Shields', spells: 'Half Caster', saveProficiency: 'WIS/CHA', strengths: ['Divine Smite crits are devastating', 'Aura of Protection saves the party', 'Heavy armor + healing'], weaknesses: ['Needs STR + CHA + CON', 'Slow without mount', 'Half-caster spell progression'] },
  { class: 'Ranger', role: 'Ranged DPS/Scout', complexity: 'Medium', hp: 'High (d10)', armor: 'Medium', spells: 'Half Caster', saveProficiency: 'STR/DEX', strengths: ['Excellent ranged DPS', 'Good scouting/exploration', 'Gloom Stalker is amazing'], weaknesses: ['Base class features are weak', 'Needs optional features to shine', 'Narrower spell list'] },
  { class: 'Rogue', role: 'DPS/Scout/Face', complexity: 'Low-Medium', hp: 'Medium (d8)', armor: 'Light', spells: 'None (AT: 1/3)', saveProficiency: 'DEX/INT', strengths: ['Sneak Attack damage scales', 'Expertise + Reliable Talent', 'Cunning Action mobility'], weaknesses: ['Fragile (d8, light armor)', 'One big hit per turn', 'Needs ally for SA or stealth'] },
  { class: 'Sorcerer', role: 'Blaster/Buffer', complexity: 'Medium', hp: 'Low (d6)', armor: 'None', spells: 'Full Caster', saveProficiency: 'CON/CHA', strengths: ['Metamagic is unique and powerful', 'Twin and Quicken change the game', 'CON save proficiency'], weaknesses: ['Fewest spells known', 'No armor', 'Sorcery points run out fast'] },
  { class: 'Warlock', role: 'DPS/Utility', complexity: 'Medium', hp: 'Medium (d8)', armor: 'Light', spells: 'Pact Magic', saveProficiency: 'WIS/CHA', strengths: ['Eldritch Blast is the best cantrip', 'Short rest slot recovery', 'Invocations are very customizable'], weaknesses: ['Very few spell slots', 'Hex is a concentration trap', 'Relies heavily on short rests'] },
  { class: 'Wizard', role: 'Controller/Utility', complexity: 'High', hp: 'Lowest (d6)', armor: 'None', spells: 'Full Caster', saveProficiency: 'INT/WIS', strengths: ['Largest spell list in the game', 'Ritual casting from spellbook', 'Best battlefield control'], weaknesses: ['Lowest HP', 'No armor', 'Extremely squishy'] },
];

export function getClassInfo(className) {
  return CLASS_COMPARISON.find(c => c.class.toLowerCase() === (className || '').toLowerCase()) || null;
}

export function compareClasses(class1, class2) {
  return {
    class1: getClassInfo(class1),
    class2: getClassInfo(class2),
  };
}

export function getClassesByComplexity(complexity) {
  return CLASS_COMPARISON.filter(c => c.complexity.toLowerCase().includes((complexity || '').toLowerCase()));
}

export function getClassesByRole(role) {
  return CLASS_COMPARISON.filter(c => c.role.toLowerCase().includes((role || '').toLowerCase()));
}
