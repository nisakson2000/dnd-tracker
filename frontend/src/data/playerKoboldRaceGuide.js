/**
 * playerKoboldRaceGuide.js
 * Player Mode: Kobold — the pack tactics underdog
 * Pure JS — no React dependencies.
 */

export const KOBOLD_BASICS = {
  race: 'Kobold',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 DEX, -2 STR (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Small',
  darkvision: '60ft',
  note: 'Legacy: Pack Tactics (advantage when ally adjacent) with Sunlight Sensitivity drawback. MotM: Draconic Cry (BA: give advantage to allies within 10ft). Both versions are powerful.',
};

export const KOBOLD_TRAITS_LEGACY = [
  { trait: 'Pack Tactics', effect: 'Advantage on attack rolls vs creature if non-incapacitated ally is within 5ft of target.', note: 'Free advantage always. Incredible for GWM/SS builds. But Sunlight Sensitivity cancels in sunlight.' },
  { trait: 'Sunlight Sensitivity', effect: 'Disadvantage on attacks and Perception in direct sunlight.', note: 'Harsh penalty. Indoors/underground/night = fine. Outdoors in day = cancelled advantage.' },
  { trait: 'Grovel, Cower, and Beg', effect: 'Action: allies gain advantage on attacks vs enemies within 10ft until your next turn.', note: 'Party-wide advantage but costs your action. Niche. Mostly worse than just attacking.' },
];

export const KOBOLD_TRAITS_MOTM = [
  { trait: 'Draconic Cry', effect: 'BA: scream. Until start of your next turn, you and allies have advantage on attacks vs enemies within 10ft of you. PB uses/LR.', note: 'Free advantage for the party. BA cost. 10ft range = be in melee. PB uses = 2-6 per LR.' },
  { trait: 'Kobold Legacy (choose one)', effect: 'Choose: Defiance (advantage vs frightened), Draconic Sorcery (one Sorcerer cantrip), or Craftiness (one skill).', note: 'Draconic Sorcery for a free cantrip is usually best.' },
];

export const KOBOLD_CLASS_SYNERGY = [
  { class: 'Fighter (GWM)', priority: 'S', reason: 'Pack Tactics = free advantage. Offsets GWM -5 penalty. Consistent big damage.', version: 'Legacy' },
  { class: 'Rogue', priority: 'S', reason: 'Pack Tactics = guaranteed Sneak Attack. Never miss SA conditions.', version: 'Legacy' },
  { class: 'Paladin', priority: 'A', reason: 'Draconic Cry gives party advantage. Paladin auras + party advantage = devastating.', version: 'MotM' },
  { class: 'Barbarian', priority: 'A', reason: 'Reckless Attack already gives advantage. Pack Tactics is redundant. MotM version better (BA party buff).', version: 'Both' },
  { class: 'Any martial', priority: 'A', reason: 'Draconic Cry as BA = party-wide advantage. Best for parties with multiple attackers.', version: 'MotM' },
];

export const KOBOLD_TACTICS = [
  { tactic: 'Pack Tactics + GWM', detail: 'Free advantage offsets -5 penalty. 2d6+15 per hit at L5. Consistent DPR machine.', rating: 'S', version: 'Legacy' },
  { tactic: 'Draconic Cry opener', detail: 'Turn 1 BA: Draconic Cry. Entire party has advantage. Devastating alpha strike.', rating: 'S', version: 'MotM' },
  { tactic: 'Underground campaigns', detail: 'Legacy Kobold shines underground. No sunlight = Pack Tactics always active. Perfect for Underdark.', rating: 'S', version: 'Legacy' },
  { tactic: 'Rogue guaranteed SA', detail: 'Pack Tactics: always have advantage when ally nearby. Never fail Sneak Attack conditions.', rating: 'S', version: 'Legacy' },
];

export function packTacticsGWMDPR(strMod, attacks, hitBonus) {
  const normalHitChance = (21 - (15 - hitBonus + 5)) / 20;
  const advantageHitChance = 1 - Math.pow(1 - normalHitChance, 2);
  const damagePerHit = 7 + strMod + 10;
  return { withAdvantage: Math.round(advantageHitChance * damagePerHit * attacks * 10) / 10, note: 'GWM -5/+10 with Pack Tactics advantage' };
}
