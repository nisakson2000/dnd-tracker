/**
 * playerAbilityScoreImprovementGuide.js
 * Player Mode: ASI vs feat decision framework
 * Pure JS — no React dependencies.
 */

export const ASI_BASICS = {
  when: 'Class levels 4, 8, 12, 16, 19 (Fighter: also 6, 14).',
  choice: '+2 to one ability score OR +1 to two ability scores OR one feat (if using feats).',
  cap: 'Ability scores cap at 20 (without magic items/features).',
  note: 'ASIs are your most impactful character decisions after class/subclass. Choose carefully.',
};

export const ASI_VS_FEAT_FRAMEWORK = {
  takeASI: [
    'Your primary stat is below 20.',
    'You have an odd primary stat (15, 17, 19) — +1 gives a modifier increase.',
    'You need CON for concentration saves.',
    'No feat dramatically changes your playstyle.',
  ],
  takeFeat: [
    'Your primary stat is already 20.',
    'A feat fundamentally changes your combat strategy (GWM, PAM, SS).',
    'A half-feat rounds out an odd stat (+1 stat + feat benefit).',
    'You\'re a Fighter (more ASIs = more room for feats).',
  ],
  note: 'Primary stat to 20 first (almost always). Then feats. Half-feats are efficient at odd scores.',
};

export const ASI_PRIORITY_BY_CLASS = [
  { class: 'Fighter (melee)', l4: 'STR/DEX to 20 OR PAM/GWM', l6: 'Remaining stat boost or second feat', l8: 'Third feat or CON', note: 'Fighters get 7 ASIs. Most feat-heavy class.' },
  { class: 'Wizard', l4: 'INT to 18-20', l8: 'War Caster or Resilient (CON)', l12: 'INT to 20 or Alert', note: 'INT first. Then concentration protection.' },
  { class: 'Rogue', l4: 'DEX to 20', l8: 'Alert or Lucky', l10: 'Sentinel or Skulker', note: 'DEX to 20 ASAP. Then utility feats.' },
  { class: 'Cleric', l4: 'WIS to 18-20', l8: 'War Caster or Resilient (CON)', l12: 'WIS to 20 or Alert', note: 'WIS for save DC + healing. Then concentration.' },
  { class: 'Paladin', l4: 'CHA or STR to 18', l8: 'Other primary to 18', l12: 'PAM or Sentinel', note: 'MAD class. Needs both STR and CHA high.' },
  { class: 'Barbarian', l4: 'STR to 20 or GWM', l8: 'CON or PAM', l12: 'Sentinel or Tough', note: 'STR for damage. CON for AC (Unarmored Defense) and HP.' },
  { class: 'Monk', l4: 'DEX to 18-20', l8: 'WIS to 16+', l12: 'Mobile or Alert', note: 'Very MAD. DEX first, then WIS.' },
  { class: 'Sorcerer', l4: 'CHA to 20', l8: 'War Caster or Resilient (CON)', l12: 'Alert or Fey Touched', note: 'CHA is everything. Then concentration.' },
];

export const HALF_FEAT_RANKING = [
  { feat: 'Fey Touched', stat: '+1 CHA/WIS/INT', benefit: 'Misty Step + L1 spell (Bless, Gift of Alacrity)', rating: 'S' },
  { feat: 'Shadow Touched', stat: '+1 CHA/WIS/INT', benefit: 'Invisibility + L1 spell', rating: 'A' },
  { feat: 'Skill Expert', stat: '+1 any', benefit: 'One skill + one Expertise', rating: 'A' },
  { feat: 'Telekinetic', stat: '+1 CHA/WIS/INT', benefit: 'BA shove 5ft (no save) + Mage Hand', rating: 'A' },
  { feat: 'Crusher/Slasher/Piercer', stat: '+1 STR/DEX/CON', benefit: 'Weapon-type bonuses on hit/crit', rating: 'B+' },
  { feat: 'Elven Accuracy', stat: '+1 DEX/INT/WIS/CHA', benefit: 'Super-advantage (3d20) on DEX/INT/WIS/CHA attacks', rating: 'S (elf only)' },
  { feat: 'Actor', stat: '+1 CHA', benefit: 'Advantage on Deception to impersonate. Mimic speech.', rating: 'B' },
];

export function asiOrFeat(primaryStat, targetStat = 20) {
  const gap = targetStat - primaryStat;
  if (gap >= 2) return { recommendation: 'ASI', reason: `Primary stat ${primaryStat} is ${gap} below cap. Boost it.` };
  if (gap === 1) return { recommendation: 'Half-feat', reason: `Odd stat ${primaryStat}. Half-feat gives +1 + feat benefit.` };
  return { recommendation: 'Feat', reason: `Primary stat at ${primaryStat} (capped). Take a feat.` };
}
