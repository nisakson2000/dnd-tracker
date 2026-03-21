/**
 * playerEvocationWizardGuide.js
 * Player Mode: School of Evocation Wizard — the blaster
 * Pure JS — no React dependencies.
 */

export const EVOCATION_BASICS = {
  class: 'Wizard (School of Evocation)',
  source: 'Player\'s Handbook',
  theme: 'Pure damage caster. Sculpt Spells to protect allies. Empowered evocations.',
  note: 'The classic blaster Wizard. Sculpt Spells solves the biggest AoE problem. Solid and reliable.',
};

export const EVOCATION_FEATURES = [
  { feature: 'Sculpt Spells', level: 2, effect: 'When you cast an evocation spell that affects other creatures, choose 1+spell level creatures. They auto-succeed on the save and take no damage (if half on save).', note: 'Drop Fireball on your melee allies. They take ZERO damage. This is the feature. Game-changing.' },
  { feature: 'Potent Cantrip', level: 6, effect: 'Cantrips that require a save still deal half damage on a successful save.', note: 'Fire Bolt doesn\'t benefit (attack roll). But Acid Splash, Frostbite, etc. always deal damage.' },
  { feature: 'Empowered Evocation', level: 10, effect: 'Add INT modifier to one damage roll of any Wizard evocation spell.', note: '+5 damage to Fireball, Magic Missile, etc. Magic Missile: each dart is 1d4+1+5. Three darts = 3×(1d4+6) = average 25.5.' },
  { feature: 'Overchannel', level: 14, effect: 'When you cast a Wizard spell of 1st-5th level that deals damage, deal maximum damage instead of rolling. First use free, subsequent uses deal 2d12 necrotic per slot level to yourself (can\'t be reduced).', note: 'Max damage Fireball: 48+5=53 damage. Once per long rest for free. Nuclear option.' },
];

export const SCULPT_SPELLS_GUIDE = {
  howItWorks: 'Choose 1+spell level creatures when casting. They auto-succeed AND take 0 damage (since evocation spells deal half on save, auto-succeed = half, but Sculpt says they take no damage if they would take half).',
  creaturesProtected: [
    { spellLevel: 1, protected: 2 },
    { spellLevel: 2, protected: 3 },
    { spellLevel: 3, protected: 4 },
    { spellLevel: 4, protected: 5 },
    { spellLevel: 5, protected: 6 },
  ],
  bestSpells: ['Fireball (3rd)', 'Ice Storm (4th)', 'Cone of Cold (5th)', 'Synaptic Static (5th)', 'Chain Lightning (6th)'],
  note: 'Center Fireball on your Fighter. Fighter takes 0. Enemies take 8d6. You are the best friend of every melee character.',
};

export const EVOCATION_TACTICS = [
  { tactic: 'Sculpted Fireball', detail: 'Fireball centered on melee allies. Protect 4 creatures. They take 0. Enemies take 8d6 (avg 28).', rating: 'S' },
  { tactic: 'Empowered Magic Missile', detail: 'L10: each missile = 1d4+1+INT. 3 missiles at L1 = 3×(3.5+5) = 25.5 avg. Auto-hit.', rating: 'A', note: 'Can\'t miss. Guaranteed damage. Scales with upcasting (1 missile per level).' },
  { tactic: 'Overchanneled Fireball', detail: 'L14: max damage Fireball = 48 + 5 (Empowered) = 53 fire damage. Sculpt allies. Once per LR free.', rating: 'S' },
  { tactic: 'Sculpted Wall of Fire', detail: 'Wall of Fire through allies. They take 0. Enemies take 5d8 per turn.', rating: 'A' },
  { tactic: 'Overchanneled Cone of Cold', detail: 'Max damage: 8×8 + 5 = 69 cold damage. 60ft cone. Sculpt 6 allies.', rating: 'S' },
];

export const EVOCATION_VS_OTHER_WIZARDS = {
  evocation: { pros: ['Sculpt Spells (protect allies)', '+INT to evocation damage', 'Max damage option', 'Simple and effective'], cons: ['Less versatile than other schools', 'Potent Cantrip is underwhelming', 'One-dimensional'] },
  warMagic: { pros: ['Power Surge (bonus damage)', 'Arcane Deflection (+2 AC/+4 saves reaction)', 'Better defense'], cons: ['No Sculpt Spells', 'Less AoE damage'] },
  bladesinging: { pros: ['Extra Attack + cantrip', 'Bladesong AC/CON', 'Most versatile'], cons: ['Melee-focused', 'No Sculpt', 'Fragile without Bladesong'] },
  verdict: 'Evocation for pure AoE blasting. Bladesinging for versatility. War Magic for defense.',
};

export function sculptSpellsProtected(spellLevel) {
  return 1 + spellLevel;
}

export function empoweredEvocationDamage(baseDamage, intMod) {
  return baseDamage + intMod;
}

export function overchannelDamage(spellLevel, diceCount, dieSize, intMod) {
  return diceCount * dieSize + intMod; // Max all dice + INT
}

export function overchannelSelfDamage(spellLevel, timesUsedToday) {
  if (timesUsedToday === 0) return 0; // First use free
  return timesUsedToday * spellLevel * 13; // 2d12 per spell level, avg 13 per 2d12... simplified
}
