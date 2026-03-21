/**
 * playerDisadvantageSourcesGuide.js
 * Player Mode: Complete guide to advantage and disadvantage sources
 * Pure JS — no React dependencies.
 */

export const ADVANTAGE_DISADVANTAGE_RULES = {
  stacking: 'Multiple advantage or disadvantage sources do NOT stack. Any amount of advantage = advantage. Any amount of disadvantage = disadvantage.',
  cancel: 'If you have ANY advantage AND ANY disadvantage = straight roll. Even if 3 sources of advantage and 1 of disadvantage = straight roll.',
  criticalHits: 'Advantage roughly doubles your crit chance (from 5% to 9.75%). Disadvantage reduces it to 0.25%.',
  averageEffect: 'Advantage adds roughly +3.3 to +5 on a d20 depending on the target number.',
  eldritchAccuracy: 'Elven Accuracy: roll 3d20 instead of 2d20. ~15% crit chance. Best crit-fishing.',
};

export const ADVANTAGE_SOURCES = [
  // Combat
  { source: 'Reckless Attack', class: 'Barbarian', condition: 'First attack on your turn (melee, STR). Enemies get advantage against you until next turn.', note: 'Risk/reward. More hits but more hits taken.' },
  { source: 'Flanking (optional rule)', class: 'Any', condition: 'You and ally on opposite sides of enemy. Many tables use this.', note: 'Optional rule from DMG. Very common house rule.' },
  { source: 'Pack Tactics', class: 'Wolves/Kobolds/summoned', condition: 'Ally within 5ft of target. Summoned wolves get this.', note: 'Why Conjure Animals (wolves) is so strong.' },
  { source: 'Faerie Fire', class: 'Druid/Bard', condition: 'Target in area fails DEX save. Advantage on attacks against them.', note: 'AoE advantage. Concentration. Also reveals invisible.' },
  { source: 'Guiding Bolt', class: 'Cleric', condition: 'Hit with Guiding Bolt. Next attack against target has advantage.', note: 'Single use advantage. Good for setting up Rogue SA.' },
  { source: 'Help action', class: 'Any/Familiar', condition: 'Help an ally: they get advantage on next attack vs target.', note: 'Owl familiar Help + Flyby is the standard combo.' },
  { source: 'Prone target', class: 'Any (melee)', condition: 'Melee attacks against prone target have advantage (ranged have disadvantage).', note: 'Trip/shove combo. Or tripping spells.' },
  { source: 'Invisible attacker', class: 'Various', condition: 'You are invisible and target can\'t see you.', note: 'Greater Invisibility maintains through attacks.' },
  { source: 'Restrained target', class: 'Various', condition: 'Restrained: attacks against have advantage.', note: 'Web, Entangle, Ensnaring Strike.' },
  { source: 'Stunned target', class: 'Various', condition: 'Stunned: attacks against have advantage.', note: 'Stunning Strike, Hold Person (paralyzed = advantage + auto-crit in melee).' },
  { source: 'Paralyzed target', class: 'Various', condition: 'Paralyzed: attacks have advantage. Hits within 5ft are auto-crits.', note: 'Hold Person + melee = auto-crit. Devastating.' },
  { source: 'Steady Aim', class: 'Rogue', condition: 'Bonus action: advantage on next attack. Can\'t move this turn.', note: 'Tasha\'s optional. Guarantees SA without allies or hiding.' },
  { source: 'True Strike (2024)', class: 'Various', condition: '2024 version: adds d6 + advantage. Much better than original.', note: 'Only relevant with 2024 rules.' },
];

export const DISADVANTAGE_SOURCES = [
  { source: 'Poisoned condition', effect: 'Disadvantage on attack rolls and ability checks.', note: 'Very common condition. Carry antitoxin.' },
  { source: 'Frightened condition', effect: 'Disadvantage on attacks/checks while source of fear is visible.', note: 'Fear, Frightful Presence, Menacing Attack.' },
  { source: 'Restrained condition', effect: 'Disadvantage on attack rolls (you). Advantage on attacks against you.', note: 'Double whammy. Escape ASAP.' },
  { source: 'Blinded condition', effect: 'Disadvantage on attacks. Attacks against you have advantage.', note: 'Darkness, Blindness, Fog Cloud.' },
  { source: 'Prone (ranged)', effect: 'Ranged attacks against prone have disadvantage.', note: 'Drop prone to dodge arrows. But melee has advantage against you.' },
  { source: 'Dodge action', effect: 'Attacks against you have disadvantage.', note: 'Full action to dodge. Good for tanks concentrating on spells.' },
  { source: 'Heavy armor without STR', effect: 'Speed reduced by 10ft. No disadvantage on attacks (common misconception).', note: 'Only reduces speed, doesn\'t cause disadvantage. Common house rule confusion.' },
  { source: 'Long range', effect: 'Ranged attacks at long range have disadvantage.', note: 'Crossbow Expert or Sharpshooter don\'t fix this (Sharpshooter ignores cover, not long range).' },
  { source: 'Ranged in melee', effect: 'Ranged attack with hostile creature within 5ft: disadvantage.', note: 'Crossbow Expert removes this penalty.' },
  { source: 'Exhaustion L3', effect: 'Disadvantage on attacks and saving throws.', note: 'L3 exhaustion is devastating. Avoid at all costs.' },
];

export function advantageHitChance(baseHitChance) {
  return 1 - (1 - baseHitChance) * (1 - baseHitChance);
}

export function disadvantageHitChance(baseHitChance) {
  return baseHitChance * baseHitChance;
}

export function advantageCritChance() {
  return 1 - 0.95 * 0.95; // ~9.75%
}

export function elvenAccuracyCritChance() {
  return 1 - 0.95 * 0.95 * 0.95; // ~14.26%
}
