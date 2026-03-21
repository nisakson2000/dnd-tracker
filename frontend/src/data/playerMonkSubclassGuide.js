/**
 * playerMonkSubclassGuide.js
 * Player Mode: All Monk subclasses (Monastic Traditions) ranked
 * Pure JS — no React dependencies.
 */

export const MONK_TRADITIONS_RANKED = [
  {
    tradition: 'Mercy',
    rating: 'S',
    role: 'Damage/Healer',
    keyFeatures: ['Hands of Healing: replace Flurry attack with heal (1d+MA die+WIS).', 'Hands of Harm: +necrotic damage + poisoned on unarmed (1 ki).', 'Physician\'s Touch L6: remove disease/condition with heal.'],
    note: 'Best Monk. Damage AND healing in one action. Fixes Monk\'s biggest weakness.',
  },
  {
    tradition: 'Open Hand',
    rating: 'A+',
    role: 'Martial',
    keyFeatures: ['Open Hand Technique: Flurry → prone, push 15ft, or no reactions. FREE.', 'Wholeness of Body L6: heal 3×level 1/LR.', 'Quivering Palm L17: 10d10 necrotic or drop to 0 HP.'],
    note: 'Classic Monk. Free rider on Flurry (no extra ki). Quivering Palm is devastating.',
  },
  {
    tradition: 'Shadow',
    rating: 'A+',
    role: 'Stealth/Utility',
    keyFeatures: ['Shadow Arts: Darkness, Darkvision, Pass w/o Trace, Silence for 2 ki each.', 'Shadow Step L6: teleport 60ft between shadows. Advantage on next attack.', 'Cloak of Shadows L11: invisible in dim light/darkness (no ki).'],
    note: 'Pass without Trace for 2 ki is incredible. Shadow Step is amazing mobility.',
  },
  {
    tradition: 'Astral Self',
    rating: 'A+',
    role: 'WIS-based',
    keyFeatures: ['Arms of the Astral Self: WIS for unarmed. 10ft reach. Force damage. 1 ki.', 'Visage L6: darkvision 120ft, advantage on Insight/Intimidation.', 'Complete Astral Self L17: +2 AC, extra attack.'],
    note: 'WIS for attacks solves MAD problem. 10ft reach is unique. Force damage.',
  },
  {
    tradition: 'Kensei',
    rating: 'A',
    role: 'Weapon Master',
    keyFeatures: ['Kensei Weapons: use martial weapons as Monk weapons (longsword, longbow).', 'Agile Parry: +2 AC if unarmed + weapon attack.', 'Deft Strike: +MA die damage for 1 ki.'],
    note: 'Best ranged Monk (longbow). Agile Parry is nice AC boost.',
  },
  {
    tradition: 'Drunken Master',
    rating: 'A',
    role: 'Mobile',
    keyFeatures: ['Drunken Technique: Flurry = free Disengage + 10ft speed.', 'Tipsy Sway L6: redirect missed attack to adjacent. Stand from prone for 5ft.', 'Drunkard\'s Luck L11: cancel disadvantage for 2 ki.'],
    note: 'Most mobile Monk. Hit and run. Redirect attacks is fun and useful.',
  },
  {
    tradition: 'Long Death',
    rating: 'A',
    role: 'Tank',
    keyFeatures: ['Touch of Death L3: temp HP = WIS+Monk level when reducing to 0 HP.', 'Hour of Reaping L6: AoE frighten.', 'Mastery of Death L11: spend 1 ki to drop to 1 HP instead of 0.'],
    note: 'Surprisingly tanky. Constant temp HP + death denial.',
  },
  {
    tradition: 'Sun Soul',
    rating: 'B+',
    role: 'Ranged',
    keyFeatures: ['Radiant Sun Bolt: ranged attack. 1d+MA die radiant.', 'Searing Arc Strike L6: Burning Hands for ki.', 'Searing Sunburst L11: ranged AoE.'],
    note: 'Ranged Monk but worse than Kensei at it. Flavor over function.',
  },
  {
    tradition: 'Four Elements',
    rating: 'C+',
    role: 'Elemental',
    keyFeatures: ['Elemental Disciplines: cast spells using ki.', 'Most cost 2-6 ki. Very expensive.', 'Fewer ki for damage than just punching.'],
    note: 'Worst Monk subclass. Ki costs are too high. Needs homebrew fix.',
  },
];

export const MONK_TRADITION_TIPS = [
  'Mercy: best Monk. Heal + damage in one action. No other Monk does this.',
  'Open Hand: Flurry riders are FREE. No extra ki cost. Best value.',
  'Shadow: Pass without Trace (2 ki) is the best use of ki in the game.',
  'Astral Self: WIS for attacks fixes MAD. Only need WIS + DEX + CON.',
  'Kensei: longbow Monk is surprisingly effective with Focused Aim.',
  'Four Elements: avoid unless your DM homebrews reduced ki costs.',
  'Stunning Strike is universal. Every Monk has the best ki ability.',
  'Shadow Step: teleport 60ft between shadows. BA. Advantage on next attack.',
  'Long Death: temp HP on kills makes you surprisingly hard to bring down.',
  'All Monks are underpowered compared to other classes. Pick what\'s fun.',
];
