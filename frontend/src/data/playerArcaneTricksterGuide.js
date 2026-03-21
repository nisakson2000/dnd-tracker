/**
 * playerArcaneTricksterGuide.js
 * Player Mode: Arcane Trickster subclass optimization and spell selection
 * Pure JS — no React dependencies.
 */

export const AT_BASICS = {
  class: 'Rogue (Arcane Trickster)',
  spellcasting: 'Third-caster (spell slots at 1/3 Rogue level)',
  ability: 'Intelligence',
  restriction: 'Enchantment and Illusion only (except at levels 3, 8, 14, 20 — any school)',
  cantrips: { level3: 3, level10: 4 },
  keyFeatures: {
    mageHandLegerdemain: 'L3: Invisible Mage Hand. Pick locks, disarm traps, pickpocket at 30ft.',
    magicalAmbush: 'L9: If hidden, targets have disadvantage on saves vs your spells.',
    versatileTrickster: 'L13: Mage Hand gives advantage on attacks (Sneak Attack enabler).',
    spellThief: 'L17: Steal a spell from enemy caster (WIS save). Cast it yourself.',
  },
};

export const AT_SPELL_PICKS = {
  mustHave: [
    { spell: 'Find Familiar', level: 1, school: 'Conjuration', note: 'Free school. Owl Help action = guaranteed Sneak Attack.' },
    { spell: 'Booming Blade', level: 0, school: 'Evocation', note: 'Sneak Attack + Booming Blade damage. Disengage away.' },
    { spell: 'Shield', level: 1, school: 'Abjuration', note: 'Free school. +5 AC reaction. Keeps you alive.' },
    { spell: 'Minor Illusion', level: 0, school: 'Illusion', note: 'Create cover to hide behind. Free Sneak Attack setup.' },
    { spell: 'Shadow Blade', level: 2, school: 'Illusion', note: 'Finesse 2d8 psychic weapon. Advantage in dim light.' },
  ],
  strong: [
    { spell: 'Mirror Image', level: 2, school: 'Illusion', note: 'No concentration. Major survivability.' },
    { spell: 'Invisibility', level: 2, school: 'Illusion', note: 'On-school. Scouting + surprise setup.' },
    { spell: 'Misty Step', level: 2, school: 'Conjuration', note: 'Free school. Bonus action escape/reposition.' },
    { spell: 'Hold Person', level: 2, school: 'Enchantment', note: 'On-school. Paralyzed = auto-crit Sneak Attack.' },
    { spell: 'Hypnotic Pattern', level: 3, school: 'Illusion', note: 'On-school. Best crowd control at 3rd level.' },
    { spell: 'Suggestion', level: 2, school: 'Enchantment', note: 'On-school. Social encounter powerhouse.' },
  ],
};

export const AT_TACTICS = [
  { tactic: 'Owl familiar Help', detail: 'Owl flies in, Help action (advantage), flies out (Flyby). Guaranteed Sneak Attack.', level: 3 },
  { tactic: 'Booming Blade + Disengage', detail: 'Hit with Booming Blade, Cunning Action Disengage. They take more damage if they chase.', level: 3 },
  { tactic: 'Minor Illusion hide', detail: 'Create a barrel/crate illusion, hide behind it. Attack from "cover" for Sneak Attack.', level: 3 },
  { tactic: 'Magical Ambush + Hold Person', detail: 'Hide → cast Hold Person (disadvantage on save) → auto-crit Sneak Attack.', level: 9 },
  { tactic: 'Versatile Trickster', detail: 'Mage Hand near enemy → bonus action advantage → Sneak Attack without ally nearby.', level: 13 },
  { tactic: 'Shadow Blade + Sneak Attack', detail: 'Finesse weapon = Sneak Attack eligible. 2d8 + Sneak Attack dice.', level: 8 },
];

export const AT_MULTICLASS = [
  { combo: 'AT X / Wizard 2 (Divination)', benefit: 'Portent dice. Replace enemy saves with low rolls for Hold Person.', rating: 'S' },
  { combo: 'AT X / Wizard 2 (War Magic)', benefit: '+INT initiative. +2 AC/+4 saves reaction.', rating: 'A' },
  { combo: 'AT X / Fighter 2', benefit: 'Action Surge for double Sneak Attack (one per turn, but surge = new turn cycle).', rating: 'B' },
];

export function atSneakAttackWithBoomingBlade(rogueLevel, boomingBladeLevel) {
  const sa = Math.ceil(rogueLevel / 2);
  const bb = boomingBladeLevel >= 17 ? 3 : boomingBladeLevel >= 11 ? 2 : boomingBladeLevel >= 5 ? 1 : 0;
  return { sneakDice: sa, boomingDice: bb, totalExtraDice: sa + bb };
}

export function magicalAmbushDC(intMod, profBonus) {
  return 8 + intMod + profBonus;
}
