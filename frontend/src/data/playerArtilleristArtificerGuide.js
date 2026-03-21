/**
 * playerArtilleristArtificerGuide.js
 * Player Mode: Artillerist Artificer — the turret builder
 * Pure JS — no React dependencies.
 */

export const ARTILLERIST_BASICS = {
  class: 'Artificer (Artillerist)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Explosive engineer. Summon Eldritch Cannons for damage, healing, or area denial.',
  note: 'Best damage Artificer. Eldritch Cannon gives consistent bonus action damage. Arcane Firearm adds d8 to spell damage.',
};

export const ARTILLERIST_FEATURES = [
  { feature: 'Eldritch Cannon', level: 3, effect: 'Action: create a Small or Tiny cannon. Choose type: Flamethrower (15ft cone, DEX save, 2d8 fire), Force Ballista (ranged 120ft, +spell attack, 2d8 force + push 5ft), Protector (1d8+INT temp HP to each creature in 10ft). Bonus action to fire. 1 hour duration.', note: 'Bonus action turret. Three modes. Can be Tiny (hold it, attach to shield). 1 hour or until destroyed.' },
  { feature: 'Arcane Firearm', level: 5, effect: 'Turn a wand, staff, or rod into an arcane firearm. +1d8 to one damage roll of Artificer spells cast through it.', note: '+1d8 to Fire Bolt, Scorching Ray, Shatter, etc. Significant damage boost.' },
  { feature: 'Explosive Cannon', level: 9, effect: 'Cannon damage increases by 1d8. Cannon can detonate as action (each creature within 20ft: DEX save or 3d8 force).', note: 'Cannon now deals 3d8 per shot. Self-destruct for AoE 3d8.' },
  { feature: 'Fortified Position', level: 15, effect: 'Create 2 cannons with one use. Allies within 10ft of cannon have half cover (+2 AC/DEX saves).', note: 'Two cannons at once + cover for allies. Double turret setup.' },
];

export const CANNON_TYPES = [
  { type: 'Flamethrower', damage: '2d8 fire (3d8 at L9)', area: '15ft cone', save: 'DEX', note: 'AoE damage. Best against groups. Can hit multiple enemies.', rating: 'A' },
  { type: 'Force Ballista', damage: '2d8 force (3d8 at L9)', range: '120ft', attack: 'Spell attack', note: 'Single target ranged. Force damage (rarely resisted). Pushes 5ft.', rating: 'S' },
  { type: 'Protector', healing: '1d8+INT temp HP', area: '10ft radius', note: 'Temp HP to all allies in range. Great for sustained combat.', rating: 'A' },
];

export const ARTILLERIST_TACTICS = [
  { tactic: 'Fire Bolt + Cannon', detail: 'Action: Fire Bolt (2d10+1d8 with Arcane Firearm). Bonus action: Force Ballista (2d8 force). Two attacks per turn.', rating: 'S', note: 'Consistent damage every turn. No spell slots needed.' },
  { tactic: 'Tiny cannon on shield', detail: 'Create Tiny cannon. Mount it on your shield. Hands free. Bonus action to fire. Walking turret.', rating: 'S' },
  { tactic: 'Protector in melee', detail: 'Tiny Protector cannon on your person. Each bonus action: 1d8+INT temp HP to everyone within 10ft.', rating: 'A', note: 'Party-wide temp HP every turn. Great in a melee group.' },
  { tactic: 'Dual cannons (L15)', detail: 'Two cannons at once. Force Ballista + Protector: damage AND temp HP every bonus action (alternate).', rating: 'S' },
  { tactic: 'Self-destruct bomb', detail: 'L9: detonate cannon for 3d8 force in 20ft radius. Set up a cannon, lure enemies near it, boom.', rating: 'B' },
];

export const ARTILLERIST_VS_BATTLESMITH = {
  artillerist: { pros: ['Best ranged damage', 'Arcane Firearm (+1d8)', 'AoE options (Flamethrower)', 'Two cannons at L15'], cons: ['No melee specialization', 'Cannon can be destroyed', 'No Steel Defender'] },
  battlesmith: { pros: ['INT for weapon attacks', 'Steel Defender (tank pet)', 'Extra Attack', 'Better melee'], cons: ['Less ranged damage', 'No Arcane Firearm', 'Steel Defender needs positioning'] },
  verdict: 'Artillerist for ranged blasting. Battlesmith for melee/pet builds.',
};

export function cannonDamage(artificerLevel) {
  return artificerLevel >= 9 ? 13.5 : 9; // 3d8 or 2d8 avg
}

export function arcaneFirearmDamage(spellDamage) {
  return spellDamage + 4.5; // +1d8 avg
}

export function artilleristTurnDPR(artificerLevel, intMod, targetAC) {
  const profBonus = Math.min(6, 2 + Math.floor((artificerLevel + 3) / 4));
  const attackBonus = intMod + profBonus;
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const fireboltDice = artificerLevel >= 17 ? 4 : artificerLevel >= 11 ? 3 : artificerLevel >= 5 ? 2 : 1;
  const firebolt = hitChance * (fireboltDice * 5.5 + 4.5); // Fire Bolt + Arcane Firearm
  const cannon = hitChance * (artificerLevel >= 9 ? 13.5 : 9); // Force Ballista
  return firebolt + cannon;
}
