/**
 * playerFeyWandererRangerGuide.js
 * Player Mode: Fey Wanderer Ranger — the social-combat hybrid
 * Pure JS — no React dependencies.
 */

export const FEY_WANDERER_BASICS = {
  class: 'Ranger (Fey Wanderer)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Fey-touched ranger. WIS to CHA checks. Psychic damage on hits. Fear/charm resistance aura.',
  note: 'Best Ranger subclass for social campaigns. WIS added to CHA checks makes you a great face. Psychic damage bonus on every hit. Incredible versatility.',
};

export const FEY_WANDERER_FEATURES = [
  { feature: 'Dreadful Strikes', level: 3, effect: 'Once per turn when you hit: +1d4 psychic damage (scales to 1d6 at L11).', note: 'Free psychic damage on every turn. Almost nothing resists psychic. Stacks with Hunter\'s Mark.' },
  { feature: 'Otherworldly Glamour', level: 3, effect: 'Add WIS modifier to CHA checks. Proficiency in one of: Deception, Performance, or Persuasion.', note: 'At +5 WIS: +5 to ALL Charisma checks on top of CHA mod. You become the party face as a Ranger.' },
  { feature: 'Fey Wanderer Spells', level: 3, effect: 'Charm Person (L3), Misty Step (L5), Dispel Magic (L9), Dimension Door (L13), Mislead (L17). Always prepared.', note: 'Misty Step alone is incredible. Dimension Door at L13. Best Ranger spell list.' },
  { feature: 'Beguiling Twist', level: 7, effect: 'Advantage on saves vs charmed/frightened. When creature within 120ft succeeds save vs charm/frighten: reaction → redirect to another creature within 120ft (WIS save or charmed/frightened).', note: 'Enemy resists your ally\'s fear? Redirect it to another enemy. Free crowd control on reaction.' },
  { feature: 'Fey Reinforcements', level: 11, effect: 'Cast Summon Fey without material components. Once free/LR, then spell slots.', note: 'Free summon once per long rest. Fey spirit fights alongside you. Good action economy.' },
  { feature: 'Misty Wanderer', level: 15, effect: 'Cast Misty Step with no spell slot. Can bring a willing creature within 5ft. PB uses/LR.', note: 'Free Misty Step that CARRIES AN ALLY. Rescue teammates. Tactical repositioning. PB times per long rest.' },
];

export const FEY_WANDERER_TACTICS = [
  { tactic: 'WIS-based face', detail: '+WIS to all CHA checks. With +5 WIS and +2 CHA: effective +7 on Persuasion/Deception. Better than most Bards at social checks.', rating: 'S' },
  { tactic: 'Dreadful Strikes + Hunter\'s Mark', detail: 'Every hit: weapon + DEX + 1d4 psychic + 1d6 HM. Extra Attack = double it. Consistent damage.', rating: 'A' },
  { tactic: 'Beguiling Twist redirect', detail: 'Ally casts Fear → enemy saves → your reaction: redirect fear to a different enemy. Free crowd control.', rating: 'S' },
  { tactic: 'Misty Step carrier', detail: 'L15: free Misty Step + bring ally. Teleport downed ally to safety. Reposition Rogue for Sneak Attack.', rating: 'S' },
  { tactic: 'Summon Fey for action economy', detail: 'L11: free Summon Fey. Spirit fights as bonus action. Your attacks + beast/fey = massive action economy.', rating: 'A' },
];

export function otherworldlyGlamourBonus(wisMod, chaMod, profBonus, isProficient) {
  return wisMod + chaMod + (isProficient ? profBonus : 0);
}

export function dreadfulStrikesDamage(rangerLevel) {
  return rangerLevel >= 11 ? 3.5 : 2.5; // 1d6 or 1d4 avg
}
