/**
 * playerFeatsRanked.js
 * Player Mode: Complete feat tier list and selection guide
 * Pure JS — no React dependencies.
 */

export const FEAT_TIER_LIST = [
  // S Tier
  { feat: 'Sharpshooter', tier: 'S', type: 'Offense', prereq: 'None', effect: '-5 to hit/+10 damage with ranged. Ignore cover (except full). No disadvantage at long range.', bestFor: ['Fighter', 'Ranger', 'Rogue'] },
  { feat: 'Great Weapon Master', tier: 'S', type: 'Offense', prereq: 'None', effect: '-5 to hit/+10 damage with heavy melee. Bonus action attack on crit or kill.', bestFor: ['Barbarian', 'Fighter', 'Paladin'] },
  { feat: 'Polearm Master', tier: 'S', type: 'Offense', prereq: 'None', effect: 'Bonus action d4 attack. OA when enemies enter your reach.', bestFor: ['Fighter', 'Paladin', 'Barbarian'] },
  { feat: 'Sentinel', tier: 'S', type: 'Defense', prereq: 'None', effect: 'OA reduces speed to 0. OA when ally attacked. Ignore Disengage.', bestFor: ['Fighter', 'Paladin', 'Barbarian'] },
  { feat: 'Lucky', tier: 'S', type: 'Utility', prereq: 'None', effect: '3 luck points per day. Reroll any d20. Works on attacks, saves, checks.', bestFor: ['Everyone'] },
  { feat: 'War Caster', tier: 'S', type: 'Caster', prereq: 'Spellcasting', effect: 'Advantage on concentration saves. Somatic with full hands. Spell as OA.', bestFor: ['Cleric', 'Paladin', 'Sorcerer', 'Warlock'] },
  { feat: 'Resilient (CON)', tier: 'S', type: 'Defense', prereq: 'None', effect: '+1 CON and proficiency in CON saves. Scales better than War Caster at high levels.', bestFor: ['Any caster'] },
  // A Tier
  { feat: 'Alert', tier: 'A', type: 'Utility', prereq: 'None', effect: '+5 initiative. Can\'t be surprised. Hidden creatures don\'t get advantage.', bestFor: ['Everyone', 'Assassin'] },
  { feat: 'Crossbow Expert', tier: 'A', type: 'Offense', prereq: 'None', effect: 'Ignore loading. No disadvantage in melee with ranged. Bonus action hand crossbow.', bestFor: ['Fighter', 'Ranger', 'Rogue'] },
  { feat: 'Eldritch Adept', tier: 'A', type: 'Caster', prereq: 'Spellcasting', effect: 'One Warlock invocation. Devil\'s Sight or Mask of Many Faces.', bestFor: ['Any caster'] },
  { feat: 'Fey Touched', tier: 'A', type: 'Caster', prereq: 'None', effect: '+1 to CHA/WIS/INT. Free Misty Step + one 1st-level divination/enchantment.', bestFor: ['Any caster', 'Half-casters'] },
  { feat: 'Shadow Touched', tier: 'A', type: 'Caster', prereq: 'None', effect: '+1 to CHA/WIS/INT. Free Invisibility + one 1st-level illusion/necromancy.', bestFor: ['Any caster', 'Rogue'] },
  { feat: 'Skill Expert', tier: 'A', type: 'Utility', prereq: 'None', effect: '+1 any stat, one proficiency, one Expertise. Flexible and powerful.', bestFor: ['Skill monkey', 'Grappler'] },
  { feat: 'Mounted Combatant', tier: 'A', type: 'Offense', prereq: 'None', effect: 'Advantage vs unmounted smaller. Redirect mount attacks. Evasion for mount.', bestFor: ['Paladin', 'Cavalier'] },
  { feat: 'Mobile', tier: 'A', type: 'Utility', prereq: 'None', effect: '+10 speed. No OA from attacked targets. Ignore difficult terrain when Dashing.', bestFor: ['Monk', 'Rogue', 'Melee caster'] },
  // B Tier
  { feat: 'Tough', tier: 'B', type: 'Defense', prereq: 'None', effect: '+2 HP per level. Simple but effective. Like +4 CON for HP only.', bestFor: ['Anyone who takes hits'] },
  { feat: 'Inspiring Leader', tier: 'B', type: 'Support', prereq: 'CHA 13', effect: 'Give 6 creatures temp HP = level + CHA mod after short rest.', bestFor: ['Paladin', 'Bard', 'Warlock', 'Sorcerer'] },
  { feat: 'Ritual Caster', tier: 'B', type: 'Utility', prereq: 'INT/WIS 13', effect: 'Cast ritual spells from a book. Huge utility for non-casters.', bestFor: ['Fighter', 'Rogue', 'Barbarian'] },
  { feat: 'Shield Master', tier: 'B', type: 'Defense', prereq: 'None', effect: 'Bonus action shove with shield. Add shield AC to DEX saves. Evasion vs single-target.', bestFor: ['Fighter', 'Paladin'] },
  { feat: 'Metamagic Adept', tier: 'B', type: 'Caster', prereq: 'Spellcasting', effect: '2 metamagic options, 2 sorcery points. Great for non-Sorcerers.', bestFor: ['Any caster'] },
  { feat: 'Telekinetic', tier: 'B', type: 'Utility', prereq: 'None', effect: '+1 mental stat, invisible Mage Hand, bonus action shove 5ft.', bestFor: ['Any caster'] },
];

export const FEAT_VS_ASI = {
  rules: [
    'If your primary stat is below 18, ASI is usually better',
    'If primary stat is 20, feat is almost always better',
    'Half-feats (+1 to a stat) are best when you have an odd score',
    'GWM/Sharpshooter are so good they\'re worth taking over ASI at any point',
    'Casters should prioritize maxing their casting stat before feats',
  ],
  exceptions: [
    'Lucky is always worth it regardless of stats',
    'Resilient (CON) is critical for concentration casters even at low levels',
    'Alert is S-tier for Assassin Rogues regardless of DEX score',
  ],
};

export function getFeatsForClass(className) {
  return FEAT_TIER_LIST.filter(f =>
    f.bestFor.includes('Everyone') ||
    f.bestFor.some(c => c.toLowerCase().includes((className || '').toLowerCase()))
  );
}

export function getTopFeats(tier) {
  return FEAT_TIER_LIST.filter(f => f.tier === (tier || 'S'));
}

export function shouldTakeFeatOrASI(primaryStat, level) {
  if (primaryStat >= 20) return { choice: 'Feat', reason: 'Primary stat maxed. Feat adds more value.' };
  if (primaryStat <= 15) return { choice: 'ASI', reason: 'Primary stat is low. +2 is huge.' };
  if (primaryStat % 2 === 1) return { choice: 'Half-feat', reason: 'Odd stat — half-feat rounds it up AND gives a bonus.' };
  return { choice: 'Either', reason: 'Solid primary stat. GWM/SS/Lucky are worth it, otherwise ASI.' };
}
