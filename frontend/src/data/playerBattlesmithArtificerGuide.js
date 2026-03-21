/**
 * playerBattlesmithArtificerGuide.js
 * Player Mode: Battle Smith Artificer — the INT-based martial with a robot dog
 * Pure JS — no React dependencies.
 */

export const BATTLESMITH_BASICS = {
  class: 'Artificer (Battle Smith)',
  source: 'Tasha\'s Cauldron of Everything',
  theme: 'Combat engineer with a Steel Defender companion. Uses INT for weapon attacks.',
  note: 'Best melee Artificer. INT for weapon attacks. Steel Defender is a reliable tank companion. Extra Attack at L5.',
};

export const BATTLESMITH_FEATURES = [
  { feature: 'Battle Ready', level: 3, effect: 'Martial weapon proficiency. Use INT instead of STR/DEX for magic weapon attacks.', note: 'INT for weapon attacks. Your magic weapon (from infusions) uses INT. Single-stat build.' },
  { feature: 'Steel Defender', level: 3, effect: 'Construct companion. AC 15, HP = 2+INT+5×artificer level. Deflect Attack (reaction: impose disadvantage on attack vs creature within 5ft). Command as bonus action.', note: 'Tank buddy. Deflect Attack imposes disadvantage. Great for protecting allies.' },
  { feature: 'Extra Attack', level: 5, effect: 'Attack twice with the Attack action.', note: 'Two attacks per turn with INT-based magic weapon. Standard martial progression.' },
  { feature: 'Arcane Jolt', level: 9, effect: 'When you or Steel Defender hits: deal extra 2d6 force damage OR heal 2d6 HP to creature within 30ft. INT mod times/long rest.', note: 'Extra damage or healing on hit. 2d6 force or 2d6 heal. Very flexible.' },
  { feature: 'Improved Defender', level: 15, effect: 'Arcane Jolt increases to 4d6. Steel Defender +2 AC. Deflect Attack also deals 1d4+INT force damage.', note: '4d6 burst/heal. Defender gets tougher. Deflect Attack now deals damage.' },
];

export const STEEL_DEFENDER_STATS = {
  ac: '15 (natural armor, +2 at L15 = 17)',
  hp: '2 + INT mod + 5 × Artificer level',
  speed: '40ft',
  actions: {
    forceEmpoweredRend: '1d8+PB force damage',
    repair: '2d8+PB HP healed to construct (3/day)',
  },
  reaction: 'Deflect Attack: impose disadvantage on one attack against creature within 5ft of Defender.',
  note: 'Commands as your bonus action. Deflect Attack uses the Defender\'s reaction. Tanky and useful.',
};

export const BATTLESMITH_TACTICS = [
  { tactic: 'INT-only build', detail: 'Max INT. Infuse weapon (+1/+2). Attack with INT. Spells with INT. Steel Defender scales with INT. One stat does everything.', rating: 'S' },
  { tactic: 'Defender bodyguard', detail: 'Park Steel Defender next to squishy ally. Deflect Attack: disadvantage on attacks against them. Free tank.', rating: 'S' },
  { tactic: 'Arcane Jolt flexibility', detail: 'Hit enemy: deal 2d6 force. OR hit enemy and heal ally 2d6 within 30ft. Choose each time.', rating: 'A' },
  { tactic: 'Shield + Enhanced Defense', detail: 'Half-plate (15+2 DEX) + Shield (2) + Enhanced Defense (+1/+2) = 20-21 AC. Tank Artificer.', rating: 'A' },
  { tactic: 'Returning Weapon', detail: 'Infuse a weapon with Returning Weapon. Throw it (ranged), it returns. Switch between melee and ranged freely.', rating: 'A' },
];

export const BATTLESMITH_VS_ARMORER = {
  battlesmith: { pros: ['Steel Defender (tank pet)', 'INT for any magic weapon', 'Arcane Jolt (damage/heal)', 'More weapon flexibility'], cons: ['Pet can be killed', 'Bonus action competition (pet vs spells)', 'Less AC than Guardian Armorer'] },
  armorer: { pros: ['Built-in taunt (Thunder Gauntlets)', 'Higher AC potential', 'Two armor modes', 'Extra infusion slots'], cons: ['No pet companion', 'Less damage output', 'Thunder Gauntlets are limited'] },
  verdict: 'Battle Smith for pet + versatility. Armorer for solo tanking.',
};

export function steelDefenderHP(artificerLevel, intMod) {
  return 2 + intMod + (5 * artificerLevel);
}

export function arcaneJoltDamage(artificerLevel) {
  return artificerLevel >= 15 ? 14 : 7; // 4d6 or 2d6 avg
}

export function battlesmithDPR(artificerLevel, intMod, targetAC) {
  const profBonus = Math.min(6, 2 + Math.floor((artificerLevel + 3) / 4));
  const attackBonus = intMod + profBonus + 1; // +1 from Enhanced Weapon
  const hitChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  const attacks = artificerLevel >= 5 ? 2 : 1;
  const weaponDmg = 4.5 + intMod + 1; // longsword + INT + Enhanced
  const defenderDmg = hitChance * (4.5 + profBonus); // Steel Defender attack
  return attacks * hitChance * weaponDmg + defenderDmg;
}
