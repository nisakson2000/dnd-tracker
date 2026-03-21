/**
 * playerOrcRaceGuide.js
 * Player Mode: Orc — the aggressive warrior
 * Pure JS — no React dependencies.
 */

export const ORC_BASICS = {
  race: 'Orc',
  source: 'Volo\'s Guide to Monsters / Mordenkainen Presents: Monsters of the Multiverse',
  asis: '+2 STR, +1 CON (legacy) or +2/+1 any (MotM)',
  speed: '30ft',
  size: 'Medium',
  darkvision: '60ft',
  note: 'Aggressive: BA to move toward enemy. Powerful Build. Relentless Endurance (MotM adds this). Similar to Half-Orc but more offense-focused.',
};

export const ORC_TRAITS_LEGACY = [
  { trait: 'Aggressive', effect: 'BA: move up to your speed toward a hostile creature you can see.', note: 'THE feature. BA Dash toward enemies. Close distance fast. 60ft movement in a turn. Incredible for melee.' },
  { trait: 'Powerful Build', effect: 'Count as one size larger for carrying capacity.', note: 'Same as Goliath/Firbolg. Carry more, grapple better.' },
  { trait: 'Primal Intuition', effect: 'Two of: Animal Handling, Insight, Intimidation, Medicine, Nature, Perception, Survival.', note: 'Two free skills. Good variety.' },
  { trait: 'Menacing', effect: 'Proficiency in Intimidation.', note: 'STR-based Intimidation is thematic.' },
];

export const ORC_TRAITS_MOTM = [
  { trait: 'Adrenaline Rush', effect: 'BA: Dash + gain temp HP = PB. PB uses/LR.', note: 'Upgraded Aggressive. Now gives temp HP too. Dash + temp HP as BA. Excellent.' },
  { trait: 'Relentless Endurance', effect: 'Drop to 1 HP instead of 0. Once per LR.', note: 'Same as Half-Orc. Cheat death once per day.' },
  { trait: 'Powerful Build', effect: 'Count as Large for carrying.', note: 'Same as legacy.' },
];

export const ORC_CLASS_SYNERGY = [
  { class: 'Barbarian', priority: 'S', reason: 'STR+CON. Aggressive to close distance while raging. Reckless + charge. Relentless + Rage = survive.' },
  { class: 'Fighter', priority: 'A', reason: 'STR+CON. Aggressive when no BA. Close gaps fast. Powerful Build for grappling.' },
  { class: 'Paladin', priority: 'A', reason: 'STR. Aggressive to close distance for Smites. Relentless Endurance for survival.' },
  { class: 'Monk', priority: 'B', reason: 'Aggressive conflicts with Flurry of Blows BA. But 60ft closing speed is nice with Step of Wind alternative.' },
];

export const ORC_TACTICS = [
  { tactic: 'Adrenaline Rush charge', detail: 'MotM: BA Dash + temp HP. Move 60ft + gain PB temp HP. Close any distance and arrive with a buffer.', rating: 'S' },
  { tactic: 'Aggressive + attack', detail: 'BA: Aggressive (move toward enemy). Action: attack. Close 60ft gap and attack in one turn.', rating: 'S' },
  { tactic: 'Relentless + tank', detail: 'Drop to 1 HP instead of 0. Buys one more turn. Cast healing on yourself or use Second Wind.', rating: 'A' },
  { tactic: 'Grapple + Powerful Build', detail: 'Count as Large. Grapple Large creatures. Drag them where you want them.', rating: 'A' },
];

export function adrenalineRushTempHP(profBonus) {
  return { tempHP: profBonus, uses: profBonus, note: `${profBonus} temp HP + Dash as BA, ${profBonus} uses/LR` };
}
