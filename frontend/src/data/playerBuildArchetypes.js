/**
 * playerBuildArchetypes.js
 * Player Mode: Common character build archetypes and optimization tips
 * Pure JS — no React dependencies.
 */

export const BUILD_ARCHETYPES = [
  {
    name: 'Sword & Board Tank',
    classes: ['Fighter', 'Paladin'],
    description: 'High AC frontliner with shield. Absorbs damage, protects the party.',
    keyStats: 'STR > CON > WIS/CHA',
    keyFeats: ['Shield Master', 'Sentinel', 'Heavy Armor Master'],
    playstyle: 'Stand in front. Use Dodge if overwhelmed. Sentinel stops enemies from passing you.',
  },
  {
    name: 'Great Weapon Master',
    classes: ['Fighter', 'Barbarian', 'Paladin'],
    description: 'Two-handed weapon specialist. Maximum damage per hit.',
    keyStats: 'STR > CON > WIS',
    keyFeats: ['Great Weapon Master', 'Polearm Master', 'Sentinel'],
    playstyle: '-5/+10 on attacks. Reckless Attack (Barbarian) offsets the -5. PAM adds bonus action attacks.',
  },
  {
    name: 'Sharpshooter',
    classes: ['Fighter', 'Ranger'],
    description: 'Ranged damage specialist. Longbow or crossbow.',
    keyStats: 'DEX > CON > WIS',
    keyFeats: ['Sharpshooter', 'Crossbow Expert', 'Alert'],
    playstyle: '-5/+10 on ranged attacks. Ignore cover. Crossbow Expert removes loading and close-range disadvantage.',
  },
  {
    name: 'Blaster Caster',
    classes: ['Wizard', 'Sorcerer'],
    description: 'AoE damage specialist. Fireball everything.',
    keyStats: 'INT/CHA > CON > DEX',
    keyFeats: ['War Caster', 'Elemental Adept', 'Alert'],
    playstyle: 'Open with AoE on clusters. Use Sculpt Spells (Evocation) to protect allies.',
  },
  {
    name: 'Control Wizard',
    classes: ['Wizard'],
    description: 'Battlefield control. Disable enemies, shape the fight.',
    keyStats: 'INT > CON > DEX',
    keyFeats: ['War Caster', 'Resilient (CON)', 'Alert'],
    playstyle: 'Hypnotic Pattern, Web, Wall of Force. Control > damage. One good control spell wins the fight.',
  },
  {
    name: 'Healer/Support',
    classes: ['Cleric', 'Druid', 'Bard'],
    description: 'Keep the party alive and buffed. Healing Word + concentration buffs.',
    keyStats: 'WIS/CHA > CON > STR/DEX',
    keyFeats: ['War Caster', 'Resilient (CON)', 'Fey Touched'],
    playstyle: 'Bless turn 1. Healing Word when someone drops. Spirit Guardians for damage.',
  },
  {
    name: 'Gish (Melee Caster)',
    classes: ['Paladin', 'Hexblade Warlock', 'Bladesinger Wizard', 'Eldritch Knight'],
    description: 'Mix melee combat with spellcasting. Best of both worlds.',
    keyStats: 'Primary casting stat > CON > STR/DEX',
    keyFeats: ['War Caster', 'Polearm Master', 'Sentinel'],
    playstyle: 'Buff yourself (Shield, Haste, Shadow Blade), then attack. Smite on crits.',
  },
  {
    name: 'Skill Monkey',
    classes: ['Rogue', 'Bard', 'Ranger'],
    description: 'Expertise in key skills. Handles social, stealth, and utility.',
    keyStats: 'DEX > CHA/WIS > CON',
    keyFeats: ['Skill Expert', 'Alert', 'Observant'],
    playstyle: 'Expertise makes you the best at specific things. Reliable Talent (Rogue 11) = never fail.',
  },
  {
    name: 'Summoner',
    classes: ['Druid', 'Wizard', 'Necromancer Wizard'],
    description: 'Flood the battlefield with allied creatures.',
    keyStats: 'WIS/INT > CON > DEX',
    keyFeats: ['War Caster', 'Resilient (CON)'],
    playstyle: 'Conjure Animals / Animate Dead. Action economy wins. Pre-roll summon stats.',
  },
];

export function getArchetype(name) {
  return BUILD_ARCHETYPES.find(a => a.name.toLowerCase().includes((name || '').toLowerCase())) || null;
}

export function getArchetypesForClass(className) {
  return BUILD_ARCHETYPES.filter(a =>
    a.classes.some(c => c.toLowerCase().includes((className || '').toLowerCase()))
  );
}
