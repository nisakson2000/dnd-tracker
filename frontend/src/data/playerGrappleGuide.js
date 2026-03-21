/**
 * playerGrappleGuide.js
 * Player Mode: Grappling rules, builds, and tactical usage
 * Pure JS — no React dependencies.
 */

export const GRAPPLE_RULES = {
  action: 'Replaces ONE attack (not full Attack action)',
  check: 'Your Athletics vs target\'s Athletics OR Acrobatics (their choice)',
  requirement: 'Target must be no more than one size larger than you',
  effect: 'Target\'s speed becomes 0. That\'s it. No other penalties.',
  escape: 'Target uses action: their Athletics or Acrobatics vs your Athletics',
  movement: 'You can drag/carry the grappled creature. Your speed is halved.',
  freeHand: 'Requires one free hand. Can still attack with the other.',
};

export const GRAPPLE_SHOVE_COMBO = {
  name: 'Grapple + Shove Prone',
  description: 'The classic grappler combo. Grapple first, then shove prone.',
  steps: [
    'Attack 1: Grapple (replaces one attack) — Athletics vs Athletics/Acrobatics',
    'Attack 2: Shove Prone (replaces one attack) — Athletics vs Athletics/Acrobatics',
    'Result: Target is Grappled AND Prone',
    'Effect: They can\'t stand up (standing costs movement, grapple sets speed to 0)',
    'Melee attacks against them have advantage. Ranged have disadvantage.',
  ],
  requirement: 'Extra Attack feature (Fighter 5, Barbarian 5, Paladin 5, etc.)',
  counter: 'Target must break grapple first (action), THEN stand up (half movement)',
};

export const GRAPPLE_BUILDS = [
  { build: 'Barbarian Grappler', key: 'Rage advantage on Athletics, Danger Sense, d12 HP', stats: 'STR > CON > DEX', feats: ['Skill Expert (Athletics)', 'Tavern Brawler', 'Grappler'], rating: 'S' },
  { build: 'Rune Knight Fighter', key: 'Giant\'s Might for Large size = grapple Huge creatures', stats: 'STR > CON', feats: ['Skill Expert (Athletics)', 'Tavern Brawler'], rating: 'S' },
  { build: 'Simic Hybrid/Loxodon', key: 'Extra appendages for grappling without losing hand', stats: 'STR > CON', feats: ['Skill Expert (Athletics)'], rating: 'A' },
  { build: 'Bard (Lore/Swords)', key: 'Expertise in Athletics, Cutting Words to reduce escape checks', stats: 'STR > CHA > CON', feats: ['Skill Expert', 'Tavern Brawler'], rating: 'A' },
  { build: 'Astral Self Monk', key: 'Use WIS for grapple checks with astral arms', stats: 'WIS > DEX > CON', feats: ['Skill Expert (Athletics)'], rating: 'B' },
];

export const GRAPPLE_TACTICS = [
  { tactic: 'Drag into hazard', description: 'Grapple, then drag enemy into Spike Growth, Spirit Guardians, lava, cliff edge, etc.', effectiveness: 'S' },
  { tactic: 'Pin the caster', description: 'Grapple the enemy spellcaster. They can still cast but can\'t flee. Focus them down.', effectiveness: 'A' },
  { tactic: 'Prone lock', description: 'Grapple + Shove Prone. They\'re stuck on the ground giving your melee advantage.', effectiveness: 'S' },
  { tactic: 'Protect the squishy', description: 'Grapple the big melee enemy so it can\'t reach your wizard.', effectiveness: 'A' },
  { tactic: 'Force movement into AoE', description: 'Drag enemy into ally\'s Cloud of Daggers, Moonbeam, or Wall of Fire.', effectiveness: 'S' },
  { tactic: 'Underwater drowning', description: 'If you can breathe underwater (racial, spell), grapple and drag them under.', effectiveness: 'A' },
];

export const GRAPPLE_COUNTERS = [
  { counter: 'Misty Step', description: 'Teleportation automatically ends grapple. No check needed.', type: 'Spell' },
  { counter: 'Freedom of Movement', description: 'Automatically escapes nonmagical grapples. No action needed.', type: 'Spell' },
  { counter: 'Thunderwave', description: 'Pushes grappler away, which breaks the grapple.', type: 'Spell' },
  { counter: 'Enlarge', description: 'Become too large to grapple (if size difference > 1).', type: 'Spell' },
  { counter: 'Slippery (trait)', description: 'Some creatures have advantage on escaping grapples.', type: 'Trait' },
  { counter: 'Legendary Action: Teleport', description: 'Many bosses can just teleport out. Don\'t grapple dragons.', type: 'Boss' },
];

export function grappleCheckAdvantage(isRaging, hasEnlarge, hasAdvantageSource) {
  return isRaging || hasEnlarge || hasAdvantageSource;
}

export function canGrapple(yourSize, targetSize) {
  const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const yourIdx = sizes.indexOf(yourSize);
  const targetIdx = sizes.indexOf(targetSize);
  return targetIdx <= yourIdx + 1;
}

export function estimateGrappleSuccess(yourAthMod, targetBestMod) {
  // Contested check: both roll d20 + mod
  // Probability of winning ≈ 50% + 2.5% per point of advantage
  const diff = yourAthMod - targetBestMod;
  const chance = Math.min(95, Math.max(5, 50 + diff * 5));
  return { chance, yourMod: yourAthMod, theirMod: targetBestMod, diff };
}
