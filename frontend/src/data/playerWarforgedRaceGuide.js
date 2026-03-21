/**
 * playerWarforgedRaceGuide.js
 * Player Mode: Warforged — the living construct
 * Pure JS — no React dependencies.
 */

export const WARFORGED_BASICS = {
  race: 'Warforged',
  source: 'Eberron: Rising from the Last War',
  asis: '+2 CON, +1 any',
  speed: '30ft',
  size: 'Medium',
  note: '+1 AC on top of any armor. Poison resistance + immunity to disease. Don\'t need to eat, drink, breathe, or sleep. Incredibly durable race. Best for tanks and frontliners.',
};

export const WARFORGED_TRAITS = [
  { trait: 'Constructed Resilience', effect: 'Advantage on saves vs poison. Resistance to poison damage. Immune to disease. Don\'t need to eat, drink, or breathe.', note: 'Poison resistance is common and valuable. Disease immunity. No breathing = underwater, gas, vacuum.' },
  { trait: 'Sentry\'s Rest', effect: 'You don\'t sleep. During long rest: 6 hours of inactivity (conscious). Can see and hear normally.', note: 'You\'re awake during long rest. Can keep watch. No ambush surprises. No sleep spells affect you.' },
  { trait: 'Integrated Protection', effect: '+1 AC bonus regardless of armor worn.', note: 'THE feature. Plate + Shield = AC 21. Add Blessing of the Forge = 22. Add Shield of Faith = 24. Incredibly strong.' },
  { trait: 'Specialized Design', effect: 'One skill proficiency and one tool proficiency of your choice.', note: 'Flexible. Pick whatever your build needs.' },
];

export const WARFORGED_CLASS_SYNERGY = [
  { class: 'Fighter', priority: 'S', reason: '+1 AC + heavy armor mastery. AC 21 baseline. CON bonus for HP and saves. Best tank race.' },
  { class: 'Artificer', priority: 'S', reason: 'Thematic perfection. +1 AC + Infusions + Shield spell. AC 24+ easily. CON for concentration.' },
  { class: 'Paladin', priority: 'S', reason: '+1 AC + Plate + Shield = 21. Aura of Protection. CON for concentration. Unkillable.' },
  { class: 'Cleric (Forge)', priority: 'S', reason: '+1 AC + Blessing of Forge + Soul of Forge = AC 23 at L6. Best AC in the game.' },
  { class: 'Barbarian', priority: 'A', reason: '+1 AC + Unarmored Defense. CON bonus helps both AC and HP. Rage resistance + poison resistance = ultra-durable.' },
  { class: 'Wizard/Sorcerer', priority: 'B', reason: '+1 AC helps squishies. CON for concentration. Sentry\'s Rest for watch duty. Decent.' },
];

export const WARFORGED_AC_EXAMPLES = [
  { setup: 'Plate + Shield + Integrated', ac: 21, note: 'Base Warforged tank. AC 21 with no magic or features.' },
  { setup: '+ Defense Fighting Style', ac: 22, note: 'Fighter/Paladin. AC 22 at L1-2.' },
  { setup: '+ Blessing of the Forge (Cleric)', ac: 23, note: 'Forge Cleric at L1. AC 23.' },
  { setup: '+ Soul of the Forge (L6)', ac: 24, note: 'Forge Cleric at L6. AC 24 with no magic items.' },
  { setup: '+ Shield spell (reaction)', ac: 29, note: 'Artificer or EK with Shield. AC 29 for a round.' },
];

export const WARFORGED_TACTICS = [
  { tactic: 'Unkillable frontliner', detail: 'AC 21+, CON bonus, poison resistance, disease immunity. Stand in front and never die.', rating: 'S' },
  { tactic: 'Permanent watchman', detail: 'Sentry\'s Rest: conscious during long rest. Take every watch. Never surprised.', rating: 'A' },
  { tactic: 'Environmental immunity', detail: 'Don\'t breathe: immune to gas, drowning, vacuum. Poison resistance. Explore hazardous areas.', rating: 'A' },
  { tactic: 'Forge Cleric stack', detail: 'Warforged Forge Cleric: AC 24 at L6 with no magic items. Spirit Guardians + unkillable AC.', rating: 'S' },
];

export function warforgedAC(baseArmorAC, hasShield, hasDefenseStyle = false) {
  let ac = baseArmorAC + 1;
  if (hasShield) ac += 2;
  if (hasDefenseStyle) ac += 1;
  return ac;
}
