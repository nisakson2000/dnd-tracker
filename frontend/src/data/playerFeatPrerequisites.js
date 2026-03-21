/**
 * playerFeatPrerequisites.js
 * Player Mode: Feat prerequisites, synergies, and tier rankings
 * Pure JS — no React dependencies.
 */

export const FEAT_TIERS = {
  S: { label: 'S Tier — Must-Have', color: '#ff5722' },
  A: { label: 'A Tier — Excellent', color: '#ff9800' },
  B: { label: 'B Tier — Good', color: '#ffc107' },
  C: { label: 'C Tier — Situational', color: '#4caf50' },
  D: { label: 'D Tier — Niche', color: '#9e9e9e' },
};

export const FEATS = [
  { name: 'Great Weapon Master', tier: 'S', prerequisite: 'None', benefit: '-5 to hit, +10 damage. Bonus attack on crit/kill.', bestFor: ['Barbarian', 'Fighter', 'Paladin'] },
  { name: 'Sharpshooter', tier: 'S', prerequisite: 'None', benefit: '-5 to hit, +10 damage. Ignore cover. No long range penalty.', bestFor: ['Fighter', 'Ranger', 'Rogue'] },
  { name: 'Polearm Master', tier: 'S', prerequisite: 'None', benefit: 'Bonus attack (d4). OA when enemy enters reach.', bestFor: ['Fighter', 'Paladin', 'Barbarian'] },
  { name: 'Sentinel', tier: 'S', prerequisite: 'None', benefit: 'OA stops movement. Attack when ally is targeted.', bestFor: ['Fighter', 'Paladin', 'Barbarian'] },
  { name: 'Lucky', tier: 'S', prerequisite: 'None', benefit: '3 luck points per day. Reroll any d20.', bestFor: ['Everyone'] },
  { name: 'War Caster', tier: 'S', prerequisite: 'Spellcasting', benefit: 'Advantage on concentration saves. Somatic with full hands. Spell as OA.', bestFor: ['Cleric', 'Paladin', 'Any gish'] },
  { name: 'Resilient (CON)', tier: 'A', prerequisite: 'None', benefit: '+1 CON, proficiency in CON saves.', bestFor: ['Sorcerer', 'Wizard', 'Bard', 'Any concentrator'] },
  { name: 'Alert', tier: 'A', prerequisite: 'None', benefit: '+5 initiative. Can\'t be surprised. No advantage from unseen attackers.', bestFor: ['Everyone', 'Especially Assassin Rogue'] },
  { name: 'Crossbow Expert', tier: 'A', prerequisite: 'None', benefit: 'Ignore loading. No disadvantage at close range. Bonus attack with hand crossbow.', bestFor: ['Fighter', 'Ranger', 'Rogue'] },
  { name: 'Tough', tier: 'A', prerequisite: 'None', benefit: '+2 HP per level. Retroactive.', bestFor: ['Everyone', 'Especially low-HP classes'] },
  { name: 'Eldritch Adept', tier: 'B', prerequisite: 'Spellcasting or Pact Magic', benefit: 'One Eldritch Invocation.', bestFor: ['Any caster'] },
  { name: 'Fey Touched', tier: 'A', prerequisite: 'None', benefit: '+1 CHA/WIS/INT. Free Misty Step + 1st-level divination/enchantment.', bestFor: ['Any CHA/WIS caster'] },
  { name: 'Shadow Touched', tier: 'B', prerequisite: 'None', benefit: '+1 CHA/WIS/INT. Free Invisibility + 1st-level illusion/necromancy.', bestFor: ['Rogue', 'Warlock', 'Any CHA/WIS caster'] },
  { name: 'Ritual Caster', tier: 'B', prerequisite: 'INT or WIS 13', benefit: 'Learn ritual spells from one class. Cast without slots.', bestFor: ['Non-casters', 'Half-casters'] },
  { name: 'Mobile', tier: 'B', prerequisite: 'None', benefit: '+10 speed. No OA from creatures you attack. Ignore difficult terrain when Dashing.', bestFor: ['Monk', 'Rogue', 'Melee strikers'] },
  { name: 'Shield Master', tier: 'B', prerequisite: 'None', benefit: 'Bonus action shove. Add shield AC to DEX saves. Evasion for shield users.', bestFor: ['Fighter', 'Paladin'] },
  { name: 'Mounted Combatant', tier: 'C', prerequisite: 'None', benefit: 'Advantage on attacks. Redirect attacks to you. Mount evasion.', bestFor: ['Cavalier', 'Paladin with Find Steed'] },
  { name: 'Tavern Brawler', tier: 'C', prerequisite: 'None', benefit: '+1 STR/CON. Improvised proficiency. Bonus grapple after unarmed.', bestFor: ['Barbarian', 'Monk'] },
];

export function getFeatsForClass(className) {
  return FEATS.filter(f => f.bestFor.some(c => c.toLowerCase().includes((className || '').toLowerCase()) || c === 'Everyone'));
}

export function getFeatsByTier(tier) {
  return FEATS.filter(f => f.tier === tier);
}

export function getFeatInfo(name) {
  return FEATS.find(f => f.name.toLowerCase() === (name || '').toLowerCase()) || null;
}
