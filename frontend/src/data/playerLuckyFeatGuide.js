/**
 * playerLuckyFeatGuide.js
 * Player Mode: Lucky feat — the universally good feat
 * Pure JS — no React dependencies.
 */

export const LUCKY_BASICS = {
  feat: 'Lucky',
  source: 'Player\'s Handbook',
  uses: '3 luck points per long rest.',
  benefit1: 'After rolling a d20 for attack, ability check, or save: spend luck point to roll another d20, choose which to use.',
  benefit2: 'When attacked: spend luck point to roll d20, choose whether attacker uses their roll or yours.',
  note: 'Universally powerful. Works on any d20 roll. 3 rerolls per day. Many consider it the strongest feat in the game.',
};

export const LUCKY_USES = [
  { use: 'Reroll a failed save', detail: 'Failed a WIS save vs Hold Person? Spend luck point → roll again → pick the better result.', priority: 'High' },
  { use: 'Reroll a missed attack', detail: 'Missed a critical Smite attack? Reroll. Choose the better d20.', priority: 'Medium' },
  { use: 'Negate an enemy crit', detail: 'Enemy crits you → spend luck point → roll d20 → enemy must use your roll if it\'s lower. Can turn crit into miss.', priority: 'High' },
  { use: 'Critical skill check', detail: 'Failed a Stealth check that exposes the party? Reroll with Lucky.', priority: 'Medium' },
  { use: 'Death saves', detail: 'Failed a death save? Lucky reroll. Can save your life.', priority: 'Critical' },
  { use: 'Disadvantage super-advantage', detail: 'RAW: if you have disadvantage, roll 2d20, then Lucky adds a 3rd d20 — choose ANY of the 3. Effectively turns disadvantage into super-advantage.', priority: 'Cheese' },
];

export const LUCKY_PRIORITY_BY_CLASS = [
  { class: 'Any class', priority: 'A+', reason: 'Lucky is good on literally every class. No class is bad with Lucky.' },
  { class: 'Rogue', priority: 'S', reason: 'One big attack per turn. A miss wastes your whole turn. Lucky prevents that.' },
  { class: 'Paladin', priority: 'S', reason: 'Miss a Smite = wasted. Lucky ensures your biggest hits land.' },
  { class: 'Caster (save-or-suck)', priority: 'S', reason: 'Enemy saves vs your big spell? Lucky doesn\'t help with enemy saves. But it protects YOUR saves.' },
  { class: 'Tank', priority: 'A', reason: 'Negate crits. Reroll failed saves. Survivability boost.' },
];

export const LUCKY_CONTROVERSY = {
  tooStrong: 'Many DMs and players consider Lucky too strong for its lack of prerequisites or costs.',
  banReasons: ['No class/level requirement', 'Works on any d20', 'Disadvantage cheese is unintuitive', '3 rerolls cover most critical moments'],
  houseRules: [
    'Limit to 1 luck point per long rest',
    'Can\'t use on disadvantage rolls',
    'Only works on saves (not attacks)',
    'Ban entirely',
  ],
  note: 'Check with your DM before taking Lucky. Some tables restrict or ban it.',
};

export function luckyRerollChance(originalRoll, dc) {
  // If original roll failed (total < dc), chance the Lucky reroll succeeds
  const successChance = (20 - dc + 1) / 20;
  return { rerollSuccess: Math.round(successChance * 100), note: `${Math.round(successChance * 100)}% chance the Lucky reroll meets DC ${dc}` };
}
