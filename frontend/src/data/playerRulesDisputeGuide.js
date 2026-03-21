/**
 * playerRulesDisputeGuide.js
 * Player Mode: Common rules disputes and correct RAW rulings
 * Pure JS — no React dependencies.
 */

export const COMMONLY_MISPLAYED_RULES = [
  {
    rule: 'Sneak Attack: Once per TURN, not per ROUND',
    common_mistake: 'Only allowing Sneak Attack on the Rogue\'s turn.',
    correct: 'Sneak Attack triggers once per TURN. OA on enemy turn = second Sneak Attack that round.',
    source: 'PHB p.96: "Once per turn, you can deal extra damage..."',
  },
  {
    rule: 'Bonus Action spells restrict your Action spell',
    common_mistake: 'Thinking you can cast two leveled spells on the same turn.',
    correct: 'If you cast a BA spell, your Action spell must be a CANTRIP. Even if you Action Surge.',
    source: 'PHB p.202: Bonus Action casting rule.',
    exception: 'Two Action spells (via Action Surge) is fine IF no BA spell is cast.',
  },
  {
    rule: 'Opportunity Attacks use your REACTION',
    common_mistake: 'Making multiple opportunity attacks per round.',
    correct: 'You only get ONE reaction per round. One OA maximum unless you have special features.',
    source: 'PHB p.195',
  },
  {
    rule: 'Darkvision doesn\'t let you see perfectly in darkness',
    common_mistake: 'Treating Darkvision as normal sight in darkness.',
    correct: 'Darkness = dim light with Darkvision. Dim light = disadvantage on Perception. You still have -5 passive.',
    source: 'PHB p.183-185',
  },
  {
    rule: 'Nat 20/1 only applies to ATTACK rolls',
    common_mistake: 'Auto-success/failure on skill checks and saves.',
    correct: 'RAW: nat 20 and nat 1 are only automatic hit/miss on ATTACK rolls. Not skills or saves.',
    source: 'PHB p.194 (attacks only). Many tables house-rule otherwise.',
  },
  {
    rule: 'Counterspell requires you to SEE the caster',
    common_mistake: 'Counterspelling from behind a wall or while blind.',
    correct: 'You must be able to see the creature casting. No Counterspell if you can\'t see them.',
    source: 'PHB Counterspell: "which you can see"',
  },
  {
    rule: 'Twin Spell: only single-target spells',
    common_mistake: 'Twinning spells that can target multiple creatures.',
    correct: 'Spell must target only ONE creature and be incapable of targeting more. No Twinning Eldritch Blast at L5+.',
    source: 'PHB p.102 + Sage Advice on EB',
  },
  {
    rule: 'Flanking is an OPTIONAL rule',
    common_mistake: 'Assuming flanking = advantage is RAW.',
    correct: 'Flanking for advantage is a VARIANT rule in the DMG. Not RAW default.',
    source: 'DMG p.251 (variant rule)',
  },
  {
    rule: 'Invisible doesn\'t mean undetectable',
    common_mistake: 'Invisible creatures can\'t be targeted at all.',
    correct: 'Invisible = heavily obscured visually. Enemies can still hear you. Attack with disadvantage at your location.',
    source: 'PHB p.291: Invisible condition',
  },
  {
    rule: 'Cover: +2 (half) or +5 (three-quarters) to AC AND DEX saves',
    common_mistake: 'Only applying cover to AC, not DEX saves.',
    correct: 'Cover adds to BOTH AC and Dexterity saving throws.',
    source: 'PHB p.196',
  },
  {
    rule: 'Concentration: only ONE spell at a time',
    common_mistake: 'Maintaining two concentration spells simultaneously.',
    correct: 'If you cast a new concentration spell, the previous one ends immediately.',
    source: 'PHB p.203',
  },
  {
    rule: 'Healing Word requires the target to be within range',
    common_mistake: 'Using Healing Word on a target you can\'t see.',
    correct: 'You must be able to see the target within 60ft. Can\'t heal through walls.',
    source: 'PHB Healing Word: "A creature of your choice that you can see within range"',
  },
];

export const RULES_CLARIFICATIONS = [
  { topic: 'Can you move between Extra Attack hits?', answer: 'YES. You can move between attacks on the Attack action.', source: 'PHB p.190' },
  { topic: 'Does jumping cost movement?', answer: 'YES. Jump distance comes out of your movement speed.', source: 'PHB p.182' },
  { topic: 'Can you delay your turn?', answer: 'NO in 5e. You can Ready an action instead.', source: 'PHB p.193 (Ready action)' },
  { topic: 'Can Shield be used after seeing damage?', answer: 'NO. Shield is triggered "when you are hit" — before damage is rolled. You know you\'re hit but not the damage.', source: 'PHB Shield spell' },
  { topic: 'Do crits double Sneak Attack dice?', answer: 'YES. ALL damage dice on a crit are doubled, including Sneak Attack, Smite, etc.', source: 'PHB p.196' },
  { topic: 'Can you move through an ally\'s space?', answer: 'YES. Ally = non-hostile. You can move through but can\'t end your turn there.', source: 'PHB p.191' },
  { topic: 'Can Counterspell counter Counterspell?', answer: 'YES. If you have your reaction available and can see the caster.', source: 'Sage Advice Compendium' },
  { topic: 'Does Eldritch Blast count as one attack or multiple?', answer: 'MULTIPLE. Each beam is a separate attack roll. Can target different creatures.', source: 'PHB Eldritch Blast' },
];

export const RULES_DISPUTE_TIPS = [
  'DM has final say. Discuss after the session, not during.',
  'Cite the PHB page number if you disagree respectfully.',
  'Nat 20/1 on skills is NOT RAW. But many tables use it.',
  'Flanking is OPTIONAL. Ask at Session 0.',
  'Sneak Attack: once per TURN. OA = second Sneak Attack per round.',
  'BA spell + Action spell: action must be a cantrip.',
  'Darkvision: darkness becomes dim light. Still disadvantage on Perception.',
  'Cover applies to AC AND DEX saves. Position behind obstacles.',
  'Invisible: enemies can still hear you. Attack with disadvantage.',
  'When in doubt, check the Sage Advice Compendium (free PDF).',
];
