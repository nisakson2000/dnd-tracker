/**
 * playerPolearmMasterGuide.js
 * Player Mode: Polearm Master feat — the melee king feat
 * Pure JS — no React dependencies.
 */

export const POLEARM_MASTER_BASICS = {
  feat: 'Polearm Master',
  source: 'Player\'s Handbook',
  weapons: ['Glaive', 'Halberd', 'Quarterstaff', 'Spear', 'Pike (Errata)'],
  benefit1: 'Bonus action: butt-end attack for 1d4 + STR bludgeoning damage.',
  benefit2: 'When creature enters YOUR reach, you can make an opportunity attack as a reaction.',
  note: 'One of the best melee feats. Extra attack per turn + reactive OA when enemies approach. Combines with Sentinel for lockdown.',
};

export const PAM_COMBOS = [
  { combo: 'PAM + Sentinel', detail: 'Enemy enters 10ft reach → PAM OA → Sentinel reduces speed to 0. Enemy can\'t reach you. They\'re stuck at 10ft.', rating: 'S', note: 'The most famous feat combo in 5e. Complete melee lockdown. Enemies can never close on you.' },
  { combo: 'PAM + Great Weapon Master', detail: 'PAM bonus action attack = extra chance for GWM -5/+10. Three GWM attacks per turn. Massive damage.', rating: 'S', note: 'At L5 with Extra Attack: 3 attacks × (+10 damage each). PAM adds the third attack.' },
  { combo: 'PAM + Dueling Fighting Style', detail: 'Spear + Shield + PAM + Dueling. 1d6+2+STR × 2 attacks + 1d4+2+STR bonus action. Defensive + good damage.', rating: 'A', note: 'Shield for AC. Dueling for +2 damage. Solid defensive build.' },
  { combo: 'PAM + Spirit Guardians (Cleric)', detail: 'Enemy enters 10ft PAM reach → OA. If they keep approaching → Spirit Guardians hits them. Double threat on approach.', rating: 'A', note: 'Cleric with quarterstaff + PAM. OA + Spirit Guardians. Excellent frontline Cleric.' },
  { combo: 'PAM + War Caster', detail: 'War Caster: cast spell as OA. PAM: OA when enemy enters reach. Cast Booming Blade/Hold Person as OA at 10ft.', rating: 'S', note: 'Hold Person as an OA when enemy approaches. If they fail, they\'re paralyzed before they even attack.' },
];

export const PAM_WEAPONS_COMPARED = [
  { weapon: 'Glaive/Halberd', damage: '1d10 (2H)', reach: '10ft', note: 'Best damage die. 10ft reach for PAM + Sentinel combo. Requires both hands.', rating: 'S' },
  { weapon: 'Quarterstaff', damage: '1d6 (versatile 1d8)', reach: '5ft', note: 'Can use with shield (1d6) or two-handed (1d8). Spellcasting focus for Druids/Monks.', rating: 'A' },
  { weapon: 'Spear', damage: '1d6 (versatile 1d8)', reach: '5ft', note: 'Same as quarterstaff. Can be thrown (20/60ft). Works with Dueling Fighting Style.', rating: 'A' },
  { weapon: 'Pike', damage: '1d10 (2H)', reach: '10ft', note: 'Same as glaive/halberd but heavy. No functional difference usually.', rating: 'A' },
];

export const PAM_CLASS_PRIORITY = [
  { class: 'Fighter', priority: 'S', reason: 'Multiple attacks + PAM bonus attack + GWM. More attacks = more value from PAM.' },
  { class: 'Paladin', priority: 'S', reason: 'More attacks = more smite opportunities. PAM bonus attack can trigger smite.' },
  { class: 'Barbarian', priority: 'A', reason: 'Rage damage on bonus action attack. GWM + PAM + Rage = massive damage.' },
  { class: 'Cleric', priority: 'A', reason: 'Quarterstaff PAM + Spirit Guardians. Excellent frontline Cleric build.' },
  { class: 'Ranger', priority: 'B', reason: 'Works but Rangers have better bonus action options (Hunter\'s Mark).' },
  { class: 'Monk', priority: 'C', reason: 'Monks already have bonus action attacks (Flurry of Blows). PAM competes for bonus action.' },
];

export function pamDPRBonus(strMod, hasGWM = false, hasDueling = false) {
  const baseBonusAttack = 2.5 + strMod; // 1d4 + STR
  const gwmBonus = hasGWM ? 10 : 0;
  const duelingBonus = hasDueling ? 2 : 0;
  return baseBonusAttack + gwmBonus + duelingBonus;
}
