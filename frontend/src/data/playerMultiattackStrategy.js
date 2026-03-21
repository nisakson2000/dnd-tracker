/**
 * playerMultiattackStrategy.js
 * Player Mode: Maximizing multiple attacks per turn — Extra Attack, bonus action attacks, and combos
 * Pure JS — no React dependencies.
 */

export const EXTRA_ATTACK_PROGRESSION = {
  twoAttacks: {
    level: 5,
    classes: ['Fighter', 'Paladin', 'Ranger', 'Barbarian', 'Monk'],
    note: 'Bladesinger Wizard also gets Extra Attack at 6 (with a cantrip replacing one attack).',
  },
  threeAttacks: {
    level: 11,
    classes: ['Fighter'],
    note: 'Only Fighters get a 3rd attack. This is a huge DPR boost.',
  },
  fourAttacks: {
    level: 20,
    classes: ['Fighter'],
    note: 'Only level 20 Fighters. Extremely rare but devastating.',
  },
  monk: {
    note: 'Monks get 2 attacks (Extra Attack) + 1-2 bonus action attacks (Martial Arts/Flurry of Blows).',
    flurry: '3-4 attacks at level 5 with Flurry of Blows.',
  },
};

export const BONUS_ACTION_ATTACKS = [
  { source: 'Two-Weapon Fighting', requirement: 'Light weapon in each hand', attacks: 1, damage: 'Weapon die only (no ability mod unless you have the fighting style)', note: 'Uses bonus action. Competes with other bonus actions.' },
  { source: 'Polearm Master', requirement: 'Glaive/Halberd/Quarterstaff/Spear', attacks: 1, damage: '1d4 + STR/DEX', note: 'Bonus action attack. Also OA when enemies enter reach.' },
  { source: 'Martial Arts (Monk)', requirement: 'Unarmed or monk weapon', attacks: 1, damage: 'Martial arts die + DEX', note: 'Free with any Attack action using monk weapon.' },
  { source: 'Flurry of Blows (Monk)', requirement: '1 ki point', attacks: 2, damage: 'Martial arts die + DEX each', note: 'Replaces Martial Arts bonus attack. 2 attacks instead of 1.' },
  { source: 'Crossbow Expert', requirement: 'Hand crossbow', attacks: 1, damage: '1d6 + DEX', note: 'Bonus action attack with hand crossbow after attacking with a one-handed weapon.' },
  { source: 'War Priest (War Cleric)', requirement: 'WIS mod/long rest', attacks: 1, damage: 'Weapon damage', note: 'Limited uses but doesn\'t require specific weapons.' },
  { source: 'Spiritual Weapon', requirement: '2nd level spell slot', attacks: 1, damage: '1d8 + spellcasting mod', note: 'No concentration! Bonus action each turn for up to 1 minute.' },
];

export const ATTACK_STACKING = [
  {
    build: 'Fighter 20',
    attacks: '4 (8 with Action Surge)',
    detail: 'Four attacks per turn. Action Surge doubles it to 8. Highest sustained attack count.',
    dpr: 'Very high sustained, explosive with Action Surge.',
  },
  {
    build: 'Monk 5 + Flurry',
    attacks: '4 (2 Extra + 2 Flurry)',
    detail: 'Four attacks at level 5. Ki-dependent. Stunning Strike on each.',
    dpr: 'High at level 5, ki limited.',
  },
  {
    build: 'Fighter 5 + PAM + GWM',
    attacks: '3 (2 Extra + 1 PAM)',
    detail: 'Three attacks with a glaive. GWM +10 damage each. Bonus action attack from PAM.',
    dpr: 'Excellent. GWM damage adds up fast with 3 attacks.',
  },
  {
    build: 'Ranger 5 + Crossbow Expert',
    attacks: '3 (2 Extra + 1 CBE)',
    detail: 'Three hand crossbow attacks. Sharpshooter +10 each. Archery fighting style.',
    dpr: 'Top-tier ranged DPR.',
  },
  {
    build: 'Warlock (Eldritch Blast)',
    attacks: '2-4 beams (level dependent)',
    detail: 'Not Extra Attack but similar. Each beam can have Agonizing Blast (+CHA) and Hex (+1d6).',
    dpr: 'Scales like a martial. Excellent sustained.',
  },
  {
    build: 'Paladin 5 + TWF',
    attacks: '3 (2 Extra + 1 TWF)',
    detail: 'Three attacks = three chances to crit and Smite. More swings = more crit fishing.',
    dpr: 'Good sustained, explosive on crits.',
  },
];

export const DAMAGE_RIDERS = {
  description: 'Extra damage added to EACH attack — multiplied by attack count.',
  riders: [
    { source: 'Hunter\'s Mark', bonus: '+1d6 per hit', duration: 'Concentration, up to 1 hour', note: '3 attacks × 1d6 = 3d6 (avg 10.5) per round.' },
    { source: 'Hex', bonus: '+1d6 per hit', duration: 'Concentration, up to 1 hour', note: 'Same as Hunter\'s Mark for Warlocks.' },
    { source: 'Great Weapon Master', bonus: '+10 per hit', duration: 'Always (if you choose -5 to hit)', note: '3 attacks × +10 = +30 damage per round if all hit.' },
    { source: 'Sharpshooter', bonus: '+10 per hit', duration: 'Always (if you choose -5 to hit)', note: 'Same as GWM for ranged. Archery style offsets the -5.' },
    { source: 'Rage damage', bonus: '+2 to +4 per hit', duration: 'While raging', note: 'Barbarian. Flat bonus on every STR attack.' },
    { source: 'Dueling style', bonus: '+2 per hit', duration: 'Always (one-handed weapon)', note: 'Reliable +2 per attack. 3 attacks = +6 total.' },
    { source: 'Hexblade\'s Curse', bonus: '+proficiency per hit', duration: '1 minute, 1/short rest', note: 'At level 9 that\'s +4 per hit. 3 attacks = +12.' },
  ],
};

export function calculateDPR(numAttacks, hitChance, avgDamagePerHit, critChance) {
  const normalDPR = numAttacks * hitChance * avgDamagePerHit;
  const critDPR = numAttacks * critChance * avgDamagePerHit; // Simplified — crits double dice only
  return Math.round((normalDPR + critDPR) * 10) / 10;
}

export function getAttacksPerTurn(className, level, hasBonus) {
  let attacks = 1;
  const extraAttackClasses = ['Fighter', 'Paladin', 'Ranger', 'Barbarian', 'Monk'];

  if (extraAttackClasses.includes(className) && level >= 5) attacks = 2;
  if (className === 'Fighter' && level >= 11) attacks = 3;
  if (className === 'Fighter' && level >= 20) attacks = 4;

  const bonusAttack = hasBonus ? 1 : 0;
  return { attacks, bonusAttack, total: attacks + bonusAttack };
}
