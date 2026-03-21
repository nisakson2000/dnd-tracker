/**
 * playerRulesQuickLookup.js
 * Player Mode: Commonly forgotten rules and quick-reference for mid-game lookups
 * Pure JS — no React dependencies.
 */

export const COMMONLY_FORGOTTEN_RULES = [
  { rule: 'Bonus action spell limits action to cantrip', detail: 'If you cast a spell as a bonus action, you can only cast a CANTRIP (not another leveled spell) with your action.', reference: 'PHB p.202' },
  { rule: 'Concentration is checked per instance of damage', detail: 'Each source of damage forces a separate CON save, even from one spell (e.g., Magic Missile = 3 saves).', reference: 'PHB p.203' },
  { rule: 'You can split movement around actions', detail: 'Move 10ft, attack, move 20ft. Movement is a pool, not a single phase.', reference: 'PHB p.190' },
  { rule: 'Dropping an item is free', detail: 'Dropping a weapon or item doesn\'t cost any action, bonus action, or free interaction. It\'s just free.', reference: 'PHB p.190' },
  { rule: 'Opportunity attacks use your reaction', detail: 'You only get ONE reaction per round. OA uses it. No Shield if you OA.', reference: 'PHB p.195' },
  { rule: 'Standing from prone costs half your speed', detail: 'Not half your movement remaining — half your SPEED. With 30ft speed, standing costs 15ft.', reference: 'PHB p.190-191' },
  { rule: 'Darkvision treats darkness as dim light', detail: 'Dim light = lightly obscured = disadvantage on Perception (sight). Darkvision doesn\'t give perfect sight in darkness.', reference: 'PHB p.183-185' },
  { rule: 'Ranged attacks in melee have disadvantage', detail: 'If a hostile creature is within 5ft and can see you, ranged attack rolls have disadvantage.', reference: 'PHB p.195' },
  { rule: 'Two-handed weapons only need two hands to attack', detail: 'You can hold a greatsword in one hand while casting with the other. Two hands required only for the attack.', reference: 'PHB p.147' },
  { rule: 'Unconscious creatures auto-fail STR/DEX saves', detail: 'And attacks within 5ft against unconscious creatures are auto-crits.', reference: 'PHB Appendix A' },
  { rule: 'Resistance doesn\'t stack', detail: 'Multiple sources of resistance to the same type = still half damage, not quarter.', reference: 'PHB p.197' },
  { rule: 'Counterspell only works on spells, not abilities', detail: 'Breath weapons, innate abilities, and magic items that don\'t "cast a spell" can\'t be Counterspelled.', reference: 'PHB p.228' },
  { rule: 'Cover applies to DEX saves too', detail: 'Half cover (+2) and three-quarters cover (+5) apply to AC AND DEX saving throws.', reference: 'PHB p.196' },
  { rule: 'You choose to use Shield AFTER learning you\'re hit', detail: 'DM says the attack hits, THEN you decide to Shield. You know if +5 AC would help.', reference: 'PHB p.275' },
  { rule: 'Healing a creature at 0 HP resets death saves', detail: 'Any amount of healing (even 1 HP) brings them back and resets their death save tally.', reference: 'PHB p.197' },
];

export const CONDITION_QUICK_REF = {
  Blinded: 'Auto-fail sight checks. Attacks against have advantage. Your attacks have disadvantage.',
  Charmed: 'Can\'t attack the charmer. Charmer has advantage on social checks.',
  Deafened: 'Auto-fail hearing checks. Can\'t hear.',
  Frightened: 'Disadvantage on checks/attacks while source is in sight. Can\'t willingly move closer.',
  Grappled: 'Speed is 0. Can escape with Athletics/Acrobatics vs Athletics.',
  Incapacitated: 'Can\'t take actions or reactions.',
  Invisible: 'Heavily obscured. Advantage on attacks. Attacks against have disadvantage.',
  Paralyzed: 'Incapacitated + auto-fail STR/DEX saves + attacks have advantage + auto-crit within 5ft.',
  Petrified: 'Turned to stone. Incapacitated. Resistance to all damage. Immune to poison/disease.',
  Poisoned: 'Disadvantage on attack rolls and ability checks.',
  Prone: 'Disadvantage on attacks. Melee attacks against have advantage. Ranged attacks have disadvantage.',
  Restrained: 'Speed 0. Attacks against have advantage. Your attacks and DEX saves have disadvantage.',
  Stunned: 'Incapacitated + auto-fail STR/DEX saves + attacks against have advantage.',
  Unconscious: 'Incapacitated + drop everything + fall prone + auto-fail STR/DEX saves + auto-crit within 5ft.',
};

export const MATH_QUICK_REF = {
  advantage: 'Roll 2d20, take higher. Roughly +5 to result on average.',
  disadvantage: 'Roll 2d20, take lower. Roughly -5 to result on average.',
  criticalHit: 'Natural 20. Double all damage dice. Always hits.',
  criticalFail: 'Natural 1. Always misses. No additional effects RAW.',
  proficiencyBonus: 'Level 1-4: +2 | 5-8: +3 | 9-12: +4 | 13-16: +5 | 17-20: +6',
  abilityModifier: '(Score - 10) / 2, round down. Score 10-11: +0 | 14-15: +2 | 18-19: +4 | 20: +5',
};

export function lookupRule(keyword) {
  return COMMONLY_FORGOTTEN_RULES.filter(r =>
    r.rule.toLowerCase().includes((keyword || '').toLowerCase()) ||
    r.detail.toLowerCase().includes((keyword || '').toLowerCase())
  );
}

export function lookupCondition(condition) {
  const key = Object.keys(CONDITION_QUICK_REF).find(k =>
    k.toLowerCase().includes((condition || '').toLowerCase())
  );
  return key ? { condition: key, effect: CONDITION_QUICK_REF[key] } : null;
}
