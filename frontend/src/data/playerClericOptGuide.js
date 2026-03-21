/**
 * playerClericOptGuide.js
 * Player Mode: Cleric optimization — domains, spell strategy, builds
 * Pure JS — no React dependencies.
 */

export const CLERIC_CORE = {
  strengths: ['Prepared caster: change spells daily.', 'Spirit Guardians: best sustained damage spell.', 'Heavy armor + shields (some domains).', 'Healing + support + damage in one class.'],
  weaknesses: ['Concentration-heavy.', 'Fewer offensive cantrips.', 'Speed: heavy armor = slower if STR < 15.', 'Can feel like the "heal bot" if not proactive.'],
  stats: 'WIS > CON > STR (heavy armor) or WIS > CON > DEX (medium armor).',
  key: 'You are NOT a heal bot. Spirit Guardians + Spiritual Weapon = best sustained DPR at L5.',
};

export const DOMAIN_RANKINGS = [
  { domain: 'Twilight', rating: 'S+', why: 'Twilight Sanctuary: temp HP every round to all allies. 300ft darkvision. Flight at L6.', note: 'Most broken domain. Some tables ban it.' },
  { domain: 'Peace', rating: 'S+', why: 'Emboldening Bond: +1d4 to attacks/saves/checks for bonded allies.', note: 'Stacks with Bless. Incredibly strong. Often banned.' },
  { domain: 'Life', rating: 'S', why: 'Best healer. Heavy armor. Disciple of Life: extra healing on every heal spell.', note: 'Goodberry + Disciple of Life = 4 HP per berry instead of 1.' },
  { domain: 'Order', rating: 'A+', why: 'Voice of Authority: ally makes reaction attack when you cast a spell on them.', note: 'Bless → Fighter gets a free attack. Every. Turn. Amazing.' },
  { domain: 'Forge', rating: 'A+', why: '+1 AC from Blessing of the Forge. Heavy armor. Fire resistance.', note: 'Tankiest Cleric. +1 armor/weapon at L1. Solid.' },
  { domain: 'Tempest', rating: 'A+', why: 'Destructive Wrath: max lightning/thunder damage. Heavy armor.', note: 'Call Lightning + max damage = devastating. Shatter synergy.' },
  { domain: 'War', rating: 'A', why: 'War Priest: extra weapon attack as BA. Guided Strike: +10 to hit.', note: 'Melee Cleric. Limited uses but strong when used.' },
  { domain: 'Light', rating: 'A', why: 'Fireball on Cleric spell list. Warding Flare: impose disadvantage.', note: 'Blaster Cleric. Fireball + Spirit Guardians.' },
  { domain: 'Grave', rating: 'A', why: 'Path to the Grave: next hit is vulnerable (double damage). Spare dying at 30ft.', note: 'Nova enabler. Paladin smite + vulnerability = obscene damage.' },
  { domain: 'Trickery', rating: 'B+', why: 'Invoke Duplicity: illusory double. Pass Without Trace on domain list.', note: 'Stealth Cleric. PWT is great but domain features are weak.' },
  { domain: 'Knowledge', rating: 'B+', why: 'Extra skills, languages. Read Thoughts. Niche utility.', note: 'Investigation/exploration focused. Weak in combat.' },
  { domain: 'Nature', rating: 'B', why: 'Druid cantrip + heavy armor. Dampen Elements: reaction resist.', note: 'Weak domain. Heavy armor + Shillelagh is interesting but limited.' },
];

export const CLERIC_COMBAT_STRATEGY = {
  round1: 'Bless or Spirit Guardians (depending on combat type).',
  round2: 'Spiritual Weapon (BA, no concentration) + cantrip or attack.',
  sustained: 'Move into enemies for Spirit Guardians damage. BA: Spiritual Weapon. Action: cantrip/Dodge.',
  healing: 'Don\'t heal until someone goes down. Healing Word (BA, ranged) to pick up.',
  key: 'Spirit Guardians + Spiritual Weapon = ~25+ DPR with NO additional spell slots.',
};

export const BEST_CLERIC_SPELLS_BY_LEVEL = [
  { level: 'Cantrip', spells: ['Toll the Dead (d12 if damaged)', 'Sacred Flame (DEX save, radiant)', 'Guidance (+1d4 to any check)'] },
  { level: 1, spells: ['Bless (S+)', 'Healing Word (S+)', 'Guiding Bolt (S)', 'Shield of Faith (A+)', 'Command (A+)'] },
  { level: 2, spells: ['Spiritual Weapon (S+)', 'Hold Person (S)', 'Aid (A+)', 'Silence (A+)'] },
  { level: 3, spells: ['Spirit Guardians (S+)', 'Revivify (S+)', 'Dispel Magic (A+)'] },
  { level: 4, spells: ['Banishment (S+)', 'Death Ward (S)', 'Guardian of Faith (A+)'] },
  { level: 5, spells: ['Holy Weapon (S)', 'Greater Restoration (S)', 'Raise Dead (A+)'] },
  { level: 6, spells: ['Heal (S)', 'Heroes\' Feast (S+)', 'Word of Recall (A)'] },
  { level: 7, spells: ['Conjure Celestial (A+)', 'Divine Word (A)', 'Regenerate (A)'] },
  { level: 8, spells: ['Holy Aura (S)', 'Antimagic Field (A+)'] },
  { level: 9, spells: ['Mass Heal (S+)', 'True Resurrection (S)'] },
];

export const CLERIC_BUILD_TIPS = [
  'You are NOT a heal bot. Spirit Guardians is your best spell.',
  'Spirit Guardians + Spiritual Weapon = best sustained DPR at L5.',
  'Healing Word: BA ranged heal. Only heal when allies go to 0.',
  'Bless: +1d4 to attacks AND saves. Best L1 concentration spell.',
  'Twilight/Peace domains: extremely powerful. Some tables ban them.',
  'Heavy armor: STR 15 to avoid speed penalty. Or pick medium armor domain.',
  'Guidance: +1d4 to any check. Cast it on everything out of combat.',
  'Prepared caster: change spells daily. Adapt to the situation.',
  'Concentration priority: Spirit Guardians > Bless > other.',
  'War Caster or Resilient (CON): protect your concentration.',
];
