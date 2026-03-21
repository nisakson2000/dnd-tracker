/**
 * playerPartyComposition.js
 * Player Mode: Party composition analysis and gap identification
 * Pure JS — no React dependencies.
 */

export const PARTY_NEEDS = [
  { need: 'Frontline / Tank', classes: ['Fighter', 'Paladin', 'Barbarian', 'Cleric (heavy armor)'], importance: 'Critical', description: 'Someone who can absorb hits and protect the party.' },
  { need: 'Healing', classes: ['Cleric', 'Druid', 'Bard', 'Paladin', 'Ranger'], importance: 'Critical', description: 'Access to Healing Word, Cure Wounds, or Revivify.' },
  { need: 'Arcane Magic', classes: ['Wizard', 'Sorcerer', 'Warlock', 'Bard'], importance: 'High', description: 'Counterspell, Detect Magic, utility and blast spells.' },
  { need: 'AoE Damage', classes: ['Wizard', 'Sorcerer', 'Druid', 'Cleric'], importance: 'High', description: 'Fireball, Spirit Guardians — clearing groups of enemies.' },
  { need: 'Skills / Utility', classes: ['Rogue', 'Bard', 'Ranger'], importance: 'High', description: 'Lockpicking, scouting, social skills, expertise.' },
  { need: 'Single-Target Damage', classes: ['Rogue', 'Fighter', 'Paladin', 'Ranger', 'Warlock'], importance: 'Medium', description: 'Sneak Attack, Smite, multiple attacks to finish off tough enemies.' },
  { need: 'Crowd Control', classes: ['Wizard', 'Druid', 'Bard', 'Sorcerer'], importance: 'Medium', description: 'Hold Person, Web, Hypnotic Pattern — disabling multiple enemies.' },
  { need: 'Face / Social', classes: ['Bard', 'Paladin', 'Warlock', 'Sorcerer', 'Rogue'], importance: 'Medium', description: 'High CHA for Persuasion, Deception, Intimidation.' },
  { need: 'Scout / Stealth', classes: ['Rogue', 'Ranger', 'Monk'], importance: 'Low', description: 'Ahead-of-party scouting, stealth, and perception.' },
  { need: 'Ritual Casting', classes: ['Wizard', 'Cleric', 'Druid', 'Bard'], importance: 'Low', description: 'Free utility spells: Detect Magic, Identify, Tiny Hut, Alarm.' },
];

export const CLASS_COVERAGE = {
  Barbarian: ['Frontline / Tank', 'Single-Target Damage'],
  Bard: ['Healing', 'Arcane Magic', 'Skills / Utility', 'Crowd Control', 'Face / Social', 'Ritual Casting'],
  Cleric: ['Frontline / Tank', 'Healing', 'AoE Damage', 'Ritual Casting'],
  Druid: ['Healing', 'AoE Damage', 'Crowd Control', 'Ritual Casting'],
  Fighter: ['Frontline / Tank', 'Single-Target Damage'],
  Monk: ['Single-Target Damage', 'Scout / Stealth'],
  Paladin: ['Frontline / Tank', 'Healing', 'Single-Target Damage', 'Face / Social'],
  Ranger: ['Healing', 'Skills / Utility', 'Single-Target Damage', 'Scout / Stealth'],
  Rogue: ['Skills / Utility', 'Single-Target Damage', 'Scout / Stealth'],
  Sorcerer: ['Arcane Magic', 'AoE Damage', 'Crowd Control', 'Face / Social'],
  Warlock: ['Arcane Magic', 'Single-Target Damage', 'Face / Social'],
  Wizard: ['Arcane Magic', 'AoE Damage', 'Crowd Control', 'Ritual Casting'],
};

export function analyzeParty(classNames) {
  const allNeeds = PARTY_NEEDS.map(n => n.need);
  const covered = new Set();
  (classNames || []).forEach(cn => {
    const coverage = CLASS_COVERAGE[cn] || [];
    coverage.forEach(c => covered.add(c));
  });
  const gaps = allNeeds.filter(n => !covered.has(n));
  const criticalGaps = gaps.filter(g => {
    const need = PARTY_NEEDS.find(n => n.need === g);
    return need && need.importance === 'Critical';
  });
  return { covered: [...covered], gaps, criticalGaps };
}

export function suggestClass(partyClasses) {
  const { criticalGaps, gaps } = analyzeParty(partyClasses);
  if (criticalGaps.length > 0) {
    const need = PARTY_NEEDS.find(n => n.need === criticalGaps[0]);
    return { need: criticalGaps[0], suggestions: need ? need.classes : [], priority: 'critical' };
  }
  if (gaps.length > 0) {
    const need = PARTY_NEEDS.find(n => n.need === gaps[0]);
    return { need: gaps[0], suggestions: need ? need.classes : [], priority: 'high' };
  }
  return { need: 'None — party is well-rounded!', suggestions: [], priority: 'none' };
}
