/**
 * playerWizardSchoolRankingGuide.js
 * Player Mode: Wizard subclass (Arcane Tradition) ranking
 * Pure JS — no React dependencies.
 */

export const WIZARD_SCHOOL_RANKING = [
  {
    school: 'Chronurgy (Dunamancy)',
    source: "Explorer's Guide to Wildemount",
    tier: 'S',
    reason: 'Chronal Shift: force reroll on any d20 within 30ft (2/LR). Convergent Future: dictate success/failure. Temporal Awareness: INT to initiative.',
    keyFeatures: ['Chronal Shift (force reroll)', 'Temporal Awareness (INT to initiative)', 'Arcane Abeyance (store spell in bead)', 'Convergent Future (dictate d20)'],
  },
  {
    school: 'Divination',
    source: "Player's Handbook",
    tier: 'S',
    reason: 'Portent: roll 2d20 at dawn, replace ANY d20 roll (yours or others). Low roll → force enemy save fail. High roll → guarantee your hit.',
    keyFeatures: ['Portent (2 predetermined d20s)', 'Expert Divination (regain slots)', 'The Third Eye (see invisible/ethereal)', 'Greater Portent (3d20 at L14)'],
  },
  {
    school: 'Bladesinging',
    source: "Tasha's Cauldron of Everything",
    tier: 'S',
    reason: 'Bladesong: +INT to AC, CON saves, Acrobatics, speed. AC 20+ with no armor. Extra Attack (one can be cantrip). Best gish.',
    keyFeatures: ['Bladesong (+INT to AC/CON)', 'Extra Attack (cantrip as one attack)', 'Song of Defense (reduce damage)', 'Song of Victory (+INT to melee)'],
  },
  {
    school: 'War Magic',
    source: "Xanathar's Guide to Everything",
    tier: 'A',
    reason: 'Arcane Deflection: +2 AC or +4 saves as reaction (limits next turn to cantrips). Power Surge: bonus force damage. Durable Magic: +2 AC/saves while concentrating.',
    keyFeatures: ['Arcane Deflection (+2 AC/+4 saves)', 'Tactical Wit (INT to initiative)', 'Power Surge (bonus damage)', 'Durable Magic (+2 AC/saves)'],
  },
  {
    school: 'Abjuration',
    source: "Player's Handbook",
    tier: 'A',
    reason: 'Arcane Ward: temp HP shield that recharges when casting abjuration spells. Projected Ward: share with allies. Most durable Wizard.',
    keyFeatures: ['Arcane Ward (recharging HP shield)', 'Projected Ward (protect allies)', 'Improved Abjuration (add prof to dispel)', 'Spell Resistance (advantage + resistance)'],
  },
  {
    school: 'Evocation',
    source: "Player's Handbook",
    tier: 'A',
    reason: 'Sculpt Spells: allies auto-succeed on your evocation saves (take 0 damage). Fireball without friendly fire. Empowered Evocation: +INT to damage.',
    keyFeatures: ['Sculpt Spells (safe AoE)', 'Potent Cantrip (half on save)', 'Empowered Evocation (+INT damage)', 'Overchannel (max damage)'],
  },
  {
    school: 'Graviturgy (Dunamancy)',
    source: "Explorer's Guide to Wildemount",
    tier: 'B+',
    reason: 'Adjust Density: double/halve weight. Gravity Well: move targets 5ft on spell hit/fail. Event Horizon: pull enemies toward you.',
    keyFeatures: ['Adjust Density (weight control)', 'Gravity Well (forced movement)', 'Violent Attraction (extra damage)', 'Event Horizon (pull aura)'],
  },
  {
    school: 'Order of Scribes',
    source: "Tasha's Cauldron of Everything",
    tier: 'B+',
    reason: 'Awakened Spellbook: change damage type of any spell to another spell of same level. Manifest Mind: cast through remote focus. Unique utility.',
    keyFeatures: ['Damage type swapping', 'Manifest Mind (remote casting)', 'Master Scrivener (free spell scroll)', 'One with the Word (spell sacrifice)'],
  },
  {
    school: 'Illusion',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'Improved Minor Illusion (sound + image). Malleable Illusions (change on the fly). Illusory Reality: make illusion real for 1 minute. DM-dependent.',
    keyFeatures: ['Improved Minor Illusion', 'Malleable Illusions', 'Illusory Self (dodge attack)', 'Illusory Reality (make illusion real)'],
  },
  {
    school: 'Necromancy',
    source: "Player's Handbook",
    tier: 'B',
    reason: 'Undead Thralls: Animate Dead creates stronger zombies/skeletons. Grim Harvest: heal on kills. Army of undead at high levels.',
    keyFeatures: ['Undead Thralls (+HP, +damage)', 'Grim Harvest (self-heal)', 'Inured to Undeath (resistance)', 'Command Undead'],
  },
  {
    school: 'Conjuration',
    source: "Player's Handbook",
    tier: 'C+',
    reason: 'Minor Conjuration: create objects. Benign Transposition: teleport 30ft. Focused Conjuration: auto-concentration on conjuration. Durable Summons: +30 temp HP to summons.',
    keyFeatures: ['Minor Conjuration (create objects)', 'Benign Transposition (teleport)', 'Focused Conjuration', 'Durable Summons (+30 temp HP)'],
  },
  {
    school: 'Enchantment',
    source: "Player's Handbook",
    tier: 'C',
    reason: 'Hypnotic Gaze: incapacitate one creature (action each turn). Instinctive Charm: redirect attacks. Many creatures immune to charm.',
    keyFeatures: ['Hypnotic Gaze (charm 1 creature)', 'Instinctive Charm (redirect)', 'Split Enchantment (twin charm)', 'Alter Memories'],
  },
  {
    school: 'Transmutation',
    source: "Player's Handbook",
    tier: 'C',
    reason: 'Transmuter\'s Stone: choose one minor buff. Minor Alchemy: change materials. Shapechanger: free Polymorph 1/SR. Weak early features.',
    keyFeatures: ['Transmuter\'s Stone (minor buff)', 'Minor Alchemy', 'Shapechanger (free Polymorph)', 'Master Transmuter (various effects)'],
  },
];

export function schoolByPriority(priority) {
  const tiers = {
    S: ['Chronurgy', 'Divination', 'Bladesinging'],
    A: ['War Magic', 'Abjuration', 'Evocation'],
    B: ['Graviturgy', 'Order of Scribes', 'Illusion', 'Necromancy'],
    C: ['Conjuration', 'Enchantment', 'Transmutation'],
  };
  return tiers[priority] || [];
}
