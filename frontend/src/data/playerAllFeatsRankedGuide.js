/**
 * playerAllFeatsRankedGuide.js
 * Player Mode: Comprehensive feat tier list for 5e — all feats ranked
 * Pure JS — no React dependencies.
 */

export const FEAT_TIER_S = [
  { feat: 'Sharpshooter', type: 'Combat', why: '-5/+10 ranged. Ignore cover. No disadvantage at long range.', bestFor: 'Any ranged attacker.' },
  { feat: 'Great Weapon Master', type: 'Combat', why: '-5/+10 melee heavy weapons. BA attack on crit/kill.', bestFor: 'Barbarian, Fighter, Paladin with greatsword/greataxe.' },
  { feat: 'Polearm Master', type: 'Combat', why: 'BA 1d4 attack. OA when enemies enter reach.', bestFor: 'Fighter, Paladin, Barbarian. Combo with Sentinel.' },
  { feat: 'Sentinel', type: 'Combat', why: 'OA stops movement. Attack when ally is targeted.', bestFor: 'Tanks. PAM + Sentinel = lock down enemies.' },
  { feat: 'Lucky', type: 'Utility', why: '3 luck points/day. Reroll any d20.', bestFor: 'Everyone. Best general-purpose feat.' },
  { feat: 'War Caster', type: 'Caster', why: 'Advantage on concentration. Somatic with hands full. Spell as OA.', bestFor: 'Any caster who concentrates in combat.' },
  { feat: 'Resilient (CON)', type: 'Half-feat', why: '+1 CON + CON save proficiency. Scales with proficiency.', bestFor: 'Casters maintaining concentration.' },
  { feat: 'Crossbow Expert', type: 'Combat', why: 'Ignore loading. No disadvantage in melee. BA hand crossbow attack.', bestFor: 'Hand crossbow builds. Combo with Sharpshooter.' },
];

export const FEAT_TIER_A = [
  { feat: 'Alert', type: 'Utility', why: '+5 initiative. Can\'t be surprised. Hidden don\'t get advantage.', bestFor: 'Assassin Rogue, anyone wanting to go first.' },
  { feat: 'Fey Touched', type: 'Half-feat', why: '+1 INT/WIS/CHA + free Misty Step + free L1 spell.', bestFor: 'Most casters. Best half-feat.' },
  { feat: 'Elven Accuracy', type: 'Half-feat', why: 'Triple advantage on DEX/INT/WIS/CHA attacks. 14.3% crit.', bestFor: 'Elf/Half-Elf with advantage sources.' },
  { feat: 'Inspiring Leader', type: 'Support', why: '10-min speech: 6 allies get level+CHA temp HP.', bestFor: 'Any CHA character. Free party temp HP.' },
  { feat: 'Ritual Caster', type: 'Utility', why: 'Ritual cast from chosen class list. No slots used.', bestFor: 'Non-casters wanting utility.' },
  { feat: 'Mobile', type: 'Combat', why: '+10ft speed. No OA from creatures you attack.', bestFor: 'Monks, melee rogues, hit-and-run.' },
  { feat: 'Skill Expert', type: 'Half-feat', why: '+1 any stat + 1 proficiency + 1 expertise.', bestFor: 'Grapplers (Athletics). Skill monkeys.' },
  { feat: 'Tough', type: 'Defensive', why: '+2 HP per level.', bestFor: 'Anyone needing HP. d6 hit die classes.' },
  { feat: 'Shadow Touched', type: 'Half-feat', why: '+1 INT/WIS/CHA + free Invisibility + free L1 spell.', bestFor: 'Stealth builds.' },
];

export const FEAT_TIER_B = [
  { feat: 'Crusher/Piercer/Slasher', type: 'Half-feat', why: '+1 STR/DEX + weapon bonuses + crit effects.', bestFor: 'Martial builds.' },
  { feat: 'Telekinetic', type: 'Half-feat', why: '+1 INT/WIS/CHA + BA shove 5ft.', bestFor: 'Positioning control.' },
  { feat: 'Chef', type: 'Half-feat', why: '+1 CON/WIS + party healing + temp HP treats.', bestFor: 'Support characters.' },
  { feat: 'Magic Initiate', type: 'Utility', why: '2 cantrips + 1 L1 spell from another class.', bestFor: 'Getting specific spells you lack.' },
  { feat: 'Observant', type: 'Half-feat', why: '+1 INT/WIS + +5 passive Perception/Investigation.', bestFor: 'Scouts.' },
  { feat: 'Moderately Armored', type: 'Utility', why: '+1 DEX + medium armor + shield prof.', bestFor: 'Wizard, Sorcerer.' },
  { feat: 'Metamagic Adept', type: 'Caster', why: '2 Metamagic options + 2 SP.', bestFor: 'Non-Sorcerer casters.' },
  { feat: 'Dual Wielder', type: 'Combat', why: '+1 AC dual wielding. Non-light weapons.', bestFor: 'TWF builds.' },
];

export const FEAT_TIER_C = [
  { feat: 'Tavern Brawler', type: 'Combat', why: '+1 STR + BA grapple after improvised/unarmed hit.', bestFor: 'Grapple builds.' },
  { feat: 'Mounted Combatant', type: 'Combat', why: 'Advantage vs smaller. Redirect attacks. Mount Evasion.', bestFor: 'Mounted builds only.' },
  { feat: 'Healer', type: 'Support', why: 'Heal 1d6+4+HD with healer\'s kit.', bestFor: 'Non-caster healers.' },
  { feat: 'Actor', type: 'Half-feat', why: '+1 CHA + impersonation advantage.', bestFor: 'Social infiltration.' },
  { feat: 'Savage Attacker', type: 'Combat', why: 'Reroll weapon damage 1/turn.', bestFor: 'Usually not worth feat slot.' },
  { feat: 'Athlete', type: 'Half-feat', why: '+1 STR/DEX + prone/jump improvements.', bestFor: 'Niche.' },
];

export const FEAT_TIPS = [
  'ASI vs Feat: if main stat < 18, usually take ASI first.',
  'PAM + Sentinel: best martial combo. Lock down enemies.',
  'Sharpshooter + CBE: best ranged damage combo.',
  'GWM + Reckless Attack: offset -5 with advantage.',
  'Lucky: works on anything. 3/day. Best general feat.',
  'War Caster vs Resilient CON: WC early, Resilient scales better.',
  'Half-feats: best when key stat is odd.',
  'Inspiring Leader: free temp HP every short rest.',
  'Mobile: hit and run. No OA from targets you attacked.',
  'Avoid trap feats: Savage Attacker, Keen Mind, Linguist.',
];
