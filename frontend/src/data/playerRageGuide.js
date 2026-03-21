/**
 * playerRageGuide.js
 * Player Mode: Barbarian Rage rules, optimization, and tactical usage
 * Pure JS — no React dependencies.
 */

export const RAGE_RULES = {
  activation: 'Bonus action on your turn',
  duration: '1 minute (10 rounds)',
  uses: 'Limited uses per long rest. Increases with level.',
  usesPerLevel: [
    { level: 1, rages: 2, damage: 2 },
    { level: 3, rages: 3, damage: 2 },
    { level: 6, rages: 4, damage: 2 },
    { level: 9, rages: 4, damage: 3 },
    { level: 12, rages: 5, damage: 3 },
    { level: 16, rages: 5, damage: 4 },
    { level: 17, rages: 6, damage: 4 },
    { level: 20, rages: 'Unlimited', damage: 4 },
  ],
  benefits: [
    'Advantage on STR checks and STR saves',
    'Bonus rage damage on melee attacks using STR',
    'Resistance to bludgeoning, piercing, and slashing damage',
  ],
  restrictions: [
    'Can\'t cast spells or concentrate on spells while raging',
    'Must attack or take damage each turn or rage ends',
    'Must use STR for melee attacks to get rage damage (not DEX)',
    'Can\'t wear heavy armor (lose rage benefits)',
  ],
  endConditions: ['You choose to end it (free action)', 'You\'re knocked unconscious', 'Your turn ends without attacking or taking damage', '1 minute passes'],
};

export const RAGE_OPTIMIZATION = [
  { tip: 'Rage on round 1', detail: 'Don\'t wait. The resistance to physical damage is worth the bonus action cost.' },
  { tip: 'Maintain rage actively', detail: 'Attack every turn. If no enemies in range, throw a javelin or dash + attack. Don\'t let rage drop.' },
  { tip: 'Reckless Attack + Rage', detail: 'Advantage on attacks (Reckless) + enemies have advantage (but Rage gives resistance). The math works in your favor.' },
  { tip: 'Grapple while raging', detail: 'Advantage on STR checks = advantage on grapple checks. Rage makes you the best grappler.' },
  { tip: 'Don\'t rage for easy fights', detail: 'Limited uses. If the fight is clearly easy, save rage for later. Rage is a resource.' },
  { tip: 'Pre-cast concentration spells', detail: 'Cast a spell BEFORE raging (Longstrider, etc.) — wait, Barbarians can\'t cast. But an ally\'s buff works fine.' },
  { tip: 'Totem Bear for resistance', detail: 'Bear Totem 3: Rage gives resistance to ALL damage except psychic. Best defensive feature in the game.' },
];

export const SUBCLASS_RAGE_FEATURES = [
  { subclass: 'Berserker', feature: 'Frenzy: Bonus action attack each turn', cost: '1 exhaustion when rage ends', rating: 'B', note: 'Great damage but exhaustion is crippling. Only frenzy once per day.' },
  { subclass: 'Totem: Bear', feature: 'Resistance to ALL damage (except psychic)', cost: 'None', rating: 'S', note: 'You take half damage from everything. The premier tank feature.' },
  { subclass: 'Totem: Wolf', feature: 'Allies have advantage on melee attacks vs enemies within 5ft of you', cost: 'None', rating: 'A', note: 'Free advantage for melee allies. Team-focused tank.' },
  { subclass: 'Totem: Elk', feature: 'Speed +15ft while raging', cost: 'None', rating: 'B', note: 'Mobility Barbarian. Good for chasing or hit-and-run.' },
  { subclass: 'Zealot', feature: 'Extra 1d6+half level radiant/necrotic on first attack each turn', cost: 'None', rating: 'S', note: 'Free damage. Plus free resurrections (no material cost). Best overall.' },
  { subclass: 'Ancestral Guardian', feature: 'Attacked enemy has disadvantage attacking anyone but you', cost: 'None', rating: 'S', note: 'True tank. Forces enemies to attack you. Protects the party.' },
  { subclass: 'Storm Herald', feature: 'Aura effect each turn (damage, temp HP, or damage resistance)', cost: 'None', rating: 'B', note: 'Flexible but underwhelming compared to other options.' },
  { subclass: 'Wild Magic', feature: 'Random magic effects on rage and attacks', cost: 'Randomness', rating: 'A', note: 'Fun and surprisingly effective. Good variety of effects.' },
];

export const RAGE_VS_NO_RAGE = {
  damage: {
    withRage: 'Greatsword: 2d6+STR+Rage = 2d6+7 avg = 14 per hit',
    withoutRage: 'Greatsword: 2d6+STR = 2d6+5 avg = 12 per hit',
    difference: '+2 to +4 damage per hit. With Extra Attack: +4 to +8 per turn.',
  },
  defense: {
    withRage: 'Resistance to B/P/S = effectively double HP against physical damage',
    withoutRage: 'Full damage taken. d12 hit die helps but not enough.',
    difference: 'A Barbarian with 80 HP and resistance has effective 160 HP vs physical damage.',
  },
  verdict: 'Rage is nearly always worth using in real combat. The resistance alone is transformative.',
};

export function getRageDamage(level) {
  const entry = [...RAGE_RULES.usesPerLevel].reverse().find(e => level >= e.level);
  return entry ? entry.damage : 2;
}

export function getRageUses(level) {
  const entry = [...RAGE_RULES.usesPerLevel].reverse().find(e => level >= e.level);
  return entry ? entry.rages : 2;
}

export function effectiveHP(currentHP, hasRage, isBearTotem) {
  if (!hasRage) return currentHP;
  // Resistance = effectively double HP against physical damage
  // Bear totem = nearly all damage
  const multiplier = isBearTotem ? 1.9 : 1.5; // Bear resists almost everything, normal resists ~75% of damage types
  return Math.round(currentHP * multiplier);
}
