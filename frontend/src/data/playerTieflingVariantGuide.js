/**
 * playerTieflingVariantGuide.js
 * Player Mode: Tiefling variant features — all subraces compared
 * Pure JS — no React dependencies.
 */

export const BASE_TIEFLING = {
  asi: '+2 CHA, +1 INT (PHB)',
  resistance: 'Fire resistance.',
  darkvision: '60ft darkvision.',
  spells: 'Thaumaturgy (cantrip), Hellish Rebuke L1 (L3), Darkness (L5). CHA casting.',
  languages: 'Common, Infernal.',
};

export const TIEFLING_VARIANTS = [
  {
    subrace: 'Asmodeus (PHB Default)',
    asi: '+2 CHA, +1 INT',
    spells: 'Thaumaturgy, Hellish Rebuke (L3), Darkness (L5)',
    rating: 'A+',
    note: 'Standard. Good for Warlocks and Sorcerers.',
  },
  {
    subrace: 'Zariel (MTOF)',
    asi: '+2 CHA, +1 STR',
    spells: 'Thaumaturgy, Searing Smite (L3), Branding Smite (L5)',
    rating: 'S',
    note: 'Best for Paladins. +1 STR + smite spells. Perfect melee Tiefling.',
  },
  {
    subrace: 'Levistus (MTOF)',
    asi: '+2 CHA, +1 CON',
    spells: 'Ray of Frost (cantrip), Armor of Agathys (L3), Darkness (L5)',
    rating: 'S',
    note: 'Best defensive option. +1 CON + free Armor of Agathys.',
  },
  {
    subrace: 'Glasya (MTOF)',
    asi: '+2 CHA, +1 DEX',
    spells: 'Minor Illusion, Disguise Self (L3), Invisibility (L5)',
    rating: 'S',
    note: 'Best for Rogues. +1 DEX + stealth spells.',
  },
  {
    subrace: 'Dispater (MTOF)',
    asi: '+2 CHA, +1 DEX',
    spells: 'Thaumaturgy, Disguise Self (L3), Detect Thoughts (L5)',
    rating: 'A+',
    note: 'Social infiltration. Disguise Self + Detect Thoughts.',
  },
  {
    subrace: 'Mammon (MTOF)',
    asi: '+2 CHA, +1 INT',
    spells: 'Mage Hand, Tenser\'s Floating Disk (L3), Arcane Lock (L5)',
    rating: 'B+',
    note: 'Utility focused. Mage Hand is useful but spells are niche.',
  },
  {
    subrace: 'Mephistopheles (MTOF)',
    asi: '+2 CHA, +1 INT',
    spells: 'Mage Hand, Burning Hands (L3), Flame Blade (L5)',
    rating: 'B+',
    note: 'Offensive caster. Burning Hands is decent AoE early.',
  },
  {
    subrace: 'Fierna (MTOF)',
    asi: '+2 CHA, +1 WIS',
    spells: 'Friends (cantrip), Charm Person (L3), Suggestion (L5)',
    rating: 'A',
    note: 'Best for social characters. Charm Person + Suggestion for free.',
  },
  {
    subrace: 'Baalzebul (MTOF)',
    asi: '+2 CHA, +1 INT',
    spells: 'Thaumaturgy, Ray of Sickness (L3), Crown of Madness (L5)',
    rating: 'B',
    note: 'Weakest variant. Crown of Madness is unreliable.',
  },
  {
    subrace: 'Feral (SCAG)',
    asi: '+2 DEX, +1 INT',
    spells: 'Same as chosen variant',
    rating: 'A (if allowed)',
    note: 'Swaps CHA for DEX as primary. Best for DEX-based builds. Check with DM.',
  },
];

export const BEST_CLASS_MATCHES = {
  paladin: 'Zariel (+1 STR, free smite spells)',
  warlock: 'Levistus (+1 CON, Armor of Agathys) or Asmodeus',
  sorcerer: 'Levistus or Asmodeus',
  rogue: 'Glasya (+1 DEX, Disguise Self, Invisibility)',
  bard: 'Fierna (+1 WIS, Charm Person, Suggestion) or Glasya',
  wizard: 'Dispater or Mammon (+1 INT options)',
  fighter: 'Zariel (+1 STR, smite spells)',
};

export const TIEFLING_TIPS = [
  'All Tieflings get fire resistance and 60ft darkvision.',
  'Zariel: best melee Tiefling. Smite spells for Paladins.',
  'Levistus: +1 CON + Armor of Agathys. Best defensive.',
  'Glasya: +1 DEX + Invisibility. Perfect for Rogues.',
  'Fierna: social build. Free Charm Person + Suggestion.',
  'Racial spells use CHA. Good for CHA casters.',
  'Fire resistance: most common damage type. Always useful.',
  'Feral variant: +2 DEX instead of CHA. Ask DM first.',
  'Dispater: Disguise Self + Detect Thoughts = spy build.',
  'Avoid Baalzebul: Crown of Madness is a trap spell.',
];
