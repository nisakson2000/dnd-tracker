/**
 * playerClassStartingGuide.js
 * Player Mode: Class selection for new players — complexity and playstyle guide
 * Pure JS — no React dependencies.
 */

export const CLASS_COMPLEXITY = [
  { class: 'Fighter', complexity: 'Easy', playstyle: 'Hit things. Take hits. Straightforward.', bestFor: 'Brand new players.', note: 'Champion subclass is simplest build in 5e.' },
  { class: 'Barbarian', complexity: 'Easy', playstyle: 'Rage. Hit hard. Take lots of damage.', bestFor: 'Players who want to be tough.', note: 'Reckless Attack = always have advantage. Simple.' },
  { class: 'Rogue', complexity: 'Easy-Medium', playstyle: 'Sneak. High single-hit damage. Skills.', bestFor: 'Creative problem solvers.', note: 'Sneak Attack is the core mechanic. Easy to learn.' },
  { class: 'Paladin', complexity: 'Medium', playstyle: 'Tank + heal + smite. Aura support.', bestFor: 'Players who want to do everything.', note: 'Smite is simple. Spell list is manageable.' },
  { class: 'Ranger', complexity: 'Medium', playstyle: 'Ranged damage + nature skills + spells.', bestFor: 'Archer fans. Nature lovers.', note: 'Tasha\'s optional features fix the class.' },
  { class: 'Monk', complexity: 'Medium', playstyle: 'Fast. Many attacks. Ki management.', bestFor: 'Players who like martial arts flavor.', note: 'Ki management adds complexity but not too much.' },
  { class: 'Warlock', complexity: 'Medium', playstyle: 'Eldritch Blast + few powerful spells.', bestFor: 'Players who want magic without spell management.', note: 'Few slots (recover on SR). Simple rotation.' },
  { class: 'Cleric', complexity: 'Medium', playstyle: 'Heal + support + armor + divine power.', bestFor: 'Players who want to support the party.', note: 'Prepared caster but guided spell list.' },
  { class: 'Bard', complexity: 'Medium-Hard', playstyle: 'Jack of all trades. Social + support + spells.', bestFor: 'Social players who want versatility.', note: 'Many features to track. Inspiration management.' },
  { class: 'Druid', complexity: 'Hard', playstyle: 'Nature magic + Wild Shape. Versatile.', bestFor: 'Nature-loving casters.', note: 'Wild Shape adds complexity. Many form options.' },
  { class: 'Sorcerer', complexity: 'Hard', playstyle: 'Fewer spells but Metamagic flexibility.', bestFor: 'Players who want to modify spells.', note: 'Limited spells known + SP management.' },
  { class: 'Wizard', complexity: 'Hard', playstyle: 'Largest spell list. Ritual casting. Versatile.', bestFor: 'Players who enjoy spell preparation strategy.', note: 'Most spells = most decisions. Powerful but complex.' },
  { class: 'Artificer', complexity: 'Hard', playstyle: 'Magic items + spells + crafting.', bestFor: 'Tinkerers and inventors.', note: 'Infusions add extra layer of complexity.' },
];

export const FIRST_TIME_RECOMMENDATIONS = {
  wantToFight: 'Fighter (Champion). Simple. Effective. Tough.',
  wantToBeTough: 'Barbarian (Berserker or Totem). Rage and smash.',
  wantToBeStealthy: 'Rogue (Thief). Sneak Attack + skills + Cunning Action.',
  wantMagic: 'Warlock (any). Few spells to manage. EB does the work.',
  wantToHeal: 'Cleric (Life). Guided spell list. Heavy armor. Healing.',
  wantEverything: 'Paladin (Devotion). Melee + spells + healing + aura.',
};

export const CLASS_TIPS = [
  'New to D&D? Start with Fighter, Barbarian, or Rogue.',
  'Champion Fighter: simplest build. Crit on 19-20. Done.',
  'Warlock: best caster for beginners. Few spell slots. EB carries.',
  'Cleric: easier than Wizard/Sorcerer. Domain guides your build.',
  'Wizard: most powerful but hardest. Save for experienced players.',
  'Paladin: great all-rounder. Smite is intuitive and fun.',
  'Rogue: Sneak Attack feels amazing. Great for new players.',
  'Don\'t pick Sorcerer first. SP management confuses new players.',
  'Read your class features at L1-3 before Session 1.',
  'Ask experienced players for help with character creation.',
];
