/**
 * playerNecromancerGuide.js
 * Player Mode: Necromancy Wizard and undead army management
 * Pure JS — no React dependencies.
 */

export const NECROMANCER_BASICS = {
  class: 'Wizard (School of Necromancy)',
  theme: 'Raise and command undead. Army of skeletons and zombies.',
  keyFeature: 'Undead Thralls: Animate Dead creates stronger undead. Extra HP and damage.',
};

export const NECROMANCER_FEATURES = [
  { feature: 'Necromancy Savant', level: 2, effect: 'Half time and gold to copy necromancy spells into spellbook.', note: 'Standard wizard savant feature.' },
  { feature: 'Grim Harvest', level: 2, effect: 'Kill a creature with a spell: regain HP = 2× spell level (3× for necromancy).', note: 'Free healing on kills. Works on any spell, not just necromancy.' },
  { feature: 'Undead Thralls', level: 6, effect: 'Animate Dead: undead get extra HP = Wizard level, add proficiency to damage.', note: 'Skeletons get +6 HP and +3 damage at L6. Much more threatening.' },
  { feature: 'Inured to Undeath', level: 10, effect: 'Resistance to necrotic damage. Max HP can\'t be reduced.', note: 'Protects against your own undead\'s flavor damage. And enemy undead.' },
  { feature: 'Command Undead', level: 14, effect: 'Control any undead (CHA save). INT 12+ = advantage on save. Unlimited duration.', note: 'Take over powerful undead. Even a Vampire (CHA save with advantage though).' },
];

export const ANIMATE_DEAD_MATH = {
  spell: 'Animate Dead (3rd)',
  baseCreatures: 1,
  upcast: '+2 creatures per slot level above 3rd',
  reassert: 'Must recast within 24 hours to maintain control. Each cast reasserts 4 creatures (3rd level).',
  armySize: [
    { slots: '1× 3rd', army: 1, reassert: '1× 3rd/day' },
    { slots: '1× 4th', army: 3, reassert: '1× 3rd/day' },
    { slots: '1× 5th', army: 5, reassert: '2× 3rd/day' },
    { slots: '2× 3rd + 1× 4th', army: 5, reassert: '2× 3rd/day' },
    { slots: 'All available', army: '10-20+', reassert: 'Multiple slots/day for maintenance' },
  ],
  note: 'Army maintenance eats spell slots. Balance army size vs combat spell flexibility.',
};

export const SKELETON_VS_ZOMBIE = {
  skeleton: { hp: 13, ac: 13, attack: '+4, 1d6+2', ranged: 'Shortbow +4, 1d6+2 (80/320)', note: 'Better damage, ranged option, higher AC. Usually better.' },
  zombie: { hp: 22, ac: 8, attack: '+3, 1d6+1', ranged: 'None', note: 'More HP. Undead Fortitude (CON save to stay at 1 HP). Tankier but slower.' },
  verdict: 'Skeletons for damage and versatility (ranged!). Zombies for meat shields and Undead Fortitude.',
};

export const NECROMANCER_TACTICS = [
  { tactic: 'Skeleton archers', detail: 'Give skeletons shortbows. Line them up. 8 skeletons = 8 attacks/round at +4 to hit.', note: '8 attacks × 5.5 avg = 44 DPR. From one spell slot.' },
  { tactic: 'Body blocking', detail: 'Send zombies in front. They absorb attacks and block movement. You cast safely behind.', note: 'Zombies with Undead Fortitude refuse to die (CON 16 + advantage with Necromancer bonus).' },
  { tactic: 'Equip your undead', detail: 'Give skeletons better weapons and armor. They can use equipment. Chain mail skeleton = AC 16.', note: 'RAW: skeletons are proficient in simple weapons, light armor, and shields.' },
  { tactic: 'Fireball + Grim Harvest', detail: 'Kill 3 enemies with Fireball: regain 2×3 = 6 HP (or 9 HP if the spell is necromancy).', note: 'Free self-healing on AoE kills.' },
  { tactic: 'Command Undead (L14)', detail: 'Take control of enemy undead. Mummy Lord, Death Knight, Vampire (with advantage).', note: 'No duration limit. Permanently yours unless they save.' },
];

export function animateDeadCount(spellLevel) {
  return 1 + Math.max(0, (spellLevel - 3)) * 2;
}

export function skeletonDPR(count, thrallDamageBonus) {
  return count * (5.5 + thrallDamageBonus) * 0.55; // assume 55% hit rate
}

export function reassertSlotsNeeded(armySize) {
  return Math.ceil(armySize / 4); // each 3rd level reasserts 4
}
