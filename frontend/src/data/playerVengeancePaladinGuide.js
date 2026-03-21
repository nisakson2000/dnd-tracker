/**
 * playerVengeancePaladinGuide.js
 * Player Mode: Oath of Vengeance Paladin — the single-target destroyer
 * Pure JS — no React dependencies.
 */

export const VENGEANCE_BASICS = {
  class: 'Paladin (Oath of Vengeance)',
  source: 'Player\'s Handbook',
  theme: 'Hunt down a sworn enemy. Advantage on attacks. Best single-target Paladin.',
  note: 'Most aggressive Paladin oath. Vow of Enmity = advantage on all attacks vs one target. Hunter\'s Mark + Smite = devastating.',
};

export const VENGEANCE_FEATURES = [
  { feature: 'Vow of Enmity', level: 3, effect: 'Channel Divinity, bonus action: choose creature within 10ft. Advantage on attack rolls against it for 1 minute.', note: 'Advantage on ALL attacks vs one target for 1 minute. No concentration. THE boss-killing feature.' },
  { feature: 'Abjure Enemy', level: 3, effect: 'Channel Divinity: WIS save or frightened + speed 0 for 1 minute. Fiends/undead have disadvantage.', note: 'Lock down one enemy. Speed 0 is brutal. But Vow of Enmity is usually better.' },
  { feature: 'Relentless Avenger', level: 7, effect: 'When you hit with an OA, move up to half your speed toward the target (no OA provoked).', note: 'Chase down fleeing enemies. OA + free movement. Enemies can\'t escape.' },
  { feature: 'Soul of Vengeance', level: 15, effect: 'When your Vow of Enmity target attacks, use reaction to make a weapon attack against it.', note: 'Reaction attack every time your Vow target attacks anyone. Extra attack per round.' },
  { feature: 'Avenging Angel', level: 20, effect: 'Transform for 1 hour: wings (60ft fly), 30ft aura of fear (WIS save or frightened 1 min).', note: 'Flight + AoE fear. Capstone transformation.' },
];

export const VENGEANCE_SPELLS = {
  oathSpells: [
    { level: 1, spells: 'Bane, Hunter\'s Mark', note: 'Hunter\'s Mark + Smite on same attack. Massive single-target burst.' },
    { level: 2, spells: 'Hold Person, Misty Step', note: 'Hold Person = auto-crit melee = double Smite dice. Misty Step = mobility.' },
    { level: 3, spells: 'Haste, Protection from Energy', note: 'Self-Haste: +2 AC, double speed, extra attack. But risky (lethargy).' },
    { level: 4, spells: 'Banishment, Dimension Door', note: 'Banishment removes threats. Dimension Door for mobility.' },
    { level: 5, spells: 'Hold Monster, Scrying', note: 'Hold Monster = auto-crit on anything. The dream.' },
  ],
};

export const VENGEANCE_TACTICS = [
  { tactic: 'Vow + Smite nova', detail: 'Vow of Enmity (advantage). Attack twice. Smite on both hits. With advantage, you almost never miss.', rating: 'S', note: 'Advantage + GWM: cancel out the -5 penalty. Pure damage.' },
  { tactic: 'Vow + GWM', detail: 'Advantage from Vow negates GWM -5 penalty. +10 damage per hit. 2 attacks = +20 damage per turn.', rating: 'S' },
  { tactic: 'Hold Person + Smite', detail: 'Hold Person on humanoid → auto-crit → Smite dice doubled. 2d8 weapon + 4d8 Smite (L1 slot) = 6d8 per hit.', rating: 'S', note: 'Coordinate: ally Holds, you Smite.' },
  { tactic: 'Hunter\'s Mark + Extra Attack', detail: 'Hunter\'s Mark + 2 attacks: 2×(weapon + HM + Smite). Concentration but adds 1d6 per hit.', rating: 'A', note: 'Bonus action to cast. Then Vow uses bonus action too. Action economy tension.' },
  { tactic: 'Haste self-buff', detail: 'Haste: +2 AC, double speed, 3 attacks/turn. But lose a turn if concentration drops.', rating: 'A' },
  { tactic: 'Relentless Avenger chase', detail: 'Enemy runs past you → OA → hit → move half speed toward them. They can\'t escape.', rating: 'A' },
];

export const VENGEANCE_VS_CONQUEST = {
  vengeance: { pros: ['Advantage on attacks (Vow)', 'Best single-target DPS', 'Hunter\'s Mark + Haste', 'Hold Person/Monster oath spells', 'Chase mechanic'], cons: ['Less AoE control', 'No fear lockdown aura', 'Vow targets one enemy'] },
  conquest: { pros: ['Fear lockdown (speed 0 in aura)', 'Armor of Agathys synergy', 'AoE control', 'Better tank'], cons: ['Less single-target damage', 'Fear-dependent', 'No advantage feature'] },
  verdict: 'Vengeance for boss killing. Conquest for crowd control. Both S-tier.',
};

export function vowOfEnmityHitChance(attackBonus, targetAC) {
  const baseChance = Math.min(0.95, Math.max(0.05, (21 - (targetAC - attackBonus)) / 20));
  // Advantage: 1 - (1 - hit)^2
  return 1 - Math.pow(1 - baseChance, 2);
}

export function vowGWMDPR(paladinLevel, strMod, targetAC) {
  const profBonus = Math.min(6, 2 + Math.floor((paladinLevel + 3) / 4));
  const attackBonus = strMod + profBonus - 5; // GWM -5
  const hitChance = vowOfEnmityHitChance(attackBonus, targetAC);
  const damage = 6.5 + strMod + 10; // greatsword + STR + GWM
  const attacks = paladinLevel >= 5 ? 2 : 1;
  return attacks * hitChance * damage;
}
