/**
 * playerArmorOptimizer.js
 * Player Mode: Armor selection guide and AC optimization
 * Pure JS — no React dependencies.
 */

export const ARMOR_TABLE = [
  { name: 'Padded', type: 'Light', baseAC: 11, maxDex: null, stealthDis: true, strReq: null, cost: '5 gp', weight: 8 },
  { name: 'Leather', type: 'Light', baseAC: 11, maxDex: null, stealthDis: false, strReq: null, cost: '10 gp', weight: 10 },
  { name: 'Studded Leather', type: 'Light', baseAC: 12, maxDex: null, stealthDis: false, strReq: null, cost: '45 gp', weight: 13 },
  { name: 'Hide', type: 'Medium', baseAC: 12, maxDex: 2, stealthDis: false, strReq: null, cost: '10 gp', weight: 12 },
  { name: 'Chain Shirt', type: 'Medium', baseAC: 13, maxDex: 2, stealthDis: false, strReq: null, cost: '50 gp', weight: 20 },
  { name: 'Scale Mail', type: 'Medium', baseAC: 14, maxDex: 2, stealthDis: true, strReq: null, cost: '50 gp', weight: 45 },
  { name: 'Breastplate', type: 'Medium', baseAC: 14, maxDex: 2, stealthDis: false, strReq: null, cost: '400 gp', weight: 20 },
  { name: 'Half Plate', type: 'Medium', baseAC: 15, maxDex: 2, stealthDis: true, strReq: null, cost: '750 gp', weight: 40 },
  { name: 'Ring Mail', type: 'Heavy', baseAC: 14, maxDex: 0, stealthDis: true, strReq: null, cost: '30 gp', weight: 40 },
  { name: 'Chain Mail', type: 'Heavy', baseAC: 16, maxDex: 0, stealthDis: true, strReq: 13, cost: '75 gp', weight: 55 },
  { name: 'Splint', type: 'Heavy', baseAC: 17, maxDex: 0, stealthDis: true, strReq: 15, cost: '200 gp', weight: 60 },
  { name: 'Plate', type: 'Heavy', baseAC: 18, maxDex: 0, stealthDis: true, strReq: 15, cost: '1,500 gp', weight: 65 },
];

export const AC_BOOSTERS = [
  { source: 'Shield', bonus: '+2 AC', note: 'Requires proficiency. One hand occupied.' },
  { source: 'Shield of Faith (spell)', bonus: '+2 AC', note: 'Concentration. Bonus action. 10 minutes.' },
  { source: 'Shield (spell)', bonus: '+5 AC', note: 'Reaction. Until start of next turn. 1st-level slot.' },
  { source: 'Haste', bonus: '+2 AC', note: 'Concentration. Also doubles speed and gives extra action.' },
  { source: 'Cloak of Protection', bonus: '+1 AC + saves', note: 'Attunement. Uncommon.' },
  { source: 'Ring of Protection', bonus: '+1 AC + saves', note: 'Attunement. Rare. Stacks with Cloak.' },
  { source: '+1/+2/+3 Armor', bonus: '+1/+2/+3 AC', note: 'Magic armor. Stacks with everything.' },
  { source: 'Defense Fighting Style', bonus: '+1 AC', note: 'While wearing armor. Fighter/Paladin/Ranger.' },
  { source: 'Forge Domain (Cleric)', bonus: '+1 to armor or weapon', note: 'At level 1. Free +1 item daily.' },
  { source: 'Bladesong (Wizard)', bonus: '+INT AC', note: 'Light armor only. Bladesinger subclass.' },
];

export const UNARMORED_DEFENSES = [
  { class: 'Barbarian', formula: '10 + DEX mod + CON mod', note: 'No shield restriction. Shields add +2 on top.' },
  { class: 'Monk', formula: '10 + DEX mod + WIS mod', note: 'No shields. Usually lower AC early, catches up later.' },
  { class: 'Draconic Sorcerer', formula: '13 + DEX mod', note: 'Like permanent Mage Armor. Saves a spell known.' },
  { class: 'Mage Armor (spell)', formula: '13 + DEX mod', note: '8 hours, no concentration. Best for Wizards.' },
];

export function calculateAC(armorName, dexMod, hasShield, bonuses) {
  const armor = ARMOR_TABLE.find(a => a.name.toLowerCase() === (armorName || '').toLowerCase());
  if (!armor) return null;

  let dexBonus = dexMod;
  if (armor.maxDex !== null) dexBonus = Math.min(dexMod, armor.maxDex);

  let ac = armor.baseAC + dexBonus;
  if (hasShield) ac += 2;
  ac += (bonuses || 0);

  return { ac, armor: armor.name, type: armor.type, stealthDisadvantage: armor.stealthDis };
}

export function getBestArmor(dexMod, proficiencies, needsStealth) {
  return ARMOR_TABLE
    .filter(a => proficiencies.includes(a.type))
    .filter(a => !needsStealth || !a.stealthDis)
    .map(a => {
      const dexBonus = a.maxDex !== null ? Math.min(dexMod, a.maxDex) : dexMod;
      return { ...a, totalAC: a.baseAC + dexBonus };
    })
    .sort((a, b) => b.totalAC - a.totalAC);
}
