/**
 * playerTieflingRaceGuide.js
 * Player Mode: Tiefling — the infernal-blooded
 * Pure JS — no React dependencies.
 */

export const TIEFLING_BASICS = {
  race: 'Tiefling',
  source: 'Player\'s Handbook / Mordenkainen\'s Tome of Foes / MotM',
  asis: '+2 CHA, +1 INT (PHB) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  darkvision: '60ft',
  note: 'Fire resistance + Infernal Legacy spellcasting. Multiple subraces in Mordenkainen\'s Tome offer different spell sets. CHA caster race. Great for Warlocks, Sorcerers, Bards.',
};

export const TIEFLING_TRAITS = [
  { trait: 'Hellish Resistance', effect: 'Resistance to fire damage.', note: 'Fire is the most common element. Always useful. Permanent half-damage from fire.' },
  { trait: 'Darkvision', effect: '60ft darkvision.', note: 'Standard. See in darkness.' },
  { trait: 'Infernal Legacy (PHB)', effect: 'Thaumaturgy cantrip. At L3: Hellish Rebuke 1/LR. At L5: Darkness 1/LR. CHA is casting stat.', note: 'Hellish Rebuke = 2d10 reaction damage. Darkness for stealth/Devil\'s Sight combo.' },
];

export const TIEFLING_SUBRACES = [
  { subrace: 'Asmodeus (PHB default)', spells: ['Thaumaturgy', 'Hellish Rebuke (L3)', 'Darkness (L5)'], note: 'Default. Hellish Rebuke for reaction damage. Darkness for utility.' },
  { subrace: 'Zariel', asis: '+2 CHA, +1 STR', spells: ['Thaumaturgy', 'Searing Smite (L3)', 'Branding Smite (L5)'], note: 'STR + Smite spells. Perfect for Paladin Tiefling. Melee-focused.' },
  { subrace: 'Levistus', asis: '+2 CHA, +1 CON', spells: ['Ray of Frost', 'Armor of Agathys (L3)', 'Darkness (L5)'], note: 'CON bonus + Armor of Agathys = temp HP + cold damage when hit. Excellent tank option.' },
  { subrace: 'Glasya', asis: '+2 CHA, +1 DEX', spells: ['Minor Illusion', 'Disguise Self (L3)', 'Invisibility (L5)'], note: 'Infiltration suite. DEX + illusion + invisibility. Perfect Rogue Tiefling.' },
  { subrace: 'Dispater', asis: '+2 CHA, +1 DEX', spells: ['Thaumaturgy', 'Disguise Self (L3)', 'Detect Thoughts (L5)'], note: 'Social spy. Disguise Self + Detect Thoughts = read minds while disguised.' },
  { subrace: 'Mammon', asis: '+2 CHA, +1 INT', spells: ['Mage Hand', 'Tenser\'s Floating Disk (L3)', 'Arcane Lock (L5)'], note: 'Utility focused. Floating Disk for hauling. Arcane Lock for security.' },
];

export const TIEFLING_CLASS_SYNERGY = [
  { class: 'Warlock', priority: 'S', reason: 'CHA caster. Fire resistance. Hellish Rebuke reaction damage. Darkness + Devil\'s Sight combo. Thematic.' },
  { class: 'Sorcerer', priority: 'S', reason: 'CHA. Fire resistance protects concentration. Free spells save Sorcery Points. Great synergy.' },
  { class: 'Paladin (Zariel)', priority: 'S', reason: 'CHA + STR. Free Smite spells. Fire resistance. Frontline Paladin perfection.' },
  { class: 'Bard', priority: 'A', reason: 'CHA. Fire resistance. Hellish Rebuke as reaction option. Face character with edge.' },
  { class: 'Rogue (Glasya)', priority: 'A', reason: 'DEX + CHA. Free Disguise Self + Invisibility. Infiltration Rogue dream.' },
];

export const TIEFLING_TACTICS = [
  { tactic: 'Hellish Rebuke punishment', detail: 'Reaction: enemy hits you → 2d10 fire (3d10 upcast). Free damage on top of your normal turn.', rating: 'A' },
  { tactic: 'Levistus Armor of Agathys tank', detail: 'Free Armor of Agathys = 5 temp HP + 5 cold to attackers. Stack with Warlock upcasting.', rating: 'A' },
  { tactic: 'Glasya infiltration', detail: 'Disguise Self at L3, Invisibility at L5. Free infiltration spells every long rest.', rating: 'A' },
  { tactic: 'Zariel Paladin Smites', detail: 'Free Searing Smite + Branding Smite on top of Divine Smite. Extra Smite spells = extra burst.', rating: 'A' },
  { tactic: 'Darkness + Devil\'s Sight', detail: 'Warlock: Devil\'s Sight invocation + racial Darkness. See in magical darkness, enemies can\'t. Advantage on attacks.', rating: 'S' },
];

export function hellishRebukeDamage(spellLevel = 1) {
  const dice = spellLevel + 1;
  return { damage: `${dice}d10`, avg: dice * 5.5, note: 'Reaction when hit. Free from Infernal Legacy 1/LR.' };
}
