/**
 * playerArtificerSubclassRankingGuide.js
 * Player Mode: Artificer subclass ranking
 * Pure JS — no React dependencies.
 */

export const ARTIFICER_SUBCLASS_RANKING = [
  {
    subclass: 'Armorer',
    source: "Tasha's Cauldron of Everything",
    tier: 'S',
    reason: 'Power Armor: Guardian (tank, thunder gauntlets force enemies to attack you) or Infiltrator (stealth, lightning launcher). Uses INT for attacks.',
    keyFeatures: ['Power Armor (Guardian or Infiltrator)', 'Thunder Gauntlets (force attack you)', 'Lightning Launcher (ranged INT attack)', 'Armor Modifications (4 infusion slots)', 'Perfected Armor'],
    note: 'Guardian mode is an incredible tank. INT for attacks = SAD. Lightning Launcher for ranged.',
  },
  {
    subclass: 'Battle Smith',
    source: "Tasha's Cauldron of Everything",
    tier: 'A+',
    reason: 'Steel Defender: companion that scales. INT for weapon attacks. Extra Attack. Arcane Jolt: heal or damage on hit.',
    keyFeatures: ['Battle Ready (INT for weapons, martial proficiency)', 'Steel Defender (companion)', 'Extra Attack', 'Arcane Jolt (2d6 heal or damage)', 'Improved Defender'],
    note: 'Best martial Artificer. Steel Defender provides flanking, Help action, and absorbs hits. INT attacks = SAD.',
  },
  {
    subclass: 'Artillerist',
    source: "Tasha's Cauldron of Everything",
    tier: 'A',
    reason: 'Eldritch Cannon: Flamethrower (AoE), Force Ballista (ranged), Protector (temp HP aura). Can ride Tiny cannon on shoulder.',
    keyFeatures: ['Eldritch Cannon (3 types)', 'Arcane Firearm (+1d8 to spell damage)', 'Explosive Cannon (AoE on death)', 'Fortified Position (2 cannons + half cover)'],
    note: 'Best blaster Artificer. Arcane Firearm: +1d8 to every damaging cantrip/spell. Protector cannon is great support.',
  },
  {
    subclass: 'Alchemist',
    source: "Tasha's Cauldron of Everything",
    tier: 'C',
    reason: 'Experimental Elixir: random potion (or spend slot for choice). Effects are weak. Alchemical Savant: +INT to healing/damage. Worst subclass.',
    keyFeatures: ['Experimental Elixir (random or crafted)', 'Alchemical Savant (+INT to heal/damage)', 'Restorative Reagents (Lesser Restoration free)', 'Chemical Mastery'],
    note: 'Random elixirs are frustrating. Effects are too weak for the slot cost. Other subclasses do everything better.',
  },
];

export const ARTIFICER_INFUSIONS_RANKED = [
  { infusion: 'Enhanced Arcane Focus', effect: '+1/+2 to spell attacks and save DC.', rating: 'S' },
  { infusion: 'Enhanced Defense', effect: '+1/+2 AC to armor or shield.', rating: 'S' },
  { infusion: 'Enhanced Weapon', effect: '+1/+2 to attack and damage.', rating: 'A' },
  { infusion: 'Bag of Holding', effect: 'Create a Bag of Holding. 500 lbs capacity.', rating: 'A' },
  { infusion: 'Homunculus Servant', effect: 'Create a tiny construct companion. Force damage ranged attack.', rating: 'A' },
  { infusion: 'Repeating Shot', effect: '+1 weapon, ignore loading, create own ammo.', rating: 'A' },
  { infusion: 'Winged Boots', effect: 'Flying speed = walking speed. 4 hours/day. Requires L10.', rating: 'S (L10+)' },
  { infusion: 'Helm of Awareness', effect: 'Advantage on initiative. Can\'t be surprised.', rating: 'A (L10+)' },
  { infusion: 'Cloak of Protection', effect: '+1 AC and saves. Requires attunement.', rating: 'A' },
  { infusion: 'Spell-Refueling Ring', effect: 'Recover one L3 or lower slot 1/day. Requires L6.', rating: 'A' },
];

export function artificerInfusionSlots(level) {
  if (level >= 18) return { known: 12, active: 6 };
  if (level >= 14) return { known: 10, active: 5 };
  if (level >= 10) return { known: 8, active: 4 };
  if (level >= 6) return { known: 6, active: 3 };
  return { known: 4, active: 2 };
}
