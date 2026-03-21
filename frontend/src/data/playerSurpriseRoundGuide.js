/**
 * playerSurpriseRoundGuide.js
 * Player Mode: Surprise mechanics explained correctly (no "surprise round")
 * Pure JS — no React dependencies.
 */

export const SURPRISE_RULES = {
  myth: 'There is NO "surprise round" in D&D 5e. This is the most common rule misunderstanding.',
  reality: 'Surprised creatures simply CAN\'T move or take actions on their FIRST TURN, and can\'t take reactions until that turn ends.',
  determination: 'DM compares Stealth checks vs passive Perception of EACH creature individually.',
  partialSurprise: 'Some enemies may be surprised while others are not. It\'s per-creature.',
  initiative: 'Everyone rolls initiative normally. Surprised creatures still have a turn — they just can\'t do anything on it.',
  reactions: 'A surprised creature can\'t use reactions UNTIL THEIR FIRST TURN ENDS. Then they can react normally.',
};

export const ACHIEVING_SURPRISE = [
  { method: 'Stealth vs Passive Perception', dc: 'Beat each enemy\'s passive Perception', detail: 'Everyone who tries to be stealthy rolls. If any enemy notices ANY of you, that enemy is not surprised.' },
  { method: 'Pass Without Trace', bonus: '+10 to party Stealth', detail: 'Nearly guarantees surprise. 2nd-level concentration spell.' },
  { method: 'Invisibility/Greater Invisibility', bonus: 'Advantage on Stealth', detail: 'Being invisible gives advantage. But not automatic surprise — still need to beat Perception.' },
  { method: 'Distraction', bonus: 'DM discretion', detail: 'Create a diversion. Minor Illusion, Performance check, thrown object.' },
  { method: 'Disguise', bonus: 'No stealth needed', detail: 'Look like you belong. Disguise Self, Actor feat, uniforms.' },
];

export const SURPRISE_OPTIMIZATION = [
  { class: 'Assassin Rogue', benefit: 'Assassinate: advantage on any creature that hasn\'t acted. Auto-crit on surprised creatures.', tip: 'MUST go before the target in initiative. Alert feat or high DEX essential.' },
  { class: 'Gloom Stalker Ranger', benefit: 'Dread Ambusher: +WIS to initiative. Extra attack + 1d8 on first turn. Invisible to darkvision.', tip: 'The ultimate ambush class. Invisible in darkness + devastating first turn.' },
  { class: 'Bugbear Race', benefit: 'Surprise Attack: +2d6 damage in first round vs surprised targets.', tip: 'Stacks with Sneak Attack. Bugbear Assassin = massive first-hit damage.' },
  { class: 'War Wizard', benefit: 'Not surprise-specific, but +2 or +4 to initiative helps you act early.', tip: 'Going first in a surprise round lets you drop control spells before enemies can react.' },
];

export const ALERT_FEAT = {
  name: 'Alert',
  benefits: [
    '+5 to initiative (huge)',
    'Can\'t be surprised while conscious',
    'Hidden creatures don\'t get advantage on attacks against you',
  ],
  rating: 'A Tier',
  note: 'Anti-surprise AND initiative boost. Top-tier feat for anyone.',
};

export function canSurprise(partyStealthRolls, enemyPassivePerception) {
  // If ALL party stealth rolls beat the enemy's passive, that enemy is surprised
  return partyStealthRolls.every(roll => roll >= enemyPassivePerception);
}

export function getSurpriseDamageBonus(className, race) {
  let bonus = '';
  if (className === 'Assassin') bonus += 'Auto-crit + Sneak Attack. ';
  if (race === 'Bugbear') bonus += '+2d6 Surprise Attack. ';
  if (className === 'Gloom Stalker') bonus += '+1d8 Dread Ambusher. ';
  return bonus || 'No special surprise damage bonus.';
}
