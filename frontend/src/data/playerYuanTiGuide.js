/**
 * playerYuanTiGuide.js
 * Player Mode: Yuan-Ti Pureblood race optimization (pre-MotM)
 * Pure JS — no React dependencies.
 */

export const YUAN_TI_TRAITS = {
  source: 'Volo\'s Guide to Monsters (pre-MotM)',
  asi: '+2 CHA, +1 INT',
  size: 'Medium',
  speed: '30ft',
  darkvision: '60ft',
  magicResistance: 'Advantage on saving throws against spells and other magical effects.',
  poisonImmunity: 'Immune to poison damage and the poisoned condition.',
  innateSpellcasting: 'Poison Spray cantrip. Animal Friendship (snakes only, at will). Suggestion 1/day (CHA).',
  note: 'Widely considered the most powerful race in 5e before MotM nerfs. Magic Resistance + Poison Immunity.',
};

export const YUAN_TI_POWER = {
  magicResistance: {
    value: 'Advantage on ALL saves vs magic. This is the same feature ancient dragons have.',
    math: 'Advantage ≈ +5 to saves. Against Fireball, Hold Person, Banishment, Counterspell — everything.',
    comparison: 'Gnome Cunning gives advantage on INT/WIS/CHA vs magic. Yuan-Ti gets ALL saves vs ALL magic.',
  },
  poisonImmunity: {
    value: 'Complete immunity, not resistance. Poison is the most common damage type among monsters.',
    coverage: 'Green dragon breath, Purple Worm poison, assassin poison, Cloudkill, Giant Spider — all nullified.',
  },
  suggestion: {
    value: 'Free Suggestion 1/day without a spell slot. 2nd level enchantment.',
    uses: 'Social encounters, combat control, interrogation. No material component needed.',
  },
};

export const YUAN_TI_BUILDS = [
  { build: 'Yuan-Ti Paladin', detail: '+2 CHA. Magic Resistance + Aura of Protection = near-immune to magic. Poison immunity for frontline.', rating: 'S+' },
  { build: 'Yuan-Ti Sorcerer', detail: '+2 CHA. Magic Resistance protects concentration. Free Suggestion. Best sorcerer race.', rating: 'S' },
  { build: 'Yuan-Ti Warlock', detail: '+2 CHA. Hexblade + Magic Resistance. Best defensive Warlock.', rating: 'S' },
  { build: 'Yuan-Ti Bard', detail: '+2 CHA. Magic Resistance + Bardic saves + Jack of All Trades = best saves in the game.', rating: 'S' },
  { build: 'Yuan-Ti Conquest Paladin', detail: 'Frightened aura + Magic Resistance + Poison Immunity. The ultimate dark paladin.', rating: 'S+' },
];

export const MOTM_CHANGES = {
  note: 'Monsters of the Multiverse nerfed Yuan-Ti significantly.',
  changes: [
    'Magic Resistance → Magic Resistance (spells only, not "magical effects").',
    'Poison Immunity → Poison Resistance + advantage on saves vs poison.',
    'ASIs became flexible (+2/+1 or +1/+1/+1).',
    'Innate spellcasting → PB times per long rest instead of 1/day.',
  ],
  verdict: 'Pre-MotM Yuan-Ti was broken. Post-MotM is merely strong.',
};

export function magicResistanceSaveBonus() {
  return 5; // Advantage ≈ +5
}

export function poisonDamageReduction(damage, isImmune) {
  return isImmune ? 0 : Math.floor(damage / 2);
}
