/**
 * playerWizardSchools.js
 * Player Mode: All 8 schools of magic — what they do, key spells, and combat applications
 * Pure JS — no React dependencies.
 */

export const SCHOOLS_OF_MAGIC = [
  {
    school: 'Abjuration',
    theme: 'Protection, wards, and banishing',
    combatRole: 'Defense and anti-magic',
    keySpells: ['Shield', 'Counterspell', 'Dispel Magic', 'Globe of Invulnerability', 'Banishment'],
    playerTip: 'If you\'re fighting casters, Abjuration spells are your bread and butter.',
    color: 'Blue/White',
  },
  {
    school: 'Conjuration',
    theme: 'Summoning creatures and creating objects/effects',
    combatRole: 'Action economy through summons',
    keySpells: ['Conjure Animals', 'Misty Step', 'Dimension Door', 'Web', 'Cloudkill'],
    playerTip: 'Summoning gives you extra actions. Web is one of the best control spells.',
    color: 'Yellow/Gold',
  },
  {
    school: 'Divination',
    theme: 'Knowledge, foresight, and detection',
    combatRole: 'Information advantage',
    keySpells: ['Detect Magic', 'See Invisibility', 'True Seeing', 'Foresight', 'Mind Spike'],
    playerTip: 'Know what you\'re fighting before you fight it. Information wins battles.',
    color: 'Silver/Light Blue',
  },
  {
    school: 'Enchantment',
    theme: 'Mind control, charm, and influence',
    combatRole: 'Crowd control and disabling',
    keySpells: ['Hold Person', 'Hypnotic Pattern', 'Suggestion', 'Dominate Person', 'Power Word Stun'],
    playerTip: 'The strongest single-target disables are Enchantment. Hold Person = auto-crit.',
    color: 'Pink/Purple',
  },
  {
    school: 'Evocation',
    theme: 'Raw elemental damage and energy',
    combatRole: 'Direct damage, AoE blasting',
    keySpells: ['Fireball', 'Lightning Bolt', 'Magic Missile', 'Wall of Force', 'Meteor Swarm'],
    playerTip: 'When in doubt, Fireball. Evocation Wizard\'s Sculpt Spells protects allies from your AoE.',
    color: 'Red/Orange',
  },
  {
    school: 'Illusion',
    theme: 'Deception, misdirection, and false reality',
    combatRole: 'Creative problem solving',
    keySpells: ['Minor Illusion', 'Mirror Image', 'Major Image', 'Greater Invisibility', 'Simulacrum'],
    playerTip: 'Illusion power scales with player creativity and DM receptiveness.',
    color: 'Violet/Shifting',
  },
  {
    school: 'Necromancy',
    theme: 'Death, undead, and life manipulation',
    combatRole: 'Minion army and drain effects',
    keySpells: ['Toll the Dead', 'Animate Dead', 'Blight', 'Circle of Death', 'Finger of Death'],
    playerTip: 'Animate Dead creates a horde. Each skeleton/zombie adds actions to your side.',
    color: 'Green/Black',
  },
  {
    school: 'Transmutation',
    theme: 'Transformation and changing properties',
    combatRole: 'Versatile buffs and polymorph',
    keySpells: ['Polymorph', 'Haste', 'Slow', 'Fly', 'True Polymorph'],
    playerTip: 'Polymorph can be offensive (T-Rex) or defensive (Giant Ape for HP). Haste is top-tier buff.',
    color: 'Green/Brown',
  },
];

export const SCHOOL_IDENTIFICATION = {
  description: 'Identifying a spell\'s school helps you know what it does and how to counter it.',
  inCombat: [
    'Arcana check (reaction) to identify a spell being cast — DC 15 + spell level.',
    'Detect Magic reveals school of active magic effects.',
    'If you know the spell, you automatically know its school.',
  ],
  counterplay: [
    { school: 'Abjuration', counter: 'Overwhelm defenses. Dispel Magic their wards.' },
    { school: 'Conjuration', counter: 'Break concentration to dismiss summons. Focus the caster.' },
    { school: 'Enchantment', counter: 'High WIS saves. Calm Emotions. Elves get advantage (Fey Ancestry).' },
    { school: 'Evocation', counter: 'Spread out to avoid AoE. Absorb Elements. Evasion.' },
    { school: 'Illusion', counter: 'Investigation check to see through. True Seeing. Ignore and test.' },
    { school: 'Necromancy', counter: 'Radiant damage. Turn Undead. Kill the controlling caster.' },
    { school: 'Transmutation', counter: 'Break concentration (Polymorph, Haste). Dispel Magic.' },
  ],
};

export const DETECTING_SPELLS = {
  verbal: 'You can hear a spell being cast (verbal component). Arcana to identify.',
  somatic: 'You can see gestures (somatic component). Arcana to identify.',
  subtle: 'Subtle Spell (Sorcerer) removes V and S. You can\'t tell a spell is being cast.',
  concentration: 'Look for visible effects. If an enemy has a glow, aura, or ongoing effect, they\'re likely concentrating.',
  tip: 'Track which enemies have used spells. If they haven\'t used a reaction, they might have Counterspell.',
};

export function getSchool(schoolName) {
  return SCHOOLS_OF_MAGIC.find(s => s.school.toLowerCase() === (schoolName || '').toLowerCase()) || null;
}

export function getCounterplay(schoolName) {
  const entry = SCHOOL_IDENTIFICATION.counterplay.find(c => c.school.toLowerCase() === (schoolName || '').toLowerCase());
  return entry ? entry.counter : 'Dispel Magic or break concentration.';
}

export function getSchoolsByRole(role) {
  const roleMap = {
    damage: ['Evocation', 'Necromancy'],
    control: ['Enchantment', 'Conjuration', 'Illusion'],
    defense: ['Abjuration', 'Transmutation'],
    utility: ['Divination', 'Transmutation', 'Illusion'],
    summoning: ['Conjuration', 'Necromancy'],
  };
  return roleMap[role] || [];
}
