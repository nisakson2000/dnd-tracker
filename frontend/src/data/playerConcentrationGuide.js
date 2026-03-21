/**
 * playerConcentrationGuide.js
 * Player Mode: Concentration spell rules, protection strategies, and spell priority
 * Pure JS — no React dependencies.
 */

export const CONCENTRATION_RULES = {
  limit: 'You can concentrate on ONE spell at a time. Casting another concentration spell ends the first.',
  check: 'When you take damage while concentrating, make a CON save. DC = 10 or half the damage taken (whichever is higher).',
  otherEnders: [
    'Casting another concentration spell',
    'Being incapacitated or killed',
    'DM rules environmental interruption (earthquake, etc.)',
  ],
  note: 'You can voluntarily drop concentration at any time (no action required).',
  duration: 'Concentration spells last up to their listed duration, or until concentration is broken.',
};

export const CON_SAVE_MATH = [
  { damage: 10, dc: 10, note: 'Minimum DC. Even 10 damage only requires DC 10.' },
  { damage: 20, dc: 10, note: 'Still DC 10. Half of 20 = 10 = the minimum.' },
  { damage: 22, dc: 11, note: 'Half of 22 = 11. First time DC goes above 10.' },
  { damage: 30, dc: 15, note: 'Half of 30 = 15. Getting hard without proficiency.' },
  { damage: 40, dc: 20, note: 'Half of 40 = 20. Nearly impossible without save bonuses.' },
  { damage: 50, dc: 25, note: 'Half of 50 = 25. Only Resilient + high CON + magic can save this.' },
];

export const CONCENTRATION_PROTECTION = [
  { method: 'War Caster feat', bonus: 'Advantage on CON saves for concentration', effectiveBonus: '+5 avg', note: 'Advantage is roughly +5. Great early, slightly less impactful at high levels.' },
  { method: 'Resilient (CON)', bonus: 'Proficiency bonus to CON saves', effectiveBonus: '+2 to +6', note: 'Scales with level. Better than War Caster at level 9+. Get both if possible.' },
  { method: 'Both War Caster + Resilient', bonus: 'Advantage + proficiency', effectiveBonus: '+7 to +11', note: 'Nearly impossible to fail DC 10 checks. This is the gold standard.' },
  { method: 'Constitution score', bonus: '+1 per 2 CON above 10', effectiveBonus: 'Varies', note: 'Don\'t dump CON. 14 CON minimum for any concentration caster.' },
  { method: 'Aura of Protection (Paladin 6)', bonus: 'Add CHA mod to all saves', effectiveBonus: '+3 to +5', note: 'Stacks with everything. Paladins are the best concentration holders.' },
  { method: 'Shield spell', bonus: '+5 AC (fewer hits = fewer checks)', effectiveBonus: 'Prevention', note: 'Don\'t get hit in the first place. Shield is concentration protection.' },
  { method: 'Positioning', bonus: 'Stay behind tanks, use cover', effectiveBonus: 'Prevention', note: 'The best concentration save is one you never have to make.' },
  { method: 'Lucky feat', bonus: 'Reroll a failed save 3x/day', effectiveBonus: 'Emergency', note: 'Last resort. Works when everything else fails.' },
];

export const TOP_CONCENTRATION_SPELLS = [
  { spell: 'Spirit Guardians', level: 3, class: 'Cleric', reason: 'Massive damage aura. Losing this wastes your action AND slot.', protectPriority: 'S' },
  { spell: 'Haste', level: 3, class: 'Sorcerer/Wizard', reason: 'Losing Haste STUNS the target. Double punishment for dropping.', protectPriority: 'S' },
  { spell: 'Conjure Animals', level: 3, class: 'Druid', reason: 'Losing concentration = losing 8 wolves. Massive action economy swing.', protectPriority: 'S' },
  { spell: 'Hypnotic Pattern', level: 3, class: 'Multiple', reason: 'Multiple enemies are incapacitated. Dropping = they all wake up.', protectPriority: 'A' },
  { spell: 'Web', level: 2, class: 'Wizard/Sorcerer', reason: 'Battlefield control. Enemies escape when Web drops.', protectPriority: 'A' },
  { spell: 'Hex', level: 1, class: 'Warlock', reason: 'Ongoing damage. 8 hours at 3rd level slot. Worth protecting.', protectPriority: 'B' },
  { spell: 'Bless', level: 1, class: 'Cleric', reason: '+1d4 to attacks and saves for 3 allies. Consistently impactful.', protectPriority: 'A' },
  { spell: 'Wall of Force', level: 5, class: 'Wizard', reason: 'Indestructible wall. Dropping = enemies are free. Keep it up.', protectPriority: 'S' },
];

export const CONCENTRATION_PRIORITY = {
  question: 'Should I cast a new concentration spell if I\'m already concentrating?',
  answer: [
    'If current spell is doing more work than the new one would → keep current',
    'If current spell\'s job is done (enemies dead, effect applied) → switch',
    'If new spell would be game-changing → switch (some spells are worth losing another)',
    'If you\'re about to lose concentration anyway (low HP, surrounded) → switch to something quick-impact',
  ],
};

export function concentrationDC(damage) {
  return Math.max(10, Math.floor(damage / 2));
}

export function saveChance(conMod, proficient, profBonus, hasAdvantage, dc) {
  const bonus = conMod + (proficient ? profBonus : 0);
  const needed = dc - bonus;
  let chance = Math.min(100, Math.max(5, (21 - needed) * 5));
  if (hasAdvantage) chance = 100 - ((100 - chance) * (100 - chance) / 100);
  return Math.round(chance);
}

export function multiHitSurvivalChance(hits, avgDamagePerHit, conMod, proficient, profBonus, hasAdvantage) {
  let survival = 1;
  for (let i = 0; i < hits; i++) {
    const dc = concentrationDC(avgDamagePerHit);
    const chance = saveChance(conMod, proficient, profBonus, hasAdvantage, dc) / 100;
    survival *= chance;
  }
  return Math.round(survival * 100);
}
