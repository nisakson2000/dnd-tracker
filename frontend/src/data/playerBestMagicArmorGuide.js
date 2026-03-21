/**
 * playerBestMagicArmorGuide.js
 * Player Mode: Best magic armor and shields by rarity
 * Pure JS — no React dependencies.
 */

export const UNCOMMON_ARMOR = [
  { item: '+1 Armor', type: 'Any', effect: '+1 AC.', rating: 'A+', note: 'Simple. Always useful. No attunement.' },
  { item: '+1 Shield', type: 'Shield', effect: '+3 AC total.', rating: 'S', note: 'No attunement! +3 AC is massive for free.' },
  { item: 'Mithral Armor', type: 'Medium/Heavy', effect: 'No STR requirement. No stealth disadvantage.', rating: 'A+', note: 'Heavy armor without the drawbacks. Great for Clerics.' },
  { item: 'Adamantine Armor', type: 'Medium/Heavy', effect: 'Crits against you become normal hits.', rating: 'A', note: 'Anti-crit. Protects against burst damage.' },
  { item: 'Cast-Off Armor', type: 'Any', effect: 'Remove as an action instead of 1-10 minutes.', rating: 'B', note: 'Niche. Useful for quick disguise changes.' },
  { item: 'Mariner\'s Armor', type: 'Any', effect: 'Swim speed = walking speed. Breathe underwater.', rating: 'A (aquatic)', note: 'Campaign-dependent. Amazing in water settings.' },
];

export const RARE_ARMOR = [
  { item: '+2 Armor', type: 'Any', effect: '+2 AC.', rating: 'S', note: 'Significant AC boost. No attunement.' },
  { item: '+2 Shield', type: 'Shield', effect: '+4 AC total.', rating: 'S+', note: 'No attunement. +4 AC is incredible.' },
  { item: 'Armor of Resistance', type: 'Any', effect: 'Resistance to one damage type. Attunement.', rating: 'A+', note: 'Choose fire, cold, or common type. Halves that damage.' },
  { item: 'Shield of Missile Attraction', type: 'Shield', effect: '+2 AC. Resistance to ranged damage. Cursed: attracts ranged attacks.', rating: 'B+ (cursed)', note: 'You attract ranged fire but resist it. Tank tool.' },
  { item: 'Glamoured Studded Leather', type: 'Light', effect: '+1 leather. Change appearance as BA.', rating: 'A', note: 'Social infiltration. Armor that looks like clothing.' },
  { item: 'Elven Chain', type: 'Chain shirt', effect: '+1 chain shirt. Can wear without proficiency.', rating: 'A', note: 'Wizards and Sorcerers can wear it. 14+DEX(max 2) AC.' },
];

export const VERY_RARE_ARMOR = [
  { item: '+3 Armor', type: 'Any', effect: '+3 AC.', rating: 'S+', note: 'Highest AC armor. +3 plate = AC 21.' },
  { item: '+3 Shield', type: 'Shield', effect: '+5 AC total.', rating: 'S+', note: 'Absurd AC boost. +3 plate + +3 shield = AC 26 base.' },
  { item: 'Armor of Invulnerability', type: 'Plate', effect: 'Resistance to nonmagical damage. Action: immune for 10 min (1/day).', rating: 'S+', note: 'Legendary. Resistance to all physical damage. Immunity burst.' },
  { item: 'Dragon Scale Mail', type: 'Scale mail', effect: '+1 AC. Advantage on saves vs dragon breath. Sense dragons 30 miles.', rating: 'A+', note: 'Dragon campaign essential. Resistance to associated element.' },
  { item: 'Demon Armor', type: 'Plate', effect: '+1 plate. +1 unarmed (1d8). Advantage vs demons. Cursed: can\'t remove.', rating: 'B+ (cursed)', note: 'Strong but cursed. Stuck in the armor.' },
  { item: 'Animated Shield', type: 'Shield', effect: 'BA: shield floats and defends you. +2 AC hands-free.', rating: 'S', note: 'Free up a hand while keeping shield AC. Two-hand weapon + shield.' },
];

export const LEGENDARY_ARMOR = [
  { item: 'Robe of the Archmagi', type: 'Robe', effect: 'AC 15+DEX. +2 spell save DC. Advantage on saves vs magic. Magic resistance.', rating: 'S+', note: 'Best caster armor. AC + DC + saves. Requires attunement by sorcerer/warlock/wizard.' },
  { item: 'Plate Armor of Etherealness', type: 'Plate', effect: 'AC 18. Action: become ethereal. 1/day.', rating: 'A+', note: 'Free Etherealness once/day. Scout, bypass, escape.' },
  { item: 'Spellguard Shield', type: 'Shield', effect: 'Advantage on saves vs spells. Spell attacks have disadvantage vs you.', rating: 'S+', note: 'Anti-caster shield. Incredible against magic-heavy enemies.' },
];

export const MAGIC_ARMOR_TIPS = [
  '+1 Shield: no attunement, +3 AC total. Best uncommon item.',
  'Mithral armor: no stealth disadvantage. Great for stealthy Clerics.',
  'Adamantine: crits become normal hits. Anti-burst protection.',
  'Animated Shield: two-hand weapon + shield AC. Best of both worlds.',
  'Robe of the Archmagi: best caster item. AC + DC + magic resistance.',
  'Elven Chain: Wizard can wear it. +1 chain shirt without proficiency.',
  'Armor of Resistance: pick fire or the most common damage type.',
  '+3 Plate + +3 Shield = AC 26 before other bonuses. Unkillable.',
  'Spellguard Shield: advantage on saves vs spells. Anti-caster.',
  'Shield > armor upgrades usually. +1 shield (no attunement) > +1 armor.',
];
