/**
 * playerPartyRoles.js
 * Player Mode: Party role identification and optimization tips
 * Pure JS — no React dependencies.
 */

export const PARTY_ROLES = [
  {
    role: 'Tank',
    description: 'High HP and AC. Draws enemy attention and protects allies.',
    classes: ['Barbarian', 'Fighter', 'Paladin'],
    keyStats: ['High AC', 'High HP', 'STR or CON'],
    tips: [
      'Position between enemies and squishier allies.',
      'Use Sentinel/Polearm Master to control enemy movement.',
      'Dodge action is underrated — use it when overwhelmed.',
      'Grapple + shove prone for advantage on melee attacks against target.',
    ],
  },
  {
    role: 'Melee DPS',
    description: 'Deal high damage in close combat.',
    classes: ['Barbarian', 'Fighter', 'Paladin', 'Monk', 'Ranger'],
    keyStats: ['High STR or DEX', 'Extra Attack'],
    tips: [
      'Focus fire the biggest threat.',
      'Flank for advantage (if using optional rule).',
      'Save Action Surge / Smites for critical moments.',
      'Don\'t overextend — stay near healer range.',
    ],
  },
  {
    role: 'Ranged DPS',
    description: 'Deal damage from range, staying out of harm\'s way.',
    classes: ['Ranger', 'Fighter', 'Rogue'],
    keyStats: ['High DEX', 'Sharpshooter/Crossbow Expert'],
    tips: [
      'Stay at least 30ft from enemies.',
      'Use cover when available.',
      'Crossbow Expert removes adjacent disadvantage.',
      'Sharpshooter: -5/+10 against low AC targets.',
    ],
  },
  {
    role: 'Controller',
    description: 'Disable enemies and shape the battlefield.',
    classes: ['Wizard', 'Druid', 'Bard', 'Sorcerer'],
    keyStats: ['High spell save DC', 'Concentration management'],
    tips: [
      'Priority spells: Web, Hypnotic Pattern, Wall of Force.',
      'Don\'t overlap control — one good AOE is enough.',
      'Position to hit max enemies without hitting allies.',
      'Protect your concentration at all costs.',
    ],
  },
  {
    role: 'Blaster',
    description: 'Deal massive AOE damage.',
    classes: ['Sorcerer', 'Wizard', 'Warlock'],
    keyStats: ['High spell attack/DC', 'Damage spells'],
    tips: [
      'Wait for controller to group enemies, then blast.',
      'Fireball: 20ft radius = huge area. Don\'t hit allies.',
      'Quickened Spell + Eldritch Blast for Sorcerers/Warlocks.',
      'Save high-level slots for impactful moments.',
    ],
  },
  {
    role: 'Healer',
    description: 'Keep the party alive and remove conditions.',
    classes: ['Cleric', 'Druid', 'Bard', 'Paladin'],
    keyStats: ['Healing spells prepared', 'Wisdom/Charisma'],
    tips: [
      'DON\'T heal proactively — heal when someone is down or about to die.',
      'Healing Word (bonus action) is better than Cure Wounds in combat.',
      'Use your action for damage/control, bonus for healing.',
      'Lesser Restoration removes blindness, deafness, poison, paralysis.',
    ],
  },
  {
    role: 'Support',
    description: 'Buff allies and provide utility.',
    classes: ['Bard', 'Cleric', 'Paladin', 'Wizard'],
    keyStats: ['Buff spells', 'Auras', 'Utility'],
    tips: [
      'Bless is one of the best spells in the game — +1d4 to everything.',
      'Haste on the Fighter/Barbarian is a game-changer.',
      'Paladin Aura of Protection = +CHA to all saves within 10ft.',
      'Bardic Inspiration gives allies a clutch bonus die.',
    ],
  },
  {
    role: 'Scout',
    description: 'Explore ahead, find traps, gather intelligence.',
    classes: ['Rogue', 'Ranger', 'Monk'],
    keyStats: ['High Stealth', 'High Perception', 'Darkvision'],
    tips: [
      'Move ahead quietly — Stealth is your best friend.',
      'Check for traps (Investigation) before the party walks in.',
      'Use your familiar (if available) to scout safely.',
      'Report back before engaging — don\'t fight alone.',
    ],
  },
];

export function getRole(roleName) {
  return PARTY_ROLES.find(r => r.role.toLowerCase() === (roleName || '').toLowerCase()) || null;
}

export function suggestRole(className) {
  return PARTY_ROLES.filter(r =>
    r.classes.some(c => c.toLowerCase() === (className || '').toLowerCase())
  );
}

export function getPartyBalance(partyClasses) {
  const filledRoles = new Set();
  for (const cls of partyClasses) {
    const roles = suggestRole(cls);
    roles.forEach(r => filledRoles.add(r.role));
  }
  const missingRoles = PARTY_ROLES.filter(r => !filledRoles.has(r.role)).map(r => r.role);
  return { filledRoles: [...filledRoles], missingRoles };
}
