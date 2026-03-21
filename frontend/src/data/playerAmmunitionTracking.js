/**
 * playerAmmunitionTracking.js
 * Player Mode: Tracking arrows, bolts, darts, sling bullets, and other consumables
 * Pure JS — no React dependencies.
 */

export const AMMUNITION_RULES = {
  recovery: 'After combat, spend 1 minute to recover HALF your expended ammunition (rounded down).',
  magic: 'Magic ammunition (+1 arrows, etc.) is consumed on use — you can\'t recover it.',
  cost: {
    arrows20: '1 gp',
    bolts20: '1 gp',
    slingBullets20: '4 cp',
    blowgunNeedles50: '1 gp',
    darts: '5 cp each (also a simple weapon)',
  },
  carrying: 'A quiver holds 20 arrows/bolts. Multiple quivers are reasonable.',
};

export const AMMUNITION_TYPES = [
  { type: 'Arrows', weapons: ['Shortbow', 'Longbow'], weight: '1 lb per 20', recovery: '50%' },
  { type: 'Crossbow Bolts', weapons: ['Light Crossbow', 'Heavy Crossbow', 'Hand Crossbow'], weight: '1.5 lb per 20', recovery: '50%' },
  { type: 'Sling Bullets', weapons: ['Sling'], weight: '1.5 lb per 20', recovery: '50%' },
  { type: 'Blowgun Needles', weapons: ['Blowgun'], weight: '1 lb per 50', recovery: '50%' },
  { type: 'Darts', weapons: ['Thrown'], weight: '0.25 lb each', recovery: '50% (thrown weapons use same rule)' },
  { type: 'Javelins', weapons: ['Thrown'], weight: '2 lb each', recovery: 'Retrievable if not broken/lost' },
  { type: 'Handaxes', weapons: ['Thrown'], weight: '2 lb each', recovery: 'Retrievable if not broken/lost' },
];

export const MAGIC_AMMUNITION = [
  { name: '+1 Ammunition', rarity: 'Uncommon', bonus: '+1 to hit and damage', note: 'Consumed on use. Stock up when you find them.' },
  { name: '+2 Ammunition', rarity: 'Rare', bonus: '+2 to hit and damage', note: 'Consumed. Save for tough fights.' },
  { name: '+3 Ammunition', rarity: 'Very Rare', bonus: '+3 to hit and damage', note: 'Consumed. Save for the final boss.' },
  { name: 'Arrows of Slaying', rarity: 'Very Rare', bonus: '+6d10 vs specific creature type', note: 'Save for the correct creature type. Ask the DM what type it targets.' },
  { name: 'Walloping Ammunition', rarity: 'Common', bonus: 'DC 10 STR save or knocked prone', note: 'Fun and useful. Not consumed? Check with DM.' },
  { name: 'Unbreakable Arrow', rarity: 'Common', bonus: 'Can\'t be broken', note: 'Always recoverable. Nice quality of life.' },
];

export const TRACKING_TIPS = [
  'Start each adventure day with a full quiver (20). Buy extras in town.',
  'Mark ammunition use on your character sheet with tick marks.',
  'After each combat, recover half (round down). 20 used → 10 recovered.',
  'Magic ammunition is GONE after use. Track it separately.',
  'If using a hand crossbow with Crossbow Expert, you go through bolts fast (3/round at level 5+).',
  'Rangers with Hunter\'s Mark don\'t use extra ammo — the spell adds damage to existing attacks.',
  'Arcane Archer arrows regain their magic after use — they\'re not consumed.',
  'Artificer\'s Repeating Shot infusion creates its own ammo. No tracking needed.',
];

export const CONSUMABLE_TRACKING = [
  { item: 'Potions of Healing', note: 'Track by type: Basic (2d4+2), Greater (4d4+4), Superior (8d4+8), Supreme (10d4+20).' },
  { item: 'Spell components (consumed)', note: 'Revivify (300gp diamond), Chromatic Orb (50gp diamond), Raise Dead (500gp diamond).' },
  { item: 'Holy Water', note: '2d6 radiant as ranged attack. 25gp per flask.' },
  { item: 'Alchemist\'s Fire', note: '1d4 fire per turn (DEX save to end). 50gp per flask.' },
  { item: 'Acid', note: '2d6 acid as ranged attack. 25gp per vial.' },
  { item: 'Oil', note: 'Splash on target, then light for 5 fire damage per round. 1 sp per flask.' },
  { item: 'Caltrops', note: '5ft area, DEX save or 1 piercing + speed 0. 1gp per bag.' },
  { item: 'Ball Bearings', note: '10ft area, DEX save or fall prone. 1gp per bag.' },
];

export function createAmmoTracker(startingAmmo) {
  return {
    current: startingAmmo,
    used: 0,
    recovered: 0,
    use(count) {
      const actual = Math.min(count, this.current);
      this.current -= actual;
      this.used += actual;
      return actual;
    },
    recover() {
      const recovered = Math.floor(this.used / 2);
      this.current += recovered;
      this.recovered += recovered;
      this.used = 0;
      return recovered;
    },
    resupply(count) {
      this.current += count;
    },
  };
}

export function ammoPerCombat(attacksPerRound, rounds, recoveryRate) {
  const used = attacksPerRound * rounds;
  const recovered = Math.floor(used * (recoveryRate || 0.5));
  return { used, recovered, net: used - recovered };
}

export function ammoNeededForDay(combatsExpected, attacksPerRound, avgRounds) {
  const perCombat = attacksPerRound * avgRounds;
  const recoveredPerCombat = Math.floor(perCombat / 2);
  const netPerCombat = perCombat - recoveredPerCombat;
  return { perCombat: netPerCombat, total: netPerCombat * combatsExpected, recommended: netPerCombat * combatsExpected + 20 };
}
