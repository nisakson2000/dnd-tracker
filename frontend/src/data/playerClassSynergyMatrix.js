/**
 * playerClassSynergyMatrix.js
 * Player Mode: Class synergy matrix showing which classes combo well together
 * Pure JS — no React dependencies.
 */

export const CLASS_SYNERGIES = [
  { class1: 'Paladin', class2: 'Bard', synergy: 'S', reason: 'Bard buffs (Bardic Inspiration, Faerie Fire) + Paladin smites = devastating. Both CHA-based for social pillar.' },
  { class1: 'Wizard', class2: 'Fighter', synergy: 'S', reason: 'Fighter protects Wizard concentration. Wizard provides AoE and control. Classic combo.' },
  { class1: 'Rogue', class2: 'Anyone with Help action', synergy: 'A', reason: 'Help action = advantage = guaranteed Sneak Attack. Familiars count.' },
  { class1: 'Warlock', class2: 'Sorcerer', synergy: 'S', reason: 'Darkness + Devil\'s Sight. Quickened spells + Eldritch Blast. Sorlock multiclass is legendary.' },
  { class1: 'Cleric', class2: 'Barbarian', synergy: 'A', reason: 'Cleric heals and buffs. Barbarian tanks. Spirit Guardians + Barbarian frontline = AoE damage.' },
  { class1: 'Druid', class2: 'Ranger', synergy: 'A', reason: 'Druid area control + Ranger\'s martial damage. Both nature-themed. Pass Without Trace for party stealth.' },
  { class1: 'Monk', class2: 'Cleric', synergy: 'B', reason: 'Monk stuns enemies, Cleric buffs. Stunned = auto-fail DEX/STR saves for cleric spells.' },
  { class1: 'Artificer', class2: 'Fighter', synergy: 'A', reason: 'Artificer infuses Fighter\'s weapons/armor. Enhanced Defense + Enhanced Weapon on the Fighter is huge.' },
  { class1: 'Paladin', class2: 'Warlock', synergy: 'A', reason: 'Both CHA-based. Warlock\'s Hex + Paladin smites stack. Eldritch Blast for range when melee isn\'t possible.' },
  { class1: 'Wizard', class2: 'Rogue', synergy: 'A', reason: 'Wizard casts Hold Person, Rogue gets auto-crit Sneak Attack on paralyzed target.' },
  { class1: 'Barbarian', class2: 'Rogue', synergy: 'B', reason: 'Reckless Attack gives advantage = Sneak Attack (if using finesse weapons). Unusual but effective.' },
  { class1: 'Cleric', class2: 'Paladin', synergy: 'A', reason: 'Double healer/frontline. Cleric buffs + Paladin aura = extremely tanky duo.' },
  { class1: 'Sorcerer', class2: 'Any martial', synergy: 'A', reason: 'Twinned Haste on two martials = devastating. Quickened Hold Person + martial follow-up.' },
  { class1: 'Druid', class2: 'Barbarian', synergy: 'B', reason: 'Moon Druid Wild Shape + Rage (multiclass). Bear HP + Rage resistance = nearly unkillable.' },
];

export const PARTY_COMPOSITIONS = [
  { name: 'Classic', comp: ['Fighter', 'Cleric', 'Wizard', 'Rogue'], rating: 'A', note: 'Covers all roles. Tried and true.' },
  { name: 'Holy Avengers', comp: ['Paladin', 'Cleric', 'Paladin', 'Bard'], rating: 'S', note: 'Double Paladin aura. Massive saves. CHA-focused social monsters.' },
  { name: 'Blaster Squad', comp: ['Sorcerer', 'Wizard', 'Warlock', 'Bard'], rating: 'B', note: 'All casters. Incredible at levels 5+. Fragile early. No healing except Bard.' },
  { name: 'Stealth Team', comp: ['Rogue', 'Ranger', 'Monk', 'Bard'], rating: 'A', note: 'Pass Without Trace + high DEX. Incredible at ambushes and infiltration.' },
  { name: 'Frontline Heavy', comp: ['Barbarian', 'Fighter', 'Paladin', 'Cleric'], rating: 'A', note: 'Pure durability. Low range but nearly unkillable in melee.' },
  { name: 'Support Stack', comp: ['Bard', 'Cleric', 'Druid', 'Artificer'], rating: 'B', note: 'Buff everything. Low direct damage but the party is nearly invincible.' },
];

export const ROLE_COVERAGE = {
  tank: ['Barbarian', 'Fighter', 'Paladin', 'Cleric (heavy armor)'],
  healer: ['Cleric', 'Druid', 'Bard', 'Paladin', 'Ranger', 'Celestial Warlock'],
  damage: ['Fighter', 'Rogue', 'Warlock', 'Sorcerer', 'Ranger', 'Barbarian', 'Paladin'],
  control: ['Wizard', 'Druid', 'Bard', 'Sorcerer'],
  utility: ['Wizard', 'Bard', 'Artificer', 'Ranger', 'Druid', 'Rogue'],
  face: ['Bard', 'Paladin', 'Warlock', 'Sorcerer', 'Rogue'],
};

export function getSynergy(class1, class2) {
  return CLASS_SYNERGIES.find(s =>
    (s.class1.toLowerCase().includes((class1 || '').toLowerCase()) && s.class2.toLowerCase().includes((class2 || '').toLowerCase())) ||
    (s.class1.toLowerCase().includes((class2 || '').toLowerCase()) && s.class2.toLowerCase().includes((class1 || '').toLowerCase()))
  ) || null;
}

export function analyzePartyComp(classes) {
  const coverage = {};
  Object.entries(ROLE_COVERAGE).forEach(([role, roleClasses]) => {
    coverage[role] = classes.filter(c =>
      roleClasses.some(rc => rc.toLowerCase().includes(c.toLowerCase()))
    ).length;
  });
  const missing = Object.entries(coverage).filter(([, count]) => count === 0).map(([role]) => role);
  return { coverage, missing, balanced: missing.length === 0 };
}
