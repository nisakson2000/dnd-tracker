/**
 * playerGoldEconomyGuide.js
 * Player Mode: Gold management — spending priorities, income, and economy
 * Pure JS — no React dependencies.
 */

export const GOLD_BY_TIER = {
  note: 'Expected wealth varies by tier. These are rough guidelines.',
  tiers: [
    { tier: 'T1 (L1-4)', expectedGold: '50-500 gp', priorities: 'Basic equipment, healing potions, components.', note: 'Every gold piece matters.' },
    { tier: 'T2 (L5-10)', expectedGold: '500-5,000 gp', priorities: 'Magic items, Revivify diamonds, plate armor.', note: 'Start accumulating wealth.' },
    { tier: 'T3 (L11-16)', expectedGold: '5,000-50,000 gp', priorities: 'Rare+ magic items, scroll scribing, strongholds.', note: 'Major purchases possible.' },
    { tier: 'T4 (L17-20)', expectedGold: '50,000+ gp', priorities: 'Very Rare/Legendary items, Clone (1,000gp), Wish components.', note: 'Money becomes less important.' },
  ],
};

export const SPENDING_PRIORITIES = [
  { priority: 'Healing Potions', tier: 'T1+', cost: '50-1,350 gp', rating: 'S+', note: 'Always buy. Life insurance. Budget 2-3 per dungeon.' },
  { priority: 'Revivify Diamonds', tier: 'T1+', cost: '300 gp each', rating: 'S+', note: 'Stock 2-3 at minimum. Death happens. Be prepared.' },
  { priority: 'Plate Armor', tier: 'T2', cost: '1,500 gp', rating: 'S (heavy armor users)', note: 'AC 18. Biggest AC upgrade for STR builds.' },
  { priority: 'Spell Components', tier: 'T1+', cost: 'Varies', rating: 'S', note: 'Identify (100gp pearl), Chromatic Orb (50gp diamond), Greater Restoration (100gp diamond dust).' },
  { priority: 'Magic Items (shop)', tier: 'T2+', cost: 'Varies widely', rating: 'S', note: 'If available. +1 weapons/armor, Cloak of Protection, Bag of Holding.' },
  { priority: 'Scroll Scribing', tier: 'T2+', cost: '25-500 gp', rating: 'A+', note: 'Emergency scrolls: Shield, Revivify, Counterspell.' },
  { priority: 'Bag of Holding', tier: 'T1-T2', cost: '~500 gp', rating: 'A+', note: '500 lbs storage. Solves all carrying capacity issues.' },
  { priority: 'Mounts/Transport', tier: 'T1', cost: '25-400 gp', rating: 'A', note: 'Riding horse (75gp). Doubles travel speed. Paladin gets Find Steed free.' },
  { priority: 'Hiring', tier: 'T2+', cost: '2-10+ gp/day', rating: 'B+', note: 'Hirelings, guides, spellcasting services.' },
  { priority: 'Strongholds', tier: 'T3+', cost: '5,000-500,000 gp', rating: 'B', note: 'Base of operations. Primarily flavor/RP investment.' },
];

export const INCOME_SOURCES = [
  { source: 'Adventuring loot', amount: 'Varies', note: 'Primary income. Treasure hoards scale with CR.' },
  { source: 'Quest rewards', amount: '50-5,000+ gp', note: 'DM-dependent. Always negotiate.' },
  { source: 'Downtime work', amount: '1-50 gp/day', note: 'Performing, crafting, pit fighting (Xanathar\'s).' },
  { source: 'Selling magic items', amount: '50-50% market value', note: 'Buyers for magic items are rare. DM discretion.' },
  { source: 'Selling mundane items', amount: '50% market value', note: 'Half price for used goods. Standard PHB rule.' },
  { source: 'Create/Destroy Water + farms', amount: 'Variable', note: 'Creative players can establish businesses.' },
  { source: 'Fabricate spell', amount: 'Variable', note: 'Turn raw materials into finished goods. Instant profit margin.' },
];

export const GOLD_TIPS = [
  'Always carry 300gp worth of diamonds for Revivify. This is non-negotiable.',
  'Healing potions are the best gold-to-survival ratio purchase in the game.',
  'Plate armor at 1,500 gp is the single biggest AC upgrade. Save for it.',
  'Pool party gold for expensive purchases: magic items, resurrections, vehicles.',
  'Don\'t hoard gold. Unspent gold has zero value. Invest in consumables and equipment.',
  'Wizard spell copying: budget 50gp × spell level per spell. Copy every scroll you find.',
  'Goodberry + Life Cleric: 10 berries × 4 HP each = 40 HP for a L1 slot. Best gold-free healing.',
  'At high levels, gold becomes less important. Wish can create items worth 25,000 gp.',
];

export const EQUIPMENT_PRIORITIES_BY_CLASS = {
  martial: [
    '1. Best weapon you can afford (+X if available)',
    '2. Best armor you can afford (plate for heavy, half plate for medium)',
    '3. Shield (+2 AC if one-handed build)',
    '4. Healing potions (2-3 minimum)',
    '5. Mundane utility (rope, grappling hook, caltrops)',
  ],
  caster: [
    '1. Spell component pouch or arcane focus',
    '2. Expensive spell components (diamonds, gems)',
    '3. Spell scrolls to copy (Wizards)',
    '4. Healing potions',
    '5. Armor if proficient (shield if possible)',
  ],
};
