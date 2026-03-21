/**
 * playerMageArmorVsArmorGuide.js
 * Player Mode: Mage Armor vs actual armor — when to use which
 * Pure JS — no React dependencies.
 */

export const ARMOR_COMPARISON = [
  { armor: 'No armor', ac: '10 + DEX', note: 'Terrible. Only if you have nothing else.' },
  { armor: 'Mage Armor (L1)', ac: '13 + DEX (max +5)', note: 'Best for DEX 16+. AC 16 at DEX 16, AC 18 at DEX 20. No armor proficiency needed.', rating: 'A' },
  { armor: 'Light Armor (Studded Leather)', ac: '12 + DEX', note: 'Requires proficiency. AC 15 at DEX 16, AC 17 at DEX 20. Mage Armor is +1 better.', rating: 'B' },
  { armor: 'Medium Armor (Half Plate)', ac: '15 + DEX (max +2)', note: 'AC 17 max. Better than Mage Armor only if DEX ≤ 14. Disadvantage on Stealth.', rating: 'A' },
  { armor: 'Medium Armor (Half Plate + Medium Armor Master)', ac: '15 + DEX (max +3)', note: 'AC 18 with DEX 16. No Stealth disadvantage. Equals Mage Armor at DEX 20.', rating: 'A' },
  { armor: 'Heavy Armor (Plate)', ac: '18', note: 'AC 18 flat. No DEX needed. Requires proficiency + STR 15. Best raw AC.', rating: 'S' },
  { armor: 'Heavy Armor + Shield', ac: '20', note: 'AC 20. The standard tank setup. Requires Shield proficiency.', rating: 'S' },
];

export const WHEN_MAGE_ARMOR = [
  { scenario: 'Wizard with DEX 16+', recommendation: 'Use Mage Armor. AC 16 (13+3). Better than Studded Leather (12+3=15).', note: 'Mage Armor is always +1 better than the best light armor.' },
  { scenario: 'Sorcerer with DEX 14', recommendation: 'Mage Armor gives AC 15. Half Plate gives AC 17 but requires proficiency. If no armor prof, Mage Armor.', note: 'Draconic Sorcerer gets 13+DEX for free. Don\'t need Mage Armor.' },
  { scenario: 'Bladesinger Wizard', recommendation: 'Mage Armor (13+DEX+INT Bladesong). At DEX 16, INT 20: AC 22. Shield → AC 27.', note: 'Bladesong makes Mage Armor dramatically better.' },
  { scenario: 'Multiclass into heavy armor', recommendation: 'Skip Mage Armor. Plate AC 18 > Mage Armor AC 16 at DEX 16. Save the spell known/prepared slot.', note: 'If you have heavy armor proficiency, Mage Armor is wasted.' },
];

export const UNARMORED_DEFENSE_COMPARISON = [
  { class: 'Barbarian', formula: '10 + DEX + CON', maxAC: '22 (DEX 20 + CON 20)', note: 'Theoretically high but needs 2 stats at 20. In practice: AC 17-18. Can use shield for +2.' },
  { class: 'Monk', formula: '10 + DEX + WIS', maxAC: '20 (DEX 20 + WIS 20)', note: 'Similar to Barbarian but no shield. In practice: AC 16-18. Decent but not tanky.' },
  { class: 'Draconic Sorcerer', formula: '13 + DEX', maxAC: '18 (DEX 20)', note: 'Free Mage Armor equivalent. Saves a spell known. Very efficient.' },
];

export function calculateAC(armorType, dexMod, shieldBonus = 0, extras = 0) {
  const armorBase = {
    none: 10,
    mageArmor: 13,
    studdedLeather: 12,
    halfPlate: 15,
    plate: 18,
    barbarianUD: 10, // +CON handled separately
    monkUD: 10, // +WIS handled separately
    draconicResilience: 13,
  };
  const base = armorBase[armorType] || 10;
  const dexCap = ['halfPlate'].includes(armorType) ? 2 : ['plate'].includes(armorType) ? 0 : 99;
  return base + Math.min(dexMod, dexCap) + shieldBonus + extras;
}
