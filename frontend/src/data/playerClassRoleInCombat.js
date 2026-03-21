/**
 * playerClassRoleInCombat.js
 * Player Mode: What each class should be doing during combat
 * Pure JS — no React dependencies.
 */

export const CLASS_COMBAT_ROLES = {
  Barbarian: {
    primary: 'Frontline tank and damage dealer',
    turnPriority: ['Rage (turn 1)', 'Reckless Attack for advantage', 'GWM attacks if available', 'Grapple/shove high-value targets'],
    positioning: 'Front and center. Between enemies and your party.',
    resources: 'Rage (long rest). Reckless Attack (free). Hit Dice (short rest).',
    doNot: ['Stand in the back', 'Use finesse weapons (use STR for Rage bonus)', 'Forget to Rage on turn 1', 'Try to be stealthy in heavy armor'],
  },
  Fighter: {
    primary: 'Versatile damage dealer with burst potential',
    turnPriority: ['Extra Attack every turn', 'Action Surge for burst rounds', 'Maneuvers for utility (Battle Master)', 'Second Wind when below 50% HP'],
    positioning: 'Front for melee, back for ranged. Adapt to the situation.',
    resources: 'Action Surge + Second Wind (short rest). Superiority Dice (short rest).',
    doNot: ['Forget Action Surge exists', 'Save Action Surge for too long', 'Ignore your Fighting Style benefits', 'Forget Second Wind (free healing!)'],
  },
  Wizard: {
    primary: 'Battlefield controller and AoE damage',
    turnPriority: ['Concentration spell first (Web, Hypnotic Pattern, etc.)', 'Counterspell enemy casters (reaction)', 'Damage cantrips for sustained damage', 'Shield when targeted (reaction)'],
    positioning: '60-120ft from enemies. Behind cover. Within 60ft for Counterspell.',
    resources: 'Spell slots (long rest). Arcane Recovery (1/day short rest).',
    doNot: ['Go into melee without preparation', 'Cast two concentration spells (you can\'t)', 'Forget to use Shield when hit', 'Waste high-level slots on easy fights'],
  },
  Cleric: {
    primary: 'Support caster with strong combat presence',
    turnPriority: ['Spirit Guardians (concentration, melee cleric)', 'Spiritual Weapon (bonus action damage every turn)', 'Healing Word to revive downed allies (bonus action)', 'Bless for party buffs (if not concentrating on something else)'],
    positioning: 'Depends on domain. Heavy armor domains = front. Others = mid-range.',
    resources: 'Spell slots (long rest). Channel Divinity (short rest).',
    doNot: ['Use Cure Wounds on conscious allies (Healing Word on downed is better)', 'Forget Spiritual Weapon is NOT concentration', 'Neglect your own attacks — you do good damage', 'Use Channel Divinity wastefully (Turn Undead is situational)'],
  },
  Rogue: {
    primary: 'Single-target burst damage and utility',
    turnPriority: ['Ensure Sneak Attack every turn (advantage or ally adjacent)', 'Cunning Action: Hide for advantage next turn', 'Cunning Action: Disengage if in danger', 'Uncanny Dodge when hit by a big attack (reaction)'],
    positioning: 'Flanking position or behind cover. In and out — never stay in melee.',
    resources: 'Sneak Attack (1/turn, free). Cunning Action (free). All short rest.',
    doNot: ['Stay in melee without an escape plan', 'Forget Sneak Attack requires finesse or ranged weapon', 'Use your bonus action for off-hand attack (Cunning Action is almost always better)', 'Ignore Uncanny Dodge — it\'s your best defensive feature'],
  },
  Paladin: {
    primary: 'Frontline support with devastating burst damage',
    turnPriority: ['Stay within 10ft of allies (Aura of Protection)', 'Divine Smite on critical hits (always)', 'Smite on high-damage rounds', 'Lay on Hands for emergency healing'],
    positioning: 'Front line, near as many allies as possible for Aura coverage.',
    resources: 'Spell slots for Smite (long rest). Lay on Hands pool (long rest). Channel Divinity (short rest).',
    doNot: ['Move away from allies (breaks Aura coverage)', 'Smite on every hit (conserve for crits and big moments)', 'Forget you\'re a spellcaster too — Bless, Shield of Faith are great', 'Use Lay on Hands for small heals (save for emergencies)'],
  },
  Monk: {
    primary: 'Mobile striker and controller',
    turnPriority: ['Flurry of Blows for damage + Stunning Strike chances', 'Stunning Strike on high-value targets', 'Use mobility to hit backline enemies', 'Patient Defense if tanking'],
    positioning: 'Highly mobile. Hit the backline, then retreat. Monk\'s speed enables flanking.',
    resources: 'Ki Points (short rest). Use them freely — they come back quickly.',
    doNot: ['Stay still — your speed is your greatest asset', 'Spend all Ki on Stunning Strike (save some for Step of the Wind)', 'Forget your bonus action unarmed strike (free without Ki)', 'Try to tank like a Barbarian — you\'re a skirmisher'],
  },
};

export function getClassRole(className) {
  return CLASS_COMBAT_ROLES[className] || null;
}

export function getTurnPriority(className) {
  const role = CLASS_COMBAT_ROLES[className];
  return role ? role.turnPriority : [];
}

export function getPositioningAdvice(className) {
  const role = CLASS_COMBAT_ROLES[className];
  return role ? role.positioning : 'Position based on your role and party needs.';
}
