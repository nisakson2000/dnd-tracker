/**
 * playerCrownPaladinGuide.js
 * Player Mode: Oath of the Crown Paladin — the protector of civilization
 * Pure JS — no React dependencies.
 */

export const CROWN_BASICS = {
  class: 'Paladin (Oath of the Crown)',
  source: 'Sword Coast Adventurer\'s Guide',
  theme: 'Defender of law. Tank. Compelled Duel. Champion Challenge locks enemies on you.',
  note: 'The dedicated tank Paladin. Champion Challenge is a 30ft AoE taunt. Turn the Tide heals multiple allies. Best at protecting the party.',
};

export const CROWN_FEATURES = [
  { feature: 'Oath Spells', level: 3, effect: 'Command, Compelled Duel (L3). Warding Bond, Zone of Truth (L5). Aura of Vitality, Spirit Guardians (L9). Banishment, Guardian of Faith (L13). Circle of Power, Geas (L17).', note: 'Spirit Guardians is the standout — amazing on a Paladin tank. Compelled Duel for single-target tanking.' },
  { feature: 'Champion Challenge', level: 3, effect: 'Channel Divinity: each creature of your choice within 30ft must WIS save or can\'t move more than 30ft away from you.', note: 'AoE TAUNT. Enemies can\'t leave your area. Lock down multiple enemies at once. No concentration.' },
  { feature: 'Turn the Tide', level: 3, effect: 'Channel Divinity: bonus action, each creature of your choice within 30ft that has ≤ half HP regains 1d6+CHA HP.', note: 'Mass healing that triggers when allies are hurt. +5 CHA = 1d6+5 (avg 8.5) to every wounded ally.' },
  { feature: 'Divine Allegiance', level: 7, effect: 'When creature within 5ft takes damage: reaction to take that damage instead.', note: 'Bodyguard ability. You absorb hits for adjacent allies. Paladins have the HP/AC to handle it.' },
  { feature: 'Unyielding Spirit', level: 15, effect: 'Advantage on saves vs paralyzed and stunned.', note: 'Prevents the two worst conditions for a tank. You can\'t protect anyone if you\'re stunned.' },
  { feature: 'Exalted Champion', level: 20, effect: '1 hour: resistance to nonmagical B/P/S. Allies within 30ft have advantage on death saves and WIS saves.', note: 'Resistance to most damage. Party-wide death save and WIS save advantage. Capstone is solid.' },
];

export const CROWN_TACTICS = [
  { tactic: 'Champion Challenge + Spirit Guardians', detail: 'Lock enemies within 30ft (Champion Challenge) + Spirit Guardians deals 3d8 radiant per turn to them. They can\'t escape.', rating: 'S' },
  { tactic: 'Divine Allegiance bodyguard', detail: 'Stand next to the squishy caster. Any hit on them → reaction: take the damage instead. You have the AC and HP for it.', rating: 'A' },
  { tactic: 'Turn the Tide mass heal', detail: 'Multiple allies at half HP → bonus action → heal all of them 1d6+CHA. Most efficient healing in the game per action.', rating: 'A' },
  { tactic: 'Compelled Duel boss focus', detail: 'Compelled Duel the boss: WIS save or it has disadvantage on attacks against anyone but you. You become the focus.', rating: 'A' },
  { tactic: 'Sentinel feat synergy', detail: 'Sentinel: enemies that attack allies near you → OA that reduces speed to 0. Combined with Champion Challenge: enemies can\'t escape you.', rating: 'S' },
];

export function turnTheTideHealing(chaMod, alliesAtHalfHP) {
  const avgHealing = 3.5 + chaMod;
  return { perAlly: avgHealing, total: avgHealing * alliesAtHalfHP };
}

export function championChallengeRadius() {
  return 30; // 30ft radius
}
