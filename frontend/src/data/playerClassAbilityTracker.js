/**
 * playerClassAbilityTracker.js
 * Player Mode: Track class-specific abilities with uses per rest
 * Pure JS — no React dependencies.
 */

export const CLASS_RESOURCES = {
  Barbarian: [
    { ability: 'Rage', maxUses: [2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 'Unlimited'], recharge: 'long', startLevel: 1 },
    { ability: 'Reckless Attack', maxUses: ['Unlimited'], recharge: 'none', startLevel: 2 },
    { ability: 'Danger Sense', maxUses: ['Passive'], recharge: 'none', startLevel: 2 },
    { ability: 'Brutal Critical', maxUses: ['Passive'], recharge: 'none', startLevel: 9 },
  ],
  Bard: [
    { ability: 'Bardic Inspiration', maxUses: 'CHA mod', recharge: 'long (short at 5)', startLevel: 1 },
    { ability: 'Song of Rest', maxUses: ['Unlimited'], recharge: 'short', startLevel: 2 },
    { ability: 'Countercharm', maxUses: ['Unlimited'], recharge: 'none', startLevel: 6 },
  ],
  Cleric: [
    { ability: 'Channel Divinity', maxUses: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3], recharge: 'short', startLevel: 2 },
    { ability: 'Turn Undead', maxUses: 'Channel Divinity', recharge: 'short', startLevel: 2 },
    { ability: 'Divine Intervention', maxUses: [1], recharge: 'long (7 days)', startLevel: 10 },
  ],
  Fighter: [
    { ability: 'Second Wind', maxUses: [1], recharge: 'short', startLevel: 1 },
    { ability: 'Action Surge', maxUses: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], recharge: 'short', startLevel: 2 },
    { ability: 'Indomitable', maxUses: [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3], recharge: 'long', startLevel: 9 },
  ],
  Monk: [
    { ability: 'Ki Points', maxUses: 'Monk level', recharge: 'short', startLevel: 2 },
    { ability: 'Deflect Missiles', maxUses: ['Unlimited'], recharge: 'none', startLevel: 3 },
    { ability: 'Slow Fall', maxUses: ['Unlimited'], recharge: 'none', startLevel: 4 },
    { ability: 'Stunning Strike', maxUses: '1 Ki per attempt', recharge: 'short (Ki)', startLevel: 5 },
  ],
  Paladin: [
    { ability: 'Divine Sense', maxUses: '1 + CHA mod', recharge: 'long', startLevel: 1 },
    { ability: 'Lay on Hands', maxUses: 'Paladin level × 5 HP', recharge: 'long', startLevel: 1 },
    { ability: 'Divine Smite', maxUses: 'Spell slots', recharge: 'long', startLevel: 2 },
    { ability: 'Cleansing Touch', maxUses: 'CHA mod', recharge: 'long', startLevel: 14 },
  ],
  Ranger: [
    { ability: 'Favored Foe', maxUses: 'Proficiency bonus', recharge: 'long', startLevel: 1 },
    { ability: 'Primeval Awareness', maxUses: 'Spell slot', recharge: 'long', startLevel: 3 },
  ],
  Rogue: [
    { ability: 'Sneak Attack', maxUses: ['1/turn'], recharge: 'none', startLevel: 1 },
    { ability: 'Cunning Action', maxUses: ['Unlimited'], recharge: 'none', startLevel: 2 },
    { ability: 'Uncanny Dodge', maxUses: ['1/round (reaction)'], recharge: 'none', startLevel: 5 },
    { ability: 'Evasion', maxUses: ['Passive'], recharge: 'none', startLevel: 7 },
  ],
  Sorcerer: [
    { ability: 'Sorcery Points', maxUses: 'Sorcerer level', recharge: 'long', startLevel: 2 },
    { ability: 'Metamagic', maxUses: 'Sorcery Points', recharge: 'long', startLevel: 3 },
  ],
  Warlock: [
    { ability: 'Pact Magic Slots', maxUses: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4], recharge: 'short', startLevel: 1 },
    { ability: 'Mystic Arcanum', maxUses: [1], recharge: 'long', startLevel: 11 },
  ],
  Wizard: [
    { ability: 'Arcane Recovery', maxUses: [1], recharge: 'long (after short rest)', startLevel: 1 },
  ],
};

export function getClassResources(className) {
  return CLASS_RESOURCES[className] || [];
}

export function getResourcesAtLevel(className, level) {
  return getClassResources(className).filter(r => r.startLevel <= level);
}

export function createResourceTracker(className, level) {
  return getResourcesAtLevel(className, level).map(r => ({
    ...r,
    currentUses: typeof r.maxUses === 'number' ? r.maxUses : Array.isArray(r.maxUses) ? r.maxUses[Math.min(level - r.startLevel, r.maxUses.length - 1)] : 0,
    maxForLevel: Array.isArray(r.maxUses) ? r.maxUses[Math.min(level - r.startLevel, r.maxUses.length - 1)] : r.maxUses,
  }));
}
