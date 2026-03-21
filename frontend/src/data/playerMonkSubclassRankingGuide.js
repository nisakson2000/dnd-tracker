/**
 * playerMonkSubclassRankingGuide.js
 * Player Mode: Monk subclass (Monastic Tradition) ranking
 * Pure JS — no React dependencies.
 */

export const MONK_SUBCLASS_RANKING = [
  {
    subclass: 'Mercy',
    source: "Tasha's Cauldron of Everything",
    tier: 'S',
    reason: 'Hands of Healing: heal as part of Flurry (1 Ki). Hands of Harm: extra necrotic + poisoned. Physician\'s Touch: remove diseases/conditions.',
    keyFeatures: ['Hands of Healing (heal as part of Flurry)', 'Hands of Harm (necrotic + poisoned)', 'Physician\'s Touch (cure disease/conditions)', 'Hand of Ultimate Mercy (revive dead at L17)'],
    note: 'Best Monk subclass. Healing + damage + condition removal. The only Monk that does everything.',
  },
  {
    subclass: 'Astral Self',
    source: "Tasha's Cauldron of Everything",
    tier: 'A',
    reason: 'Arms of the Astral Self: WIS-based attacks with 10ft reach. Visage: darkvision + advantage Insight/Intimidation. Complete Astral Self at L17.',
    keyFeatures: ['Arms of the Astral Self (WIS attacks, 10ft reach)', 'Visage of the Astral Self (perception buffs)', 'Body of the Astral Self (reaction damage + extra attack)', 'Awakened Astral Self'],
    note: 'Fixes Monk\'s MAD problem. WIS attacks = only need WIS and CON. 10ft reach is rare for Monks.',
  },
  {
    subclass: 'Kensei',
    source: "Xanathar's Guide to Everything",
    tier: 'A',
    reason: 'Kensei Weapons: use longsword/longbow as Monk weapons. Agile Parry: +2 AC when attacking unarmed. Sharpen the Blade: +3 to attack/damage.',
    keyFeatures: ['Kensei Weapons (expanded weapon list)', 'Agile Parry (+2 AC)', 'Kensei\'s Shot (+1d4 ranged)', 'Deft Strike (add Martial Arts die to weapon)', 'Sharpen the Blade (+1/+2/+3 weapon)'],
    note: 'Best ranged Monk. Longbow Kensei with Sharpshooter is viable. Agile Parry for melee defense.',
  },
  {
    subclass: 'Open Hand',
    source: "Player's Handbook",
    tier: 'A',
    reason: 'Flurry: prone, push 15ft, or no reactions. Wholeness of Body: heal 3× Monk level. Quivering Palm: CON save or die at L17.',
    keyFeatures: ['Open Hand Technique (Flurry bonuses)', 'Wholeness of Body (self-heal)', 'Tranquility (Sanctuary between rests)', 'Quivering Palm (save or die at L17)'],
    note: 'Classic Monk. Flurry riders are always useful. Quivering Palm is one of the strongest L17 features.',
  },
  {
    subclass: 'Shadow',
    source: "Player's Handbook",
    tier: 'B+',
    reason: 'Shadow Arts: Darkness, Darkvision, PwT, Silence for 2 Ki each. Shadow Step: teleport 60ft between shadows as BA. Great infiltrator.',
    keyFeatures: ['Shadow Arts (2 Ki for stealth spells)', 'Shadow Step (BA teleport 60ft in dim/dark)', 'Cloak of Shadows (invisible in dim/dark)', 'Opportunist (OA when ally hits adjacent)'],
    note: 'Best stealth Monk. Shadow Step is incredible mobility. Limited by requiring dim light/darkness.',
  },
  {
    subclass: 'Drunken Master',
    source: "Xanathar's Guide to Everything",
    tier: 'B+',
    reason: 'Tipsy Sway: redirect attack to adjacent creature. Drunken Technique: Flurry gives Disengage + 10ft speed.',
    keyFeatures: ['Drunken Technique (Disengage + speed on Flurry)', 'Tipsy Sway (redirect attack, stand from prone cheap)', 'Drunkard\'s Luck (cancel disadvantage for 2 Ki)', 'Intoxicated Frenzy (5 Flurry attacks at L17)'],
    note: 'Best hit-and-run Monk. Flurry + free Disengage = attack and escape every turn.',
  },
  {
    subclass: 'Sun Soul',
    source: "Xanathar's Guide to Everything",
    tier: 'C',
    reason: 'Radiant Sun Bolt: ranged attack using DEX. Searing Arc Strike: Burning Hands after attack. Searing Sunburst: AoE at L11.',
    keyFeatures: ['Radiant Sun Bolt (ranged attack)', 'Searing Arc Strike (Burning Hands)', 'Searing Sunburst (AoE radiant)', 'Sun Shield (damage on hit)'],
    note: 'Ranged Monk that Kensei does better. Features don\'t scale well. Thematic but weak.',
  },
  {
    subclass: 'Four Elements',
    source: "Player's Handbook",
    tier: 'D',
    reason: 'Elemental disciplines cost too much Ki and do too little. Water Whip: 3 Ki for 3d10 + pull. You run out of Ki immediately.',
    keyFeatures: ['Elemental Disciplines (Ki-based spells)', 'Various elements', 'Scales slowly'],
    note: 'Universally considered the worst Monk subclass. Ki costs are absurdly high for mediocre effects.',
  },
];

export function monkUnarmedDamage(monkLevel) {
  if (monkLevel >= 17) return { die: 'd10', avg: 5.5 };
  if (monkLevel >= 11) return { die: 'd8', avg: 4.5 };
  if (monkLevel >= 5) return { die: 'd6', avg: 3.5 };
  return { die: 'd4', avg: 2.5 };
}
