/**
 * playerCommonMistakesGuide.js
 * Player Mode: Most common player mistakes and how to avoid them
 * Pure JS — no React dependencies.
 */

export const COMBAT_MISTAKES = [
  { mistake: 'Healing proactively', fix: 'Don\'t heal at 30/40 HP. Wait until 0 HP, then Healing Word. Prevention > cure.', severity: 'High' },
  { mistake: 'Spreading damage', fix: 'Focus fire. Kill one enemy at a time. Dead enemies deal 0 damage.', severity: 'High' },
  { mistake: 'Forgetting bonus action', fix: 'Spiritual Weapon, Healing Word, Hex, Hunter\'s Mark. Use your BA every turn.', severity: 'Medium' },
  { mistake: 'Forgetting reaction', fix: 'Opportunity attacks, Shield, Counterspell, Absorb Elements. One per round.', severity: 'Medium' },
  { mistake: 'Burning all slots early', fix: 'Budget slots. Cantrips for easy fights. Save slots for hard encounters.', severity: 'High' },
  { mistake: 'Ignoring positioning', fix: 'Use cover, don\'t cluster, keep casters back, tanks in front.', severity: 'High' },
  { mistake: 'Attacking the tank', fix: 'Target enemy casters and healers first. Kill high-priority targets.', severity: 'Medium' },
  { mistake: 'Not using Help action', fix: 'If you can\'t deal meaningful damage, Help an ally for advantage.', severity: 'Low' },
];

export const CHARACTER_BUILDING_MISTAKES = [
  { mistake: 'Dumping CON', fix: 'Never dump CON. Everyone needs HP. 14 CON minimum.', severity: 'Critical' },
  { mistake: 'Multiclassing before L5', fix: 'L5 = Extra Attack / L3 spells. Biggest power spike. Stay single-class until then.', severity: 'High' },
  { mistake: 'Not maxing primary stat', fix: 'Get your main stat to 20 ASAP. +1 to hit and DC matters enormously.', severity: 'High' },
  { mistake: 'Taking too many feats', fix: 'ASIs are valuable. One or two key feats, then max stats.', severity: 'Medium' },
  { mistake: 'Choosing bad cantrips', fix: 'You\'re stuck with cantrips. Choose ones you\'ll use every session.', severity: 'Medium' },
  { mistake: 'Ignoring saving throws', fix: 'CON saves for casters (concentration). WIS saves for everyone (charm/fear).', severity: 'Medium' },
  { mistake: 'Building for flavor only', fix: 'Flavor is free. Reflavor a strong build to match your concept.', severity: 'Low' },
];

export const SPELL_MISTAKES = [
  { mistake: 'Casting two leveled spells per turn', fix: 'If you cast a BA spell, your action can only be a cantrip. Know the rule.', severity: 'High' },
  { mistake: 'Forgetting concentration', fix: 'Only one concentration spell. Casting another ends the first. Track this.', severity: 'Critical' },
  { mistake: 'Not preparing ritual spells', fix: 'Detect Magic, Identify, Comprehend Languages — prepare them. Cast as rituals (no slot).', severity: 'Medium' },
  { mistake: 'Upcasting when unnecessary', fix: 'L1 Shield = L3 Shield. Some spells don\'t improve with higher slots.', severity: 'Medium' },
  { mistake: 'Using Cure Wounds in combat', fix: 'Healing Word (BA, 60ft) is almost always better than Cure Wounds (action, touch).', severity: 'High' },
  { mistake: 'Forgetting to maintain concentration', fix: 'Take damage → CON save (DC 10 or half damage). War Caster / Resilient helps.', severity: 'High' },
];

export const SOCIAL_MISTAKES = [
  { mistake: 'Everyone rolling the same check', fix: 'Let the best character roll. Others can Help (advantage).', severity: 'Medium' },
  { mistake: 'Attacking every NPC', fix: 'Not every encounter is combat. Talk first. Information is valuable.', severity: 'High' },
  { mistake: 'Splitting the party', fix: 'Don\'t split unless necessary. Halved party = halved power.', severity: 'High' },
  { mistake: 'Not asking the DM questions', fix: '"What do I see?" "Can I reach them?" "Is there cover?" Ask for information.', severity: 'Medium' },
];

export const RESOURCE_MISTAKES = [
  { mistake: 'Not using Hit Dice on short rests', fix: 'Hit Dice are FREE healing. Spend them. You recover half on long rest.', severity: 'High' },
  { mistake: 'Hoarding items', fix: 'Use potions, scrolls, and limited items. Saving them for "later" means never using them.', severity: 'High' },
  { mistake: 'Forgetting class features', fix: 'Review your class features regularly. Many players forget key abilities.', severity: 'Medium' },
  { mistake: 'Not buying diamonds', fix: 'Every town: buy 300gp diamonds. Revivify needs them. Stock up.', severity: 'High' },
];
