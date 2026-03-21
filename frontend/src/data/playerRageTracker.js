/**
 * playerRageTracker.js
 * Player Mode: Barbarian Rage tracking, damage bonuses, and subclass features
 * Pure JS — no React dependencies.
 */

export const RAGE_RULES = {
  action: 'Bonus Action to enter rage.',
  duration: '1 minute (10 rounds).',
  ending: [
    'Your turn ends and you haven\'t attacked or taken damage since your last turn.',
    'You are knocked unconscious.',
    'You choose to end it (no action required).',
  ],
  cannotDo: [
    'Cannot cast spells or concentrate on them.',
  ],
};

export const RAGE_USES = [
  { level: 1, uses: 2 },
  { level: 3, uses: 3 },
  { level: 6, uses: 4 },
  { level: 12, uses: 5 },
  { level: 17, uses: 6 },
  { level: 20, uses: Infinity },
];

export const RAGE_DAMAGE = [
  { level: 1, bonus: 2 },
  { level: 9, bonus: 3 },
  { level: 16, bonus: 4 },
];

export const RAGE_BENEFITS = [
  'Advantage on STR checks and STR saving throws.',
  'Bonus damage on STR-based melee weapon attacks.',
  'Resistance to bludgeoning, piercing, and slashing damage.',
];

export const SUBCLASS_RAGE_FEATURES = [
  { subclass: 'Berserker', feature: 'Frenzy', level: 3, description: 'Bonus action melee attack each turn while raging. 1 level exhaustion when rage ends.' },
  { subclass: 'Totem (Bear)', feature: 'Bear Totem', level: 3, description: 'Resistance to ALL damage except psychic while raging.' },
  { subclass: 'Totem (Wolf)', feature: 'Wolf Totem', level: 3, description: 'Allies have advantage on melee attacks against enemies within 5ft of you while raging.' },
  { subclass: 'Totem (Eagle)', feature: 'Eagle Totem', level: 3, description: 'Enemies have disadvantage on OA against you. Dash as bonus action while raging.' },
  { subclass: 'Zealot', feature: 'Divine Fury', level: 3, description: 'First hit each turn while raging: +1d6+half barb level necrotic or radiant damage.' },
  { subclass: 'Storm Herald', feature: 'Storm Aura', level: 3, description: 'Aura in 10ft radius while raging. Effect depends on environment chosen.' },
  { subclass: 'Ancestral Guardian', feature: 'Ancestral Protectors', level: 3, description: 'First creature you hit while raging: disadvantage on attacks against anyone but you, and allies have resistance to its attacks.' },
  { subclass: 'Wild Magic', feature: 'Wild Surge', level: 3, description: 'Roll d8 when entering rage for random magical effect.' },
];

export function getRageUses(barbarianLevel) {
  for (let i = RAGE_USES.length - 1; i >= 0; i--) {
    if (barbarianLevel >= RAGE_USES[i].level) return RAGE_USES[i].uses;
  }
  return 2;
}

export function getRageDamage(barbarianLevel) {
  for (let i = RAGE_DAMAGE.length - 1; i >= 0; i--) {
    if (barbarianLevel >= RAGE_DAMAGE[i].level) return RAGE_DAMAGE[i].bonus;
  }
  return 2;
}

export function isRageActive(startRound, currentRound) {
  return currentRound - startRound < 10;
}
