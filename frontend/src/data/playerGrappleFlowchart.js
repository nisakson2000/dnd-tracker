/**
 * playerGrappleFlowchart.js
 * Player Mode: Complete grapple rules flowchart and optimization
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_FLOWCHART = [
  { step: 1, action: 'Initiate Grapple', requirement: 'Must have a FREE HAND. Target must be within 5ft and no more than one size larger.', roll: 'Your Athletics vs their Athletics OR Acrobatics (their choice).' },
  { step: 2, action: 'Grapple Result', success: 'Target\'s speed = 0. They move with you if you move (half speed).', failure: 'Nothing happens. You used one attack.' },
  { step: 3, action: 'Shove Prone (optional)', requirement: 'Use a second attack to shove the grappled target prone.', effect: 'Grappled + Prone = speed 0 (can\'t stand) + advantage on melee attacks against them.' },
  { step: 4, action: 'Maintain', requirement: 'No action needed. Grapple persists until you let go, get incapacitated, or they break free.', note: 'You can attack while grappling (if you have a free hand or weapon).' },
  { step: 5, action: 'Break Free', requirement: 'Target uses action: Athletics or Acrobatics vs your Athletics.', note: 'They need their ENTIRE action. Can\'t attack and try to escape in same turn.' },
];

export const GRAPPLE_COMBOS = [
  { name: 'Grapple + Shove Prone', rating: 'S', classes: ['Fighter', 'Barbarian'], detail: 'Grapple → Shove Prone (2 attacks). Target can\'t stand because speed = 0. All melee have advantage. They have disadvantage.' },
  { name: 'Grapple + Spike Growth', rating: 'S', classes: ['Barbarian', 'Ranger'], detail: 'Drag grappled enemy through Spike Growth. 2d4 per 5ft = devastating damage.' },
  { name: 'Grapple + Spirit Guardians', rating: 'A', classes: ['Cleric'], detail: 'Grapple enemy in Spirit Guardians aura. They take 3d8 every turn, can\'t escape.' },
  { name: 'Grapple + Moonbeam', rating: 'A', classes: ['Druid'], detail: 'Hold enemy in Moonbeam. 2d10 radiant at start of their turn. Can\'t leave.' },
  { name: 'Tavern Brawler Grapple', rating: 'B', classes: ['Any'], detail: 'Hit with unarmed/improvised → bonus action grapple. Action economy efficient.' },
  { name: 'Shield Master Shove', rating: 'A', classes: ['Fighter', 'Paladin'], detail: 'Shield Master: bonus action shove after Attack action. Prone + grapple combo.' },
];

export const GRAPPLE_BUILD_TIPS = [
  'Athletics Expertise (Rogue dip or Skill Expert feat) makes you nearly impossible to resist.',
  'Advantage on STR checks while Raging (Barbarian) = advantage on grapple checks.',
  'Enlarge spell makes you Large = can grapple Huge creatures.',
  'Rune Knight can grow Large = expanded grapple targets.',
  'Simic Hybrid / Loxodon have natural grapple advantages.',
  'Tavern Brawler feat: bonus action grapple after unarmed/improvised hit.',
  'Don\'t need STR for Athletics if you have Expertise — but STR helps.',
  'Two free hands = grapple two creatures at once!',
];

export function canGrapple(attackerSize, targetSize) {
  const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const attackerIdx = sizes.indexOf(attackerSize);
  const targetIdx = sizes.indexOf(targetSize);
  return targetIdx <= attackerIdx + 1; // can grapple one size larger max
}

export function grappleCheckAdvantage(hasRage, hasEnlarge) {
  if (hasRage) return { advantage: true, source: 'Rage: advantage on STR checks' };
  if (hasEnlarge) return { advantage: true, source: 'Enlarge: advantage on STR checks' };
  return { advantage: false, source: 'Normal roll' };
}
