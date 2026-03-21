/**
 * playerBugbearRaceGuide.js
 * Player Mode: Bugbear — the long-armed ambusher
 * Pure JS — no React dependencies.
 */

export const BUGBEAR_BASICS = {
  race: 'Bugbear',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 STR, +1 DEX (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  darkvision: '60ft',
  note: 'Surprise Attack for 2d6 extra damage. Long-Limbed for 5ft extra reach. Sneaky + long arms + burst damage. Incredible for Rogues, Fighters, and any melee build.',
};

export const BUGBEAR_TRAITS = [
  { trait: 'Surprise Attack', effect: 'If you hit a surprised creature in the first round: +2d6 damage.', note: 'Stacks with Sneak Attack, Smite, etc. Assassin Rogue Bugbear: auto-crit + Sneak Attack + Surprise Attack = devastating.' },
  { trait: 'Long-Limbed', effect: 'Your reach is 5ft longer when you make melee attacks on your turn.', note: '10ft reach with normal weapons. 15ft with polearms. Only on your turn (not OAs). Still incredible.' },
  { trait: 'Powerful Build', effect: 'Count as one size larger for carrying/push/drag/lift.', note: 'Grapple Large creatures more easily. Carry more. Minor but useful.' },
  { trait: 'Sneaky (legacy)', effect: 'Proficiency in Stealth.', note: 'Free Stealth proficiency. Helps set up Surprise Attack.' },
  { trait: 'Fey Ancestry (MotM)', effect: 'Advantage on saves vs charmed.', note: 'Replaced Sneaky in MotM. Good defensive trait.' },
];

export const BUGBEAR_CLASS_SYNERGY = [
  { class: 'Rogue (Assassin)', priority: 'S', reason: 'Surprise Attack + Assassinate auto-crit + Sneak Attack. All dice doubled on crit. Massive burst.' },
  { class: 'Fighter (Battlemaster)', priority: 'S', reason: 'Long-Limbed + PAM = 15ft reach. Superiority dice + Surprise Attack. Control + burst.' },
  { class: 'Paladin', priority: 'A', reason: 'Surprise Attack + Divine Smite. Long-Limbed reach Smites. STR bonus (legacy).' },
  { class: 'Barbarian', priority: 'A', reason: 'STR bonus. Surprise Attack + Reckless Attack. Long-Limbed GWM reach. Solid.' },
  { class: 'Monk', priority: 'B', reason: 'Long-Limbed + Monk = 10ft reach unarmed. Interesting but DEX/WIS not boosted (legacy).' },
];

export const BUGBEAR_TACTICS = [
  { tactic: 'Assassin Rogue combo', detail: 'Surprise round: auto-crit + Sneak Attack + Surprise Attack. All dice doubled. At L5: 2×(3d6 SA + 2d6 Surprise + weapon) = massive.', rating: 'S' },
  { tactic: 'Long-Limbed kiting', detail: '10ft melee reach. Hit → step back. Enemy must close 10ft to hit you. Free pseudo-disengage.', rating: 'A' },
  { tactic: 'PAM + Long-Limbed', detail: '10ft polearm + 5ft Long-Limbed = 15ft reach. OA when enemies enter 15ft. Absurd control zone.', rating: 'S' },
  { tactic: 'Stealth + Surprise Attack', detail: 'Use Stealth to set up surprise. First hit: +2d6. Simple but effective burst.', rating: 'A' },
];

export function surpriseAttackBurst(sneakAttackDice = 0, smiteDice = 0, isCrit = false) {
  const surpriseDice = 2;
  let totalDice = surpriseDice + sneakAttackDice + smiteDice;
  if (isCrit) totalDice *= 2;
  return { totalD6s: totalDice, avg: totalDice * 3.5, isCrit, note: isCrit ? 'All dice doubled on crit (Assassinate)' : 'First-round burst' };
}

export function longLimbedReach(weaponReach) {
  return weaponReach + 5;
}
