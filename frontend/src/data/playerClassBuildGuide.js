/**
 * playerClassBuildGuide.js
 * Player Mode: Optimized class builds and progression paths
 * Pure JS — no React dependencies.
 */

export const CLASS_BUILDS = [
  {
    name: 'GWM Barbarian',
    class: 'Barbarian (Totem Warrior)',
    race: 'Half-Orc or Variant Human',
    stats: 'STR 16+ > CON 14+ > DEX 14',
    keyFeats: ['Great Weapon Master (level 4)', 'Sentinel (level 8)', 'Resilient WIS (level 12)'],
    strategy: 'Reckless Attack + GWM = constant advantage with -5/+10. Bear Totem for resistance to everything.',
    tier: 'S',
  },
  {
    name: 'Sharpshooter Fighter',
    class: 'Fighter (Battle Master)',
    race: 'Variant Human or Custom Lineage',
    stats: 'DEX 16+ > CON 14 > WIS 12',
    keyFeats: ['Sharpshooter (level 1 VHuman)', 'Crossbow Expert (level 4)', 'Alert (level 6)'],
    strategy: 'Hand crossbow + Crossbow Expert = bonus action attack. Sharpshooter on every shot. Precision Attack maneuver covers the -5.',
    tier: 'S',
  },
  {
    name: 'Hexblade Warlock',
    class: 'Warlock (Hexblade)',
    race: 'Half-Elf or Variant Human',
    stats: 'CHA 16+ > CON 14 > DEX 14',
    keyFeats: ['Eldritch Adept or War Caster (level 4)', 'Polearm Master (if melee, level 8)'],
    strategy: 'CHA for attack/damage. Medium armor + shield. Hex + Eldritch Blast at range. Spirit Shroud for melee.',
    tier: 'A',
  },
  {
    name: 'Peace Cleric',
    class: 'Cleric (Peace Domain)',
    race: 'Hill Dwarf or Variant Human',
    stats: 'WIS 16+ > CON 14 > STR 13 (for heavy armor)',
    keyFeats: ['War Caster (level 4)', 'Resilient CON (level 8)'],
    strategy: 'Emboldening Bond is one of the strongest features in the game. Spirit Guardians + Spiritual Weapon. Bless stacks with Bond.',
    tier: 'S',
  },
  {
    name: 'Twilight Cleric',
    class: 'Cleric (Twilight Domain)',
    race: 'Any with WIS bonus',
    stats: 'WIS 16+ > CON 14 > STR 13',
    keyFeats: ['War Caster (level 4)', 'Resilient CON (level 8)'],
    strategy: 'Twilight Sanctuary = 1d6+level temp HP to EVERYONE every round. Heavy armor + martial weapons. Arguably the strongest cleric.',
    tier: 'S',
  },
  {
    name: 'Moon Druid',
    class: 'Druid (Circle of the Moon)',
    race: 'Any (stats don\'t matter in Wild Shape)',
    stats: 'WIS 16+ > CON 14 > DEX 14',
    keyFeats: ['Sentinel (level 4)', 'Resilient CON (level 8)'],
    strategy: 'Wild Shape = massive temp HP pool. Sentinel in bear form = lock down enemies. Levels 2-4 you\'re the strongest in the party.',
    tier: 'A',
  },
  {
    name: 'Gloom Stalker Assassin',
    class: 'Ranger 5 / Rogue 3+',
    race: 'Wood Elf or Custom Lineage',
    stats: 'DEX 16+ > WIS 14 > CON 14',
    keyFeats: ['Alert (level 4)', 'Sharpshooter (Rogue 4)'],
    strategy: 'Dread Ambusher + Assassinate = massive first-turn damage. Invisible in darkness. +WIS to initiative.',
    tier: 'S',
  },
  {
    name: 'Eloquence Bard',
    class: 'Bard (College of Eloquence)',
    race: 'Half-Elf or Changeling',
    stats: 'CHA 16+ > DEX 14 > CON 14',
    keyFeats: ['Fey Touched (level 4)', 'Metamagic Adept or Lucky (level 8)'],
    strategy: 'Minimum 12 on Persuasion/Deception. Unsettling Words + save-or-suck spells. Best face in the game.',
    tier: 'A',
  },
  {
    name: 'Chronurgy Wizard',
    class: 'Wizard (Chronurgy)',
    race: 'Gnome or Custom Lineage',
    stats: 'INT 16+ > CON 14 > DEX 14',
    keyFeats: ['War Caster (level 4)', 'Resilient CON (level 8)', 'Lucky (level 12)'],
    strategy: 'Chronal Shift = force rerolls. Convergent Future = set die results. Arcane Abeyance = store spells in beads. Insanely powerful.',
    tier: 'S',
  },
];

export function getBuild(className) {
  return CLASS_BUILDS.filter(b =>
    b.class.toLowerCase().includes((className || '').toLowerCase()) ||
    b.name.toLowerCase().includes((className || '').toLowerCase())
  );
}

export function getTopBuilds() {
  return CLASS_BUILDS.filter(b => b.tier === 'S');
}

export function getBuildByName(name) {
  return CLASS_BUILDS.find(b =>
    b.name.toLowerCase().includes((name || '').toLowerCase())
  ) || null;
}
