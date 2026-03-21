/**
 * playerAsiVsFeatGuide.js
 * Player Mode: ASI vs Feat decision guide — when to boost stats vs take a feat
 * Pure JS — no React dependencies.
 */

export const ASI_VS_FEAT_RULES = {
  when: 'L4, 8, 12, 16, 19 for most classes. Fighter gets 7 ASIs. Rogue gets 6.',
  asi: '+2 to one ability score or +1 to two scores. Max 20.',
  feat: 'Replace ASI with a feat. Feats are optional (check with DM).',
  key: 'Max your primary stat first. Then consider feats.',
};

export const TAKE_ASI_WHEN = [
  { condition: 'Primary stat is below 18', why: '+1 to hit and +1 damage (or +1 spell DC) is always worth it.', priority: 'S+' },
  { condition: 'Primary stat is odd (15, 17, 19)', why: '+1 rounds up to next modifier. Most efficient use.', priority: 'S+' },
  { condition: 'CON is below 14', why: 'HP and concentration saves are too important to ignore.', priority: 'A+' },
  { condition: 'You need to meet a multiclass requirement', why: '13 in relevant stats. Plan for L5+ dips.', priority: 'A' },
  { condition: 'No feat significantly improves your build', why: 'Raw stats are never wrong. +2 STR is always good.', priority: 'A' },
];

export const TAKE_FEAT_WHEN = [
  { condition: 'Primary stat is already 20', why: 'Can\'t go higher. Feats are pure value now.', priority: 'S+' },
  { condition: 'A half-feat rounds up an odd stat', why: '+1 to odd stat + feat benefit = best of both worlds.', priority: 'S+' },
  { condition: 'A feat fundamentally changes your playstyle', why: 'GWM, Sharpshooter, PAM, Sentinel. Build-defining.', priority: 'S+' },
  { condition: 'V.Human/Custom Lineage L1 feat', why: 'Free feat at L1. Take a build-defining feat early.', priority: 'S+' },
  { condition: 'You need Resilient (CON/WIS) for saves', why: 'Save proficiency is worth more than +2 to a stat.', priority: 'A+' },
];

export const HALF_FEATS = [
  { feat: 'Fey Touched', stat: 'INT/WIS/CHA', bonus: 'Misty Step + L1 Divination/Enchantment spell. Free casts 1/LR.', rating: 'S', bestFor: 'Any caster with odd mental stat.' },
  { feat: 'Shadow Touched', stat: 'INT/WIS/CHA', bonus: 'Invisibility + L1 Illusion/Necromancy spell. Free casts 1/LR.', rating: 'A+', bestFor: 'Rogues, any caster.' },
  { feat: 'Elven Accuracy', stat: 'DEX/INT/WIS/CHA', bonus: 'Triple advantage. Reroll one die on advantage.', rating: 'S+ (elf/half-elf)', bestFor: 'Rogue, Ranger, any elf with advantage sources.' },
  { feat: 'Crusher', stat: 'STR/CON', bonus: 'Push 5ft on hit. Crit = advantage for all on target.', rating: 'A', bestFor: 'Bludgeoning weapon users.' },
  { feat: 'Slasher', stat: 'STR/DEX', bonus: 'Reduce speed by 10ft. Crit = disadvantage on attacks.', rating: 'A', bestFor: 'Slashing weapon users.' },
  { feat: 'Piercer', stat: 'STR/DEX', bonus: 'Reroll 1 damage die. Extra die on crit.', rating: 'A', bestFor: 'Ranged attackers, rapier users.' },
  { feat: 'Resilient', stat: 'Any', bonus: 'Proficiency in one saving throw.', rating: 'S (CON/WIS)', bestFor: 'Everyone. CON for casters, WIS for martials.' },
  { feat: 'Skill Expert', stat: 'Any', bonus: 'One skill proficiency + one Expertise.', rating: 'A', bestFor: 'Skill builds. Athletics Expertise for grapplers.' },
  { feat: 'Telekinetic', stat: 'INT/WIS/CHA', bonus: 'BA: shove 5ft (invisible force). Mage Hand (invisible).', rating: 'A', bestFor: 'Control builds. Push into Spirit Guardians.' },
  { feat: 'Chef', stat: 'CON/WIS', bonus: 'Short rest: +PB temp HP treats. Long rest: +1d8 HP snacks.', rating: 'B+', bestFor: 'Support builds. Temp HP for party.' },
];

export const ASI_FEAT_PLANNING = {
  level4: 'Boost primary stat to 18 (or take build-defining feat if V.Human).',
  level8: 'Max primary stat to 20 (or take key feat).',
  level12: 'Feat time. Resilient (CON/WIS), War Caster, or offensive feat.',
  level16: 'Second feat or boost secondary stat.',
  level19: 'Capstone feat. Lucky, Alert, or flavor pick.',
  fighter: 'L4: primary stat. L6: GWM/SS. L8: max primary. L12-19: stack feats.',
  note: 'Fighters get 7 ASIs. They can afford more feats than anyone.',
};

export const ASI_FEAT_TIPS = [
  'Max your primary stat first (20). Then feats.',
  'Odd stat? Half-feat rounds it up. Best value.',
  'V.Human: take build-defining feat at L1 (GWM, PAM, CBE).',
  'Resilient (CON): essential for concentration casters by L8-12.',
  'Resilient (WIS): essential for martials. WIS saves are devastating.',
  'Fey Touched: best half-feat. Misty Step + utility spell + stat.',
  'GWM/Sharpshooter: build-defining. Take when you can offset -5.',
  'Fighter gets 7 ASIs. Max stats then stack feats.',
  'Don\'t take a feat just because it sounds cool. Math matters.',
  'Plan your ASI/feat progression at character creation.',
];
