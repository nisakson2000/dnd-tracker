/**
 * playerDragonbornBreathGuide.js
 * Player Mode: Dragonborn breath weapon optimization and ancestry comparison
 * Pure JS — no React dependencies.
 */

export const BREATH_WEAPON_RULES = {
  action: 'Action (not Attack action). Cannot be used with Extra Attack.',
  save: 'DC = 8 + CON mod + proficiency bonus.',
  damage: '2d6 (L1), 3d6 (L6), 4d6 (L11), 5d6 (L16).',
  recharge: 'PHB: 1/short rest. Fizban\'s: proficiency bonus times per long rest.',
  area: 'Depends on ancestry: 15ft cone or 5x30ft line.',
  resistance: 'You also gain resistance to your ancestry\'s damage type.',
};

export const DRACONIC_ANCESTRIES = [
  { dragon: 'Black', type: 'Acid', shape: '5x30ft line', save: 'DEX', rating: 'A' },
  { dragon: 'Blue', type: 'Lightning', shape: '5x30ft line', save: 'DEX', rating: 'A' },
  { dragon: 'Brass', type: 'Fire', shape: '5x30ft line', save: 'DEX', rating: 'B+' },
  { dragon: 'Bronze', type: 'Lightning', shape: '5x30ft line', save: 'DEX', rating: 'A' },
  { dragon: 'Copper', type: 'Acid', shape: '5x30ft line', save: 'DEX', rating: 'A' },
  { dragon: 'Gold', type: 'Fire', shape: '15ft cone', save: 'DEX', rating: 'S' },
  { dragon: 'Green', type: 'Poison', shape: '15ft cone', save: 'CON', rating: 'B' },
  { dragon: 'Red', type: 'Fire', shape: '15ft cone', save: 'DEX', rating: 'S' },
  { dragon: 'Silver', type: 'Cold', shape: '15ft cone', save: 'CON', rating: 'A+' },
  { dragon: 'White', type: 'Cold', shape: '15ft cone', save: 'CON', rating: 'A+' },
];

export const FIZBANS_DRAGONBORN = [
  { type: 'Chromatic', feature: 'Chromatic Warding (L5): immunity to your damage type for 1 minute, 1/long rest.', rating: 'S' },
  { type: 'Metallic', feature: 'Metallic Breath (L5): 2nd breath option — 15ft cone, push 20ft OR incapacitate (CON save).', rating: 'S+' },
  { type: 'Gem', feature: 'Gem Flight (L5): fly speed = walking speed for 1 minute, 1/long rest. Spectral wings.', rating: 'S+' },
];

export const BEST_ANCESTRIES = {
  overall: 'Gold/Red (fire cone, most common resistance but highest baseline damage)',
  resistance: 'Fire (most common enemy damage type) or Poison (many monsters use it)',
  fizbans: 'Gem Dragonborn (free flight at L5) or Metallic (incapacitate breath)',
  minmax: 'Silver/White (CON save breath = harder to resist for most enemies)',
};

export const BREATH_OPTIMIZATION = [
  'Cone > Line in most situations. Hits more targets.',
  'CON save breaths (Silver, White, Green) are harder for enemies to pass.',
  'Maximize CON for higher save DC.',
  'Use breath weapon early when enemies are grouped.',
  'Fire resistance is most common on monsters — consider non-fire ancestry.',
  'PHB: 1/short rest. Take short rests to recharge.',
  'Fizban\'s: prof bonus uses/long rest. Much better scaling.',
  'Gem Dragonborn: free flight at L5. Best racial feature.',
  'Metallic: incapacitate breath is incredible crowd control.',
  'Breath weapon is an Action, not Attack. Can\'t combine with Extra Attack.',
];

export const BREATH_TIPS = [
  'Breath weapon uses Action. Not compatible with Extra Attack.',
  'DC = 8 + CON + prof. Max CON for better DC.',
  'Gold/Red: fire cone. Most damage potential.',
  'Silver/White: cold cone. CON save = harder to resist.',
  'Fizban\'s Gem: free flight at L5. Best Dragonborn option.',
  'Metallic breath: incapacitate enemies in 15ft cone.',
  'Chromatic Warding: full immunity to your type for 1 minute.',
  'Position for maximum targets before breathing.',
  'Short rest (PHB) recharges breath. Don\'t hoard it.',
  'Poison resistance (Green): many monsters deal poison.',
];
