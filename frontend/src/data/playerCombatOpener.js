/**
 * playerCombatOpener.js
 * Player Mode: Optimal first-turn strategies by class/role
 * Pure JS — no React dependencies.
 */

export const FIRST_TURN_STRATEGIES = [
  { role: 'Melee DPS (Fighter/Barbarian)', turn1: 'Rage/Action Surge → attack primary target. Focus fire.', priority: 'Get into melee ASAP. Don\'t waste a turn moving without attacking.', tip: 'If you can\'t reach anyone, Dash. An attack on turn 2 is better than nothing.' },
  { role: 'Ranged DPS (Ranger/Fighter)', turn1: 'Hunter\'s Mark → attack. Or: Sharpshooter power attacks.', priority: 'Find cover or high ground. Mark the biggest threat.', tip: 'Don\'t switch targets until your mark is dead (transfers as bonus action on kill).' },
  { role: 'Rogue', turn1: 'Hide (Cunning Action) → Sneak Attack from stealth.', priority: 'Guarantee Sneak Attack. Stealth advantage > moving to flank.', tip: 'If an ally is adjacent to your target, you don\'t need stealth for Sneak Attack.' },
  { role: 'Blaster Caster (Wizard/Sorcerer)', turn1: 'AoE if 3+ enemies clustered. Single-target control if boss.', priority: 'Fireball/Hypnotic Pattern on groups. Hold Person/Banishment on solos.', tip: 'Don\'t waste slots on weak enemies the martials can handle.' },
  { role: 'Support Caster (Cleric/Bard)', turn1: 'Bless (3 allies) or Spirit Guardians (if in melee range).', priority: 'Get your concentration spell up FIRST. Everything else is secondary.', tip: 'Bless is almost always correct turn 1 unless you\'re in melee range for Spirit Guardians.' },
  { role: 'Controller (Druid/Wizard)', turn1: 'Web/Entangle on enemy cluster. Faerie Fire if need advantage.', priority: 'Lock down as many enemies as possible on turn 1.', tip: 'Position control spells to split the enemy group.' },
  { role: 'Tank (Paladin/Fighter)', turn1: 'Get to the front line. Interpose between enemies and squishies.', priority: 'Absorb attention. Compelled Duel or Sentinel OAs.', tip: 'Your job is to make enemies attack YOU, not the wizard.' },
  { role: 'Warlock', turn1: 'Hex → Eldritch Blast. Or: Hold Person + EB at advantage.', priority: 'Hex should be up by end of turn 1 for +1d6 per beam.', tip: 'If you have 2+ beams, Hex damage adds up fast. Don\'t drop concentration.' },
  { role: 'Monk', turn1: 'Move in → Stunning Strike on the biggest threat.', priority: 'Stun the boss if possible. Even if it fails, try again (spend Ki).', tip: 'Stunning a key enemy is worth 2-3 Ki points. The party capitalizes with advantage + auto-crits in melee.' },
];

export const OPENING_SPELLS_TIER_LIST = [
  { tier: 'S', spells: ['Bless', 'Spirit Guardians', 'Hypnotic Pattern', 'Web', 'Faerie Fire'] },
  { tier: 'A', spells: ['Fireball', 'Hold Person', 'Haste', 'Entangle', 'Hex + EB'] },
  { tier: 'B', spells: ['Shield of Faith', 'Hunter\'s Mark', 'Spike Growth', 'Silence'] },
  { tier: 'Traps', spells: ['Witch Bolt (wastes action)', 'True Strike (NEVER)', 'Mordenkainen\'s Sword (terrible)'] },
];

export function getOpeningStrategy(role) {
  return FIRST_TURN_STRATEGIES.find(s => s.role.toLowerCase().includes((role || '').toLowerCase())) || null;
}

export function getOpeningSpellsByTier(tier) {
  const entry = OPENING_SPELLS_TIER_LIST.find(t => t.tier === tier);
  return entry ? entry.spells : [];
}
