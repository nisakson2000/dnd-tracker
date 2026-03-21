/**
 * playerArcaneTraditionGuide.js
 * Player Mode: All Wizard subclasses (Arcane Traditions) ranked
 * Pure JS — no React dependencies.
 */

export const ARCANE_TRADITIONS_RANKED = [
  { school: 'Chronurgy', rating: 'S+', role: 'Control', key: 'Chronal Shift: reroll any d20. +INT initiative. Decide success/fail L14.', note: 'Best Wizard subclass.' },
  { school: 'Divination', rating: 'S+', role: 'Control', key: 'Portent: 2-3 d20s at dawn. Replace any roll. Force save failures.', note: 'Most powerful feature in 5e.' },
  { school: 'Scribes', rating: 'S', role: 'Versatile', key: 'Copy in 2 min. Change damage types. Ritual cast at normal speed.', note: 'Most flexible.' },
  { school: 'Bladesinging', rating: 'S', role: 'Melee', key: '+INT to AC and concentration. Extra Attack (cantrip). Song of Defense.', note: 'Highest AC Wizard.' },
  { school: 'Abjuration', rating: 'A+', role: 'Tank', key: 'Arcane Ward: 2×level+INT HP shield. Projected to allies. Spell resistance L14.', note: 'Tankiest Wizard.' },
  { school: 'War Magic', rating: 'A+', role: 'Combat', key: '+2 AC or +4 saves reaction. +INT initiative.', note: 'Reliable defense.' },
  { school: 'Evocation', rating: 'A+', role: 'Blaster', key: 'Sculpt: allies auto-succeed + 0 damage. Overchannel: max damage.', note: 'Fireball without friendly fire.' },
  { school: 'Illusion', rating: 'A+ (DM)', role: 'Creative', key: 'Malleable Illusions. Illusory Reality L14: illusion becomes real.', note: 'Broken at L14.' },
  { school: 'Conjuration', rating: 'A', role: 'Summoning', key: 'Unbreakable concentration on conjuration. 30ft teleport.', note: 'Good summoner.' },
  { school: 'Necromancy', rating: 'A', role: 'Minions', key: 'Buffed Animate Dead. Command Undead L14.', note: 'Zombie army.' },
  { school: 'Enchantment', rating: 'B+', role: 'Social', key: 'Hypnotic Gaze. Redirect attacks. Alter Memories.', note: 'DM-dependent.' },
  { school: 'Transmutation', rating: 'B+', role: 'Utility', key: 'Transmuter\'s Stone (various buffs). Free Polymorph L10.', note: 'Spread thin.' },
];

export const WIZARD_TRADITION_TIPS = [
  'Chronurgy + Divination: best subclasses. Dice control wins D&D.',
  'Portent: low roll = force enemy save failure. High = guarantee your hit.',
  'Bladesinger: 23+ AC with Bladesong. INT to concentration saves.',
  'Evocation Sculpt: Fireball centered on yourself. Allies take 0 damage.',
  'Scribes: change Fireball to cold damage. Bypass fire resistance.',
  'Abjuration Ward recharges when you cast abjuration spells (Shield, Counterspell).',
  'Illusory Reality L14: create real walls/bridges from illusions.',
  'Wizard is the strongest class in 5e. Any tradition works.',
];
