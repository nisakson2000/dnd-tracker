/**
 * playerCommonHouseRulesGuide.js
 * Player Mode: Common house rules — what to expect and ask about at Session 0
 * Pure JS — no React dependencies.
 */

export const COMMON_HOUSE_RULES = [
  { rule: 'Potions as Bonus Action', frequency: 'Very Common', effect: 'Drink a potion as BA instead of action. Makes potions actually useful.', note: 'Some DMs: BA = roll, Action = max. Ask.' },
  { rule: 'Critical Hit Max + Roll', frequency: 'Very Common', effect: 'On crit: max one set of dice + roll the other. More consistent crits.', note: 'RAW: roll all dice. House rule prevents 2 on a crit.' },
  { rule: 'Flanking = Advantage', frequency: 'Common', effect: 'Two allies on opposite sides of enemy = advantage.', note: 'Can make advantage too easy. Some DMs give +2 instead.' },
  { rule: 'Free Feat at Level 1', frequency: 'Common', effect: 'Everyone gets a free feat at character creation.', note: 'Human gets 2 feats. Variant Human or Custom Lineage.' },
  { rule: 'Milestone Leveling', frequency: 'Very Common', effect: 'Level up at story milestones, not XP.', note: 'DM controls pacing. No XP tracking needed.' },
  { rule: 'Revised Ranger', frequency: 'Common', effect: 'Tasha\'s optional features replace PHB Ranger.', note: 'Basically mandatory. PHB Ranger is weak.' },
  { rule: 'Inspiration as Reroll', frequency: 'Common', effect: 'Inspiration lets you reroll (not just advantage).', note: 'Stronger than RAW inspiration. More impactful.' },
  { rule: 'Death Save Privacy', frequency: 'Common', effect: 'Death saves are rolled privately (only DM and player see).', note: 'Adds tension. Party doesn\'t know how close you are to dying.' },
  { rule: 'Spell Points', frequency: 'Uncommon', effect: 'Replace spell slots with a point pool. More flexible casting.', note: 'DMG variant rule. More bookkeeping but more flexibility.' },
  { rule: 'Exhaustion on 0 HP', frequency: 'Uncommon', effect: 'Gain 1 exhaustion when dropped to 0 HP. Prevents yo-yo healing.', note: 'Makes combat deadlier. Healing Word spam has consequences.' },
  { rule: 'Nat 1 / Nat 20 on Skills', frequency: 'Common', effect: 'Nat 20 auto-succeeds, Nat 1 auto-fails on skill checks.', note: 'NOT RAW. RAW only applies to attacks. But many tables use it.' },
  { rule: 'Bonus Action Potions + Other BA', frequency: 'Uncommon', effect: 'Can\'t use BA potion AND BA spell on same turn.', note: 'Balance for the BA potion house rule.' },
];

export const SESSION_ZERO_QUESTIONS = [
  { topic: 'Ability Scores', ask: 'Rolling, point buy, or standard array?', why: 'Determines character power level.' },
  { topic: 'Starting Level', ask: 'What level do we start at?', why: 'Affects class/subclass availability.' },
  { topic: 'Allowed Sources', ask: 'PHB only? All official? UA allowed?', why: 'Determines what you can build.' },
  { topic: 'Feats', ask: 'Are feats allowed? Free feat at L1?', why: 'Feats are optional RAW. Most tables allow them.' },
  { topic: 'Multiclassing', ask: 'Is multiclassing allowed?', why: 'Optional RAW. Some DMs restrict it.' },
  { topic: 'Flanking', ask: 'Does flanking give advantage?', why: 'Huge tactical difference if yes.' },
  { topic: 'Critical Hits', ask: 'How do crits work? Roll or max+roll?', why: 'Affects damage expectations.' },
  { topic: 'Potions', ask: 'Action or bonus action to drink?', why: 'Makes potions much better as BA.' },
  { topic: 'Death & Dying', ask: 'Standard death saves? Exhaustion on 0 HP?', why: 'Affects combat risk and healing strategy.' },
  { topic: 'PvP', ask: 'Is PvP allowed?', why: 'Most tables ban PvP. Clarify early.' },
  { topic: 'Tone', ask: 'Serious, comedic, or mixed?', why: 'Align roleplay expectations.' },
  { topic: 'Homebrew', ask: 'Any homebrew rules or content?', why: 'Know what\'s different from standard 5e.' },
];

export const VARIANT_RULES_WORTH_ASKING = [
  { rule: 'Encumbrance', standard: 'STR × 15 = max carry', variant: 'Tiered penalties at STR×5 and STR×10', ask: 'Does the DM track encumbrance?' },
  { rule: 'Diagonals', standard: '5ft per diagonal', variant: 'Alternating 5ft/10ft per diagonal', ask: 'How are diagonals measured on the grid?' },
  { rule: 'Cleave', standard: 'No cleave', variant: 'Excess damage carries to adjacent targets', ask: 'Is the cleave variant in use?' },
  { rule: 'Healing Potions', standard: 'Roll 2d4+2', variant: 'Max heal (10 HP) as action, roll as BA', ask: 'How do healing potions work?' },
  { rule: 'Long Rest Healing', standard: 'Full HP on long rest', variant: 'Spend HD to heal, limited recovery', ask: 'Gritty realism or standard resting?' },
];

export const HOUSE_RULE_TIPS = [
  'Ask about house rules at Session 0. Don\'t assume RAW.',
  'Potions as BA: very common. Ask your DM.',
  'Flanking advantage: know if it\'s used. Changes positioning.',
  'Milestone vs XP: most DMs use milestone now.',
  'Free feat at L1: affects your build. Plan accordingly.',
  'Nat 20/1 on skills: NOT RAW but very common house rule.',
  'Crit damage: ask if it\'s roll or max+roll. Big difference.',
  'Death saves: ask if they\'re public or private.',
  'PvP rules: clarify early. Avoid table drama.',
  'Write down all house rules. Refer back during play.',
];
