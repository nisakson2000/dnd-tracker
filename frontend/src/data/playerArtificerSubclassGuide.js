/**
 * playerArtificerSubclassGuide.js
 * Player Mode: Artificer subclass comparison and optimization
 * Pure JS — no React dependencies.
 */

export const ARTIFICER_SUBCLASSES = [
  {
    subclass: 'Armorer',
    rating: 'S',
    source: 'TCE',
    keyFeature: 'Arcane Armor: heavy armor without STR requirement. Guardian (temp HP, force attacks) or Infiltrator (lightning, stealth).',
    strengths: ['INT-based attacks through armor', 'Guardian: temp HP on hit + force enemies to target you', 'Infiltrator: lightning damage + advantage on Stealth', 'Extra attunement slots'],
    weaknesses: ['Two modes can be hard to optimize for both', 'Less crafting feel than other subclasses'],
    playstyle: 'Iron Man. Switch between tank (Guardian) and stealth (Infiltrator) modes.',
  },
  {
    subclass: 'Battle Smith',
    rating: 'S',
    source: 'TCE',
    keyFeature: 'INT for weapon attacks. Steel Defender: mechanical companion (BA command, reaction to impose disadvantage).',
    strengths: ['INT-based weapon attacks (truly SAD)', 'Steel Defender is a great companion', 'Martial weapons + shield', 'Extra Attack at L5'],
    weaknesses: ['Defender competes for BA', 'Defender has limited HP at high levels'],
    playstyle: 'Combat artificer. Fight with INT. Your steel defender tanks, flanks, and protects.',
  },
  {
    subclass: 'Artillerist',
    rating: 'A+',
    source: 'TCE',
    keyFeature: 'Eldritch Cannon: tiny or small cannon. Flamethrower (AoE), Force Ballista (damage + push), Protector (temp HP).',
    strengths: ['Cannon doesn\'t require action after creation', 'Protector: 1d8+INT temp HP to all in 10ft each turn', 'Arcane Firearm: +1d8 to damage spells'],
    weaknesses: ['Cannon has limited HP', 'Only 1 cannon at a time (2 at L15)', 'Less weapon-focused'],
    playstyle: 'Turret builder. Set up Protector for constant temp HP or Force Ballista for damage support.',
  },
  {
    subclass: 'Alchemist',
    rating: 'B',
    source: 'TCE',
    keyFeature: 'Experimental Elixir: random elixir at dawn (healing, flight, AC, speed, etc.).',
    strengths: ['Free elixirs (random each dawn)', 'Restorative Reagents: Lesser Restoration with spell slots', 'Alchemical Savant: +INT to healing/damage spells'],
    weaknesses: ['Random elixirs are unreliable', 'Weakest subclass mechanically', 'No combat identity', 'Elixir creation costs spell slots after first free one'],
    playstyle: 'Potion brewer. Randomness and support. Weakest artificer but still functional.',
  },
];

export const ARTIFICER_GENERAL_TIPS = [
  'Infusions are your bread and butter. Enhanced Weapon (+1/+2) and Enhanced Defense (+1/+2) first.',
  'Spell-Storing Item (L11): 2×INT mod uses of a L1-2 spell. ANYONE can activate it. Give to familiar/defender.',
  'Best Spell-Storing Item picks: Aid (S+), Cure Wounds (A+), Web (S), Faerie Fire (A+).',
  'Artificers get extra attunement slots: 4 at L10, 5 at L14, 6 at L18. You USE magic items.',
  'Flash of Genius (L7): +INT to any save or ability check you see (reaction, INT mod/LR). Incredible support.',
  'Magic Item Adept (L10): attune 4 items + craft common/uncommon items in quarter time at half cost.',
  'Artificers are half-casters but prepare from their full list. Adapt daily.',
  'Best artificer spells: Web (S), Faerie Fire (A+), Cure Wounds (A), Heat Metal (S), Tiny Servant (A).',
  'Artificer 1 is a great multiclass dip: CON save proficiency, medium armor, shields, and infusions.',
];

export const ARTIFICER_INFUSION_PRIORITIES = [
  { infusion: 'Enhanced Weapon', priority: 'S', note: '+1/+2 to weapon. Give to party martial. Core infusion.' },
  { infusion: 'Enhanced Defense', priority: 'S', note: '+1/+2 AC to armor or shield. Core infusion.' },
  { infusion: 'Bag of Holding', priority: 'A+', note: 'Create a Bag of Holding. Party essential.' },
  { infusion: 'Mind Sharpener', priority: 'S (casters)', note: 'Auto-succeed concentration save (4 charges/LR). Give to concentrating caster.' },
  { infusion: 'Returning Weapon', priority: 'A', note: '+1 thrown weapon that returns. Great for thrown builds.' },
  { infusion: 'Homunculus Servant', priority: 'A', note: 'Tiny construct. Delivers touch spells, Help action, scouts.' },
  { infusion: 'Replicate Magic Item', priority: 'Varies', note: 'Create specific magic items. Alchemy Jug (A), Lantern of Revealing (A), Winged Boots (S).' },
  { infusion: 'Spell-Refueling Ring', priority: 'A+', note: 'Recover one L3 or lower spell slot per day. Essentially free spell slot.' },
];
