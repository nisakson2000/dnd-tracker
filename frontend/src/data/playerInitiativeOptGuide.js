/**
 * playerInitiativeOptGuide.js
 * Player Mode: Initiative optimization — going first wins fights
 * Pure JS — no React dependencies.
 */

export const INITIATIVE_BASICS = {
  formula: 'DEX modifier + bonuses',
  note: 'Going first = landing your spell/attack before enemies. At high levels, initiative determines who wins.',
};

export const INITIATIVE_BOOSTERS = [
  { source: 'Alert feat', bonus: '+5', note: 'Flat +5 to initiative. Can\'t be surprised. THE initiative feat.' },
  { source: 'DEX modifier', bonus: '+1 to +5', note: 'DEX 20 = +5.' },
  { source: 'Gift of Alacrity', bonus: '+1d8 (avg 4.5)', note: 'Wildemount spell. 8-hour duration.' },
  { source: 'War Wizard (L2)', bonus: '+INT mod', note: 'INT 20 = +5 on top of DEX.' },
  { source: 'Swashbuckler (L3)', bonus: '+CHA mod', note: 'CHA 20 = +5.' },
  { source: 'Gloom Stalker (L3)', bonus: '+WIS mod', note: 'WIS 20 = +5.' },
  { source: 'Barbarian Feral Instinct', bonus: 'Advantage', note: 'Effectively +3.3 average.' },
  { source: 'Jack of All Trades (Bard)', bonus: '+half PB', note: 'Initiative is a DEX check.' },
  { source: 'Harengon (race)', bonus: '+PB', note: 'Add full proficiency bonus.' },
  { source: 'Weapon of Warning', bonus: 'Advantage', note: 'Also: can\'t be surprised. Great uncommon item.' },
];

export const INITIATIVE_BUILDS = [
  { build: 'Alert Gloom Stalker', total: '+14', note: 'DEX 5 + WIS 4 + Alert 5. Dread Ambusher alpha strike.' },
  { build: 'Harengon Alert Gloom Stalker', total: '+18', note: 'DEX 5 + WIS 4 + Alert 5 + PB 4. Min roll 19.' },
  { build: 'Alert War Wizard', total: '+13', note: 'DEX 3 + INT 5 + Alert 5. First Fireball wins.' },
  { build: 'Alert Swashbuckler', total: '+14', note: 'DEX 5 + CHA 4 + Alert 5. First Sneak Attack.' },
];

export const INITIATIVE_TACTICS = [
  { tactic: 'Casters go first', detail: 'AoE before enemies spread. More targets = more value.', rating: 'S' },
  { tactic: 'Alert can\'t be surprised', detail: 'Even in ambush, you act normally. Combined with high init = always ready.', rating: 'S' },
  { tactic: 'Buff on turn 1', detail: 'Go first → cast Haste/Bless before enemies attack. Allies benefit immediately.', rating: 'A' },
];

export function initiativeBonus(dexMod, alertFeat = false, classBonusMod = 0) {
  let bonus = dexMod + classBonusMod;
  if (alertFeat) bonus += 5;
  return { bonus, expectedInitiative: Math.round(10.5 + bonus) };
}
