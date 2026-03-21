/**
 * playerSentinelPAMCombo.js
 * Player Mode: Sentinel + Polearm Master combo — the ultimate melee lockdown
 * Pure JS — no React dependencies.
 */

export const PAM_SENTINEL_BASICS = {
  polearmMaster: {
    weapons: 'Glaive, halberd, pike, quarterstaff, spear.',
    bonusAttack: 'Bonus action: 1d4 bludgeoning with opposite end of weapon.',
    oaTrigger: 'Opportunity attack when creature ENTERS your reach (normally only on leaving).',
  },
  sentinel: {
    stopMovement: 'When you hit with an opportunity attack, target\'s speed becomes 0 for the rest of the turn.',
    attackNearby: 'When a creature within 5ft attacks someone other than you, you can use reaction to attack it.',
    ignoreDisengage: 'Creatures provoke OA from you even if they take the Disengage action.',
  },
  combo: 'Enemy enters 10ft reach → PAM OA triggers → Sentinel stops movement at 10ft → enemy can\'t reach you.',
};

export const PAM_SENTINEL_TACTICS = [
  { tactic: 'Reach lockdown', detail: 'Stand with glaive/halberd (10ft reach). Enemy enters 10ft → OA → speed 0. They\'re stuck 10ft away. Can\'t hit you.', situation: 'Any melee enemy.' },
  { tactic: 'Bodyguard', detail: 'Stand next to squishy ally. Enemy attacks them? Sentinel: reaction attack. Hit? Speed 0, they\'re stuck by you.', situation: 'Protecting casters.' },
  { tactic: 'Chokepoint', detail: 'Block a doorway with 10ft reach. No enemy gets past without taking an OA and stopping.', situation: 'Dungeon corridors, doorways.' },
  { tactic: 'No escape', detail: 'Enemy tries to Disengage? Doesn\'t matter. Sentinel ignores Disengage. They still provoke.', situation: 'Enemies trying to flee.' },
  { tactic: '3 attacks/turn at L5', detail: 'Attack action: 2 attacks (Extra Attack) + PAM bonus action: 1 attack (d4). 3 total.', situation: 'Every turn.' },
  { tactic: 'Polearm reach + AoO zone', detail: 'You threaten a 10ft radius circle. 4 squares in each direction. Massive control zone.', situation: 'Open battlefield.' },
];

export const PAM_SENTINEL_BUILDS = [
  { build: 'V. Human Fighter (PAM L1, Sentinel L4)', class: 'Fighter', weapon: 'Glaive/Halberd', note: 'Online at level 4. Extra ASIs for GWM later.', rating: 'S' },
  { build: 'V. Human Paladin', class: 'Paladin', weapon: 'Glaive', note: 'Smite on OAs. PAM bonus attack = extra Smite chance. Aura covers 10ft.', rating: 'S' },
  { build: 'Echo Knight + PAM + Sentinel', class: 'Fighter (Echo Knight)', weapon: 'Glaive', note: 'OA from echo\'s position too. Two lockdown zones simultaneously.', rating: 'S' },
  { build: 'Barbarian + PAM + Sentinel', class: 'Barbarian', weapon: 'Glaive', note: 'Reckless Attack + Rage damage on OAs. PAM bonus action competes with nothing.', rating: 'A' },
  { build: 'Cavalier Fighter', class: 'Fighter (Cavalier)', weapon: 'Lance + shield (mounted)', note: 'Cavalier already has Sentinel-like features. PAM for bonus attack.', rating: 'A' },
];

export const ADDING_GWM = {
  combo: 'PAM + Sentinel + Great Weapon Master',
  effect: '-5/+10 on all attacks including PAM bonus action and OAs.',
  featsNeeded: 3,
  timeline: {
    vhuman: 'PAM L1 → Sentinel L4 → GWM L6 (Fighter only) or L8.',
    customLineage: 'Same but +2 to STR for higher accuracy.',
  },
  note: '3 attacks × (weapon + STR + 10) = absurd damage. OAs also get +10.',
};

export function pamDPR(mainWeaponAvg, strMod, hasGWM, attacks) {
  const gwmBonus = hasGWM ? 10 : 0;
  const mainDmg = (mainWeaponAvg + strMod + gwmBonus) * attacks;
  const bonusDmg = 2.5 + strMod + gwmBonus; // d4 PAM bonus
  return mainDmg + bonusDmg;
}

export function oaZone(weaponReach) {
  // Squares threatened: ring of squares at reach distance
  return weaponReach === 10 ? 'All squares from 5ft to 10ft' : 'Adjacent squares only';
}
