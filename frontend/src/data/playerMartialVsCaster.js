/**
 * playerMartialVsCaster.js
 * Player Mode: Martial vs caster balance and how each excels
 * Pure JS — no React dependencies.
 */

export const MARTIAL_STRENGTHS = [
  { strength: 'Consistent Damage', detail: 'Martials deal reliable damage every turn. No spell slots to run out of. Cantrips can\'t match martial DPR.', levels: 'All' },
  { strength: 'Durability', detail: 'Higher HP, better armor, more hit dice. Barbarians resist physical damage. Fighters self-heal.', levels: 'All' },
  { strength: 'Short Rest Dependent', detail: 'Key resources (Action Surge, Ki, Superiority Dice) reset on SHORT rest. More fights = martials shine.', levels: 'All' },
  { strength: 'No Component Issues', detail: 'No verbal/somatic/material components. Can fight in Silence, underwater, or while grappled.', levels: 'All' },
  { strength: 'Opportunity Attacks', detail: 'Control the battlefield through threat of OA. Sentinel makes this even stronger.', levels: '1+' },
  { strength: 'Multi-Attack Scaling', detail: 'Fighter gets 4 attacks at level 20. Consistent damage that doesn\'t depend on save DCs.', levels: '5+' },
  { strength: 'Antimagic Immunity', detail: 'Martials are unaffected by Antimagic Field. When magic fails, swords still work.', levels: 'All' },
];

export const CASTER_STRENGTHS = [
  { strength: 'Battlefield Control', detail: 'Wall of Force, Hypnotic Pattern, Web — casters reshape the fight. One spell can end encounters.', levels: '3+' },
  { strength: 'Versatility', detail: 'Prepared casters change their entire toolkit daily. Always have the right tool for the job.', levels: '1+' },
  { strength: 'AoE Damage', detail: 'Fireball hits 8+ enemies at once. Martials can only hit one (maybe two with Cleave).', levels: '5+' },
  { strength: 'Utility Magic', detail: 'Fly, Teleport, Knock, Detect Magic, Identify — spells solve non-combat problems that martials can\'t.', levels: '1+' },
  { strength: 'Save-or-Suck', detail: 'One failed save = enemy removed from combat. Hold Person, Banishment, Polymorph.', levels: '3+' },
  { strength: 'Long-Range Engagement', detail: 'Spells reach 120ft+. Martials need to close distance. Casters control engagement range.', levels: '1+' },
  { strength: 'Scaling Power', detail: 'Spell levels scale dramatically. Level 17 Wizard has Wish. Level 17 Fighter has... more attacks.', levels: '9+' },
];

export const LEVEL_BALANCE = [
  { tier: 'Tier 1 (1-4)', balance: 'Even', note: 'Martials and casters are roughly equal. Martials often lead due to HP and damage consistency.' },
  { tier: 'Tier 2 (5-10)', balance: 'Slight caster advantage', note: 'Fireball and 3rd-level spells tip the scales. Martials compensate with Extra Attack.' },
  { tier: 'Tier 3 (11-16)', balance: 'Caster advantage', note: 'High-level spells dominate. Martials need magic items to keep up. But fighters get 3rd attack.' },
  { tier: 'Tier 4 (17-20)', balance: 'Strong caster advantage', note: 'Wish, True Polymorph, Simulacrum. Martials are still essential but casters reshape reality.' },
];

export const MARTIAL_TIPS_VS_CASTERS = [
  'Silence shuts down verbal spells (most of them). Get a Silence cast near enemy casters.',
  'Grapple the caster. Speed 0 = can\'t run. Then shove them prone for melee advantage.',
  'Multiple attacks = multiple concentration checks. Three DC 10 saves > one DC 10 save.',
  'Counterspell requires line of sight. Use cover to block enemy Counterspell.',
  'Mage Slayer feat: advantage on saves vs adjacent casters, reaction attack when they cast.',
  'Ready your action to attack when the caster starts casting. Interrupt with damage.',
];

export const CASTER_TIPS_FOR_MARTIALS = [
  'Buff your martials. Haste on a Fighter is worth more than Fireball in most fights.',
  'Control the battlefield so your martials can reach priority targets safely.',
  'Let martials handle the frontline. Your job is AoE, control, and support.',
  'Don\'t compete with martial damage on single targets. Martial DPR is better sustained.',
  'Save your big spells for fights where martials need help. Let them handle easy fights.',
  'Your best contribution is often Bless or Faerie Fire, not another damage spell.',
];

export function getStrengths(type) {
  if (type === 'martial') return MARTIAL_STRENGTHS;
  if (type === 'caster') return CASTER_STRENGTHS;
  return [];
}

export function getBalanceAtTier(tier) {
  return LEVEL_BALANCE.find(l =>
    l.tier.toLowerCase().includes((tier || '').toLowerCase())
  ) || null;
}
